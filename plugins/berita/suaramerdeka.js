import fetch from 'node-fetch'

const handler = async (m, { sock, qtxt, reply }) => {
await reply("Proses Kak \~ 💫")
try {
const res = await fetch('https://api.baguss.xyz/api/berita/merdeka')
const json = await res.json()

if (!json.success || !json.data.length) return await reply("Gagal mengambil data berita.")

const berita = json.data[Math.floor(Math.random() * json.data.length)]
const caption = `📰 *BERITA MERDEKA*\n\n📌 *Judul:* ${berita.title}\n🔗 *Link:* ${berita.link}`

await sock.sendMessage(
  m.chat,
  {
    text: caption,
    contextInfo: {
      externalAdReply: {
        title: "Merdeka News",
        body: berita.title,
        thumbnailUrl: "https://raw.githubusercontent.com/bagus-api/storage/master/WtweP.jpg",
        sourceUrl: berita.link,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  },
  { quoted: qtxt }
)

} catch (e) {
await reply("Terjadi kesalahan saat memproses data.")
}
}

handler.command = ["merdeka", "suaramerdeka"]
export default handler