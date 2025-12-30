import axios from 'axios'

const handler = async (m, { sock, text, reply, qtxt, command, usedPrefix }) => {
if (!text) return await reply(`Masukkan URL Pinterest!\n\nContoh: ${usedPrefix + command} https://pin.it/xxxxx`)

await reply("Proses Kak \~ 💫")

try {
const { data } = await axios.get(`https://api.baguss.xyz/api/download/pinterest?url=${encodeURIComponent(text)}`)

if (!data.status) return await reply("Gagal mengambil data dari URL tersebut.")

const { media, author } = data.result

await sock.sendMessage(
  m.chat,
  {
    image: { url: media.url },
    caption: `*PINTEREST DOWNLOADER*\n\n*Author:* ${author.name}\n*Profile:* ${author.url}\n*Media Type:* ${media.type}`
  },
  { quoted: qtxt }
)

} catch (e) {
await reply("Terjadi kesalahan saat memproses permintaan.")
}
}

handler.command = ["pindl", "pinterestdl"]
export default handler