const express = require('express');
const router = express.Router();
const { Statistic, Customer, ContactHistory } = require('../models');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

// 대시보드 통계
router.get('/dashboard', auth, async (req, res) => {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // 주간 시작일 (월요일)
    const weekStart = new Date(today);
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);

    const weekStartStr = weekStart.toISOString().split('T')[0];

    // 오늘 통계
    const todayStats = await Statistic.findOne({
      where: {
        user_id: req.user.id,
        date: todayStr,
        type: 'daily'
      }
    });

    // 주간 통계 (월요일부터 오늘까지)
    const weeklyStats = await Statistic.findAll({
      where: {
        user_id: req.user.id,
        date: {
          [Op.between]: [weekStartStr, todayStr]
        },
        type: 'daily'
      }
    });

    const weeklyTotal = weeklyStats.reduce((acc, stat) => {
      acc.new_customers += stat.new_customers;
      acc.contact_activities += stat.contact_activities;
      return acc;
    }, { new_customers: 0, contact_activities: 0 });

    // 오늘 Contact 예정 고객 수
    const todayContactCount = await Customer.count({
      where: { user_id: req.user.id },
      include: [
        {
          association: 'contact_schedule',
          where: {
            next_contact_date: todayStr,
            is_active: true
          },
          required: true
        }
      ]
    });

    // 완료된 할 일 수 (오늘)
    const { Todo } = require('../models');
    const todayTodos = await Todo.findAll({
      where: {
        user_id: req.user.id,
        date: todayStr
      }
    });

    const completedTodos = todayTodos.filter(todo => todo.is_completed).length;
    const totalTodos = todayTodos.length;

    res.json({
      success: true,
      data: {
        today: {
          new_customers: todayStats ? todayStats.new_customers : 0,
          contact_activities: todayStats ? todayStats.contact_activities : 0,
          contact_scheduled: todayContactCount,
          todos: {
            completed: completedTodos,
            total: totalTodos
          }
        },
        weekly: {
          new_customers: weeklyTotal.new_customers,
          contact_activities: weeklyTotal.contact_activities
        }
      }
    });
  } catch (error) {
    console.error('대시보드 통계 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '대시보드 통계 조회 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

// 고객 관리 통계
router.get('/customers', auth, async (req, res) => {
  try {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthStartStr = monthStart.toISOString().split('T')[0];

    // 전체 고객 수
    const totalCustomers = await Customer.count({
      where: { user_id: req.user.id }
    });

    // 활성/비활성 고객 수
    const activeCustomers = await Customer.count({
      where: {
        user_id: req.user.id,
        status: 'active'
      }
    });

    const inactiveCustomers = totalCustomers - activeCustomers;

    // Contact 관리 중인 고객 수
    const contactManagedCustomers = await Customer.count({
      where: {
        user_id: req.user.id,
        contact_management: true
      }
    });

    // 이번 달 신규 고객 수
    const newThisMonth = await Customer.count({
      where: {
        user_id: req.user.id,
        created_at: {
          [Op.gte]: monthStart
        }
      }
    });

    res.json({
      success: true,
      data: {
        total: totalCustomers,
        active: activeCustomers,
        inactive: inactiveCustomers,
        contactManaged: contactManagedCustomers,
        newThisMonth
      }
    });
  } catch (error) {
    console.error('고객 관리 통계 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '고객 관리 통계 조회 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

// 주간 통계
router.get('/weekly', auth, async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();

    // 주간 시작일 (월요일)
    const weekStart = new Date(targetDate);
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);

    // 주간 종료일 (일요일)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const weekStartStr = weekStart.toISOString().split('T')[0];
    const weekEndStr = weekEnd.toISOString().split('T')[0];

    const stats = await Statistic.findAll({
      where: {
        user_id: req.user.id,
        date: {
          [Op.between]: [weekStartStr, weekEndStr]
        },
        type: 'daily'
      },
      order: [['date', 'ASC']]
    });

    const total = stats.reduce((acc, stat) => {
      acc.new_customers += stat.new_customers;
      acc.contact_activities += stat.contact_activities;
      return acc;
    }, { new_customers: 0, contact_activities: 0 });

    res.json({
      success: true,
      data: {
        period: {
          start: weekStartStr,
          end: weekEndStr
        },
        daily: stats,
        total
      }
    });
  } catch (error) {
    console.error('주간 통계 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '주간 통계 조회 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

// 월간 통계
router.get('/monthly', auth, async (req, res) => {
  try {
    const { year, month } = req.query;
    const targetYear = year ? parseInt(year) : new Date().getFullYear();
    const targetMonth = month ? parseInt(month) - 1 : new Date().getMonth();

    const monthStart = new Date(targetYear, targetMonth, 1);
    const monthEnd = new Date(targetYear, targetMonth + 1, 0);

    const monthStartStr = monthStart.toISOString().split('T')[0];
    const monthEndStr = monthEnd.toISOString().split('T')[0];

    const stats = await Statistic.findAll({
      where: {
        user_id: req.user.id,
        date: {
          [Op.between]: [monthStartStr, monthEndStr]
        },
        type: 'daily'
      },
      order: [['date', 'ASC']]
    });

    const total = stats.reduce((acc, stat) => {
      acc.new_customers += stat.new_customers;
      acc.contact_activities += stat.contact_activities;
      return acc;
    }, { new_customers: 0, contact_activities: 0 });

    // 영업일 수 (통계가 있는 날)
    const workdays = stats.length;
    const dailyAverage = {
      new_customers: workdays > 0 ? (total.new_customers / workdays).toFixed(1) : 0,
      contact_activities: workdays > 0 ? (total.contact_activities / workdays).toFixed(1) : 0
    };

    res.json({
      success: true,
      data: {
        period: {
          year: targetYear,
          month: targetMonth + 1,
          start: monthStartStr,
          end: monthEndStr
        },
        daily: stats,
        total,
        workdays,
        dailyAverage
      }
    });
  } catch (error) {
    console.error('월간 통계 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '월간 통계 조회 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

// 연간 통계
router.get('/yearly', auth, async (req, res) => {
  try {
    const { year } = req.query;
    const targetYear = year ? parseInt(year) : new Date().getFullYear();

    const yearStart = new Date(targetYear, 0, 1);
    const yearEnd = new Date(targetYear, 11, 31);

    const yearStartStr = yearStart.toISOString().split('T')[0];
    const yearEndStr = yearEnd.toISOString().split('T')[0];

    const stats = await Statistic.findAll({
      where: {
        user_id: req.user.id,
        date: {
          [Op.between]: [yearStartStr, yearEndStr]
        },
        type: 'daily'
      },
      order: [['date', 'ASC']]
    });

    // 월별로 그룹화
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      new_customers: 0,
      contact_activities: 0
    }));

    stats.forEach(stat => {
      const statDate = new Date(stat.date);
      const month = statDate.getMonth();
      monthlyData[month].new_customers += stat.new_customers;
      monthlyData[month].contact_activities += stat.contact_activities;
    });

    const total = monthlyData.reduce((acc, month) => {
      acc.new_customers += month.new_customers;
      acc.contact_activities += month.contact_activities;
      return acc;
    }, { new_customers: 0, contact_activities: 0 });

    res.json({
      success: true,
      data: {
        year: targetYear,
        monthly: monthlyData,
        total
      }
    });
  } catch (error) {
    console.error('연간 통계 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '연간 통계 조회 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

module.exports = router;
