const express = require('express');
const router = express.Router();
const { Customer, ContactSchedule, ContactHistory, User } = require('../models');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

// 고객 코드 생성 함수
async function generateCustomerCode(username, userId) {
  const year = new Date().getFullYear().toString().slice(-2);

  // 해당 사용자의 올해 고객 수 확인
  const count = await Customer.count({
    where: {
      user_id: userId,
      code: {
        [Op.like]: `${username}-${year}-%`
      }
    }
  });

  const newNumber = (count + 1).toString().padStart(4, '0');
  return `${username}-${year}-${newNumber}`;
}

// 고객 목록 조회
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      search,
      contactManagement,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { user_id: req.user.id };

    // 필터링 조건
    if (status) {
      where.status = status;
    }
    if (contactManagement !== undefined) {
      where.contact_management = contactManagement === 'true';
    }
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { phone_primary: { [Op.like]: `%${search}%` } },
        { code: { [Op.like]: `%${search}%` } }
      ];
    }

    // 고객 목록 조회
    const { count, rows: customers } = await Customer.findAndCountAll({
      where,
      include: [
        {
          model: ContactSchedule,
          as: 'contact_schedule',
          required: false
        },
        {
          model: ContactHistory,
          as: 'contact_histories',
          required: false,
          limit: 1,
          order: [['contact_date', 'DESC']]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder]],
      distinct: true
    });

    res.json({
      success: true,
      data: {
        customers,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('고객 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '고객 목록 조회 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

// 고객 상세 조회
router.get('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      },
      include: [
        {
          model: ContactSchedule,
          as: 'contact_schedule'
        },
        {
          model: ContactHistory,
          as: 'contact_histories',
          include: [
            {
              model: User,
              as: 'creator',
              attributes: ['id', 'name', 'username']
            }
          ],
          order: [['contact_date', 'DESC']]
        }
      ]
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: '고객을 찾을 수 없습니다'
      });
    }

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('고객 상세 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '고객 상세 조회 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

// 고객 등록
router.post('/', auth, async (req, res) => {
  try {
    const {
      name,
      phone_primary,
      phone_secondary,
      email,
      address,
      memo,
      status,
      contact_management
    } = req.body;

    // 필수 필드 검증
    if (!name || !phone_primary) {
      return res.status(400).json({
        success: false,
        message: '고객명과 연락처는 필수 입력 항목입니다'
      });
    }

    // 고객 코드 생성
    const code = await generateCustomerCode(req.user.username, req.user.id);

    // 고객 생성
    const customer = await Customer.create({
      code,
      name,
      phone_primary,
      phone_secondary,
      email,
      address,
      memo,
      status: status || 'active',
      contact_management: contact_management !== undefined ? contact_management : true,
      user_id: req.user.id
    });

    res.status(201).json({
      success: true,
      message: '고객이 등록되었습니다',
      data: customer
    });
  } catch (error) {
    console.error('고객 등록 오류:', error);
    res.status(500).json({
      success: false,
      message: '고객 등록 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

// 고객 수정
router.put('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: '고객을 찾을 수 없습니다'
      });
    }

    const {
      name,
      phone_primary,
      phone_secondary,
      email,
      address,
      memo,
      status,
      contact_management
    } = req.body;

    await customer.update({
      name: name || customer.name,
      phone_primary: phone_primary || customer.phone_primary,
      phone_secondary,
      email,
      address,
      memo,
      status: status || customer.status,
      contact_management: contact_management !== undefined ? contact_management : customer.contact_management
    });

    res.json({
      success: true,
      message: '고객 정보가 수정되었습니다',
      data: customer
    });
  } catch (error) {
    console.error('고객 수정 오류:', error);
    res.status(500).json({
      success: false,
      message: '고객 수정 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

// 고객 삭제
router.delete('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: '고객을 찾을 수 없습니다'
      });
    }

    await customer.destroy();

    res.json({
      success: true,
      message: '고객이 삭제되었습니다'
    });
  } catch (error) {
    console.error('고객 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: '고객 삭제 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

// 고객 일괄 삭제
router.post('/batch-delete', auth, async (req, res) => {
  try {
    const { customerIds } = req.body;

    if (!customerIds || !Array.isArray(customerIds) || customerIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: '삭제할 고객 ID를 선택해주세요'
      });
    }

    const deletedCount = await Customer.destroy({
      where: {
        id: {
          [Op.in]: customerIds
        },
        user_id: req.user.id
      }
    });

    res.json({
      success: true,
      message: `${deletedCount}명의 고객이 삭제되었습니다`,
      deletedCount
    });
  } catch (error) {
    console.error('고객 일괄 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: '고객 일괄 삭제 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

module.exports = router;
