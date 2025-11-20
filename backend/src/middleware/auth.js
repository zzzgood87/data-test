const jwt = require('jsonwebtoken');
const { User } = require('../models');

// JWT_SECRET 환경 변수 확인 (없으면 기본값 사용)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET 환경 변수가 설정되지 않아 기본값을 사용합니다. 프로덕션에서는 반드시 설정하세요!');
}

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: '인증 토큰이 필요합니다.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({
      where: {
        id: decoded.id
      }
    });

    if (!user) {
      return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: '인증에 실패했습니다.' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: '관리자 권한이 필요합니다.' });
  }
  next();
};

module.exports = auth;
