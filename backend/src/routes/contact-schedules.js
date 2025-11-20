const express = require('express');
const router = express.Router();
const { ContactSchedule, Customer } = require('../models');
const auth = require('../middleware/auth');

// 다음 Contact 날짜 계산 함수
function calculateNextContactDate(startDate, endDate, frequency, frequencyDetail) {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  // 종료일이 지났으면 null 반환
  if (today > end) {
    return null;
  }

  let nextDate = new Date(start);

  // 시작일이 미래면 시작일 반환
  if (start > today) {
    return start.toISOString().split('T')[0];
  }

  // 주기에 따른 계산
  switch (frequency) {
    case 'daily':
      // 매일
      nextDate = new Date(today);
      break;

    case 'weekly':
      // 매주 특정 요일
      if (frequencyDetail && frequencyDetail.dayOfWeek !== undefined) {
        const targetDay = frequencyDetail.dayOfWeek; // 0: 일요일, 1: 월요일, ...
        const currentDay = today.getDay();
        let daysToAdd = targetDay - currentDay;
        if (daysToAdd <= 0) daysToAdd += 7;

        nextDate = new Date(today);
        nextDate.setDate(today.getDate() + daysToAdd);
      }
      break;

    case 'monthly':
      // 매월 특정 일
      if (frequencyDetail && frequencyDetail.dayOfMonth !== undefined) {
        nextDate = new Date(today.getFullYear(), today.getMonth(), frequencyDetail.dayOfMonth);

        // 이미 지난 날짜면 다음 달로
        if (nextDate <= today) {
          nextDate = new Date(today.getFullYear(), today.getMonth() + 1, frequencyDetail.dayOfMonth);
        }
      }
      break;

    case 'yearly':
      // 매년 특정 날짜
      if (frequencyDetail && frequencyDetail.month !== undefined && frequencyDetail.day !== undefined) {
        nextDate = new Date(today.getFullYear(), frequencyDetail.month - 1, frequencyDetail.day);

        // 이미 지난 날짜면 내년으로
        if (nextDate <= today) {
          nextDate = new Date(today.getFullYear() + 1, frequencyDetail.month - 1, frequencyDetail.day);
        }
      }
      break;

    case 'custom':
      // 사용자 정의 (일 수 단위)
      if (frequencyDetail && frequencyDetail.days !== undefined) {
        const daysSinceStart = Math.floor((today - start) / (1000 * 60 * 60 * 24));
        const cycles = Math.ceil(daysSinceStart / frequencyDetail.days);
        nextDate = new Date(start);
        nextDate.setDate(start.getDate() + (cycles * frequencyDetail.days));
      }
      break;
  }

  // 종료일을 넘지 않도록
  if (nextDate > end) {
    return end.toISOString().split('T')[0];
  }

  return nextDate.toISOString().split('T')[0];
}

// Contact 일정 생성
router.post('/', auth, async (req, res) => {
  try {
    const {
      customer_id,
      start_date,
      end_date,
      frequency,
      frequency_detail,
      preferred_method,
      alert_settings,
      expiry_alert
    } = req.body;

    // 필수 필드 검증
    if (!customer_id || !start_date || !end_date || !frequency) {
      return res.status(400).json({
        success: false,
        message: '필수 필드를 입력해주세요'
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

    // 다음 Contact 날짜 계산
    const next_contact_date = calculateNextContactDate(
      start_date,
      end_date,
      frequency,
      frequency_detail
    );

    // Contact 일정 생성
    const schedule = await ContactSchedule.create({
      customer_id,
      start_date,
      end_date,
      frequency,
      frequency_detail,
      next_contact_date,
      preferred_method,
      alert_settings,
      expiry_alert: expiry_alert !== undefined ? expiry_alert : true,
      is_active: true
    });

    res.status(201).json({
      success: true,
      message: 'Contact 일정이 등록되었습니다',
      data: schedule
    });
  } catch (error) {
    console.error('Contact 일정 생성 오류:', error);
    res.status(500).json({
      success: false,
      message: 'Contact 일정 생성 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

// Contact 일정 조회 (특정 날짜)
router.get('/date/:date', auth, async (req, res) => {
  try {
    const { date } = req.params;

    const schedules = await ContactSchedule.findAll({
      where: {
        next_contact_date: date,
        is_active: true
      },
      include: [
        {
          model: Customer,
          as: 'customer',
          where: {
            user_id: req.user.id
          },
          required: true
        }
      ]
    });

    res.json({
      success: true,
      data: schedules
    });
  } catch (error) {
    console.error('Contact 일정 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: 'Contact 일정 조회 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

// Contact 일정 수정
router.put('/:id', auth, async (req, res) => {
  try {
    const schedule = await ContactSchedule.findOne({
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

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Contact 일정을 찾을 수 없습니다'
      });
    }

    const {
      start_date,
      end_date,
      frequency,
      frequency_detail,
      preferred_method,
      alert_settings,
      expiry_alert,
      is_active
    } = req.body;

    // 다음 Contact 날짜 재계산
    let next_contact_date = schedule.next_contact_date;
    if (start_date || end_date || frequency || frequency_detail) {
      next_contact_date = calculateNextContactDate(
        start_date || schedule.start_date,
        end_date || schedule.end_date,
        frequency || schedule.frequency,
        frequency_detail || schedule.frequency_detail
      );
    }

    await schedule.update({
      start_date: start_date || schedule.start_date,
      end_date: end_date || schedule.end_date,
      frequency: frequency || schedule.frequency,
      frequency_detail: frequency_detail || schedule.frequency_detail,
      next_contact_date,
      preferred_method: preferred_method || schedule.preferred_method,
      alert_settings: alert_settings || schedule.alert_settings,
      expiry_alert: expiry_alert !== undefined ? expiry_alert : schedule.expiry_alert,
      is_active: is_active !== undefined ? is_active : schedule.is_active
    });

    res.json({
      success: true,
      message: 'Contact 일정이 수정되었습니다',
      data: schedule
    });
  } catch (error) {
    console.error('Contact 일정 수정 오류:', error);
    res.status(500).json({
      success: false,
      message: 'Contact 일정 수정 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

// Contact 미루기
router.post('/:customerId/postpone', auth, async (req, res) => {
  try {
    const { days = 1 } = req.body;

    const schedule = await ContactSchedule.findOne({
      where: { customer_id: req.params.customerId },
      include: [
        {
          model: Customer,
          as: 'customer',
          where: { user_id: req.user.id },
          required: true
        }
      ]
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Contact 일정을 찾을 수 없습니다'
      });
    }

    const currentDate = new Date(schedule.next_contact_date);
    currentDate.setDate(currentDate.getDate() + parseInt(days));

    const newDate = currentDate.toISOString().split('T')[0];

    await schedule.update({
      next_contact_date: newDate
    });

    res.json({
      success: true,
      message: `Contact가 ${days}일 미뤄졌습니다`,
      data: schedule
    });
  } catch (error) {
    console.error('Contact 미루기 오류:', error);
    res.status(500).json({
      success: false,
      message: 'Contact 미루기 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

module.exports = router;
module.exports.calculateNextContactDate = calculateNextContactDate;
