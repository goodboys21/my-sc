import fetch from "node-fetch"

const handler = async (m, { sock, text, qtxt, reply, command, usedPrefix }) => {
if (!text) return reply(`Gunakan format: ${usedPrefix}${command} <url tiktok>`);

await reply('Proses Kak ~ 💫');

try {
const res = await fetch(`https://api.baguss.xyz/api/download/tiktok?url=${encodeURIComponent(text)}`)
const data = await res.json()

if (!data.status) throw "Gagal mengambil data dari API."

const { video_nowm, audio_url, description, slides } = data.result

if (slides && slides.length > 0) {
  for (let img of slides) {
    await sock.sendMessage(m.chat, { image: { url: img }, caption: description || "" }, { quoted: m })
  }
} else if (video_nowm) {
  await sock.sendMessage(m.chat, { 
    video: { url: video_nowm }, 
    caption: description || "",
    fileName: "tiktok.mp4"
  }, { quoted: m })
}

if (audio_url) {
  await sock.sendMessage(m.chat, { 
    audio: { url: audio_url }, 
    mimetype: "audio/mpeg",
    ptt: false
  }, { quoted: m })
}

} catch (e) {
await sock.sendMessage(m.chat, { text: "Terjadi kesalahan saat mengunduh media." }, { quoted: qtxt })
}
}

handler.command = ["tiktok", "ttdl", "tt", "tiktokdl"]
export default handler