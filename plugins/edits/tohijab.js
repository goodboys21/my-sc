import axios from 'axios'
import CryptoJS from 'crypto-js'
import fs from 'fs'

const AES_KEY = 'ai-enhancer-web__aes-key'
const AES_IV = 'aienhancer-aesiv'

function encryptData(obj) {
  return CryptoJS.AES.encrypt(
    JSON.stringify(obj),
    CryptoJS.enc.Utf8.parse(AES_KEY),
    {
      iv: CryptoJS.enc.Utf8.parse(AES_IV),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  ).toString()
}

const handler = async (m, { sock, reply, command }) => {
  const q = m.quoted ? m.quoted : m

  const mime =
    q.mimetype ||
    q.message?.imageMessage?.mimetype ||
    q.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage?.mimetype ||
    ''

  if (!/image\/(jpe?g|png)/i.test(mime)) {
    return await reply('Kirim atau reply gambar dengan caption .' + command)
  }

  await reply('Proses Kak ~ 💫')

  try {
    // DOWNLOAD & SAVE IMAGE (BAILEYS)
    const filePath = await sock.downloadAndSaveMediaMessage(
      q,
      `./tmp/tmp_${Date.now()}`,
      true
    )

    const buffer = fs.readFileSync(filePath)
    const base64Image = buffer.toString('base64')

    // CLEAN FILE
    fs.unlinkSync(filePath)

    const settings = encryptData({
      prompt: 'tolong ubah agar menggunakan hijab muslimah.',
      size: '2K',
      aspect_ratio: 'match_input_image',
      output_format: 'jpeg',
      max_images: 1
    })

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10)',
      'Content-Type': 'application/json',
      'Origin': 'https://aienhancer.ai',
      'Referer': 'https://aienhancer.ai/ai-image-editor'
    }

    // CREATE TASK
    const create = await axios.post(
      'https://aienhancer.ai/api/v1/k/image-enhance/create',
      {
        model: 2,
        image: `data:image/jpeg;base64,${base64Image}`,
        settings
      },
      { headers }
    )

    const taskId = create?.data?.data?.id
    if (!taskId) throw new Error('Gagal membuat task AI')

    let resultUrl = null

    // POLLING RESULT
    for (let i = 0; i < 15; i++) {
      await new Promise(r => setTimeout(r, 3000))

      const check = await axios.post(
        'https://aienhancer.ai/api/v1/k/image-enhance/result',
        { task_id: taskId },
        { headers }
      )

      const res = check?.data?.data
      if (!res) continue

      if (res.status === 'success') {
        resultUrl = res.output
        break
      }

      if (res.status === 'failed') {
        throw new Error(res.error || 'Proses gagal di server')
      }
    }

    if (!resultUrl) throw new Error('Timeout: hasil tidak ditemukan')

    await sock.sendMessage(
      m.chat,
      {
        image: { url: resultUrl },
        caption: '✅ Berhasil mengedit gambar.'
      },
      { quoted: q }
    )

  } catch (e) {
    await reply('Error: ' + e.message)
  }
}

handler.command = ['hijab', 'tohijab']
export default handler