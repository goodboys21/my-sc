import axios from 'axios'

const handler = async (m, { sock, text, qtxt, reply, command, usedPrefix }) => {
if (!text) return await reply(`Gunakan format: ${usedPrefix + command} <url google drive>`)

await reply("Proses Kak \~ 💫")

try {
const apiUrl = `https://api.baguss.xyz/api/download/gdrive?url=${encodeURIComponent(text)}`
const { data } = await axios.get(apiUrl)

if (!data.status) return await reply("Gagal mendapatkan data dari Google Drive.")

const { name, download } = data.data

await sock.sendMessage(
  m.chat,
  {
    document: { url: download },
    fileName: name,
    mimetype: 'application/octet-stream'
  },
  { quoted: qtxt }
)

} catch (e) {
await reply("Terjadi kesalahan saat memproses permintaan.")
}
}

handler.command = ["gdrive", "googledrive"]
export default handler