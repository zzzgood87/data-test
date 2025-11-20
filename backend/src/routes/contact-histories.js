const express = require('express');
const router = express.Router();
const { ContactHistory, Customer, ContactSchedule, User } = require('../models');
const auth = require('../middleware/auth');
const { calculateNextContactDate } = require('./contact-schedules');

// Contact 이력 조회 (고객별)
router.get('/customer/:customerId', auth, async (req, res) => {
  try {
    const { customerId } = req.params;

    // 고객 확인
    const customer = await Customer.findOne({
      where: {
        id: customerId,
        user_id: req.user.id
      }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: '고객을 찾을 수 없습니다'
      });
    }

    const histories = await ContactHistory.findAll({
      where: { customer_id: customerId },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'username']
        }
      ],
      order: [['contact_date', 'DESC'], ['contact_time', 'DESC']]
    });

    res.json({
      success: true,
      data: histories
    });
  } catch (error) {
    console.error('Contact 이력 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: 'Contact 이력 조회 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

// Contact 이력 추가
router.post('/', auth, async (req, res) => {
  try {
    const {
      customer_id,
      contact_date,
      contact_time,
      method,
      content,
      is_important,
      auto_reschedule
    } = req.body;

    // 필수 필드 검증
    if (!customer_id || !contact_date || !content) {
      return res.status(400).json({
        success: false,
        message: '필수 필드를 입력해주세요 (customer_id, contact_date, content)'
      });
    }

    // 고객 확인
    const customer = await Customer.findOne({
      where: {
        id: customer_id,
        user_id: req.user.id
      }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: '고객을 찾을 수 없습니다'
      });
    }

    // Contact 이력 생성
    const history = await ContactHistory.create({
      customer_id,
      contact_date,
      contact_time,
      method,
      content,
      is_important: is_important || false,
      auto_reschedule: auto_reschedule !== undefined ? auto_reschedule : true,
      created_by: req.user.id
    });

    // 자동 재설정 처리
    if (auto_reschedule !== false) {
      const schedule = await ContactSchedule.findOne({
        where: { customer_id }
      });

      if (schedule) {
        const next_contact_date = calculateNextContactDate(
          schedule.start_date,
          schedule.end_date,
          schedule.frequency,
          schedule.frequency_detail
        );

        await schedule.update({ next_contact_date });
      }
    }

    // 통계 업데이트 (contact_activities 증가)
    await updateStatistics(req.user.id, contact_date, 'contact');

    res.status(201).json({
      success: true,
      message: 'Contact 이력이 등록되었습니다',
      data: history
    });
  } catch (error) {
    console.error('Contact 이력 추가 오류:', error);
    res.status(500).json({
      success: false,
      message: 'Contact 이력 추가 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

// Contact 이력 수정
router.put('/:id', auth, async (req, res) => {
  try {
    const history = await ContactHistory.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Customer,
          as: 'customer',
          where: { user_id: req.user.id },
          required: true
        }
      ]
    });

    if (!history) {
      return res.status(404).json({
        success: false,
        message: 'Contact 이력을 찾을 수 없습니다'
      });
    }

    const {
      contact_date,
      contact_time,
      method,
      content,
      is_important
    } = req.body;

    await history.update({
      contact_date: contact_date || history.contact_date,
      contact_time: contact_time || history.contact_time,
      method: method || history.method,
      content: content || history.content,
      is_important: is_important !== undefined ? is_important : history.is_important
    });

    res.json({
      success: true,
      message: 'Contact 이력이 수정되었습니다',
      data: history
    });
  } catch (error) {
    console.error('Contact 이력 수정 오류:', error);
    res.status(500).json({
      success: false,
      message: 'Contact 이력 수정 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

// Contact 이력 삭제
router.delete('/:id', auth, async (req, res) => {
  try {
    const history = await ContactHistory.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Customer,
          as: 'customer',
          where: { user_id: req.user.id },
          required: true
        }
      ]
    });

    if (!history) {
      return res.status(404).json({
        success: false,
        message: 'Contact 이력을 찾을 수 없습니다'
      });
    }

    await history.destroy();

    res.json({
      success: true,
      message: 'Contact 이력이 삭제되었습니다'
    });
  } catch (error) {
    console.error('Contact 이력 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: 'Contact 이력 삭제 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

// 통계 업데이트 함수
async function updateStatistics(userId, date, type) {
  const { Statistic } = require('../models');

  try {
    const statDate = new Date(date);
    const dateStr = statDate.toISOString().split('T')[0];

    // Daily 통계 업데이트
    const [dailyStat] = await Statistic.findOrCreate({
      where: {
        user_id: userId,
        date: dateStr,
        type: 'daily'
      },
      defaults: {
        new_customers: 0,
        contact_activities: 0
      }
    });

    if (type === 'contact') {
      await dailyStat.increment('contact_activities');
    } else if (type === 'customer') {
      await dailyStat.increment('new_customers');
    }
  } catch (error) {
    console.error('통계 업데이트 오류:', error);
  }
}

module.exports = router;
