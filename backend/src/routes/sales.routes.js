const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { v4: uuidv4 } = require('uuid');

// Criar uma nova venda (Nova Transação)
router.post('/', async (req, res) => {
  const { customerId, productId, paymentType, dueDate } = req.body;

  try {
    // 1. Verificar se o produto está disponível
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.status !== 'AVAILABLE') {
      return res.status(400).json({ error: true, message: 'Produto não disponível para venda.' });
    }

    // 2. Iniciar transação no banco
    const result = await prisma.$transaction(async (tx) => {
      // 2a. Marcar produto como vendido
      await tx.product.update({
        where: { id: productId },
        data: { status: 'SOLD' },
      });

      // 2b. Criar a venda
      const sale = await tx.sale.create({
        data: {
          customerId,
          productId,
          totalAmount: product.price,
          paymentType,
          status: 'PENDING',
          // Aqui no futuro geramos o PDF e salvamos a URL
          contractUrl: null, 
        },
      });

      // 2c. Se for Boleto, criar o registro de pagamento (Simulado)
      let payment = null;
      if (paymentType === 'BOLETO' || paymentType === 'FINANCING') {
        payment = await tx.payment.create({
          data: {
            saleId: sale.id,
            amount: product.price,
            status: 'PENDING',
            dueDate: new Date(dueDate || new Date().setDate(new Date().getDate() + 3)),
            boletoBarcode: `34191.79001 01043.510047 91020.150008 5 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            boletoUrl: `https://fake-boleto.com/${uuidv4()}`,
          },
        });
      }

      return { sale, payment };
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Listar todas as vendas (para o Admin)
router.get('/', async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        customer: {
          select: { name: true, cpf: true, email: true },
        },
        product: true,
        payment: true,
      },
      orderBy: { saleDate: 'desc' },
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Confirmar pagamento manualmente
router.patch('/:id/confirm', async (req, res) => {
  const { id } = req.params;

  try {
    const sale = await prisma.sale.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });

    await prisma.payment.update({
      where: { saleId: id },
      data: {
        status: 'PAID',
        paidAt: new Date(),
      },
    });

    res.json({ message: 'Venda e pagamento confirmados com sucesso!', sale });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

module.exports = router;
