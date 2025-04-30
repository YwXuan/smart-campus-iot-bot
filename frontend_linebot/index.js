// ✅ index.js - 主伺服器整合全部功能模組
require('dotenv').config();
const express = require('express');
const { Client, middleware } = require('@line/bot-sdk');
const classroomStatusComponent = require('./classroomStatusComponent');
const scheduleRoutes = require('./scheduleRoutes');
const infoRoutes = require('./infoRoutes');
const controlRoutes = require('./controlRoutes');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};
const client = new Client(config);
const studentMap = new Map();

app.post('/webhook', middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error('❌ Webhook 錯誤:', err);
      res.status(500).end();
    });
});

// 匯入所有功能模組
app.use('/', classroomStatusComponent);
app.use('/schedule', scheduleRoutes);
app.use('/info', infoRoutes);
app.use('/control', controlRoutes);

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') return null;
  const userId = event.source.userId;
  const msg = event.message.text;

  if (msg === '我要註冊') {
    const profile = await client.getProfile(userId);
    studentMap.set(userId, {
      name: profile.displayName,
      picture: profile.pictureUrl,
      statusMessage: profile.statusMessage || '',
    });
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: `✅ ${profile.displayName}，你已被註冊為學生`,
    });
  }

  if (msg === '查詢學生') {
    if (studentMap.size === 0) {
      return client.replyMessage(event.replyToken, {
        type: 'text', text: '目前還沒有學生被註冊喔 🧐'
      });
    }
    const bubbles = [];
    for (const [id, student] of studentMap.entries()) {
      bubbles.push({
        type: 'bubble',
        hero: {
          type: 'image', url: student.picture || 'https://example.com/default.jpg',
          size: 'full', aspectRatio: '1.51:1', aspectMode: 'cover'
        },
        body: {
          type: 'box', layout: 'vertical', contents: [
            { type: 'text', text: `👤 ${student.name}`, weight: 'bold', size: 'xl' },
            { type: 'text', text: `🆔 ${id.slice(0, 10)}...`, size: 'sm', color: '#888' },
            { type: 'text', text: '🎓 身份：學生', size: 'sm', color: '#333' }
          ]
        },
        footer: {
          type: 'box', layout: 'horizontal', contents: [
            {
              type: 'button', style: 'primary',
              action: { type: 'message', label: '確認身份', text: `確認 ${student.name}` }
            }
          ]
        }
      });
    }
    return client.replyMessage(event.replyToken, {
      type: 'flex', altText: '📋 學生清單', contents: { type: 'carousel', contents: bubbles }
    });
  }

  if (msg.startsWith('確認')) {
    const name = msg.replace('確認 ', '');
    return client.replyMessage(event.replyToken, {
      type: 'text', text: `✅ 已確認 ${name} 的身份`
    });
  }

  return client.replyMessage(event.replyToken, {
    type: 'text', text: `你說的是：${msg}`
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 智慧教室系統已啟動於 http://localhost:${port}`);
});