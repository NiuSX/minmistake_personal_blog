# 数据库完整学习笔记

> 适合对象：后端开发、全栈开发、数据开发、测试、运维、架构学习者，以及需要系统掌握数据库基础、SQL、建模、事务、索引、性能优化、备份恢复、高可用和 NoSQL 的人。

数据库是软件系统中用于持久化、组织、查询和管理数据的核心基础设施。大多数业务系统最终都绕不开数据库：用户、订单、商品、权限、日志、配置、支付、库存、消息、指标、报表等都需要被可靠地存储和查询。

如果你只会写 `SELECT * FROM user`，还不算真正理解数据库。真正掌握数据库，需要理解：数据模型、表设计、主键外键、SQL 执行顺序、索引原理、事务 ACID、隔离级别、锁和 MVCC、查询计划、分页优化、范式和反范式、备份恢复、主从复制、分库分表、连接池、安全权限、迁移脚本、OLTP/OLAP 区别，以及不同类型数据库的适用场景。

说明：不同数据库产品在 SQL 语法、数据类型、索引、事务隔离、锁机制、复制方式和执行计划上存在差异。本文以通用数据库知识和常见关系型数据库为主，示例 SQL 偏标准写法，同时会提示 MySQL、PostgreSQL 等常见差异。真实项目应以所使用数据库的官方文档为准。

## 目录

1. 数据库是什么
2. 数据库解决什么问题
3. 数据库分类
4. DB、DBMS、SQL、Schema
5. 关系型数据库核心概念
6. SQL 分类
7. 数据类型
8. 表、字段、行、约束
9. 主键、外键、唯一约束
10. DDL：建库建表改表删表
11. DML：增删改
12. DQL：查询基础
13. WHERE、NULL、三值逻辑
14. ORDER BY、LIMIT、分页
15. 聚合函数、GROUP BY、HAVING
16. JOIN 连接查询
17. 子查询、CTE、临时表
18. 窗口函数
19. 视图和物化视图
20. 事务 ACID
21. 并发问题与隔离级别
22. 锁、MVCC 与死锁
23. 索引原理
24. 常见索引类型
25. 索引设计原则
26. SQL 执行计划
27. 查询优化
28. 数据库设计与 ER 建模
29. 范式与反范式
30. 命名规范和字段设计
31. 连接池
32. 数据迁移与版本管理
33. 备份与恢复
34. 复制、读写分离与高可用
35. 分区、分库、分表
36. OLTP、OLAP、数据仓库
37. NoSQL 数据库
38. Redis、MongoDB、Elasticsearch 简介
39. CAP、BASE 与一致性
40. 数据安全与权限
41. 数据库监控
42. 常见错误和反模式
43. 数据库学习路线
44. SQL 速查表
45. 推荐参考资料

## 1. 数据库是什么

数据库是按照一定数据模型组织、存储和管理数据的系统。

它提供：

- 数据持久化
- 数据查询
- 数据新增、修改、删除
- 并发控制
- 事务处理
- 权限控制
- 备份恢复
- 数据完整性约束
- 高可用和扩展能力

一句话理解：

```text
数据库是应用系统可靠保存和高效查询数据的地方。
```

## 2. 数据库解决什么问题

### 2.1 数据持久化

程序运行在内存中，进程退出后内存数据会丢失。

数据库把数据保存到磁盘或持久化存储中。

例如：

- 用户注册信息
- 订单信息
- 支付记录
- 商品库存
- 系统配置

### 2.2 数据结构化

数据库可以用表、文档、键值、图等方式组织数据。

关系型数据库用表结构：

```text
users
orders
products
order_items
```

### 2.3 高效查询

数据库支持：

- 条件查询
- 排序
- 分页
- 聚合
- 连接
- 索引
- 查询优化器

### 2.4 数据一致性

例如转账：

```text
A 扣 100
B 加 100
```

这两个操作必须同时成功或同时失败。

数据库用事务保证。

### 2.5 并发访问

多个用户同时访问同一份数据。

数据库需要处理：

- 并发读
- 并发写
- 读写冲突
- 写写冲突
- 死锁
- 隔离级别

## 3. 数据库分类

### 3.1 关系型数据库

以表为核心，用 SQL 查询。

常见：

- MySQL
- PostgreSQL
- Oracle
- SQL Server
- SQLite
- MariaDB

适合：

- 事务系统
- 业务系统
- 强一致性数据
- 复杂查询
- 多表关系

### 3.2 键值数据库

以 key-value 存储。

常见：

- Redis
- etcd
- DynamoDB

适合：

- 缓存
- 会话
- 分布式锁
- 计数器
- 排行榜

### 3.3 文档数据库

以 JSON/BSON 文档存储。

常见：

- MongoDB
- CouchDB

适合：

- 半结构化数据
- 内容管理
- 配置数据
- 快速迭代 schema

### 3.4 列式数据库

按列存储，适合分析查询。

常见：

- ClickHouse
- Apache Doris
- Apache Druid
- BigQuery

适合：

- 日志分析
- 指标分析
- 报表
- OLAP

### 3.5 图数据库

以节点和边表达关系。

常见：

- Neo4j
- JanusGraph

适合：

- 社交关系
- 推荐系统
- 知识图谱
- 路径查询

### 3.6 搜索引擎

面向全文检索。

常见：

- Elasticsearch
- OpenSearch
- Solr

适合：

- 搜索
- 日志检索
- 文本分析
- 模糊匹配

## 4. DB、DBMS、SQL、Schema

