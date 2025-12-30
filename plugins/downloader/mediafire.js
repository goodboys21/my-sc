import axios from 'axios'

const handler = async (m, { sock, text, qtxt, reply, command, usedPrefix }) => {
if (!text) return await reply(`Gunakan format:\n${usedPrefix + command} https://www.mediafire.com/file/xxxxx`)

await reply("Proses Kak \~ 💫")

try {
const apiUrl = `https://api.baguss.xyz/api/download/mediafire?url=${encodeURIComponent(text)}`
const { data } = await axios.get(apiUrl)

if (!data.status) return await reply("Gagal mendapatkan data dari Mediafire.")

const { fileName, fileSize, fileType, uploaded, download } = data.result

const caption = `*MEDIAFIRE DOWNLOADER*\n\n` +
  `*Nama:* ${fileName}\n` +
  `*Ukuran:* ${fileSize}\n` +
  `*Tipe:* ${fileType}\n` +
  `*Upload:* ${uploaded}\n\n` +
  `Sedang mengirim berkas...`

await sock.sendMessage(m.chat, { text: caption }, { quoted: qtxt })

await sock.sendMessage(
  m.chat,
  {
    document: { url: download },
    fileName: fileName,
    mimetype: 'application/octet-stream'
  },
  { quoted: qtxt }
)

} catch (e) {
await reply("Terjadi kesalahan saat memproses permintaan.")
}
}

handler.command = ["mediafire", "mediafiredl"]
export default handler