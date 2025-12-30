import axios from 'axios'

const handler = async (m, { sock, qtxt, reply }) => {
await reply("Proses Kak \~ 💫")
try {
const response = await axios.get("https://api.baguss.xyz/api/berita/cnn")
const res = response.data

if (!res.success || !res.data.length) {
  return await sock.sendMessage(m.chat, { text: "❌ Gagal mengambil data berita." }, { quoted: qtxt })
}

const news = res.data[Math.floor(Math.random() * res.data.length)]

let caption = "📰 *CNN INDONESIA*\n\n"
caption += "📌 *Judul:* " + news.title + "\n"
caption += "🔗 *Link:* " + news.link + "\n\n"
caption += "Situs: CNN Indonesia"

await sock.sendMessage(
  m.chat,
  {
    text: caption,
    contextInfo: {
      externalAdReply: {
        title: news.title,
        body: "Berita Terkini CNN Indonesia",
        thumbnailUrl: "https://raw.githubusercontent.com/bagus-api/storage/master/WtweP.jpg",
        sourceUrl: news.link,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  },
  { quoted: qtxt }
)

} catch (e) {
await sock.sendMessage(m.chat, { text: "❌ Terjadi kesalahan pada server api." }, { quoted: qtxt })
}
}

handler.command = ["cnn"]
export default handler