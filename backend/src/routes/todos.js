const express = require('express');
const router = express.Router();
const { Todo } = require('../models');
const auth = require('../middleware/auth');

// To-do 목록 조회
router.get('/', auth, async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: '날짜를 지정해주세요'
      });
    }

    const todos = await Todo.findAll({
      where: {
        user_id: req.user.id,
        date
      },
      order: [
        ['is_completed', 'ASC'],
        ['priority', 'ASC'],
        ['created_at', 'ASC']
      ]
    });

    res.json({
      success: true,
      data: todos
    });
  } catch (error) {
    console.error('To-do 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: 'To-do 목록 조회 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

// To-do 추가
router.post('/', auth, async (req, res) => {
  try {
    const { date, content, priority } = req.body;

    if (!date || !content) {
      return res.status(400).json({
        success: false,
        message: '날짜와 내용을 입력해주세요'
      });
    }

    const todo = await Todo.create({
      user_id: req.user.id,
      date,
      content,
      priority: priority || 0,
      is_completed: false
    });

    res.status(201).json({
      success: true,
      message: 'To-do가 추가되었습니다',
      data: todo
    });
  } catch (error) {
    console.error('To-do 추가 오류:', error);
    res.status(500).json({
      success: false,
      message: 'To-do 추가 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

// To-do 수정
router.put('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'To-do를 찾을 수 없습니다'
      });
    }

    const { date, content, priority, is_completed } = req.body;

    await todo.update({
      date: date || todo.date,
      content: content || todo.content,
      priority: priority !== undefined ? priority : todo.priority,
      is_completed: is_completed !== undefined ? is_completed : todo.is_completed
    });

    res.json({
      success: true,
      message: 'To-do가 수정되었습니다',
      data: todo
    });
  } catch (error) {
    console.error('To-do 수정 오류:', error);
    res.status(500).json({
      success: false,
      message: 'To-do 수정 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

// To-do 완료 처리
router.patch('/:id/complete', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'To-do를 찾을 수 없습니다'
      });
    }

    await todo.update({
      is_completed: !todo.is_completed
    });

    res.json({
      success: true,
      message: todo.is_completed ? 'To-do가 완료되었습니다' : 'To-do가 미완료 상태로 변경되었습니다',
      data: todo
    });
  } catch (error) {
    console.error('To-do 완료 처리 오류:', error);
    res.status(500).json({
      success: false,
      message: 'To-do 완료 처리 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

// To-do 삭제
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'To-do를 찾을 수 없습니다'
      });
    }

    await todo.destroy();

    res.json({
      success: true,
      message: 'To-do가 삭제되었습니다'
    });
  } catch (error) {
    console.error('To-do 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: 'To-do 삭제 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

// To-do 우선순위 일괄 업데이트 (드래그 앤 드롭용)
router.post('/reorder', auth, async (req, res) => {
  try {
    const { todoIds } = req.body;

    if (!todoIds || !Array.isArray(todoIds)) {
      return res.status(400).json({
        success: false,
        message: 'To-do ID 배열을 제공해주세요'
      });
    }

    // 순서대로 우선순위 업데이트
    const promises = todoIds.map((id, index) =>
      Todo.update(
        { priority: index },
        {
          where: {
            id,
            user_id: req.user.id
          }
        }
      )
    );

    await Promise.all(promises);

    res.json({
      success: true,
      message: 'To-do 순서가 변경되었습니다'
    });
  } catch (error) {
    console.error('To-do 순서 변경 오류:', error);
    res.status(500).json({
      success: false,
      message: 'To-do 순서 변경 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

module.exports = router;
