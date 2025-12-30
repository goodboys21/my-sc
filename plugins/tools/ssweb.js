import axios from 'axios';

const handler = async (m, { sock, text, command, usedPrefix }) => {
if (!text) return sock.sendMessage(m.chat, { text: `Gunakan format: ${usedPrefix + command} <url>` }, { quoted: m });

await sock.sendMessage(m.chat, { text: "Proses Kak \~ 💫" }, { quoted: m });

try {
const response = await axios.get(`https://api.baguss.xyz/api/tools/ssweb?url=${encodeURIComponent(text)}`);
const data = response.data;

if (data.status && data.result) {
  await sock.sendMessage(
    m.chat,
    {
      image: { url: data.result },
      caption: `✅ Screenshot Berhasil\n\nURL: ${text}`
    },
    { quoted: m }
  );
} else {
  await sock.sendMessage(m.chat, { text: "❌ Gagal mengambil screenshot." }, { quoted: m });
}

} catch (e) {
await sock.sendMessage(m.chat, { text: "❌ Terjadi kesalahan pada server API." }, { quoted: m });
}
}

handler.command = ["ssweb", "ss"]
export default handler