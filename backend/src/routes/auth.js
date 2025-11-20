const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const auth = require('../middleware/auth');

// 회원가입
router.post('/register', async (req, res) => {
  try {
    const { username, password, name, email, role } = req.body;

    // 필수 필드 검증
    if (!username || !password || !name) {
      return res.status(400).json({
        success: false,
        message: '필수 필드를 입력해주세요 (username, password, name)'
      });
    }

    // 사용자 중복 확인
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '이미 존재하는 사용자명입니다'
      });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const user = await User.create({
      username,
      password: hashedPassword,
      name,
      email,
      role: role || 'user'
    });

    // JWT 토큰 생성
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // 비밀번호 제외하고 반환
    const userResponse = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.status(201).json({
      success: true,
      message: '회원가입이 완료되었습니다',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({
      success: false,
      message: '회원가입 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 필수 필드 검증
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '아이디와 비밀번호를 입력해주세요'
      });
    }

    // 사용자 확인
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '아이디 또는 비밀번호가 올바르지 않습니다'
      });
    }

    // 비밀번호 확인
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: '아이디 또는 비밀번호가 올바르지 않습니다'
      });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // 비밀번호 제외하고 반환
    const userResponse = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.json({
      success: true,
      message: '로그인 성공',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({
      success: false,
      message: '로그인 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

// 현재 사용자 정보 조회
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '사용자 정보 조회 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

module.exports = router;
