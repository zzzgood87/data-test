const express = require('express');
const router = express.Router();
const { ActivityLog, Unit, Building, User } = require('../models');
const { auth } = require('../middleware/auth');

// 영업 활동 목록 조회
router.get('/', auth, async (req, res) => {
  try {
    const { unitId, buildingId, agentId, activityType } = req.query;
    const where = {};

    if (unitId) where.unitId = unitId;
    if (buildingId) where.buildingId = buildingId;
    if (agentId) where.agentId = agentId;
    if (activityType) where.activityType = activityType;

    const activities = await ActivityLog.findAll({
      where,
      include: [
        {
          model: Unit,
          as: 'unit'
        },
        {
          model: Building,
          as: 'building'
        },
        {
          model: User,
          as: 'agent',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['activityDate', 'DESC']],
      limit: 50
    });

    res.json({ activities });
  } catch (error) {
    console.error('활동 목록 조회 오류:', error);
    res.status(500).json({ error: '활동 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 영업 활동 등록
router.post('/', auth, async (req, res) => {
  try {
    const activityData = {
      ...req.body,
      agentId: req.user.id
    };

    const activity = await ActivityLog.create(activityData);

    res.status(201).json({
      message: '영업 활동이 등록되었습니다.',
      activity
    });
  } catch (error) {
    console.error('활동 등록 오류:', error);
    res.status(500).json({ error: '활동 등록 중 오류가 발생했습니다.' });
  }
});

// 영업 활동 수정
router.put('/:id', auth, async (req, res) => {
  try {
    const activity = await ActivityLog.findByPk(req.params.id);

    if (!activity) {
      return res.status(404).json({ error: '활동을 찾을 수 없습니다.' });
    }

    // 본인의 활동만 수정 가능
    if (activity.agentId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: '본인의 활동만 수정할 수 있습니다.' });
    }

    await activity.update(req.body);

    res.json({
      message: '활동 정보가 수정되었습니다.',
      activity
    });
  } catch (error) {
    console.error('활동 수정 오류:', error);
    res.status(500).json({ error: '활동 수정 중 오류가 발생했습니다.' });
  }
});

// 영업 활동 삭제
router.delete('/:id', auth, async (req, res) => {
  try {
    const activity = await ActivityLog.findByPk(req.params.id);

    if (!activity) {
      return res.status(404).json({ error: '활동을 찾을 수 없습니다.' });
    }

    // 본인의 활동만 삭제 가능
    if (activity.agentId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: '본인의 활동만 삭제할 수 있습니다.' });
    }

    await activity.destroy();

    res.json({ message: '활동이 삭제되었습니다.' });
  } catch (error) {
    console.error('활동 삭제 오류:', error);
    res.status(500).json({ error: '활동 삭제 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
