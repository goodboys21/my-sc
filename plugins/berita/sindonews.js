import fetch from 'node-fetch'

const handler = async (m, { sock, qtxt, reply }) => {
await reply("Proses Kak \~ 💫")
try {
const response = await fetch('https://api.baguss.xyz/api/berita/sindonews')
const json = await response.json()

if (!json.success || !json.data.length) throw "Gagal mengambil data berita."

const data = json.data[Math.floor(Math.random() * json.data.length)]
const caption = `*SINDONEWS NEWS*\n\n` +
  `*Judul:* ${data.title}\n` +
  `*Link:* ${data.link}`

await sock.sendMessage(
  m.chat,
  {
    text: caption,
    contextInfo: {
      externalAdReply: {
        title: "Sindonews Update",
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

handler.command = ["sindo", "sindonews"]
export default handler