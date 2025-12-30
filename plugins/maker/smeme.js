import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import FormData from "form-data";

async function uploadTelegraphZorner(buffer) {
  const form = new FormData();
  form.append("images", buffer, "image.jpg");

  const res = await fetch("https://telegraph.zorner.men/upload", {
    method: "POST",
    headers: {
      Accept: "application/json"
    },
    body: form
  });

  const json = await res.json();
  if (!json?.links?.[0]) throw new Error("Upload Telegraph gagal");

  return json.links[0];
}

const handler = async (m, { sock, text, reply, command, usedPrefix }) => {
  const qmsg = m.quoted ? m.quoted : m;
  const mime = qmsg.mimetype || qmsg.msg?.mimetype || "";

  if (!/image/.test(mime))
    return reply(
      `Kirim atau reply gambar dengan caption *${usedPrefix + command} teks1,teks2*`
    );

  if (!text || !text.includes(",")) {
    return reply(`Format salah.\nContoh: *${usedPrefix + command} Halo,Bang*`);
  }

  await reply("Proses Kak ~ 💫");

  try {
    const [topText, bottomText] = text.split(",").map(v => v.trim());

    const mediaPath = await sock.downloadAndSaveMediaMessage(qmsg);
    const imgBuffer = fs.readFileSync(mediaPath);

    const teleUrl = await uploadTelegraphZorner(imgBuffer);

    const apiUrl = `https://brat.siputzx.my.id/meme?topText=${encodeURIComponent(
      topText
    )}&bottomText=${encodeURIComponent(
      bottomText
    )}&fontFamily=Impact&textColor=white&strokeColor=black&backgroundImage=${encodeURIComponent(
      teleUrl
    )}`;

    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error("API meme error");

    const buffer = await res.buffer();

    const tmpPath = path.join(
      process.cwd(),
      `./tmp/smeme_${Date.now()}.png`
    );

    fs.writeFileSync(tmpPath, buffer);

    await sock.sendImageAsSticker(
      m.chat,
      tmpPath,
      m,
      { author: "Sticker Meme" }
    );

    fs.unlinkSync(tmpPath);
    fs.unlinkSync(mediaPath);
  } catch (e) {
    console.error(e);
    reply("❌ Gagal membuat sticker meme.");
  }
};

handler.command = ["smeme", "stickermeme"];
export default handler;