| 概念 | 含义 |
| :--- | :--- |
| DB | Database，数据库 |
| DBMS | Database Management System，数据库管理系统 |
| RDBMS | 关系型数据库管理系统 |
| SQL | Structured Query Language，结构化查询语言 |
| Schema | 数据库结构定义 |
| Table | 表 |
| Row | 行，记录 |
| Column | 列，字段 |
| Index | 索引 |
| Transaction | 事务 |

### 4.1 DB 和 DBMS 区别

MySQL 是 DBMS。

你在 MySQL 中创建的 `shop` 是 database。

```sql
CREATE DATABASE shop;
```

### 4.2 Schema

不同数据库中 schema 含义略有差异。

PostgreSQL 中 schema 是 database 下的命名空间：

```text
database -> schema -> table
```

MySQL 中 schema 常常和 database 接近。

## 5. 关系型数据库核心概念

### 5.1 表

表是关系型数据库中存储数据的基本结构。

```text
users
```

| id | username | email |
| :--- | :--- | :--- |
| 1 | alice | alice@example.com |
| 2 | bob | bob@example.com |

### 5.2 行

一行是一条记录。

例如一个用户、一笔订单、一条日志。

### 5.3 列

一列是一个字段。

例如：

- `id`
- `username`
- `email`
- `created_at`

### 5.4 关系

表与表之间可以建立关系。

常见：

- 一对一
- 一对多
- 多对多

### 5.5 一对多

一个用户有多个订单。

```text
users.id -> orders.user_id
```

### 5.6 多对多

学生和课程：

```text
students
courses
student_courses
```

中间表：

```sql
CREATE TABLE student_courses (
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    PRIMARY KEY (student_id, course_id)
);
```

## 6. SQL 分类

### 6.1 DDL

Data Definition Language，数据定义语言。

用于定义结构：

```sql
CREATE TABLE
ALTER TABLE
DROP TABLE
CREATE INDEX
```

### 6.2 DML

Data Manipulation Language，数据操作语言。

用于修改数据：

```sql
INSERT
UPDATE
DELETE
```

### 6.3 DQL

Data Query Language，数据查询语言。

```sql
SELECT
```

### 6.4 DCL

Data Control Language，数据控制语言。

```sql
GRANT
REVOKE
```

### 6.5 TCL

Transaction Control Language，事务控制语言。

```sql
BEGIN
COMMIT
ROLLBACK
SAVEPOINT
```

## 7. 数据类型

不同数据库数据类型不完全相同。

### 7.1 整数

常见：

```sql
SMALLINT
INTEGER
BIGINT
```

MySQL 还常见：

```sql
TINYINT
MEDIUMINT
```

### 7.2 小数

精确小数：

```sql
DECIMAL(10, 2)
NUMERIC(10, 2)
```

适合金额。

浮点数：

```sql
FLOAT
DOUBLE
REAL
```

不适合精确金额。

### 7.3 字符串

```sql
CHAR(10)
VARCHAR(255)
TEXT
```

`CHAR` 固定长度。

`VARCHAR` 可变长度。

`TEXT` 适合长文本。

### 7.4 日期时间

```sql
DATE
TIME
TIMESTAMP
DATETIME
```

不同数据库对时区处理不同。

建议项目统一约定：

```text
存 UTC 时间，展示时按用户时区转换。
```

### 7.5 布尔

```sql
BOOLEAN
```

MySQL 中常用 `TINYINT(1)` 表示布尔。

### 7.6 JSON

现代数据库通常支持 JSON 类型。

PostgreSQL：

```sql
JSON
JSONB
```

MySQL：

```sql
JSON
```

JSON 适合存扩展属性，但不要用 JSON 逃避合理建模。

## 8. 表、字段、行、约束

