-- 赛博盆栽 CyberBonsai D1 数据库初始化表结构

CREATE TABLE IF NOT EXISTS users_bonsai (
  username TEXT PRIMARY KEY,           -- GitHub 用户名 (小写)
  level INTEGER DEFAULT 0,             -- 盆栽等级 (0: 种子, 1: 幼芽, 2: 幼苗, 3: 盆景, 4: 开花)
  xp INTEGER DEFAULT 0,                -- 经验值 (当前浇水量)
  last_commit_count INTEGER DEFAULT 0, -- 上次拉取时的 commits 数
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP -- 上次更新时间
);
