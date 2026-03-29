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
    
    // Fallback logic: check env var first, otherwise default to auto-discovery
    let targetChatId = process.env.TELEGRAM_CHAT_ID || null; 

    // Auto-Discovery: If no Chat ID is set, check the bot's unread messages!
    if (!targetChatId || targetChatId.includes('_bot')) {
      try {
        const updateRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`);
        const updateData = await updateRes.json();
        if (updateData.ok && updateData.result.length > 0) {
          // Grab the Chat ID of the last person who messaged the bot (e.g. sent /status)
          targetChatId = updateData.result[updateData.result.length - 1].message.chat.id;
          console.log("MAGA: Auto-discovered Telegram Chat ID:", targetChatId);
        } else {
          throw new Error("No recent messages found to auto-discover Chat ID.");
        }
      } catch (err) {
        return res.status(400).json({ error: "Please send a message to the bot first to initialize it." });
      }
    }

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: targetChatId,
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
