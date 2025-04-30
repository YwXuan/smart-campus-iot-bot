const express = require('express');
const router = express.Router();

// 模擬教室電腦狀態（20 台機器）
const roomData = {
  'A101': Array.from({ length: 20 }, (_, i) => ({
    id: `PC-${i + 1}`,
    status: ['🔴 使用中', '🟢 空閒', '🟠 維修中'][Math.floor(Math.random() * 3)]
  })),
  'B202': Array.from({ length: 20 }, (_, i) => ({
    id: `PC-${i + 1}`,
    status: ['🔴 使用中', '🟢 空閒', '🟠 維修中'][Math.floor(Math.random() * 3)]
  }))
};

// 選單頁面
router.get('/classroom-status', (req, res) => {
  // 獲取所有教室名稱
  const rooms = Object.keys(roomData);
  const roomOptions = rooms.map(room => `<option value="${room}">${room}</option>`).join('');
  
  res.send(`
    <html>
      <head>
        <title>教室查詢</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f5f7fa;
            margin: 0;
            padding: 30px;
            font-size: 26px;
            max-width: 1200px;
            margin: 0 auto;
          }
          
          h2 {
            color: #2c3e50;
            font-size: 40px;
            text-align: center;
            margin-bottom: 40px;
          }
          
          .container {
            background-color: white;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: 0 auto;
          }
          
          .form-group {
            margin-bottom: 30px;
          }
          
          label {
            display: block;
            margin-bottom: 15px;
            font-weight: bold;
            color: #34495e;
            font-size: 28px;
          }
          
          select {
            width: 100%;
            padding: 16px;
            font-size: 26px;
            border: 2px solid #ddd;
            border-radius: 10px;
            background-color: white;
            box-sizing: border-box;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 16px center;
            background-size: 20px;
          }
          
          button {
            display: block;
            width: 100%;
            padding: 18px;
            font-size: 28px;
            background-color: #27ae60;
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            margin-top: 20px;
            font-weight: bold;
            box-shadow: 0 4px 8px rgba(39, 174, 96, 0.2);
            transition: all 0.3s ease;
          }
          
          button:hover {
            background-color: #219653;
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(39, 174, 96, 0.3);
          }
          
          .status-legend {
            margin-top: 30px;
            background-color: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
          }
          
          .status-title {
            font-weight: bold;
            margin-bottom: 15px;
            text-align: center;
          }
          
          .status-items {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
          }
          
          .status-item {
            display: flex;
            align-items: center;
            margin: 8px 0;
            font-size: 22px;
          }
          
          .status-item .icon {
            margin-right: 10px;
            font-size: 24px;
          }
          
          @media (max-width: 768px) {
            body {
              padding: 20px;
              font-size: 22px;
            }
            
            h2 {
              font-size: 32px;
              margin-bottom: 30px;
            }
            
            .container {
              padding: 25px;
            }
            
            label {
              font-size: 24px;
            }
            
            select {
              font-size: 22px;
              padding: 14px;
            }
            
            button {
              font-size: 24px;
              padding: 16px;
            }
            
            .status-item {
              font-size: 18px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>🏫 教室查詢</h2>
          <form action="/classroom-status/result" method="GET">
            <div class="form-group">
              <label for="room">請選擇要查詢的教室：</label>
              <select id="room" name="room">
                ${roomOptions}
              </select>
            </div>
            <button type="submit">查詢狀況</button>
          </form>
          
          <div class="status-legend">
            <div class="status-title">電腦狀態說明</div>
            <div class="status-items">
              <div class="status-item"><span class="icon">🔴</span> 使用中</div>
              <div class="status-item"><span class="icon">🟢</span> 空閒</div>
              <div class="status-item"><span class="icon">🟠</span> 維修中</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `);
});

