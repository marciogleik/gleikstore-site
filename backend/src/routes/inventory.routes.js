const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

// Listar todo o estoque
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Adicionar novo iPhone ao estoque
router.post('/', async (req, res) => {
  const { model, capacity, color, condition, imei, price } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        model,
        capacity,
        color,
        condition,
        imei,
        price: parseFloat(price),
        status: 'AVAILABLE',
      },
    });
    res.status(201).json(product);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: true, message: 'IMEI já cadastrado no sistema.' });
    }
    res.status(500).json({ error: true, message: error.message });
  }
});

// Buscar um produto específico pelo IMEI ou ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ error: true, message: 'Produto não encontrado.' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Atualizar dados do produto
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        price: data.price ? parseFloat(data.price) : undefined,
      },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Remover produto do estoque
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({
      where: { id },
    });
    res.json({ message: 'Produto removido com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

module.exports = router;
