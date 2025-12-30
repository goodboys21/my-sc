const handler = async (m, { sock, text, qtxt, reply, command, usedPrefix }) => {
await reply("Proses Kak \~ 💫")
try {
const response = await fetch('https://api.baguss.xyz/api/berita/liputan')
const json = await response.json()

if (!json.success || !json.data.length) throw "Gagal mengambil data berita."

const news = json.data[Math.floor(Math.random() * json.data.length)]
const caption = `📰 *LIPUTAN 6 NEWS*\n\n` +
  `📌 *Judul:* ${news.title}\n` +
  `🔗 *Link:* ${news.link}\n\n` +
  `_© ${json.creator}_`

await sock.sendMessage(
  m.chat,
  {
    text: caption,
    contextInfo: {
      externalAdReply: {
        title: "Liputan 6 Terkini",
        body: news.title,
        thumbnailUrl: "https://raw.githubusercontent.com/bagus-api/storage/master/WtweP.jpg",
        sourceUrl: news.link,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  },
  { quoted: m }
)

} catch (e) {
await reply("❌ Terjadi kesalahan saat mengakses API.")
}
}

handler.command = ["liputan", "liputan6"]
export default handler