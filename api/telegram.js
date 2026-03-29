// api/telegram.js
// Vercel Serverless Function – Telegram Broadcast Engine
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message payload is required' });
    }

    // The token you provided
    const TELEGRAM_BOT_TOKEN = '8605633941:AAGL_FKPoYBdDKpUivntEjiaRE04yRM8VeU';
    
    // We pull the Chat ID from Vercel's Environment Variables.
    // Replace this fallback with your actual numerical Chat ID for local testing.
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '@Trumpster2000_bot'; 

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML' // Allow bolding and emojis in the message
      })
    });

    if (!response.ok) {
      const tgError = await response.text();
      console.error('Telegram API Error:', tgError);
      throw new Error(`Telegram API Error: ${tgError}`);
    }

    res.status(200).json({ success: true, message: 'Broadcast successful' });
  } catch (error) {
    console.error('Telegram Broadcast Error:', error.message);
    res.status(500).json({ error: error.message });
  }
}
