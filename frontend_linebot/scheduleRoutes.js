const express = require('express');
const router = express.Router();

let schedules = [
  { id: 1, subject: '數學', teacher: '王小明', time: '週一 08:10~10:00' },
  { id: 2, subject: '英文', teacher: '林美麗', time: '週二 10:10~12:00' },
];

// 格式化時間顯示使其更符合課表格式
function formatScheduleTime(timeStr) {
  // 假設時間格式為 "週x HH:MM~HH:MM"
  const parts = timeStr.split(' ');
  if (parts.length < 2) return timeStr;
  
  const day = parts[0];
  const time = parts[1];
  
  // 把時間段以 ~ 分割成起始和結束時間
  const [start, end] = time.split('~');
  
  return `
    <div class="schedule-time">
      <div class="day">${day}</div>
      <div class="hours">${start} ~ ${end}</div>
    </div>
  `;
}

// 主畫面：列出所有課程
router.get('/', (req, res) => {
  // 取得目前選中的星期（從查詢參數獲取，預設為週一）
  const selectedDay = req.query.day || '週一';
  
  // 篩選課程，如果選擇 "全部" 則顯示所有課程
  const filteredSchedules = selectedDay === '全部' 
    ? schedules 
    : schedules.filter(cls => cls.time.startsWith(selectedDay));
  
  const list = filteredSchedules.map(cls => `
    <tr>
      <td>${cls.subject}</td>
      <td>${cls.teacher}</td>
      <td>${formatScheduleTime(cls.time)}</td>
    </tr>
  `).join('');

  // 創建週一到週日的頁籤
  const days = ['週一', '週二', '週三', '週四', '週五', '週六', '週日', '全部'];
  const dayTabs = days.map(day => {
    const isActive = day === selectedDay ? 'active' : '';
    return `<a href="/schedule?day=${day}" class="day-tab ${isActive}">${day}</a>`;
  }).join('');

  // 如果沒有符合條件的資料，顯示提示訊息
  const emptyMessage = filteredSchedules.length === 0 ? 
    `<tr><td colspan="3" class="empty-message">這個星期沒有課程安排</td></tr>` : '';
  
  res.send(`
    <html>
    <head>
      <title>課表管理</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { 
          font-family: Arial, sans-serif; 
          background: #f7f7f7; 
          padding: 20px; 
          font-size: 26px; /* 調整為稍小的字體 */
          max-width: 1200px;
          margin: 0 auto;
        }
        h2 { 
          color: #2c3e50; 
          font-size: 40px; /* 稍微小一點的標題 */
          text-align: center;
          margin-bottom: 30px;
        }
        .day-tabs {
          display: flex;
          overflow-x: auto;
          margin-bottom: 30px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          padding: 10px;
        }
        .day-tab {
          padding: 14px 20px;
          margin: 0 5px;
          text-decoration: none;
          color: #2c3e50;
          border-radius: 8px;
          white-space: nowrap;
          transition: all 0.3s ease;
          font-weight: bold;
        }
        .day-tab:first-child {
          margin-left: 0;
        }
        .day-tab:hover {
          background: #f0f0f0;
        }
        .day-tab.active {
          background: #27ae60;
          color: white;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          background: white; 
          box-shadow: 0 0 20px rgba(0,0,0,0.15); 
          font-size: 26px; /* 調整表格字體 */
          margin-bottom: 40px;
          border-radius: 12px;
          overflow: hidden;
        }
        th, td { 
          padding: 18px 24px; /* 稍微減少內距 */
          border-bottom: 2px solid #ccc; 
          text-align: left; 
        }
        th { 
          background-color: #27ae60; 
          color: white; 
          font-size: 30px; /* 稍微小一點的表頭字體 */
          font-weight: bold;
        }
        tr:last-child td {
          border-bottom: none;
        }
        tr:hover {
          background-color: #f5f5f5;
        }
        .schedule-time {
          display: flex;
          flex-direction: column;
        }
        .schedule-time .day {
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 5px;
        }
        .schedule-time .hours {
          color: #3498db;
          font-size: 24px;
        }
        a.button {
          display: block; /* 改為區塊元素以占滿寬度 */
          padding: 16px 26px;
          background: #27ae60;
          color: white;
          text-decoration: none;
          border-radius: 12px;
          margin-top: 30px;
          font-size: 28px; /* 稍微小一點的按鈕文字 */
          text-align: center;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
        }
        a.button:hover {
          background: #219653;
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.2);
        }
        .empty-message {
          text-align: center;
          padding: 30px;
          font-style: italic;
          color: #7f8c8d;
        }
        @media (max-width: 768px) {
          body { 
            padding: 15px;
            font-size: 22px; /* 手機版更小一點 */
          }
          h2 { font-size: 36px; }
          th, td { padding: 15px 12px; }
          th { font-size: 26px; }
          a.button { font-size: 26px; }
          .schedule-time .hours { font-size: 20px; }
          .day-tab {
            padding: 10px 14px;
            font-size: 20px;
          }
        }
      </style>
    </head>
    <body>
      <h2>📘 課表管理</h2>
      <div class="day-tabs">
        ${dayTabs}
      </div>
      <table>
        <thead>
          <tr><th>科目</th><th>教師</th><th>時間</th></tr>
        </thead>
        <tbody>
          ${list || emptyMessage}
        </tbody>
      </table>
      <a class="button" href="/schedule/add">➕ 新增課程</a>
    </body>
    </html>
  `);
});

