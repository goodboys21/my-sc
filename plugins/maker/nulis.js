import fetch from 'node-fetch'

const handler = async (m, { sock, text, qtxt, reply, command, usedPrefix }) => {
if (!text) return await reply(`Gunakan: ${usedPrefix + command} teks yang ingin ditulis`)

await reply("Proses Kak ~ 💫")

try {
const apiUrl = `https://brat.siputzx.my.id/nulis?waktu=&hari=&nama=&kelas=&text=${encodeURIComponent(text)}&type=13`
const response = await fetch(apiUrl)

if (!response.ok) throw new Error('Gagal mengambil data dari API')

const buffer = await response.buffer()

await sock.sendMessage(
  m.chat,
  {
    image: buffer,
    caption: '✅ Berhasil menulis'
  },
  { quoted: qtxt }
)

} catch (e) {
await reply("Terjadi kesalahan saat memproses permintaan.")
}
}

handler.command = ["nulis"]
export default handler