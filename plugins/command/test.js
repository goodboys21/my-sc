const handler = async (m, { sock, usedPrefix, command, text }) => {
  const replyText = text
    ? `✅ Test berhasil.\n\nInput kamu:\n"${text}"`
    : `✅ Test berhasil.\n\nGunakan:\n${usedPrefix + command} halo`

  await sock.sendMessage(
    m.chat,
    {
      text: replyText,
      mentions: [m.sender]
    },
    { quoted: m }
  )
}

handler.command = ["test"]
export default handler