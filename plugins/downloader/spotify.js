import axios from "axios"
import * as cheerio from "cheerio"

const spotydl = async (spotifyUrl) => {
  const baseUrl = "https://spotmate.online"

  const { data: html, headers } = await axios.get(baseUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "text/html"
    }
  })

  const $ = cheerio.load(html)

  const csrfToken = $('meta[name="csrf-token"]').attr("content")
  if (!csrfToken) throw new Error("CSRF token tidak ditemukan")

  const cookies = headers["set-cookie"] || []
  const cookieHeader = cookies.map(c => c.split(";")[0]).join("; ")

  const headersPost = {
    "Content-Type": "application/json",
    "X-CSRF-TOKEN": csrfToken,
    "Cookie": cookieHeader,
    "Referer": baseUrl,
    "Origin": baseUrl,
    "User-Agent": "Mozilla/5.0"
  }

  const { data: trackData } = await axios.post(
    `${baseUrl}/getTrackData`,
    { spotify_url: spotifyUrl },
    { headers: headersPost }
  )

  const { data: convertData } = await axios.post(
    `${baseUrl}/convert`,
    { urls: spotifyUrl },
    { headers: headersPost }
  )

  if (!convertData?.url) {
    throw new Error("Gagal mendapatkan URL unduhan")
  }

  return {
    title: trackData?.name || "Unknown",
    artist: trackData?.artists?.map(a => a.name).join(", ") || "-",
    url: convertData.url
  }
}

const handler = async (m, { sock, text, qtxt, reply, command, usedPrefix }) => {
  if (!text) {
    return reply(`Gunakan format: ${usedPrefix + command} <link spotify>`)
  }

  if (!/spotify\.com/.test(text)) {
    return reply("Link Spotify tidak valid")
  }

  await reply("Proses Kak ~ 💫")

  try {
    const result = await spotydl(text)

    await sock.sendMessage(
      m.chat,
      {
        audio: { url: result.url },
        mimetype: "audio/mpeg",
        fileName: `${result.title}.mp3`,
        caption: `🎵 ${result.title}\n👤 ${result.artist}`
      },
      {
        quoted: qtxt || m   // ⬅️ INI KUNCINYA
      }
    )

  } catch (e) {
    console.error("SPOTIFY ERROR:", e)
    await reply(`Terjadi kesalahan: ${e.message}`)
  }
}

handler.command = ["spotify", "spotifydl"]
export default handler