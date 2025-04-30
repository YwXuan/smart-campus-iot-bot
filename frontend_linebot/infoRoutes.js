// ✅ routes/infoRoutes.js - 假資料溫度與瓦數圖表顯示（Chart.js 視覺化 + 數據標示 + 今日溫度）
const infoRouter = require('express').Router();

infoRouter.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>教室資訊總覽</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: Arial, sans-serif; background: #f8f8f8; padding: 20px; font-size: 20px; }
          h2 { text-align: center; color: #2c3e50; font-size: 28px; }
          ul { list-style: none; padding: 0; max-width: 400px; margin: 30px auto; }
          li {
            background: white;
            margin-bottom: 16px;
            padding: 18px;
            border-radius: 10px;
            box-shadow: 0 0 8px rgba(0,0,0,0.08);
            text-align: center;
          }
          a { text-decoration: none; color: #27ae60; font-weight: bold; }
        </style>
      </head>
      <body>
        <h2>📊 教室資訊總覽</h2>
        <ul>
          <li><a href="/info/temp">🌡️ 當前溫度與歷史</a></li>
          <li><a href="/info/power">⚡ 耗電資訊</a></li>
        </ul>
      </body>
    </html>
  `);
});

infoRouter.get('/temp', (req, res) => {
  const history = [22.1, 22.5, 23.2, 24.0, 23.5];
  const today = 24.3;
  const fullHistory = [...history, today];
  const labels = ['第 1 天', '第 2 天', '第 3 天', '第 4 天', '第 5 天', '今天'];

  res.send(`
    <html>
      <head>
        <title>溫度資訊</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
          body { font-family: Arial, sans-serif; background: #eef1f5; padding: 20px; font-size: 20px; }
          h3 { color: #2980b9; text-align: center; font-size: 24px; margin-bottom: 20px; }
          canvas { max-width: 100%; height: auto; display: block; margin: auto; background: white; border-radius: 10px; padding: 10px; box-shadow: 0 0 8px rgba(0,0,0,0.1); }
          a {
            display: block;
            text-align: center;
            margin-top: 30px;
            text-decoration: none;
            color: white;
            background: #27ae60;
            padding: 10px;
            border-radius: 8px;
            max-width: 300px;
            margin-left: auto;
            margin-right: auto;
          }
        </style>
      </head>
      <body>
        <h3>🌡️ 歷史溫度折線圖</h3>
        <canvas id="tempChart"></canvas>
        <a href="/info">⬅️ 返回資訊首頁</a>
        <script>
          const ctx = document.getElementById('tempChart').getContext('2d');
          new Chart(ctx, {
            type: 'line',
            data: {
              labels: ${JSON.stringify(labels)},
              datasets: [{
                label: '溫度 °C',
                data: ${JSON.stringify(fullHistory)},
                borderColor: '#2980b9',
                backgroundColor: 'rgba(41, 128, 185, 0.2)',
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#2980b9',
                pointRadius: 6,
                pointHoverRadius: 8
              }]
            },
            options: {
              responsive: true,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return '溫度：' + context.raw + ' °C';
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: false,
                  ticks: {
                    callback: function(value) { return value + '°C'; }
                  }
                }
              }
            }
          });
        </script>
      </body>
    </html>
  `);
});


infoRouter.get('/power', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>耗電資訊</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
          body { font-family: Arial, sans-serif; background: #f0f2f5; padding: 20px; font-size: 20px; }
          h3 { color: #e67e22; text-align: center; font-size: 24px; margin-bottom: 20px; }
          canvas { max-width: 100%; height: auto; display: block; margin: auto; background: white; border-radius: 10px; padding: 10px; box-shadow: 0 0 8px rgba(0,0,0,0.1); }
          a {
            display: block;
            text-align: center;
            margin-top: 30px;
            text-decoration: none;
            color: white;
            background: #27ae60;
            padding: 10px;
            border-radius: 8px;
            max-width: 300px;
            margin-left: auto;
            margin-right: auto;
          }
        </style>
      </head>
      <body>
        <h3>⚡ 耗電設備圖表</h3>
        <canvas id="powerChart"></canvas>
        <a href="/info">⬅️ 返回資訊首頁</a>
        <script>
          const ctx = document.getElementById('powerChart').getContext('2d');
          new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['冷氣', '電腦', '風扇', '電燈'],
              datasets: [{
                label: '瓦數 (W)',
                data: [2800, 600, 300, 400],
                backgroundColor: ['#3498db', '#2ecc71', '#f1c40f', '#e67e22']
              }]
            },
            options: { responsive: true }
          });
        </script>
      </body>
    </html>
  `);
});

module.exports = infoRouter;
