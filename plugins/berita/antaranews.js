import axios from 'axios'

const handler = async (m, { sock, qtxt, reply, command }) => {
await reply("Proses Kak \~ 💫")
try {
const { data } = await axios.get("https://api.baguss.xyz/api/berita/antaranews")
if (!data.success || !data.data.length) throw new Error("Gagal mengambil data")

const randomNews = data.data[Math.floor(Math.random() * data.data.length)]
const message = `📰 *ANTARA NEWS*\n\n` +
                `📌 *Judul:* ${randomNews.title}\n` +
                `🔗 *Link:* ${randomNews.link}\n\n` +
                `_Waktu: ${data.timestamp}_`

await sock.sendMessage(
  m.chat,
  {
    text: message,
    mentions: [m.sender]
  },
  { quoted: qtxt }
)

} catch (e) {
await reply("Terjadi kesalahan saat mengambil berita.")
}
}

handler.command = ["antara", "antaranews"]
export default handler