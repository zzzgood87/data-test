const express = require('express');
const router = express.Router();
const { Unit, Building, Owner, TransactionHistory, ActivityLog } = require('../models');
const { auth } = require('../middleware/auth');

// 특정 건물의 모든 유닛 조회
router.get('/building/:buildingId', auth, async (req, res) => {
  try {
    const units = await Unit.findAll({
      where: { buildingId: req.params.buildingId },
      include: [
        {
          model: Owner,
          as: 'owner'
        }
      ],
      order: [['floor', 'DESC'], ['unitNumber', 'ASC']]
    });

    res.json({ units });
  } catch (error) {
    console.error('유닛 목록 조회 오류:', error);
    res.status(500).json({ error: '유닛 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 유닛 상세 조회
router.get('/:id', auth, async (req, res) => {
  try {
    const unit = await Unit.findByPk(req.params.id, {
      include: [
        {
          model: Building,
          as: 'building'
        },
        {
          model: Owner,
          as: 'owner'
        },
        {
          model: TransactionHistory,
          as: 'transactions',
          order: [['transactionDate', 'DESC']]
        },
        {
          model: ActivityLog,
          as: 'activities',
          order: [['activityDate', 'DESC']],
          limit: 10
        }
      ]
    });

    if (!unit) {
      return res.status(404).json({ error: '유닛을 찾을 수 없습니다.' });
    }

    res.json({ unit });
  } catch (error) {
    console.error('유닛 상세 조회 오류:', error);
    res.status(500).json({ error: '유닛 상세 조회 중 오류가 발생했습니다.' });
  }
});

// 유닛 등록
router.post('/', auth, async (req, res) => {
  try {
    const unit = await Unit.create(req.body);

    res.status(201).json({
      message: '유닛이 등록되었습니다.',
      unit
    });
  } catch (error) {
    console.error('유닛 등록 오류:', error);
    res.status(500).json({ error: '유닛 등록 중 오류가 발생했습니다.' });
  }
});

// 유닛 수정
router.put('/:id', auth, async (req, res) => {
  try {
    const unit = await Unit.findByPk(req.params.id);

    if (!unit) {
      return res.status(404).json({ error: '유닛을 찾을 수 없습니다.' });
    }

    await unit.update(req.body);

    res.json({
      message: '유닛 정보가 수정되었습니다.',
      unit
    });
  } catch (error) {
    console.error('유닛 수정 오류:', error);
    res.status(500).json({ error: '유닛 수정 중 오류가 발생했습니다.' });
  }
});

// 유닛 삭제
router.delete('/:id', auth, async (req, res) => {
  try {
    const unit = await Unit.findByPk(req.params.id);

    if (!unit) {
      return res.status(404).json({ error: '유닛을 찾을 수 없습니다.' });
    }

    await unit.destroy();

    res.json({ message: '유닛이 삭제되었습니다.' });
  } catch (error) {
    console.error('유닛 삭제 오류:', error);
    res.status(500).json({ error: '유닛 삭제 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
