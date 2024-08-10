export const sendTelegramMessage = async (chatId:any, message:any, inlineKeyboard:any) => {
    const token = "6867371385:AAGfb8XC-MI5FeuoAmBpg9IVkAZkpgnoE4E";
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    if (!token || !chatId) {
        console.error('Token or chatId is missing');
        return;
    }

    const body = {
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
        reply_markup:{}
    };

    if (inlineKeyboard) {
        body.reply_markup = {
            inline_keyboard: inlineKeyboard
        };
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error("Error sending message to Telegram", error);
    }
}