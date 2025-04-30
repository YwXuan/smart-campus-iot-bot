const controlRouter = require('express').Router();

// 追蹤設備狀態
const deviceStatus = {
  '冷氣': false,
  '風扇': false,
  '電燈前區': false,
  '電燈後區': false,
  '電腦': Array(12).fill(false), // 12台電腦的狀態
  'acTemp': 26 // 新增冷氣溫度屬性
};

// 預設情境設定
const presetScenes = {
  '教室設定1': {
    '冷氣': true,
    '冷氣溫度': 26,
    '風扇': true,
    '電燈前區': true,
    '電燈後區': false,
    '電腦': [true, true, true, true, false, false, false, false, false, false, false, false]
  },
  '教室設定2': {
    '冷氣': true,
    '冷氣溫度': 24,
    '風扇': false,
    '電燈前區': true,
    '電燈後區': true,
    '電腦': [true, true, true, true, true, true, true, true, false, false, false, false]
  },
  '節能模式': {
    '冷氣': false,
    '冷氣溫度': 28,
    '風扇': true,
    '電燈前區': true,
    '電燈後區': false,
    '電腦': [false, false, false, false, false, false, false, false, false, false, false, false]
  }
};

controlRouter.get('/', (req, res) => {
  // 計算冷氣當前溫度 (使用儲存的溫度或預設為26度)
  const acTemp = deviceStatus.acTemp || 26;
  
  // 生成基本設備的切換開關
  const basicControls = `
    <div class="basic-controls section">
      <h3>基本控制</h3>
      <div class="control-row">
        <div class="toggle-control">
          <span class="device-name">冷氣</span>
          <label class="switch">
            <input type="checkbox" data-device="冷氣" ${deviceStatus['冷氣'] ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
          <span class="status-text">${deviceStatus['冷氣'] ? '開啟' : '關閉'}</span>
        </div>
        
        <div class="toggle-control">
          <span class="device-name">風扇</span>
          <label class="switch">
            <input type="checkbox" data-device="風扇" ${deviceStatus['風扇'] ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
          <span class="status-text">${deviceStatus['風扇'] ? '開啟' : '關閉'}</span>
        </div>
      </div>
      
      <div class="control-row">
        <div class="toggle-control">
          <span class="device-name">電燈前區</span>
          <label class="switch">
            <input type="checkbox" data-device="電燈前區" ${deviceStatus['電燈前區'] ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
          <span class="status-text">${deviceStatus['電燈前區'] ? '開啟' : '關閉'}</span>
        </div>
        
        <div class="toggle-control">
          <span class="device-name">電燈後區</span>
          <label class="switch">
            <input type="checkbox" data-device="電燈後區" ${deviceStatus['電燈後區'] ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
          <span class="status-text">${deviceStatus['電燈後區'] ? '開啟' : '關閉'}</span>
        </div>
      </div>
    </div>
  `;
  
  // 生成冷氣溫度控制區
  const tempControl = `
    <div class="temp-control section">
      <h3>冷氣溫度控制</h3>
      <div class="temp-slider-container">
        <button class="temp-btn temp-down" id="temp-down">-</button>
        <input type="range" min="18" max="30" value="${acTemp}" class="temp-slider" id="temp-slider">
        <button class="temp-btn temp-up" id="temp-up">+</button>
        <div class="temp-display">
          <span id="temp-value">${acTemp}</span>°C
        </div>
      </div>
    </div>
  `;
  
  // 生成電腦控制區
  let computerControls = `
    <div class="computer-control section">
      <h3>電腦控制</h3>
      <div class="all-computers-control">
        <button class="control-btn" id="turn-on-all">全部開啟</button>
        <button class="control-btn" id="turn-off-all">全部關閉</button>
      </div>
      <div class="computers-grid">
  `;
  
  // 生成12台電腦的控制開關
  for (let i = 0; i < 12; i++) {
    const pcStatus = deviceStatus['電腦'][i];
    computerControls += `
      <div class="computer-item">
        <span class="computer-name">PC-${i+1}</span>
        <label class="switch">
          <input type="checkbox" data-pc="${i}" ${pcStatus ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
        <span class="status-text">${pcStatus ? '開啟' : '關閉'}</span>
      </div>
    `;
  }
  
  computerControls += `
      </div>
    </div>
  `;
  
  // 生成預設情境設定區塊
  let sceneControls = `
    <div class="scene-control section">
      <h3>情境設定</h3>
      <div class="scenes-grid">
  `;
  
  // 添加各個預設情境
  Object.keys(presetScenes).forEach(scene => {
    sceneControls += `
      <div class="scene-item" data-scene="${scene}">
        <div class="scene-name">${scene}</div>
        <div class="scene-description">
          冷氣: ${presetScenes[scene]['冷氣'] ? '開啟' : '關閉'} (${presetScenes[scene]['冷氣溫度']}°C), 
          風扇: ${presetScenes[scene]['風扇'] ? '開啟' : '關閉'}, 
          電燈: ${presetScenes[scene]['電燈前區'] ? '前區' : ''}${presetScenes[scene]['電燈前區'] && presetScenes[scene]['電燈後區'] ? '+' : ''}${presetScenes[scene]['電燈後區'] ? '後區' : ''}
        </div>
        <button class="apply-scene-btn">套用</button>
      </div>
    `;
  });
  
  sceneControls += `
      </div>
    </div>
  `;

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>設備控制中心</title>
        <meta charset="UTF-8">
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
            margin-bottom: 30px;
          }
          
          h3 {
            color: #34495e;
            font-size: 30px;
            margin-top: 0;
            margin-bottom: 20px;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
          }
          
          .control-panel {
            background-color: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          }
          
          .section {
            background-color: #f8f9fa;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 30px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
          }
          
          .control-row {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 20px;
            margin-bottom: 20px;
          }
          
          .toggle-control {
            display: flex;
            align-items: center;
            padding: 15px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            flex: 1;
            min-width: 250px;
          }
          
          .device-name {
            flex: 1;
            font-weight: bold;
            margin-right: 15px;
          }
          
          .status-text {
            margin-left: 15px;
            min-width: 60px;
          }
          
          /* 開關按鈕樣式 */
          .switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
          }
          
          .switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }
          
          .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 34px;
          }
          
          .slider:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
          }
          
          input:checked + .slider {
            background-color: #2196F3;
          }
          
          input:checked + .slider:before {
            transform: translateX(26px);
          }
          
          /* 溫度控制區塊樣式 */
          .temp-slider-container {
            display: flex;
            align-items: center;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
          }
          
          .temp-slider {
            flex: 1;
            height: 20px;
            -webkit-appearance: none;
            background: #ddd;
            outline: none;
            border-radius: 10px;
            margin: 0 15px;
          }
          
          .temp-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: #3498db;
            cursor: pointer;
          }
          
          .temp-btn {
            width: 40px;
            height: 40px;
            font-size: 24px;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          .temp-display {
            margin-left: 20px;
            font-size: 28px;
            font-weight: bold;
            min-width: 80px;
            text-align: center;
          }
          
          /* 電腦控制區塊樣式 */
          .all-computers-control {
            display: flex;
            justify-content: flex-start;
            gap: 15px;
            margin-bottom: 20px;
          }
          
          .control-btn {
            padding: 10px 20px;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 22px;
          }
          
          .computers-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 15px;
          }
          
          .computer-item {
            display: flex;
            align-items: center;
            padding: 15px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
          }
          
          .computer-name {
            flex: 1;
            font-weight: bold;
            font-size: 22px;
          }
          
          /* 情境設定區塊樣式 */
          .scenes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
          }
          
          .scene-item {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
          }
          
          .scene-name {
            font-weight: bold;
            font-size: 26px;
            margin-bottom: 10px;
            color: #2c3e50;
          }
          
          .scene-description {
            font-size: 18px;
            color: #7f8c8d;
            margin-bottom: 15px;
            line-height: 1.4;
          }
          
          .apply-scene-btn {
            width: 100%;
            padding: 12px;
            background: #27ae60;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 22px;
            transition: all 0.3s;
          }
          
          .apply-scene-btn:hover {
            background: #219653;
          }
          
          .status-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(39, 174, 96, 0.9);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            transform: translateX(150%);
            transition: transform 0.3s ease;
            z-index: 1000;
          }
          
          .status-notification.show {
            transform: translateX(0);
          }
          
          @media (max-width: 768px) {
            body {
              padding: 15px;
              font-size: 22px;
            }
            
            h2 {
              font-size: 32px;
              margin-bottom: 20px;
            }
            
            h3 {
              font-size: 26px;
            }
            
            .control-panel {
              padding: 20px;
            }
            
            .section {
              padding: 20px;
            }
            
            .control-row {
              flex-direction: column;
              gap: 15px;
            }
            
            .toggle-control {
              min-width: auto;
            }
            
            .temp-slider-container {
              flex-wrap: wrap;
            }
            
            .temp-slider {
              width: 100%;
              margin: 15px 0;
              order: 3;
            }
            
            .temp-btn {
              width: 30px;
              height: 30px;
              font-size: 20px;
            }
            
            .temp-display {
              font-size: 24px;
              flex: 1;
              text-align: right;
            }
            
            .computers-grid {
              grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            }
            
            .computer-name {
              font-size: 18px;
            }
            
            .scenes-grid {
              grid-template-columns: 1fr;
            }
          }
        </style>
      </head>
      <body>
        <h2>🔌 設備控制中心</h2>
        
        <div class="control-panel">
          <form id="control-form">
            ${sceneControls}
            ${basicControls}
            ${tempControl}
            ${computerControls}
          </form>
        </div>
        
        <div class="status-notification" id="status-notification"></div>
        
        <script>
          // 顯示通知
          function showNotification(message) {
            const notification = document.getElementById('status-notification');
            notification.textContent = message;
            notification.classList.add('show');
            
            setTimeout(() => {
              notification.classList.remove('show');
            }, 3000);
          }
          
          // 切換設備狀態
          function toggleDevice(deviceName, status) {
            // 呼叫API更新設備狀態
            fetch('/control/api/update', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                device: deviceName,
                status: status ? 'on' : 'off'
              })
            })
            .then(response => response.json())
            .then(data => {
              console.log('API回應:', data);
              showNotification('已切換 ' + deviceName + ' 為 ' + (status ? '開啟' : '關閉'));
              
              // 更新狀態顯示
              const statusElement = document.querySelector('input[data-device="' + deviceName + '"]')
                .parentElement.nextElementSibling;
              statusElement.textContent = status ? '開啟' : '關閉';
            })
            .catch(error => {
              console.error('錯誤:', error);
              showNotification('設備狀態更新失敗');
            });
          }
          
          // 切換電腦狀態
          function toggleComputer(pcIndex, status) {
            // 呼叫API更新電腦狀態
            fetch('/control/api/update', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                device: 'PC-' + (pcIndex + 1),
                status: status ? 'on' : 'off'
              })
            })
            .then(response => response.json())
            .then(data => {
              console.log('API回應:', data);
              showNotification('已切換 PC-' + (pcIndex+1) + ' 為 ' + (status ? '開啟' : '關閉'));
              
              // 更新狀態顯示
              const statusElement = document.querySelector('input[data-pc="' + pcIndex + '"]')
                .parentElement.nextElementSibling;
              statusElement.textContent = status ? '開啟' : '關閉';
            })
            .catch(error => {
              console.error('錯誤:', error);
              showNotification('電腦狀態更新失敗');
            });
          }
          
          // 更新冷氣溫度
          function updateTemperature(temp) {
            // 呼叫API更新溫度
            fetch('/control/api/update-temp', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                temperature: temp
              })
            })
            .then(response => response.json())
            .then(data => {
              console.log('API回應:', data);
              showNotification('已設定冷氣溫度為 ' + temp + '°C');
              
              // 更新溫度顯示
              document.getElementById('temp-value').textContent = temp;
              document.getElementById('temp-slider').value = temp;
            })
            .catch(error => {
              console.error('錯誤:', error);
              showNotification('溫度更新失敗');
            });
          }
          
          // 套用情境設定
          function applyScene(sceneName) {
            // 呼叫API套用情境
            fetch('/control/api/apply-scene', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                scene: sceneName
              })
            })
            .then(response => response.json())
            .then(data => {
              console.log('API回應:', data);
              showNotification('已套用情境設定: ' + sceneName);
              
              // 重新載入頁面以顯示更新後的狀態
              window.location.reload();
            })
            .catch(error => {
              console.error('錯誤:', error);
              showNotification('情境套用失敗');
            });
          }
          
          // 監聽設備開關切換
          document.querySelectorAll('input[data-device]').forEach(function(checkbox) {
            checkbox.addEventListener('change', function() {
              const deviceName = this.dataset.device;
              const isChecked = this.checked;
              toggleDevice(deviceName, isChecked);
            });
          });
          
          // 監聽電腦開關切換
          document.querySelectorAll('input[data-pc]').forEach(function(checkbox) {
            checkbox.addEventListener('change', function() {
              const pcIndex = parseInt(this.dataset.pc);
              const isChecked = this.checked;
              toggleComputer(pcIndex, isChecked);
            });
          });
          
          // 溫度控制
          const tempSlider = document.getElementById('temp-slider');
          const tempValue = document.getElementById('temp-value');
          
          tempSlider.addEventListener('input', function() {
            const temp = this.value;
            tempValue.textContent = temp;
          });
          
          tempSlider.addEventListener('change', function() {
            updateTemperature(this.value);
          });
          
          // 溫度增減按鈕
          document.getElementById('temp-down').addEventListener('click', function() {
            const currentTemp = parseInt(tempValue.textContent);
            if (currentTemp > 18) {
              updateTemperature(currentTemp - 1);
            }
          });
          
          document.getElementById('temp-up').addEventListener('click', function() {
            const currentTemp = parseInt(tempValue.textContent);
            if (currentTemp < 30) {
              updateTemperature(currentTemp + 1);
            }
          });
          
          // 電腦全開/全關按鈕
          document.getElementById('turn-on-all').addEventListener('click', function(e) {
            e.preventDefault();
            // 呼叫API一次更新所有電腦
            fetch('/control/api/update-all-computers', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                status: 'on'
              })
            })
            .then(response => response.json())
            .then(data => {
              document.querySelectorAll('input[data-pc]').forEach(function(checkbox) {
                checkbox.checked = true;
                checkbox.parentElement.nextElementSibling.textContent = '開啟';
              });
              showNotification('已開啟所有電腦');
            })
            .catch(error => {
              console.error('錯誤:', error);
              showNotification('操作失敗');
            });
          });
          
          document.getElementById('turn-off-all').addEventListener('click', function(e) {
            e.preventDefault();
            // 呼叫API一次更新所有電腦
            fetch('/control/api/update-all-computers', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                status: 'off'
              })
            })
            .then(response => response.json())
            .then(data => {
              document.querySelectorAll('input[data-pc]').forEach(function(checkbox) {
                checkbox.checked = false;
                checkbox.parentElement.nextElementSibling.textContent = '關閉';
              });
              showNotification('已關閉所有電腦');
            })
            .catch(error => {
              console.error('錯誤:', error);
              showNotification('操作失敗');
            });
          });
          
          // 監聽情境套用按鈕
          document.querySelectorAll('.apply-scene-btn').forEach(function(button) {
            button.addEventListener('click', function(e) {
              e.preventDefault();
              const sceneName = this.parentElement.dataset.scene;
              applyScene(sceneName);
            });
          });
          
          // 防止表單提交（因為我們使用即時更新）
          document.getElementById('control-form').addEventListener('submit', function(e) {
            e.preventDefault();
          });
        </script>
      </body>
    </html>
  `);
});

// 更新設備API端點
controlRouter.post('/api/update', (req, res) => {
  const { device, status } = req.body;
  console.log(`✅ API 更新設備：${device}, 狀態: ${status}`);
  
  // 更新設備狀態
  if (device.startsWith('PC-')) {
    // 更新電腦狀態
    const pcIndex = parseInt(device.replace('PC-', '')) - 1;
    if (pcIndex >= 0 && pcIndex < deviceStatus['電腦'].length) {
      deviceStatus['電腦'][pcIndex] = status === 'on';
    }
  } else {
    // 更新其他設備狀態
    if (device in deviceStatus) {
      deviceStatus[device] = status === 'on';
    }
  }
  
  res.json({ success: true, message: `已更新 ${device} 狀態為 ${status}` });
});

// 更新溫度API端點
controlRouter.post('/api/update-temp', (req, res) => {
  const { temperature } = req.body;
  const temp = parseInt(temperature);
  
  if (isNaN(temp) || temp < 18 || temp > 30) {
    return res.status(400).json({ success: false, message: '溫度必須在18-30度之間' });
  }
  
  console.log(`✅ API 更新冷氣溫度：${temp}°C`);
  deviceStatus.acTemp = temp;
  
  res.json({ success: true, message: `已更新冷氣溫度為 ${temp}°C` });
});

// 一次性更新所有電腦狀態
controlRouter.post('/api/update-all-computers', (req, res) => {
  const { status } = req.body;
  const newStatus = status === 'on';
  
  console.log(`✅ API 一次性${newStatus ? '開啟' : '關閉'}所有電腦`);
  
  // 更新所有電腦狀態
  deviceStatus['電腦'] = Array(12).fill(newStatus);
  
  res.json({ success: true, message: `已${newStatus ? '開啟' : '關閉'}所有電腦` });
});

// 套用情境設定API
controlRouter.post('/api/apply-scene', (req, res) => {
  const { scene } = req.body;
  console.log(`✅ API 套用情境設定：${scene}`);
  
  // 檢查情境是否存在
  if (scene in presetScenes) {
    const sceneData = presetScenes[scene];
    
    // 更新設備狀態
    for (const device in sceneData) {
      if (device === '電腦') {
        deviceStatus['電腦'] = [...sceneData['電腦']];
      } else if (device !== '冷氣溫度') {
        deviceStatus[device] = sceneData[device];
      }
    }
    
    // 更新冷氣溫度
    deviceStatus.acTemp = sceneData['冷氣溫度'];
    
    res.json({ success: true, message: `已套用情境設定：${scene}` });
  } else {
    res.status(404).json({ success: false, message: '找不到指定的情境設定' });
  }
});

// 這個路由處理函數保留以維持兼容性，但更推薦使用API端點進行狀態更新
controlRouter.post('/', (req, res) => {
  // 更新設備狀態
  Object.keys(deviceStatus).forEach(function(device) {
    if (device !== '電腦' && device !== 'acTemp') {
      var newStatus = req.body[device] === 'on';
      deviceStatus[device] = newStatus;
    }
  });
  
  // 重定向回控制頁面
  res.redirect('/control');
});

module.exports = controlRouter;