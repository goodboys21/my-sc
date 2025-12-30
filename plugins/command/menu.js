import fs from "fs"
import path from "path"
import speed from "performance-now"

const PLUGIN_DIR = "./plugins"
const EXCLUDE_FOLDERS = ["command"]

function getCategories() {
  return fs.readdirSync(PLUGIN_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && !EXCLUDE_FOLDERS.includes(d.name.toLowerCase()))
    .map(d => d.name)
}

function getCommandsByCategory(category) {
  const folderPath = path.join(PLUGIN_DIR, category)
  if (!fs.existsSync(folderPath)) return null

  return fs.readdirSync(folderPath)
    .filter(f => f.endsWith(".js"))
    .map(f => f.replace(".js", ""))
}

const handler = async (m, { sock, qtxt, text, getPluginStats, usedPrefix }) => {

  const info = getPluginStats()
  const timestamp = speed()
  const latency = (speed() - timestamp).toFixed(4)

  let menuText = ""

  if (!text) {
    const categories = getCategories()
    for (const category of categories) {
      menuText += `• .menu ${category}\n`
    }
    
  } else {
    const category = text.toLowerCase()

    if (EXCLUDE_FOLDERS.includes(category)) {
      return sock.sendMessage(
        m.chat,
        { text: `❌ Category *${category}* tidak tersedia.` },
        { quoted: qtxt }
      )
    }

    const commands = getCommandsByCategory(category)

    if (!commands || commands.length === 0) {
      return sock.sendMessage(
        m.chat,
        { text: `❌ Category *${category}* tidak ditemukan.` },
        { quoted: qtxt }
      )
    }

    for (const cmd of commands) {
      menuText += `• ${usedPrefix}${cmd}\n`
    }
  }

  const teks = `Hai @${m.sender.split("@")[0]}, I am a multi-device WhatsApp bot developed by the Bagus Api team.

╔════〔 SCRIPT INFO 〕═══╗
║ 🤖 Bot        : ${global.namaBot}
║ 🪀 Library    : WS Baileys
║ 🚧 Version    : 0.0.01
║ 👨‍💻 Creator    : ${global.namaOwner}
╚══════════════════╝

${menuText}
© powered by ${global.namaOwner}
`

  await sock.sendMessage(
    m.chat,
    {
      image: { url: global.thumb },
      caption: teks,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 9999999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: global.idChanel,
          newsletterName: global.namaChanel
        }
      }
    },
    { quoted: qtxt }
  )
}

handler.command = ["menu"]
export default handler