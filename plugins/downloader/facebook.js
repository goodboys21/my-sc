import axios from "axios"
import * as cheerio from "cheerio"
import qs from "qs"

/* ===============================
   SCRAPER SNAPSave FACEBOOK
================================ */
export async function snapSaveFacebook(url) {
  if (!/facebook\.com|fb\.watch/i.test(url)) {
    throw new Error("URL bukan Facebook")
  }

  const postData = qs.stringify({
    p: "facebook",
    q: url,
    lang: "id",
    w: ""
  })

  const { data } = await axios.post(
    "https://snapsave.io/api/ajaxSearch/facebook",
    postData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/137.0.0.0 Mobile Safari/537.36"
      },
      timeout: 20000
    }
  )

  if (!data || data.status !== "ok" || !data.data) {
    throw new Error("Response SnapSave tidak valid")
  }

  const $ = cheerio.load(data.data)

  const result = {
    title: $("h3").first().text().trim() || "Facebook Video",
    video: []
  }

  $("a.download-link-fb").each((_, el) => {
    const link = $(el).attr("href")
    if (!link) return

    const rowText = $(el).closest("tr").text()
    const quality =
      rowText.match(/\d{3,4}p/i)?.[0] ||
      rowText.match(/HD|SD/i)?.[0] ||
      "unknown"

    result.video.push({
      quality,
      url: link
    })
  })

  if (!result.video.length) {
    throw new Error("Link video tidak ditemukan")
  }

  return result
}

/* ===============================
   HANDLER BAILEYS
================================ */
const handler = async (m, { sock, text, qtxt, reply, command, usedPrefix }) => {
  if (!text) {
    return sock.sendMessage(
      m.chat,
      { text: `Gunakan format:\n${usedPrefix}${command} <url facebook>` },
      { quoted: m }
    )
  }

  await reply('Proses kak ~ 💫');

  try {
    const data = await snapSaveFacebook(text)

    const selected = data.video
      .map(v => ({
        ...v,
        q: parseInt(v.quality) || 0
      }))
      .sort((a, b) => b.q - a.q)[0]

    await sock.sendMessage(
      m.chat,
      {
        video: { url: selected.url },
        caption:
          `✅ *FACEBOOK DOWNLOADER*\n\n` +
          `📌 *Judul:* ${data.title}\n` +
          `🎞️ *Kualitas:* ${selected.quality}`
      },
      { quoted: m }
    )
  } catch (err) {
    await sock.sendMessage(
      m.chat,
      { text: "❌ Gagal mengunduh video Facebook." },
      { quoted: m }
    )
  }
}

handler.command = ["facebook", "fb", "fbdl"]
export default handler