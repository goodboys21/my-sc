import fetch from 'node-fetch'

const handler = async (m, { sock, qtxt, reply }) => {
await reply("Proses Kak \~ 💫")
try {
const response = await fetch('https://api.baguss.xyz/api/berita/detik')
const json = await response.json()

if (!json.success || !json.data || json.data.length === 0) {
  return await sock.sendMessage(m.chat, { text: "Gagal mengambil data berita." }, { quoted: qtxt })
}

const data = json.data
const item = data[Math.floor(Math.random() * data.length)]

let cap = "*DETIK NEWS*\n\n"
cap += "📌 *Judul:* " + item.title + "\n"
cap += "🔗 *Link:* " + item.link + "\n\n"
cap += "© Detik News"

await sock.sendMessage(
  m.chat,
  {
    text: cap,
    contextInfo: {
      externalAdReply: {
        title: "Detik News Update",
        body: item.title,
        thumbnailUrl: "https://raw.githubusercontent.com/bagus-api/storage/master/WtweP.jpg",
        sourceUrl: item.link,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  },
  { quoted: qtxt }
)

} catch (e) {
await sock.sendMessage(m.chat, { text: "Error: " + e.message }, { quoted: qtxt })
}
}

handler.command = ["detik", "detiknews"]
export default handler