// 結果頁面
router.get('/classroom-status/result', (req, res) => {
  const room = req.query.room || 'A101';
  const statusFilter = req.query.status || 'all'; // 獲取狀態篩選參數
  const pcList = roomData[room] || [];
  
  // 計算各種狀態的電腦數量
  const usedCount = pcList.filter(pc => pc.status.includes('使用中')).length;
  const freeCount = pcList.filter(pc => pc.status.includes('空閒')).length;
  const repairCount = pcList.filter(pc => pc.status.includes('維修中')).length;
  
  // 根據選擇的狀態過濾電腦列表
  let filteredPCs = pcList;
  if (statusFilter !== 'all') {
    if (statusFilter === 'used') {
      filteredPCs = pcList.filter(pc => pc.status.includes('使用中'));
    } else if (statusFilter === 'free') {
      filteredPCs = pcList.filter(pc => pc.status.includes('空閒'));
    } else if (statusFilter === 'repair') {
      filteredPCs = pcList.filter(pc => pc.status.includes('維修中'));
    }
  }
  
  // 生成教室電腦狀態卡片 - 只顯示編號和狀態燈號
  const pcCards = filteredPCs.map(pc => {
    let statusClass = '';
    let statusIcon = '';
    
    if (pc.status.includes('空閒')) {
      statusClass = 'pc-free';
      statusIcon = '🟢';
    } else if (pc.status.includes('使用中')) {
      statusClass = 'pc-used';
      statusIcon = '🔴';
    } else {
      statusClass = 'pc-repair';
      statusIcon = '🟠';
    }
    
    return `
    <div class="pc-card ${statusClass}">
      <div class="pc-name">${pc.id}</div>
      <div class="pc-status-icon">${statusIcon}</div>
    </div>`;
  }).join('');

  // 如果沒有符合條件的電腦，顯示提示訊息
  const emptyMessage = filteredPCs.length === 0 ? 
    `<div class="empty-message">沒有符合此狀態的電腦</div>` : '';

  res.send(`
    <html>
      <head>
        <title>${room} 狀況</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f5f7fa;
            margin: 0;
            padding: 30px;
            font-size: 26px;
            max-width: 1200px;
            margin: 0 auto;
          }
          
          h2 {
            color: #2c3e50;
            font-size: 40px;
            text-align: center;
            margin-bottom: 20px;
          }
          
          .status-legend {
            background-color: #f8f9fa;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 20px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          }
          
          .status-title {
            font-weight: bold;
            margin-bottom: 10px;
            text-align: center;
            font-size: 24px;
          }
          
          .status-items {
            display: flex;
            justify-content: space-around;
            flex-wrap: nowrap;
          }
          
          .status-item {
            display: flex;
            align-items: center;
            margin: 8px 15px;
            font-size: 22px;
          }
          
          .status-item .icon {
            margin-right: 10px;
            font-size: 24px;
          }
          
          .room-summary {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin: 20px 0 30px;
            flex-wrap: nowrap;
          }
          
          .summary-item {
            background: white;
            padding: 10px 15px;
            border-radius: 8px;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            text-decoration: none;
            color: inherit;
            font-size: 22px;
          }
          
          .summary-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          }
          
          .summary-item.active {
            background-color: #3498db;
            color: white;
          }
          
          .summary-item.active::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 50%;
            margin-left: -8px;
            border-width: 8px 8px 0;
            border-style: solid;
            border-color: #3498db transparent transparent;
          }
          
          .summary-item .count {
            margin-left: 8px;
            font-size: 22px;
          }
          
          .summary-all {
            background-color: #34495e;
            color: white;
          }
          
          .pc-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
          }
          
          .pc-card {
            background: white;
            border-radius: 12px;
            padding: 15px;
            text-align: center;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          
          .pc-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
          }
          
          .pc-free {
            border-top: 4px solid #27ae60;
          }
          
          .pc-used {
            border-top: 4px solid #e74c3c;
          }
          
          .pc-repair {
            border-top: 4px solid #f39c12;
          }
          
          .pc-name {
            font-weight: bold;
            font-size: 24px;
            margin-bottom: 12px;
          }
          
          .pc-status-icon {
            font-size: 28px;
          }
          
          .empty-message {
            text-align: center;
            padding: 40px;
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            font-style: italic;
            color: #7f8c8d;
            grid-column: 1 / -1;
          }
          
          .back-button {
            display: block;
            width: 100%;
            max-width: 300px;
            padding: 16px;
            font-size: 26px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            margin: 30px auto;
            text-align: center;
            text-decoration: none;
            font-weight: bold;
            box-shadow: 0 4px 8px rgba(52, 152, 219, 0.2);
            transition: all 0.3s ease;
          }
          
          .back-button:hover {
            background-color: #2980b9;
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(52, 152, 219, 0.3);
          }
          
          .status-filter-info {
            text-align: center;
            margin-bottom: 20px;
            font-style: italic;
            color: #7f8c8d;
          }
          
          @media (max-width: 768px) {
            body {
              padding: 15px;
              font-size: 22px;
            }
            
            h2 {
              font-size: 32px;
            }
            
            .pc-grid {
              grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
              gap: 15px;
            }
            
            .pc-card {
              padding: 12px;
            }
            
            .pc-name {
              font-size: 20px;
              margin-bottom: 8px;
            }
            
            .pc-status-icon {
              font-size: 24px;
            }
            
            .status-item {
              font-size: 16px;
              margin: 5px 5px;
            }
            
            .back-button {
              font-size: 22px;
              padding: 14px;
            }
            
            .summary-item {
              padding: 8px 10px;
              font-size: 16px;
            }
            
            .summary-item .count {
              font-size: 18px;
            }
            
            .room-summary {
              gap: 5px;
            }
          }
        </style>
      </head>
      <body>
        <h2>🖥️ 教室 ${room} 電腦狀況</h2>
        
        <div class="status-legend">
          <div class="status-title">電腦狀態說明</div>
          <div class="status-items">
            <div class="status-item"><span class="icon">🔴</span> 使用中</div>
            <div class="status-item"><span class="icon">🟢</span> 空閒</div>
            <div class="status-item"><span class="icon">🟠</span> 維修中</div>
          </div>
        </div>
        
        <div class="room-summary">
          <a href="/classroom-status/result?room=${room}&status=all" class="summary-item ${statusFilter === 'all' || !statusFilter ? 'active' : ''}">
            全部<span class="count">${pcList.length}</span>
          </a>
          <a href="/classroom-status/result?room=${room}&status=free" class="summary-item ${statusFilter === 'free' ? 'active' : ''}">
            空閒<span class="count">${freeCount}</span>
          </a>
          <a href="/classroom-status/result?room=${room}&status=used" class="summary-item ${statusFilter === 'used' ? 'active' : ''}">
            使用中<span class="count">${usedCount}</span>
          </a>
          <a href="/classroom-status/result?room=${room}&status=repair" class="summary-item ${statusFilter === 'repair' ? 'active' : ''}">
            維修<span class="count">${repairCount}</span>
          </a>
        </div>
        
        ${statusFilter !== 'all' ? `<div class="status-filter-info">目前只顯示「${
          statusFilter === 'free' ? '空閒' : 
          statusFilter === 'used' ? '使用中' : '維修中'
        }」狀態的電腦</div>` : ''}
        
        <div class="pc-grid">
          ${pcCards}
          ${emptyMessage}
        </div>
        
        <a href="/classroom-status" class="back-button">⬅️ 返回教室選單</a>
      </body>
    </html>
  `);
});

module.exports = router;