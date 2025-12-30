/*
  ** convert video/Audio to vn
*/

import fs from "fs"
import { exec } from "child_process"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const handler = async (m, { sock, reply, example }) => {

  const quoted = m.quoted ? m.quoted : m
  const mime = (quoted.msg || quoted).mimetype || ""
  if (!/audio|video/.test(mime))
    return reply(example("reply ke video atau audio yang ingin dijadikan VN"))

  reply("Wait...")

  try {
    // Download media
    const mediaPath = await sock.downloadAndSaveMediaMessage(quoted)
    const outPath = path.join(__dirname, `temp_${Date.now()}.ogg`) // OGG container

    // Convert ke VN WhatsApp (force mono, 48kHz, hapus metadata)
    await new Promise((resolve, reject) => {
      exec(
        `ffmpeg -y -i "${mediaPath}" -vn -c:a libopus -b:a 64k -ac 1 -ar 48000 -map_metadata -1 "${outPath}"`,
        (err, stdout, stderr) => {
          if (err) return reject(err)
          resolve()
        }
      )
    })

    // Kirim sebagai VN
    await sock.sendMessage(
      m.chat,
      {
        audio: { url: outPath },
        mimetype: "audio/ogg; codecs=opus",
        ptt: true
      },
      { quoted: m }
    )

    // Hapus file sementara
    fs.unlinkSync(mediaPath)
    fs.unlinkSync(outPath)
  } catch (err) {
    console.error(err)
    reply("❌ Gagal mengonversi ke VN. Coba lagi nanti.")
  }
}

handler.command = ["toptt", "tovn", "tovoicenote"]
export default handler