### 8.1 建表示例

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
```

### 8.2 常见约束

| 约束 | 作用 |
| :--- | :--- |
| `PRIMARY KEY` | 主键 |
| `FOREIGN KEY` | 外键 |
| `UNIQUE` | 唯一 |
| `NOT NULL` | 非空 |
| `DEFAULT` | 默认值 |
| `CHECK` | 检查约束 |

### 8.3 NOT NULL

```sql
username VARCHAR(50) NOT NULL
```

表示必须有值。

### 8.4 DEFAULT

```sql
status VARCHAR(20) NOT NULL DEFAULT 'active'
```

### 8.5 CHECK

```sql
age INTEGER CHECK (age >= 0)
```

MySQL 老版本对 CHECK 支持曾有差异，实际使用需查具体版本。

## 9. 主键、外键、唯一约束

### 9.1 主键

主键唯一标识一行。

要求：

- 唯一
- 非空
- 稳定

```sql
id BIGINT PRIMARY KEY
```

### 9.2 自增主键

MySQL：

```sql
id BIGINT PRIMARY KEY AUTO_INCREMENT
```

PostgreSQL：

```sql
id BIGSERIAL PRIMARY KEY
```

或 identity：

```sql
id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
```

### 9.3 UUID 主键

适合：

- 分布式生成
- 不暴露递增规律
- 多系统合并数据

缺点：

- 占用更大
- 索引局部性可能较差

### 9.4 外键

```sql
CREATE TABLE orders (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

外键保证引用完整性。

### 9.5 唯一约束

```sql
email VARCHAR(255) NOT NULL UNIQUE
```

组合唯一：

```sql
UNIQUE (tenant_id, username)
```

## 10. DDL：建库建表改表删表

### 10.1 创建数据库

```sql
CREATE DATABASE shop;
```

### 10.2 删除数据库

```sql
DROP DATABASE shop;
```

危险操作，生产环境禁止随意执行。

### 10.3 创建表

```sql
CREATE TABLE products (
    id BIGINT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL
);
```

### 10.4 修改表

新增字段：

```sql
ALTER TABLE products ADD COLUMN description TEXT;
```

修改字段：

```sql
ALTER TABLE products ALTER COLUMN name TYPE VARCHAR(200);
```

不同数据库语法不同。

### 10.5 删除字段

```sql
ALTER TABLE products DROP COLUMN description;
```

### 10.6 删除表

```sql
DROP TABLE products;
```

## 11. DML：增删改

### 11.1 INSERT

```sql
INSERT INTO users (id, username, email, created_at, updated_at)
VALUES (1, 'alice', 'alice@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
```

### 11.2 批量插入

```sql
INSERT INTO users (id, username, email, created_at, updated_at)
VALUES
    (1, 'alice', 'alice@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 'bob', 'bob@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
```

### 11.3 UPDATE

```sql
UPDATE users
SET email = 'alice_new@example.com',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1;
```

注意：

```text
UPDATE 一定要谨慎写 WHERE。
```

### 11.4 DELETE

```sql
DELETE FROM users
WHERE id = 1;
```

注意：

```text
DELETE 也一定要谨慎写 WHERE。
```

### 11.5 软删除

很多业务不直接删除，而是：

```sql
UPDATE users
SET deleted_at = CURRENT_TIMESTAMP
WHERE id = 1;
```

查询时过滤：

```sql
WHERE deleted_at IS NULL
```

## 12. DQL：查询基础

### 12.1 SELECT

```sql
SELECT id, username, email
FROM users;
```

### 12.2 不建议 SELECT *

不推荐：

```sql
SELECT * FROM users;
```

原因：

- 多取无用字段
- 增加网络传输
- 表结构变化影响程序
- 不利于覆盖索引

推荐：

```sql
SELECT id, username, email
FROM users;
```

### 12.3 WHERE

```sql
SELECT id, username
FROM users
WHERE status = 'active';
```

### 12.4 别名

```sql
SELECT username AS name
FROM users;
```

表别名：

```sql
SELECT u.id, u.username
FROM users AS u;
```

## 13. WHERE、NULL、三值逻辑

### 13.1 常见条件

```sql
WHERE age >= 18
WHERE status = 'active'
WHERE created_at >= '2026-01-01'
WHERE username LIKE 'a%'
WHERE id IN (1, 2, 3)
WHERE deleted_at IS NULL
```

### 13.2 NULL

NULL 表示未知或缺失。

不能用：

```sql
WHERE deleted_at = NULL
```

应该用：

```sql
WHERE deleted_at IS NULL
```

非空：

```sql
WHERE deleted_at IS NOT NULL
```

### 13.3 三值逻辑

SQL 判断结果可能是：

- TRUE
- FALSE
- UNKNOWN

涉及 NULL 时经常得到 UNKNOWN。

例如：

```sql
NULL = NULL
```

结果不是 TRUE，而是 UNKNOWN。

### 13.4 AND / OR

```sql
WHERE status = 'active'
  AND age >= 18
```

```sql
WHERE status = 'active'
   OR status = 'pending'
```

注意括号：

```sql
WHERE status = 'active'
  AND (role = 'admin' OR role = 'owner')
```

## 14. ORDER BY、LIMIT、分页

### 14.1 ORDER BY

```sql
SELECT id, username
FROM users
ORDER BY created_at DESC;
```

### 14.2 多字段排序

```sql
ORDER BY status ASC, created_at DESC
```

### 14.3 LIMIT

```sql
SELECT id, username
FROM users
ORDER BY created_at DESC
LIMIT 20;
```

### 14.4 OFFSET 分页

```sql
SELECT id, username
FROM users
ORDER BY created_at DESC
LIMIT 20 OFFSET 40;
```

问题：

```text
OFFSET 越大，性能通常越差。
```

### 14.5 游标分页

```sql
SELECT id, username, created_at
FROM users
WHERE created_at < '2026-06-01 10:00:00'
ORDER BY created_at DESC
LIMIT 20;
```

如果 created_at 不唯一，使用组合条件：

```sql
WHERE (created_at, id) < ('2026-06-01 10:00:00', 1000)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

不同数据库对行值比较支持不同。

## 15. 聚合函数、GROUP BY、HAVING

### 15.1 聚合函数

常见：

```sql
COUNT()
SUM()
AVG()
MIN()
MAX()
```

示例：

```sql
SELECT COUNT(*) AS user_count
FROM users;
```

### 15.2 GROUP BY

```sql
SELECT status, COUNT(*) AS count
FROM users
GROUP BY status;
```

### 15.3 HAVING

`WHERE` 过滤分组前数据。

`HAVING` 过滤分组后结果。

```sql
SELECT user_id, COUNT(*) AS order_count
FROM orders
GROUP BY user_id
HAVING COUNT(*) >= 10;
```

### 15.4 COUNT(*) 和 COUNT(column)

```sql
COUNT(*)
```

统计行数。

```sql
COUNT(email)
```

统计 email 非 NULL 的行数。

## 16. JOIN 连接查询

### 16.1 INNER JOIN

只返回两边匹配的数据。

```sql
SELECT o.id, u.username, o.total_amount
FROM orders AS o
INNER JOIN users AS u ON o.user_id = u.id;
```

### 16.2 LEFT JOIN

返回左表全部数据，右表匹配不到则为 NULL。

```sql
SELECT u.id, u.username, o.id AS order_id
FROM users AS u
LEFT JOIN orders AS o ON u.id = o.user_id;
```

### 16.3 RIGHT JOIN

返回右表全部数据。

实际开发中较少用，通常可改写成 LEFT JOIN。

### 16.4 FULL JOIN

返回两边所有数据，匹配不到的列为 NULL。

MySQL 不直接支持标准 FULL JOIN。

### 16.5 多表 JOIN

```sql
SELECT
    o.id AS order_id,
    u.username,
    p.name AS product_name,
    oi.quantity
FROM orders AS o
JOIN users AS u ON o.user_id = u.id
JOIN order_items AS oi ON o.id = oi.order_id
JOIN products AS p ON oi.product_id = p.id;
```

### 16.6 JOIN 注意事项

- JOIN 条件必须明确
- 小心笛卡尔积
- JOIN 字段通常需要索引
- 不要一次 JOIN 过多大表
- 注意过滤条件放在 ON 还是 WHERE

## 17. 子查询、CTE、临时表

### 17.1 子查询

```sql
SELECT id, username
FROM users
WHERE id IN (
    SELECT user_id
    FROM orders
    WHERE total_amount > 1000
);
```

### 17.2 EXISTS

```sql
SELECT u.id, u.username
FROM users AS u
WHERE EXISTS (
    SELECT 1
    FROM orders AS o
    WHERE o.user_id = u.id
);
```

### 17.3 CTE

Common Table Expression。

```sql
WITH high_value_orders AS (
    SELECT *
    FROM orders
    WHERE total_amount > 1000
)
SELECT user_id, COUNT(*)
FROM high_value_orders
GROUP BY user_id;
```

CTE 可以提升复杂 SQL 可读性。

### 17.4 递归 CTE

适合树形结构。

```sql
WITH RECURSIVE category_tree AS (
    SELECT id, parent_id, name
    FROM categories
    WHERE id = 1

    UNION ALL

    SELECT c.id, c.parent_id, c.name
    FROM categories c
    JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT *
FROM category_tree;
```

不同数据库支持和语法存在差异。

## 18. 窗口函数

窗口函数用于在不折叠行的情况下做分组计算。

### 18.1 ROW_NUMBER

```sql
SELECT
    user_id,
    id AS order_id,
    total_amount,
    ROW_NUMBER() OVER (
        PARTITION BY user_id
        ORDER BY total_amount DESC
    ) AS rn
FROM orders;
```

### 18.2 每个用户金额最高订单

```sql
WITH ranked_orders AS (
    SELECT
        user_id,
        id AS order_id,
        total_amount,
        ROW_NUMBER() OVER (
            PARTITION BY user_id
            ORDER BY total_amount DESC
        ) AS rn
    FROM orders
)
SELECT *
FROM ranked_orders
WHERE rn = 1;
```

### 18.3 常见窗口函数

| 函数 | 作用 |
| :--- | :--- |
| `ROW_NUMBER()` | 行号，不并列 |
| `RANK()` | 排名，有并列且跳号 |
| `DENSE_RANK()` | 排名，有并列不跳号 |
| `LAG()` | 取前一行 |
| `LEAD()` | 取后一行 |
| `SUM() OVER` | 窗口求和 |
| `AVG() OVER` | 窗口平均 |

## 19. 视图和物化视图

### 19.1 视图

视图是保存的查询。

```sql
CREATE VIEW active_users AS
SELECT id, username, email
FROM users
WHERE status = 'active';
```

查询：

```sql
SELECT *
FROM active_users;
```

### 19.2 视图优点

- 简化复杂查询
- 隐藏底层表结构
- 控制字段暴露
- 统一查询逻辑

### 19.3 物化视图

物化视图保存查询结果。

适合：

- 报表
- 聚合数据
- 查询成本高但更新频率低的数据

不同数据库支持不同。

PostgreSQL 示例：

```sql
CREATE MATERIALIZED VIEW daily_sales AS
SELECT DATE(created_at) AS date, SUM(total_amount) AS amount
FROM orders
GROUP BY DATE(created_at);
```

刷新：

```sql
REFRESH MATERIALIZED VIEW daily_sales;
```

## 20. 事务 ACID

事务是一组操作的逻辑单元。

### 20.1 示例

转账：

```sql
BEGIN;

UPDATE accounts
SET balance = balance - 100
WHERE id = 1;

UPDATE accounts
SET balance = balance + 100
WHERE id = 2;

COMMIT;
```

失败时：

```sql
ROLLBACK;
```

### 20.2 ACID

| 特性 | 含义 |
| :--- | :--- |
| Atomicity 原子性 | 要么全部成功，要么全部失败 |
| Consistency 一致性 | 事务前后数据满足约束 |
| Isolation 隔离性 | 并发事务互不干扰到指定程度 |
| Durability 持久性 | 提交后数据不会因为故障轻易丢失 |

### 20.3 SAVEPOINT

```sql
BEGIN;

INSERT INTO orders (id, user_id) VALUES (1, 100);

SAVEPOINT before_items;

INSERT INTO order_items (order_id, product_id) VALUES (1, 200);

ROLLBACK TO SAVEPOINT before_items;

COMMIT;
```

## 21. 并发问题与隔离级别

### 21.1 脏读

一个事务读到另一个未提交事务的数据。

### 21.2 不可重复读

同一事务内两次读取同一行，结果不同。

### 21.3 幻读

同一事务内两次范围查询，出现新增或消失的行。

### 21.4 丢失更新

两个事务同时读同一值并更新，后提交覆盖先提交。

### 21.5 隔离级别

标准隔离级别：

| 隔离级别 | 说明 |
| :--- | :--- |
| Read Uncommitted | 可能读未提交数据 |
| Read Committed | 只能读已提交数据 |
| Repeatable Read | 同一事务内重复读一致 |
| Serializable | 最高隔离，效果接近串行执行 |

### 21.6 数据库差异

MySQL InnoDB 默认通常是 Repeatable Read。

PostgreSQL 默认通常是 Read Committed。

不同数据库对隔离级别的具体实现不同。

## 22. 锁、MVCC 与死锁

### 22.1 共享锁和排他锁

共享锁：

```text
读锁，多个事务可同时持有。
```

排他锁：

```text
写锁，同一资源通常只能一个事务持有。
```

### 22.2 行锁和表锁

行锁粒度小，并发好。

表锁粒度大，并发差，但管理简单。

### 22.3 MVCC

Multi-Version Concurrency Control，多版本并发控制。

核心思想：

```text
读不一定阻塞写，写不一定阻塞读；通过数据版本实现一致性读。
```

MVCC 能显著提升并发性能。

### 22.4 SELECT FOR UPDATE

```sql
BEGIN;

SELECT *
FROM accounts
WHERE id = 1
FOR UPDATE;

UPDATE accounts
SET balance = balance - 100
WHERE id = 1;

COMMIT;
```

用于锁定待更新行。

### 22.5 死锁

事务 A 持有资源 1，等待资源 2。

事务 B 持有资源 2，等待资源 1。

形成死锁。

减少死锁：

- 固定访问顺序
- 事务尽量短
- 索引要合理
- 避免大事务
- 捕获死锁错误并重试

## 23. 索引原理

索引是帮助数据库快速查找数据的数据结构。

没有索引：

```text
全表扫描
```

有索引：

```text
按索引快速定位
```

### 23.1 索引类比

书的目录就是索引。

如果没有目录，查某一章要从头翻到尾。

有目录，可以直接定位页码。

### 23.2 索引代价

索引不是越多越好。

代价：

- 占用磁盘空间
- INSERT 更慢
- UPDATE 索引字段更慢
- DELETE 更慢
- 优化器选择成本增加

### 23.3 B+Tree

关系型数据库常用 B+Tree 索引。

适合：

- 等值查询
- 范围查询
- 排序
- 前缀匹配

### 23.4 覆盖索引

查询字段都能从索引中得到，不必回表。

```sql
SELECT id, email
FROM users
WHERE email = 'a@example.com';
```

如果索引包含 `(email, id)`，可能形成覆盖索引。

## 24. 常见索引类型

### 24.1 普通索引

```sql
CREATE INDEX idx_users_email ON users(email);
```

### 24.2 唯一索引

```sql
CREATE UNIQUE INDEX uk_users_email ON users(email);
```

### 24.3 组合索引

```sql
CREATE INDEX idx_orders_user_created
ON orders(user_id, created_at);
```

### 24.4 前缀索引

MySQL 中常见：

```sql
CREATE INDEX idx_users_email_prefix
ON users(email(20));
```

### 24.5 部分索引

PostgreSQL 支持：

```sql
CREATE INDEX idx_active_users_email
ON users(email)
WHERE status = 'active';
```

### 24.6 函数索引

```sql
CREATE INDEX idx_users_lower_email
ON users(LOWER(email));
```

查询：

```sql
WHERE LOWER(email) = LOWER('Alice@Example.com')
```

## 25. 索引设计原则

### 25.1 给高频查询建索引

先看真实查询。

不要凭感觉乱建。

### 25.2 高选择性字段更适合索引

选择性高：

- email
- phone
- order_no

选择性低：

- gender
- status
- boolean

低选择性字段不一定不能建索引，要结合查询场景和组合索引。

### 25.3 组合索引顺序很重要

```sql
CREATE INDEX idx_orders_user_status_created
ON orders(user_id, status, created_at);
```

适合：

```sql
WHERE user_id = ?
WHERE user_id = ? AND status = ?
WHERE user_id = ? AND status = ? ORDER BY created_at
```

不一定适合：

```sql
WHERE status = ?
```

### 25.4 避免对索引列做函数计算

不推荐：

```sql
WHERE DATE(created_at) = '2026-06-07'
```

更推荐：

```sql
WHERE created_at >= '2026-06-07'
  AND created_at < '2026-06-08'
```

### 25.5 避免左模糊 LIKE

```sql
WHERE name LIKE '%abc'
```

通常难以使用普通 B+Tree 索引。

前缀匹配更友好：

```sql
WHERE name LIKE 'abc%'
```

全文检索应考虑专门索引或搜索引擎。

## 26. SQL 执行计划

执行计划告诉你数据库如何执行 SQL。

### 26.1 MySQL

```sql
EXPLAIN
SELECT *
FROM users
WHERE email = 'a@example.com';
```

### 26.2 PostgreSQL

```sql
EXPLAIN
SELECT *
FROM users
WHERE email = 'a@example.com';
```

实际执行并统计：

```sql
EXPLAIN ANALYZE
SELECT *
FROM users
WHERE email = 'a@example.com';
```

### 26.3 重点关注

- 是否全表扫描
- 是否使用索引
- JOIN 顺序
- 估算行数和实际行数差距
- 排序是否消耗大
- 是否临时表
- 是否回表

### 26.4 不同数据库术语不同

MySQL 关注：

- type
- key
- rows
- Extra

PostgreSQL 关注：

- Seq Scan
- Index Scan
- Bitmap Index Scan
- Nested Loop
- Hash Join
- Sort
- Cost
- Actual Time

## 27. 查询优化

### 27.1 只查需要字段

不推荐：

```sql
SELECT *
FROM orders;
```

推荐：

```sql
SELECT id, user_id, total_amount, created_at
FROM orders;
```

### 27.2 合理使用索引

根据 WHERE、JOIN、ORDER BY、GROUP BY 建索引。

### 27.3 避免大 OFFSET

大分页使用游标分页。

### 27.4 分批处理

不要一次处理百万行。

```sql
SELECT id
FROM users
WHERE id > ?
ORDER BY id
LIMIT 1000;
```

### 27.5 避免 N+1 查询

错误模式：

```text
查 100 个订单
循环每个订单查用户
```

应使用 JOIN 或批量查询。

### 27.6 大事务拆分

大事务会：

- 持锁时间长
- 占用 undo/redo
- 增加复制延迟
- 增加回滚成本

### 27.7 读写分离

读多写少系统可使用读副本分担读压力。

注意复制延迟。

## 28. 数据库设计与 ER 建模

### 28.1 实体

实体是业务对象。

例如：

- 用户
- 商品
- 订单
- 课程
- 文章

### 28.2 属性

实体的字段。

用户属性：

- id
- username
- email
- status
- created_at

### 28.3 关系

实体之间的关系：

- 用户下订单
- 订单包含商品
- 学生选课程

### 28.4 ER 图

ER 图描述：

- 实体
- 属性
- 关系
- 基数

### 28.5 设计步骤

1. 理解业务流程。
2. 找实体。
3. 找实体属性。
4. 找实体关系。
5. 确定主键。
6. 确定外键。
7. 确定约束。
8. 根据查询场景设计索引。
9. 根据性能和扩展性做适度反范式。

## 29. 范式与反范式

### 29.1 第一范式

字段保持原子性。

不推荐：

```text
phone_numbers = "138...,139..."
```

推荐单独表：

```text
user_phones
```

### 29.2 第二范式

非主键字段依赖整个主键，而不是组合主键的一部分。

### 29.3 第三范式

非主键字段不传递依赖其他非主键字段。

### 29.4 范式优点

- 减少冗余
- 降低更新异常
- 数据一致性更好

### 29.5 反范式

为了性能或查询方便，适度冗余数据。

例如订单表冗余用户名：

```text
orders.buyer_name
```

即使用户改名，历史订单仍显示当时名称。

### 29.6 原则

```text
先合理范式化，再基于真实查询和性能瓶颈做反范式。
```

不要一开始就过度冗余。

## 30. 命名规范和字段设计

### 30.1 表名

常见风格：

```text
users
orders
order_items
```

统一即可。

### 30.2 字段名

推荐 snake_case：

```text
created_at
updated_at
deleted_at
user_id
order_no
```

### 30.3 常见基础字段

```sql
id BIGINT PRIMARY KEY
created_at TIMESTAMP NOT NULL
updated_at TIMESTAMP NOT NULL
deleted_at TIMESTAMP NULL
```

### 30.4 状态字段

```sql
status VARCHAR(20) NOT NULL
```

状态值要有明确枚举定义。

### 30.5 金额字段

推荐：

```sql
amount DECIMAL(18, 2)
```

或用整数保存最小货币单位：

```sql
amount_cents BIGINT
```

不要用浮点数保存金额。

### 30.6 时间字段

建议统一：

- 存 UTC
- 字段名清晰
- 业务时间和系统时间分开

例如：

```text
paid_at
shipped_at
created_at
updated_at
```

## 31. 连接池

### 31.1 为什么需要连接池

数据库连接创建成本高。

连接池复用连接。

### 31.2 常见参数

- 最大连接数
- 最小空闲连接
- 获取连接超时
- 空闲超时
- 最大生命周期
- 连接检测

### 31.3 连接池过大不是好事

过多连接会：

- 增加数据库压力
- 增加上下文切换
- 占用内存
- 造成锁竞争

### 31.4 经验原则

连接池大小要根据：

- 数据库能力
- 应用实例数量
- 查询耗时
- QPS
- 事务长度

综合评估。

## 32. 数据迁移与版本管理

### 32.1 为什么需要迁移

数据库结构会随业务变化。

需要可追踪、可回滚、可审计。

### 32.2 常见工具

- Flyway
- Liquibase
- Alembic
- Rails Migration
- Prisma Migrate

### 32.3 迁移脚本示例

```sql
ALTER TABLE users ADD COLUMN last_login_at TIMESTAMP NULL;
```

### 32.4 迁移原则

- 迁移脚本进版本库
- 禁止手工改生产库结构
- 大表变更要评估锁表风险
- 上线前先在测试环境执行
- 保持应用和数据库兼容

### 32.5 兼容式变更

安全顺序：

1. 新增可空字段。
2. 发布应用写入新字段。
3. 回填历史数据。
4. 添加约束。
5. 删除旧字段。

不要一次性删除旧字段导致旧版本应用崩溃。

## 33. 备份与恢复

### 33.1 为什么备份

防止：

- 误删数据
- 硬件故障
- 软件 bug
- 勒索攻击
- 灾难事故

### 33.2 备份类型

| 类型 | 说明 |
| :--- | :--- |
| 全量备份 | 备份全部数据 |
| 增量备份 | 备份变化数据 |
| 逻辑备份 | 导出 SQL 或逻辑数据 |
| 物理备份 | 复制数据库物理文件 |
| Point-in-Time Recovery | 恢复到某个时间点 |

### 33.3 只备份不演练等于没备份

必须定期恢复演练。

检查：

- 备份是否完整
- 备份是否可恢复
- 恢复耗时
- 恢复后数据是否正确

### 33.4 RPO 和 RTO

RPO：

```text
最多允许丢失多少数据。
```

RTO：

```text
最多允许多久恢复服务。
```

## 34. 复制、读写分离与高可用

### 34.1 主从复制

主库写入，从库复制数据。

用途：

- 读扩展
- 备份
- 故障切换

### 34.2 读写分离

写请求走主库。

读请求走从库。

注意：

```text
从库可能有复制延迟。
```

刚写完马上读，可能读不到最新数据。

### 34.3 高可用

高可用关注：

- 主库故障检测
- 自动故障切换
- 数据一致性
- 客户端重连
- 脑裂防护

### 34.4 常见风险

- 复制延迟
- 主从数据不一致
- 故障切换丢数据
- 应用缓存旧连接
- DNS 切换延迟

## 35. 分区、分库、分表

### 35.1 分区

在同一个数据库中，把一张大表按规则拆成多个分区。

常见：

- 按时间
- 按范围
- 按 hash

适合：

- 日志表
- 订单历史
- 时间序列数据

### 35.2 分库

把数据拆到不同数据库实例。

### 35.3 分表

把一张逻辑表拆成多张物理表。

例如：

```text
orders_0000
orders_0001
...
orders_1023
```

### 35.4 分片键

选择分片键很关键。

常见：

- user_id
- tenant_id
- order_id

### 35.5 分库分表代价

- 跨分片 JOIN 困难
- 跨分片事务复杂
- 全局唯一 ID
- 分页和排序复杂
- 数据迁移复杂
- 运维复杂

原则：

```text
能不分就不分，先优化索引、SQL、硬件、读写分离、分区。
```

## 36. OLTP、OLAP、数据仓库

### 36.1 OLTP

Online Transaction Processing。

面向在线事务。

特点：

- 高频读写
- 单次查询数据量小
- 强事务
- 低延迟

典型：

- 电商下单
- 用户登录
- 支付
- 库存扣减

### 36.2 OLAP

Online Analytical Processing。

面向分析查询。

特点：

- 大数据量扫描
- 聚合统计
- 报表
- 查询耗时可更长

典型：

- 销售报表
- 用户行为分析
- 日志分析

### 36.3 数据仓库

数据仓库用于整合多个业务系统数据，支持分析。

常见流程：

```text
业务库 -> ETL/ELT -> 数据仓库 -> BI/报表/分析
```

### 36.4 不要用业务库硬扛报表

复杂报表可能拖慢线上交易系统。

应考虑：

- 只读副本
- 数据仓库
- OLAP 数据库
- 缓存预计算

## 37. NoSQL 数据库

NoSQL 不是“不要 SQL”，而是 Not Only SQL。

### 37.1 适合场景

- 高并发缓存
- 半结构化数据
- 海量日志
- 全文搜索
- 图关系
- 时间序列

### 37.2 不适合盲目替代关系库

很多业务数据天然有关系和事务。

例如：

- 订单
- 支付
- 库存
- 账户余额

这些通常更适合关系型数据库。

### 37.3 选型原则

根据问题选数据库。

不要因为流行而选。

## 38. Redis、MongoDB、Elasticsearch 简介

### 38.1 Redis

内存键值数据库。

常见用途：

- 缓存
- 分布式锁
- 计数器
- 限流
- 排行榜
- 会话
- 消息队列轻量场景

注意：

- 内存容量
- 持久化策略
- 缓存穿透/击穿/雪崩
- 大 key
- 热 key

### 38.2 MongoDB

文档数据库。

适合：

- 文档结构灵活
- JSON 风格数据
- 快速迭代

注意：

- schema 仍要设计
- 嵌入和引用要权衡
- 大文档和数组增长问题

### 38.3 Elasticsearch

搜索和分析引擎。

适合：

- 全文搜索
- 日志检索
- 复杂文本匹配

注意：

- 不是主业务数据库替代品
- 写入一致性和事务能力不同于关系库
- 索引设计和分片设计很重要

## 39. CAP、BASE 与一致性

### 39.1 CAP

分布式系统中三个目标：

- Consistency 一致性
- Availability 可用性
- Partition Tolerance 分区容错性

网络分区发生时，系统通常需要在一致性和可用性之间权衡。

### 39.2 BASE

BASE 是一种最终一致性思想：

- Basically Available
- Soft state
- Eventually consistent

适合部分分布式系统。

### 39.3 强一致与最终一致

强一致：

```text
写入成功后，后续读取立即看到最新值。
```

最终一致：

```text
写入后短时间内可能读到旧值，但最终会一致。
```

### 39.4 业务选择

账户余额、支付、库存扣减通常要求更强一致。

点赞数、浏览量、推荐数据可以接受最终一致。

## 40. 数据安全与权限

### 40.1 最小权限原则

应用账号只给必要权限。

不要让应用使用 root/superuser。

### 40.2 权限示例

```sql
GRANT SELECT, INSERT, UPDATE, DELETE
ON users
TO app_user;
```

### 40.3 防 SQL 注入

危险：

```sql
SELECT *
FROM users
WHERE username = '${username}';
```

推荐使用参数化查询：

```sql
SELECT *
FROM users
WHERE username = ?;
```

### 40.4 敏感数据

敏感数据包括：

- 密码
- 手机号
- 邮箱
- 身份证
- 支付信息
- token

原则：

- 密码只存 hash
- 敏感字段加密或脱敏
- 日志不要打印敏感数据
- 备份也要保护

### 40.5 审计

重要操作应记录：

- 谁操作
- 操作时间
- 操作对象
- 操作前后变化
- 来源 IP

## 41. 数据库监控

### 41.1 关键指标

- QPS
- TPS
- 慢查询
- 连接数
- CPU
- 内存
- 磁盘 IO
- 锁等待
- 死锁
- 缓存命中率
- 复制延迟
- 磁盘空间

### 41.2 慢查询日志

数据库通常支持慢查询日志。

用于发现：

- 无索引查询
- 大表扫描
- 慢 JOIN
- 大排序
- 锁等待

### 41.3 告警

应对这些设置告警：

- 磁盘空间不足
- 主从延迟过大
- 连接数接近上限
- 慢查询激增
- 错误率升高
- 备份失败

## 42. 常见错误和反模式

### 42.1 没有主键

每张业务表都应有明确主键。

### 42.2 滥用 SELECT *

影响性能和稳定性。

### 42.3 没有 WHERE 的 UPDATE/DELETE

高危操作。

### 42.4 金额用浮点数

不推荐：

```sql
price FLOAT
```

推荐：

```sql
price DECIMAL(10, 2)
```

或：

```sql
price_cents BIGINT
```

### 42.5 用逗号拼多值

不推荐：

```text
role_ids = "1,2,3"
```

推荐中间表。

### 42.6 索引越多越好

错误。

索引会增加写入成本。

### 42.7 不做备份恢复演练

只备份不恢复验证，风险很大。

### 42.8 大事务

大事务容易造成锁等待、复制延迟和回滚困难。

### 42.9 把数据库当消息队列

简单任务可以，但高并发消息场景应考虑专门消息队列。

### 42.10 缓存和数据库一致性没设计

使用 Redis 缓存时，要考虑：

- 更新数据库后如何失效缓存
- 缓存穿透
- 缓存击穿
- 缓存雪崩
- 双写一致性

## 43. 数据库学习路线

### 阶段 1：SQL 基础

掌握：

- SELECT
- INSERT
- UPDATE
- DELETE
- WHERE
- ORDER BY
- LIMIT

### 阶段 2：表设计

掌握：

- 数据类型
- 主键
- 外键
- 唯一约束
- 非空约束
- 默认值

### 阶段 3：复杂查询

掌握：

- JOIN
- GROUP BY
- HAVING
- 子查询
- CTE
- 窗口函数

### 阶段 4：事务和并发

掌握：

- ACID
- 隔离级别
- 锁
- MVCC
- 死锁

### 阶段 5：索引和优化

掌握：

- B+Tree
- 组合索引
- 覆盖索引
- 执行计划
- 慢查询

### 阶段 6：工程实践

掌握：

- 连接池
- 迁移脚本
- 备份恢复
- 权限安全
- 监控告警

### 阶段 7：架构能力

掌握：

- 主从复制
- 读写分离
- 分区
- 分库分表
- OLTP/OLAP
- NoSQL 选型

## 44. SQL 速查表

### 44.1 建表

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL
);
```

### 44.2 插入

```sql
INSERT INTO users (id, username, email, created_at)
VALUES (1, 'alice', 'alice@example.com', CURRENT_TIMESTAMP);
```

### 44.3 查询

```sql
SELECT id, username, email
FROM users
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 20;
```

### 44.4 更新

```sql
UPDATE users
SET email = 'new@example.com'
WHERE id = 1;
```

### 44.5 删除

```sql
DELETE FROM users
WHERE id = 1;
```

### 44.6 JOIN

```sql
SELECT o.id, u.username, o.total_amount
FROM orders AS o
JOIN users AS u ON o.user_id = u.id;
```

### 44.7 聚合

```sql
SELECT status, COUNT(*) AS count
FROM users
GROUP BY status
HAVING COUNT(*) > 10;
```

### 44.8 创建索引

```sql
CREATE INDEX idx_users_email ON users(email);
```

### 44.9 事务

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

回滚：

```sql
ROLLBACK;
```

### 44.10 执行计划

```sql
EXPLAIN
SELECT *
FROM users
WHERE email = 'a@example.com';
```

## 45. 推荐参考资料

建议阅读：

- PostgreSQL 官方文档：https://www.postgresql.org/docs/
- MySQL 官方文档：https://dev.mysql.com/doc/
- SQLite 官方文档：https://www.sqlite.org/docs.html
- Redis 官方文档：https://redis.io/docs/latest/
- MongoDB 官方文档：https://www.mongodb.com/docs/
- Elasticsearch 官方文档：https://www.elastic.co/docs/
- SQL 教程：https://www.w3schools.com/sql/
- Use The Index, Luke：https://use-the-index-luke.com/

## 最后总结

数据库的核心可以浓缩为：

```text
表保存结构化数据
SQL 操作和查询数据
约束保证数据正确
事务保证操作可靠
索引提升查询性能
执行计划解释查询过程
备份恢复保证安全底线
复制和分片解决可用性与扩展性
```

学习数据库最重要的不是背语法，而是建立工程判断：

1. 这个数据应该如何建模？
2. 这个字段应该用什么类型？
3. 这个查询会不会走索引？
4. 这个事务会不会锁太久？
5. 这个表未来数据量多大？
6. 这个操作失败后能否恢复？
7. 这个设计是否满足一致性要求？

当你能解释主键和唯一索引的区别、LEFT JOIN 和 INNER JOIN 的区别、WHERE 和 HAVING 的区别、事务隔离级别、MVCC、组合索引最左前缀、执行计划、慢查询、备份恢复和读写分离时，就已经真正入门数据库。
