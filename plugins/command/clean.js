function extractQuotedText(m) {
  const q = m.quoted
  if (!q) return null

  if (typeof q.text === "string") return q.text

  const msg =
    q.message?.conversation ||
    q.message?.extendedTextMessage?.text ||
    q.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation ||
    q.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text ||
    null

  return msg
}

function cleanCode(text) {
  if (!text) return text

  return text
    .replace(/```[a-zA-Z]*\n?/g, "")
    .replace(/```/g, "")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, "$2")
    .replace(/=\s*\\?>/g, "=>")
    .replace(/\\!/g, "!")
    .replace(/\(\s*!/g, "(!")
    .trim()
}

const handler = async (m, { sock, reply }) => {
  const quotedText = extractQuotedText(m)

  if (!quotedText) {
    return reply("Reply kode plugin yang ingin di-clean.")
  }

  const result = cleanCode(quotedText)

  await sock.sendMessage(
    m.chat,
    {
      text: result,
      mentions: [m.sender]
    },
    { quoted: m }
  )
}

handler.command = ["cleancode"]
export default handler