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
    
    // Fallback logic: check env var first, otherwise default to the public channel
    let targetChatId = process.env.TELEGRAM_CHAT_ID || '@trumpster2000'; 

    // Auto-Discovery: Only run if targetChatId is somehow missing or set to the old default
    if (!targetChatId || targetChatId.includes('_bot')) {
      try {
        const updateRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`);
        const updateData = await updateRes.json();
        if (updateData.ok && updateData.result.length > 0) {
          // Find the most recent update with a valid chat_id (Handles DMs, Channel Posts, and Joining Channels)
          const lastUpdate = updateData.result[updateData.result.length - 1];
          if (lastUpdate.message) targetChatId = lastUpdate.message.chat.id;
          else if (lastUpdate.channel_post) targetChatId = lastUpdate.channel_post.chat.id;
          else if (lastUpdate.my_chat_member) targetChatId = lastUpdate.my_chat_member.chat.id;
          
          if (!targetChatId) throw new Error("Could not parse Chat ID from Telegram update event.");
          console.log("MAGA: Auto-discovered Telegram Chat ID:", targetChatId);
        } else {
          throw new Error("No recent messages found to auto-discover Chat ID.");
        }
      } catch (err) {
        return res.status(400).json({ error: "Failed Auto-Discovery. Tip: Send a message inside your channel first!", details: err.message });
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

    res.status(200).json({ 
      success: true, 
      message: 'Broadcast successful',
      discovered_chat_id: targetChatId 
    });
  } catch (error) {
    console.error('Telegram Broadcast Error:', error.message);
    res.status(500).json({ error: error.message });
  }
}
