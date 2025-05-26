import config from '../config.js';

export async function prompt_bot(messages) {
    try {
        const response = await fetch(config.bot_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: config.bot_model,
                messages: messages,
                stream: false,
                options: {'temperature': config.bot_temperature}
            })
        });
        const result = await response.json();
        return result.message.content
            .replace(/\\n/g, ' ')          // Menghapus escape newlines
            .replace(/\n/g, ' ')           // Menghapus newlines
            .replace(/\\"/g, ' ')          // Menghapus escape quotes
            .replace(/\\'/g, ' ')          // Menghapus escape single quotes
            .replace(/\\r/g, ' ')          // Menghapus escape carriage return
            .replace(/\\\\/g, ' ')         // Menghapus escape backslash
            .replace(/"/g, '')             // Menghapus double quotes
            .replace(/["']/g, '')          // Menghapus single dan double quotes
            .replace(/-+/g, ', ')          // Mengganti semua '-' dengan ','
            .replace(/\*/g, ' ')           // Mengganti semua '*' dengan spasi
            .replace(/_/g, ' ')            // Mengganti semua underscore '_' dengan spasi (untuk Markdown italics)
            .replace(/`+/g, ' ')           // Mengganti semua backticks '`' dengan spasi (untuk Markdown code)
            .replace(/!\[.*?\]\(.*?\)/g, '') // Menghapus gambar Markdown (termasuk ![alt](url))
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Menghapus link Markdown, hanya menyisakan teks link
            .replace(/[\r\n]+/g, ' ')      // Menghapus semua jenis newlines secara umum
            .replace(/\s+/g, ' ')          // Mengganti multiple spaces dengan satu spasi
            .trim();
    } catch (error) {
        //console.error("Error:", error);
        return null;
    }
}