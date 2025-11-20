-- ================================================
-- 부동산 CRM 시스템 데이터베이스 스키마
-- ================================================

-- 1. users 테이블 (사용자 정보)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user' CHECK(role IN ('admin', 'team_leader', 'user')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. customers 테이블 (고객 정보)
CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,  -- 'username-YY-0001' 형식
    name VARCHAR(100) NOT NULL,
    phone_primary VARCHAR(20) NOT NULL,
    phone_secondary VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    memo TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
    contact_management BOOLEAN DEFAULT 1,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. contact_schedules 테이블 (Contact 일정 관리)
CREATE TABLE IF NOT EXISTS contact_schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    frequency VARCHAR(20) NOT NULL CHECK(frequency IN ('daily', 'weekly', 'monthly', 'yearly', 'custom')),
    frequency_detail TEXT,  -- JSON 형식으로 저장
    next_contact_date DATE,
    preferred_method VARCHAR(20) CHECK(preferred_method IN ('면대면', '유선', '문자', '카톡', '이메일', '기타')),
    alert_settings TEXT,  -- JSON 형식으로 저장
    expiry_alert BOOLEAN DEFAULT 1,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- 4. contact_histories 테이블 (Contact 이력)
CREATE TABLE IF NOT EXISTS contact_histories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    contact_date DATE NOT NULL,
    contact_time TIME,
    method VARCHAR(20) CHECK(method IN ('면대면', '통화', '문자', '카톡', '이메일', 'DM', '기타')),
    content TEXT NOT NULL,
    is_important BOOLEAN DEFAULT 0,
    auto_reschedule BOOLEAN DEFAULT 1,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 5. todos 테이블 (할 일 목록)
CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    content TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT 0,
    priority INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. statistics 테이블 (통계 데이터)
CREATE TABLE IF NOT EXISTS statistics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    new_customers INTEGER DEFAULT 0,
    contact_activities INTEGER DEFAULT 0,
    type VARCHAR(20) NOT NULL CHECK(type IN ('daily', 'weekly', 'monthly')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, date, type)
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_code ON customers(code);
CREATE INDEX IF NOT EXISTS idx_contact_schedules_customer_id ON contact_schedules(customer_id);
CREATE INDEX IF NOT EXISTS idx_contact_schedules_next_contact_date ON contact_schedules(next_contact_date);
CREATE INDEX IF NOT EXISTS idx_contact_histories_customer_id ON contact_histories(customer_id);
CREATE INDEX IF NOT EXISTS idx_contact_histories_contact_date ON contact_histories(contact_date);
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_date ON todos(date);
CREATE INDEX IF NOT EXISTS idx_statistics_user_id ON statistics(user_id);
CREATE INDEX IF NOT EXISTS idx_statistics_date ON statistics(date);

-- 초기 관리자 계정 생성 (비밀번호: admin1234)
INSERT OR IGNORE INTO users (id, username, password, name, email, role)
VALUES (1, 'admin', '$2a$10$rH8qKv0YqKxJ1VzJxqNLyOxK8k3Y7EZZ9YqHZxJxJxJxJxJxJxJxJ', '관리자', 'admin@example.com', 'admin');
