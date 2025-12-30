import fetch from 'node-fetch'

const handler = async (m, { sock, text, qtxt, reply, command, usedPrefix }) => {
if (!text) return await sock.sendMessage(m.chat, { text: `Gunakan format: ${usedPrefix + command} <url snackvideo>` }, { quoted: m })

await reply("Proses Kak \~ 💫")

try {
const response = await fetch(`https://api.baguss.xyz/api/download/snackvideo?url=${encodeURIComponent(text)}`)
const res = await response.json()

if (!res.success) return await sock.sendMessage(m.chat, { text: "Gagal mengambil data dari URL tersebut." }, { quoted: m })

const caption = `${res.title}`

await sock.sendMessage(
  m.chat,
  {
    video: { url: res.videoUrl },
    caption: caption,
    fileName: 'snack.mp4',
    mimetype: 'video/mp4'
  },
  { quoted: m }
)

} catch (e) {
await sock.sendMessage(m.chat, { text: "Terjadi kesalahan saat memproses permintaan." }, { quoted: m })
}
}

handler.command = ["snackvideo", "snackvideodl"]
export default handler