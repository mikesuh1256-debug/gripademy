'use strict';

const { handleTalkEvent } = require('../lib/naver-talk-faq');

function parseBody(body) {
  if (!body) return {};
  if (typeof body === 'string') return JSON.parse(body);
  return body;
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      service: 'megrip-naver-talk-faq',
      webhook: '/api/naver-talk',
    });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const configuredToken = process.env.NAVER_TALK_WEBHOOK_TOKEN;
  if (configuredToken && req.query?.token !== configuredToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const response = handleTalkEvent(parseBody(req.body));
    if (!response) return res.status(200).end();
    return res.status(200).json(response);
  } catch (error) {
    console.error('Naver TalkTalk webhook error:', error.message);
    return res.status(200).end();
  }
};
