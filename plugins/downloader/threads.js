// Threads Downloader (Format IG Style)

import axios from 'axios'

async function threadsdl(url) {
  const { data } = await axios.get(
    `https://snapthreads.net/api/download?url=${encodeURIComponent(url)}`,
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
      },
      timeout: 20000
    }
  )

  if (!data?.directLink) throw new Error('Gagal mengambil direct link')
  return data.directLink
}

const handler = async (m, { sock, text, qtxt, reply, command, usedPrefix }) => {
  if (!text)
    return reply(
      `Kirim link Threads\nContoh: ${usedPrefix + command} https://www.threads.com/@user/post/xxxx`
    )

  await reply('Proses Kak ~ 💫')

  try {
    const mediaUrl = await threadsdl(text)

    const res = await axios.get(mediaUrl, {
      responseType: 'arraybuffer',
      timeout: 30000
    })

    const buf = Buffer.from(res.data)

    // Deteksi video / image
    if (buf.slice(4, 8).toString() === 'ftyp') {
      await sock.sendMessage(
        m.chat,
        { video: buf, caption: 'Threads Downloader' },
        { quoted: m }
      )
    } else {
      await sock.sendMessage(
        m.chat,
        { image: buf, caption: 'Threads Downloader' },
        { quoted: qtxt || m }
      )
    }
  } catch (e) {
    await sock.sendMessage(
      m.chat,
      { text: 'Terjadi kesalahan saat mengambil media Threads.' },
      { quoted: m }
    )
  }
}

handler.command = ['threads', 'thdl']
export default handler