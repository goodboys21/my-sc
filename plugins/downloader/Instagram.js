import axios from 'axios';
import * as cheerio from 'cheerio';

const handler = async (m, { sock, text, qtxt, reply, command, usedPrefix }) => {
if (!text) return reply(`Kirim linknya sekalian contoh ${command} <link>`);

await reply('Proses Kak ~ 💫');

try {
const response = await axios.get(`https://insta-save.net/content.php?url=${encodeURIComponent(text)}`, {
headers: {
'Content-Type': 'application/x-www-form-urlencoded',
'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
}
});

const { html } = response.data;
if (!html) throw new Error("Gagal mengambil data.");

const $ = cheerio.load(html);
const media = [];

$('video source').each((i, el) => {
  const src = $(el).attr('src');
  if (src) media.push({ type: 'video', url: src });
});

$('img.w-100').each((i, el) => {
  const src = $(el).attr('src');
  if (src && !media.find(m => m.url === src)) media.push({ type: 'image', url: src });
});

const caption = $('.text-sm').first().text().trim() || "Instagram Media";

if (media.length === 0) throw new Error("Media tidak ditemukan.");

for (const item of media) {
  if (item.type === 'video') {
    await sock.sendMessage(m.chat, { video: { url: item.url }, caption: caption }, { quoted: m });
  } else {
    await sock.sendMessage(m.chat, { image: { url: item.url }, caption: caption }, { quoted: qtxt });
  }
}

} catch (e) {
await sock.sendMessage(m.chat, { text: "Terjadi kesalahan: " + e.message }, { quoted: m });
}
}

handler.command = ["ig", "igdl", "instagram"]
export default handler