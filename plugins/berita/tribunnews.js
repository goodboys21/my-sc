import fetch from 'node-fetch'

const handler = async (m, { sock, qtxt, reply, command }) => {
await reply("Proses Kak \~ 💫")

try {
const res = await fetch('https://api.baguss.xyz/api/berita/tribunnews')
const json = await res.json()

if (!json.success || !json.data.length) throw "Gagal mengambil data berita."

const data = json.data[Math.floor(Math.random() * json.data.length)]
const caption = `📰 *TRIBUN NEWS*\n\n` +
  `📌 *Judul:* ${data.title}\n\n` +
  `🔗 *Link:* ${data.link}`

await sock.sendMessage(
  m.chat,
  {
    text: caption,
    contextInfo: {
      externalAdReply: {
        title: "TRIBUNNEWS - BERITA TERKINI",
        body: data.title,
        thumbnailUrl: "https://raw.githubusercontent.com/bagus-api/storage/master/WtweP.jpg",
        sourceUrl: data.link,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  },
  { quoted: qtxt }
)

} catch (e) {
await reply("Terjadi kesalahan saat memproses permintaan.")
}
}

handler.command = ["tribun", "tribunnews"]
export default handler