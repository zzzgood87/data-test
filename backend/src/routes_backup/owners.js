const express = require('express');
const router = express.Router();
const { Owner, Unit, Building } = require('../models');
const { auth } = require('../middleware/auth');

// 소유자 목록 조회
router.get('/', auth, async (req, res) => {
  try {
    const owners = await Owner.findAll({
      include: [
        {
          model: Unit,
          as: 'units',
          include: [
            {
              model: Building,
              as: 'building'
            }
          ]
        }
      ],
      order: [['name', 'ASC']]
    });

    res.json({ owners });
  } catch (error) {
    console.error('소유자 목록 조회 오류:', error);
    res.status(500).json({ error: '소유자 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 소유자 상세 조회
router.get('/:id', auth, async (req, res) => {
  try {
    const owner = await Owner.findByPk(req.params.id, {
      include: [
        {
          model: Unit,
          as: 'units',
          include: [
            {
              model: Building,
              as: 'building'
            }
          ]
        }
      ]
    });

    if (!owner) {
      return res.status(404).json({ error: '소유자를 찾을 수 없습니다.' });
    }

    res.json({ owner });
  } catch (error) {
    console.error('소유자 상세 조회 오류:', error);
    res.status(500).json({ error: '소유자 상세 조회 중 오류가 발생했습니다.' });
  }
});

// 소유자 등록
router.post('/', auth, async (req, res) => {
  try {
    const owner = await Owner.create(req.body);

    res.status(201).json({
      message: '소유자가 등록되었습니다.',
      owner
    });
  } catch (error) {
    console.error('소유자 등록 오류:', error);
    res.status(500).json({ error: '소유자 등록 중 오류가 발생했습니다.' });
  }
});

// 소유자 수정
router.put('/:id', auth, async (req, res) => {
  try {
    const owner = await Owner.findByPk(req.params.id);

    if (!owner) {
      return res.status(404).json({ error: '소유자를 찾을 수 없습니다.' });
    }

    await owner.update(req.body);

    res.json({
      message: '소유자 정보가 수정되었습니다.',
      owner
    });
  } catch (error) {
    console.error('소유자 수정 오류:', error);
    res.status(500).json({ error: '소유자 수정 중 오류가 발생했습니다.' });
  }
});

// 소유자 삭제
router.delete('/:id', auth, async (req, res) => {
  try {
    const owner = await Owner.findByPk(req.params.id);

    if (!owner) {
      return res.status(404).json({ error: '소유자를 찾을 수 없습니다.' });
    }

    await owner.destroy();

    res.json({ message: '소유자가 삭제되었습니다.' });
  } catch (error) {
    console.error('소유자 삭제 오류:', error);
    res.status(500).json({ error: '소유자 삭제 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