// 課表時間輔助函數，用於新增頁面的時間選項
function getTimeOptions() {
  const days = ['週一', '週二', '週三', '週四', '週五'];
  const startTimes = ['08:10', '09:10', '10:10', '11:10', '13:30', '14:30', '15:30', '16:30'];
  const endTimes = ['09:00', '10:00', '11:00', '12:00', '14:20', '15:20', '16:20', '17:20'];
  
  let options = '';
  days.forEach(day => {
    startTimes.forEach((start, i) => {
      options += `<option value="${day} ${start}~${endTimes[i]}">${day} ${start}~${endTimes[i]}</option>`;
    });
  });
  
  return options;
}

// 新增課表畫面
router.get('/add', (req, res) => {
  res.send(`
    <html>
    <head>
      <title>新增課程</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { 
          font-family: Arial, sans-serif; 
          background: #f2f2f2; 
          padding: 20px; 
          font-size: 26px; /* 調整為稍小的字體 */
        }
        h2 { 
          color: #2c3e50; 
          font-size: 40px; /* 稍微小一點的標題 */
          text-align: center;
          margin-bottom: 30px;
        }
        form {
          background: white;
          padding: 40px; /* 更多內部間距 */
          max-width: 800px; /* 更寬的表單 */
          margin: auto;
          box-shadow: 0 0 20px rgba(0,0,0,0.15);
          border-radius: 16px;
        }
        label { 
          display: block; 
          margin-bottom: 15px; 
          font-size: 26px; /* 調整標籤大小 */
          font-weight: bold;
        }
        input { 
          display: block; 
          width: 100%; 
          margin-bottom: 30px; 
          padding: 16px; 
          font-size: 26px; /* 調整輸入框文字大小 */
          border: 2px solid #ddd;
          border-radius: 10px;
          box-sizing: border-box;
        }
        input:focus {
          outline: none;
          border-color: #27ae60;
          box-shadow: 0 0 8px rgba(39,174,96,0.4);
        }
        button {
          background: #27ae60; 
          color: white; 
          padding: 16px 26px;
          border: none; 
          border-radius: 10px; 
          font-size: 28px; /* 調整按鈕文字大小 */
          cursor: pointer;
          width: 100%;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
        }
        button:hover {
          background: #219653;
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.2);
        }
        a.back-link {
          display: block;
          text-align: center;
          margin-top: 30px;
          color: #2c3e50;
          text-decoration: none;
          font-size: 24px;
        }
        @media (max-width: 768px) {
          body { 
            padding: 15px;
            font-size: 22px; 
          }
          h2 { font-size: 36px; }
          form { padding: 25px; }
          input { padding: 12px; font-size: 22px; }
          button { font-size: 24px; }
        }
      </style>
    </head>
    <body>
      <h2>➕ 新增課程</h2>
      <form method="POST" action="/schedule/add">
        <label>科目:</label>
        <input name="subject" required>
        <label>教師:</label>
        <input name="teacher" required>
        <label>時間:</label>
        <select name="time" required style="display: block; width: 100%; margin-bottom: 30px; padding: 16px; font-size: 26px; border: 2px solid #ddd; border-radius: 10px; box-sizing: border-box; background-color: white;">
          <option value="">-- 選擇時間 --</option>
          ${getTimeOptions()}
        </select>
        <button type="submit">送出</button>
      </form>
      <a href="/schedule" class="back-link">← 返回課表</a>
    </body>
    </html>
  `);
});

// 接收表單
router.post('/add', (req, res) => {
  const { subject, teacher, time } = req.body;
  schedules.push({ id: Date.now(), subject, teacher, time });
  res.redirect('/schedule');
});

module.exports = router;