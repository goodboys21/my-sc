import axios from "axios"
import fs from "fs"
import { exec } from "child_process"
import { promisify } from "util"
const writeFile = promisify(fs.writeFile)
const unlink = promisify(fs.unlink)

const handler = async (m, { sock, qtxt, reply, command }) => {
const q = m.quoted ? m.quoted : m
const mime = (q.msg || q).mimetype || ""

if (!/image/.test(mime)) return reply(`Kirim atau balas foto dengan perintah *${command}*`)

await reply("Proses Kak ~ 💫")

try {
const media = await q.download()
const inputPath = `./tmp/${Date.now()}.jpg`
const outputPath = `./tmp/${Date.now()}.png`
await writeFile(inputPath, media)

const base64 = fs.readFileSync(inputPath).toString("base64")

const res = await axios.post(
  "https://background-remover.com/removeImageBackground",
  {
    encodedImage: `data:image/jpeg;base64,${base64}`,
    title: "image.jpg",
    mimeType: "image/jpeg"
  },
  {
    headers: {
      "sec-ch-ua-platform": `"Android"`,
      "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36 EdgA/143.0.0.0",
      "sec-ch-ua": `"Microsoft Edge";v="143", "Chromium";v="143", "Not A(Brand";v="24"`,
      "content-type": "application/json",
      "sec-ch-ua-mobile": "?1",
      "accept": "*/*",
      "origin": "https://background-remover.com",
      "referer": "https://background-remover.com/upload",
      "accept-language": "id"
    }
  }
)

const out = res.data.encodedImageWithoutBackground.split(",")[1]
await writeFile(outputPath, Buffer.from(out, "base64"))

await sock.sendMessage(
  m.chat,
  {
    image: fs.readFileSync(outputPath),
    caption: "✅ Berhasil menghapus background."
  },
  { quoted: qtxt }
)

await unlink(inputPath)
await unlink(outputPath)

} catch (e) {
reply("❌ Terjadi kesalahan saat memproses gambar.")
}
}

handler.command = ["removebg", "removebackground", "rbg"]
export default handler