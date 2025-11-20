const express = require('express');
const router = express.Router();
const { TransactionHistory, Unit, Building, User } = require('../models');
const { auth } = require('../middleware/auth');

// 거래 히스토리 조회
router.get('/', auth, async (req, res) => {
  try {
    const { unitId, transactionType } = req.query;
    const where = {};

    if (unitId) where.unitId = unitId;
    if (transactionType) where.transactionType = transactionType;

    const transactions = await TransactionHistory.findAll({
      where,
      include: [
        {
          model: Unit,
          as: 'unit',
          include: [
            {
              model: Building,
              as: 'building'
            }
          ]
        },
        {
          model: User,
          as: 'agent',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['transactionDate', 'DESC']],
      limit: 100
    });

    res.json({ transactions });
  } catch (error) {
    console.error('거래 히스토리 조회 오류:', error);
    res.status(500).json({ error: '거래 히스토리 조회 중 오류가 발생했습니다.' });
  }
});

// 거래 히스토리 등록
router.post('/', auth, async (req, res) => {
  try {
    const transactionData = {
      ...req.body,
      agentId: req.user.id
    };

    const transaction = await TransactionHistory.create(transactionData);

    res.status(201).json({
      message: '거래 히스토리가 등록되었습니다.',
      transaction
    });
  } catch (error) {
    console.error('거래 히스토리 등록 오류:', error);
    res.status(500).json({ error: '거래 히스토리 등록 중 오류가 발생했습니다.' });
  }
});

// 거래 히스토리 수정
router.put('/:id', auth, async (req, res) => {
  try {
    const transaction = await TransactionHistory.findByPk(req.params.id);

    if (!transaction) {
      return res.status(404).json({ error: '거래 히스토리를 찾을 수 없습니다.' });
    }

    await transaction.update(req.body);

    res.json({
      message: '거래 히스토리가 수정되었습니다.',
      transaction
    });
  } catch (error) {
    console.error('거래 히스토리 수정 오류:', error);
    res.status(500).json({ error: '거래 히스토리 수정 중 오류가 발생했습니다.' });
  }
});

// 거래 히스토리 삭제
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await TransactionHistory.findByPk(req.params.id);

    if (!transaction) {
      return res.status(404).json({ error: '거래 히스토리를 찾을 수 없습니다.' });
    }

    await transaction.destroy();

    res.json({ message: '거래 히스토리가 삭제되었습니다.' });
  } catch (error) {
    console.error('거래 히스토리 삭제 오류:', error);
    res.status(500).json({ error: '거래 히스토리 삭제 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
