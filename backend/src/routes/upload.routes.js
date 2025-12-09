/**
 * Rotas de Upload de Arquivos
 * POST /api/upload/profile-photo - Upload de foto de perfil
 * POST /api/upload/document - Upload de documento
 * POST /api/upload/contract - Upload de contrato
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const prisma = require('../lib/prisma');
const supabase = require('../lib/supabase');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Configuração do Multer para upload temporário
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'));
    }
  }
});

// Todas as rotas requerem autenticação
router.use(authMiddleware);

/**
 * Função auxiliar para upload ao Supabase
 */
async function uploadToSupabase(filePath, bucket, fileName) {
  if (!supabase) {
    // Se Supabase não está configurado, retorna URL local
    return `/uploads/${path.basename(filePath)}`;
  }

  const fileBuffer = fs.readFileSync(filePath);
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, fileBuffer, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    throw new Error(`Erro no upload: ${error.message}`);
  }

  // Obter URL pública
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  // Remover arquivo temporário
  fs.unlinkSync(filePath);

  return urlData.publicUrl;
}

/**
 * POST /api/upload/profile-photo
 * Upload de foto de perfil
 */
router.post('/profile-photo', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: 'Nenhum arquivo enviado'
      });
    }

    const fileName = `profile-photos/${req.user.id}/${req.file.filename}`;
    const fileUrl = await uploadToSupabase(req.file.path, 'gleikstore', fileName);

    // Atualizar ou criar foto de perfil no banco
    const profilePhoto = await prisma.profilePhoto.upsert({
      where: { userId: req.user.id },
      update: { fileUrl },
      create: {
        userId: req.user.id,
        fileUrl
      }
    });

    return res.json({
      message: 'Foto de perfil atualizada com sucesso!',
      profilePhoto
    });
  } catch (error) {
    console.error('Erro no upload de foto:', error);
    return res.status(500).json({
      error: true,
      message: 'Erro ao fazer upload da foto'
    });
  }
});

/**
 * POST /api/upload/document
 * Upload de documento (RG, CPF, Comprovante)
 */
router.post('/document', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: 'Nenhum arquivo enviado'
      });
    }

    const { documentType } = req.body;

    // Validar tipo de documento
    const validTypes = ['RG', 'CPF', 'COMPROVANTE_ENDERECO'];
    if (!documentType || !validTypes.includes(documentType)) {
      return res.status(400).json({
        error: true,
        message: 'Tipo de documento inválido. Use: RG, CPF ou COMPROVANTE_ENDERECO'
      });
    }

    const fileName = `documents/${req.user.id}/${documentType}/${req.file.filename}`;
    const fileUrl = await uploadToSupabase(req.file.path, 'gleikstore', fileName);

    // Verificar se já existe documento desse tipo
    const existingDoc = await prisma.document.findFirst({
      where: {
        userId: req.user.id,
        documentType
      }
    });

    let document;
    if (existingDoc) {
      // Atualizar documento existente
      document = await prisma.document.update({
        where: { id: existingDoc.id },
        data: { fileUrl, uploadedAt: new Date() }
      });
    } else {
      // Criar novo documento
      document = await prisma.document.create({
        data: {
          userId: req.user.id,
          documentType,
          fileUrl
        }
      });
    }

    return res.json({
      message: 'Documento enviado com sucesso!',
      document
    });
  } catch (error) {
    console.error('Erro no upload de documento:', error);
    return res.status(500).json({
      error: true,
      message: 'Erro ao fazer upload do documento'
    });
  }
});

/**
 * POST /api/upload/contract
 * Upload de contrato assinado (PDF)
 */
router.post('/contract', upload.single('contract'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: 'Nenhum arquivo enviado'
      });
    }

    // Verificar se é PDF
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({
        error: true,
        message: 'O contrato deve ser um arquivo PDF'
      });
    }

    const fileName = `contracts/${req.user.id}/${req.file.filename}`;
    const fileUrl = await uploadToSupabase(req.file.path, 'gleikstore', fileName);

    // Verificar se já existe contrato
    const existingContract = await prisma.document.findFirst({
      where: {
        userId: req.user.id,
        documentType: 'CONTRATO'
      }
    });

    let document;
    if (existingContract) {
      document = await prisma.document.update({
        where: { id: existingContract.id },
        data: { fileUrl, uploadedAt: new Date() }
      });
    } else {
      document = await prisma.document.create({
        data: {
          userId: req.user.id,
          documentType: 'CONTRATO',
          fileUrl
        }
      });
    }

    return res.json({
      message: 'Contrato enviado com sucesso!',
      document
    });
  } catch (error) {
    console.error('Erro no upload de contrato:', error);
    return res.status(500).json({
      error: true,
      message: 'Erro ao fazer upload do contrato'
    });
  }
});

/**
 * GET /api/upload/documents
 * Lista todos os documentos do usuário
 */
router.get('/documents', async (req, res) => {
  try {
    const documents = await prisma.document.findMany({
      where: { userId: req.user.id },
      orderBy: { uploadedAt: 'desc' }
    });

    const profilePhoto = await prisma.profilePhoto.findUnique({
      where: { userId: req.user.id }
    });

    return res.json({
      documents,
      profilePhoto
    });
  } catch (error) {
    console.error('Erro ao buscar documentos:', error);
    return res.status(500).json({
      error: true,
      message: 'Erro ao buscar documentos'
    });
  }
});

module.exports = router;
