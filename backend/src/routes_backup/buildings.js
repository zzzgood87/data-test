const express = require('express');
const router = express.Router();
const { Building, Unit, Owner, ActivityLog, TransactionHistory } = require('../models');
const { auth } = require('../middleware/auth');
const { Op } = require('sequelize');

// 모든 건물 조회 (지도용)
router.get('/', auth, async (req, res) => {
  try {
    const {
      buildingType,
      status,
      minLat,
      maxLat,
      minLng,
      maxLng
    } = req.query;

    const where = {};

    if (buildingType) {
      where.buildingType = buildingType;
    }

    if (status) {
      where.status = status;
    }

    // 지도 영역 필터링
    if (minLat && maxLat && minLng && maxLng) {
      where.latitude = { [Op.between]: [parseFloat(minLat), parseFloat(maxLat)] };
      where.longitude = { [Op.between]: [parseFloat(minLng), parseFloat(maxLng)] };
    }

    const buildings = await Building.findAll({
      where,
      include: [
        {
          model: Unit,
          as: 'units',
          attributes: ['id', 'floor', 'unitNumber', 'currentStatus']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ buildings });
  } catch (error) {
    console.error('건물 목록 조회 오류:', error);
    res.status(500).json({ error: '건물 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 건물 상세 조회
router.get('/:id', auth, async (req, res) => {
  try {
    const building = await Building.findByPk(req.params.id, {
      include: [
        {
          model: Unit,
          as: 'units',
          include: [
            {
              model: Owner,
              as: 'owner'
            },
            {
              model: TransactionHistory,
              as: 'transactions',
              limit: 5,
              order: [['transactionDate', 'DESC']]
            }
          ],
          order: [['floor', 'DESC'], ['unitNumber', 'ASC']]
        },
        {
          model: ActivityLog,
          as: 'activities',
          limit: 10,
          order: [['activityDate', 'DESC']]
        }
      ]
    });

    if (!building) {
      return res.status(404).json({ error: '건물을 찾을 수 없습니다.' });
    }

    res.json({ building });
  } catch (error) {
    console.error('건물 상세 조회 오류:', error);
    res.status(500).json({ error: '건물 상세 조회 중 오류가 발생했습니다.' });
  }
});

// 건물 등록
router.post('/', auth, async (req, res) => {
  try {
    const buildingData = {
      ...req.body,
      registeredBy: req.user.id
    };

    const building = await Building.create(buildingData);

    res.status(201).json({
      message: '건물이 등록되었습니다.',
      building
    });
  } catch (error) {
    console.error('건물 등록 오류:', error);
    res.status(500).json({ error: '건물 등록 중 오류가 발생했습니다.' });
  }
});

// 건물 수정
router.put('/:id', auth, async (req, res) => {
  try {
    const building = await Building.findByPk(req.params.id);

    if (!building) {
      return res.status(404).json({ error: '건물을 찾을 수 없습니다.' });
    }

    await building.update(req.body);

    res.json({
      message: '건물 정보가 수정되었습니다.',
      building
    });
  } catch (error) {
    console.error('건물 수정 오류:', error);
    res.status(500).json({ error: '건물 수정 중 오류가 발생했습니다.' });
  }
});

// 건물 삭제
router.delete('/:id', auth, async (req, res) => {
  try {
    const building = await Building.findByPk(req.params.id);

    if (!building) {
      return res.status(404).json({ error: '건물을 찾을 수 없습니다.' });
    }

    await building.destroy();

    res.json({ message: '건물이 삭제되었습니다.' });
  } catch (error) {
    console.error('건물 삭제 오류:', error);
    res.status(500).json({ error: '건물 삭제 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
