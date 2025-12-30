import axios from 'axios'

const handler = async (m, { sock, text, qtxt, reply, command, usedPrefix }) => {
if (!text) return await reply(`Gunakan format: ${usedPrefix + command} <url github>`)

await reply("Proses Kak \~ 💫")

try {
const response = await axios.get(`https://api.baguss.xyz/api/download/github?url=${encodeURIComponent(text)}`)
const res = response.data

if (!res.status) return await reply("Gagal mengambil data dari GitHub.")

const { repo, owner, download_url } = res.data

await sock.sendMessage(
  m.chat,
  {
    document: { url: download_url },
    fileName: `${repo}.zip`,
    mimetype: 'application/zip',
    caption: `📦 *GitHub Downloader*\n\n👤 *Owner:* ${owner}\n📂 *Repo:* ${repo}\n\nBerhasil mengunduh repository.`
  },
  { quoted: qtxt }
)

} catch (e) {
await reply("Terjadi kesalahan saat memproses permintaan.")
}
}

handler.command = ["github", "githubdl", "gitclone"]
export default handler