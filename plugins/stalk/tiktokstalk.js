import axios from 'axios'
import * as cheerio from 'cheerio'

const proxy = () => "null"

async function tiktokStalk(username) {
try {
const targetUrl = proxy() ? proxy() + `https://tiktok.com/@${username}` : `https://tiktok.com/@${username}`
const { data: html } = await axios.get(targetUrl, {
headers: {
"User-Agent": "PostmanRuntime/7.32.2",
},
timeout: 30000,
})

const $ = cheerio.load(html)
const jsonData = $("#__UNIVERSAL_DATA_FOR_REHYDRATION__").text()
const result = JSON.parse(jsonData)

const userDetail = result["__DEFAULT_SCOPE__"]?.["webapp.user-detail"]?.userInfo
const statusCode = result["__DEFAULT_SCOPE__"]?.["webapp.user-detail"]?.statusCode

if (!userDetail || statusCode !== 0) {
  throw new Error("User TikTok tidak ditemukan!")
}

return userDetail

} catch (err) {
throw new Error(`Error stalking TikTok user: ${err.message || err}`)
}
}

const handler = async (m, { sock, text, qtxt, reply, command, usedPrefix }) => {
if (!text) return await reply(`Contoh Penggunaan:n${usedPrefix + command} jokowi`)

await reply("Proses Kak ~ 💫")

try {
const res = await tiktokStalk(encodeURIComponent(text))
const { user, stats } = res

let caption = `*TIKTOK STALK*\n\n`
caption += `*ID:* ${user.id}\n`
caption += `*Username:* ${user.uniqueId}\n`
caption += `*Nickname:* ${user.nickname}\n`
caption += `*Bio:* ${user.signature || '-'}\n`
caption += `*Verified:* ${user.verified ? 'Ya' : 'Tidak'}\n`
caption += `*Private:* ${user.privateAccount ? 'Ya' : 'Tidak'}\n`
caption += `*Followers:* ${stats.followerCount.toLocaleString()}\n`
caption += `*Following:* ${stats.followingCount.toLocaleString()}\n`
caption += `*Hearts:* ${stats.heartCount.toLocaleString()}\n`
caption += `*Video:* ${stats.videoCount.toLocaleString()}\n`
caption += `*Friend:* ${stats.friendCount.toLocaleString()}\n`

await sock.sendMessage(
  m.chat,
  {
    image: { url: user.avatarLarger },
    caption: caption
  },
  { quoted: qtxt }
)

} catch (e) {
await reply("Terjadi kesalahan atau user tidak ditemukan.")
}
}

handler.command = ["ttstalk", "tiktokstalk", "stalktiktok"]
export default handler