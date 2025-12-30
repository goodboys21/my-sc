import fetch from 'node-fetch'

const handler = async (m, { sock, text, qtxt, reply, command, usedPrefix }) => {
if (!text) return await reply(`Kirim pesan teksnya kak!nnContoh: ${usedPrefix + command} Halo dunia`)

await reply("Proses Kak ~ 💫")

try {
const time = new Date().toLocaleTimeString('id-ID', {
hour: '2-digit',
minute: '2-digit',
hour12: false
}).replace('.', ':')

const battery = Math.floor(Math.random() * 85) + 1
const message = encodeURIComponent(text)
const apiUrl = `https://brat.siputzx.my.id/iphone-quoted?time=${time}&messageText=${message}&carrierName=INDOSAT&batteryPercentage=${battery}&signalS=4`

const response = await fetch(apiUrl)

if (!response.ok) throw new Error('Gagal mengambil data dari API')

const buffer = await response.buffer()

await sock.sendMessage(
  m.chat,
  {
    image: buffer,
    caption: `📱 *iPhone Quote Chat*nn💬: ${text}`
  },
  { quoted: qtxt }
)

} catch (e) {
await reply("Terjadi kesalahan saat memproses permintaan.")
}
}

handler.command = ["iqc", "iphonequotechat"]
export default handler