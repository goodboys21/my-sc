import fetch from "node-fetch";

const handler = async (m, { sock, text, command, qtxt, reply, usedPrefix }) => {
  if (!text)
    return reply(`Contoh:\n*${usedPrefix + command} hello world*`);

  try {
    const apiUrl =
      "https://skyzxu-brat.hf.space/brat?text=" +
      encodeURIComponent(text);

    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error("API error");

    const buffer = Buffer.from(await res.arrayBuffer());

    await sock.sendImageAsSticker(
      m.chat,
      buffer,
      qtxt,
      {
        packname: "Stoic",
        author: "Botz"
      }
    );
  } catch (e) {
    console.error(e);
    reply("❌ Gagal membuat brat sticker");
  }
};

handler.command = ["brat"];
export default handler;