import Jimp from 'jimp';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const handler = async (m, { sock, qtxt, reply, command }) => {
const FRAME_URL = "https://files.clugx.my.id/ehmVW.png";
const quoted = m.quoted ? m.quoted : m;
const mime = (quoted.msg || quoted).mimetype || '';

if (!/image\/(jpe?g|png)/.test(mime)) {
  return reply(`Kirim atau balas foto dengan perintah *${command}* untuk membuat twibbon.`);
}

if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp');

const buffer = await quoted.download();
if (!buffer) throw new Error("Gagal mengunduh gambar");

await reply("Proses Kak ~ 💫");

const mediaPath = `./tmp/${Date.now()}.jpg`;
const outputPath = `./tmp/twibbon_${Date.now()}.png`;

try {
const buffer = await quoted.download();
fs.writeFileSync(mediaPath, buffer);

const userImg = await Jimp.read(mediaPath);
userImg.cover(1080, 1080);

const frameResponse = await axios.get(FRAME_URL, { responseType: "arraybuffer" });
const frameImg = await Jimp.read(frameResponse.data);
frameImg.resize(1080, 1080);

userImg.composite(frameImg, 0, 0);
await userImg.writeAsync(outputPath);

await sock.sendMessage(
  m.chat,
  {
    image: fs.readFileSync(outputPath),
    caption: "✅ Twibbon MPLS Berhasil Dibuat!"
  },
  { quoted: qtxt }
);

} catch (e) {
console.error(e);
await reply("Terjadi kesalahan saat memproses gambar.");
} finally {
if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
}
}

handler.command = ["mpls", "tompls", "twibbon"];
export default handler;