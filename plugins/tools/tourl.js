import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import FormData from "form-data";

const MAX_TELEGRAPH_SIZE = 5 * 1024 * 1024;
const TELE_EXT = ["jpg", "jpeg", "png"];

const handler = async (m, { sock, reply, qmsg, qtxt }) => {
  if (!qmsg) return reply("Kirim atau reply ke media!");
    
    await reply('Proses kak ~ 💫');

  let mediaPath;
  try {
    mediaPath = await sock.downloadAndSaveMediaMessage(qmsg);
    const buffer = fs.readFileSync(mediaPath);
    const size = buffer.length;
    const ext = path.extname(mediaPath).replace(".", "").toLowerCase();

    /* ================= GITHUB ================= */
    const uploadToGithub = async () => {
      const tokenRes = await fetch("https://json.link/RqiRdVnRL0.json");
      const { token } = await tokenRes.json();

      const random = Array.from({ length: 5 }, () =>
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
          .charAt(Math.floor(Math.random() * 62))
      ).join("");

      const finalName = ext ? `${random}.${ext}` : random;
      const apiUrl = `https://api.github.com/repos/bagus-api/storage/contents/${finalName}`;

      const res = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `token ${token}`,
          "User-Agent": "wa-bot-upload"
        },
        body: JSON.stringify({
          message: `Upload ${finalName}`,
          content: buffer.toString("base64")
        })
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error("GitHub upload gagal: " + err.slice(0, 100));
      }

      return `https://raw.githubusercontent.com/bagus-api/storage/master/${finalName}`;
    };

    /* ================= TELEGRAPH ================= */
    const uploadToTelegraph = async () => {
      const fd = new FormData();
      fd.append("images", buffer, "image." + ext);

      const res = await fetch("https://telegraph.zorner.men/upload", {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...fd.getHeaders()
        },
        body: fd
      });

      const data = await res.json();
      if (!data?.links || !Array.isArray(data.links)) return null;

      return data.links[0] || null;
    };

    /* ================= EKSEKUSI ================= */
    const githubUrl = await uploadToGithub();

    let telegraphUrl = null;
    if (TELE_EXT.includes(ext) && size <= MAX_TELEGRAPH_SIZE) {
      telegraphUrl = await uploadToTelegraph().catch(() => null);
    }

    /* ================= BUTTON ================= */
    const buttons = [
      {
        name: "cta_copy",
        buttonParamsJson: JSON.stringify({
          display_text: "Github",
          copy_code: githubUrl
        })
      }
    ];

    if (telegraphUrl) {
      buttons.push({
        name: "cta_copy",
        buttonParamsJson: JSON.stringify({
          display_text: "Telegraph",
          copy_code: telegraphUrl
        })
      });
    }

    /* ================= CAPTION ================= */
    let caption =
`*Upload Succes* ✅

> 👾 Github :
${githubUrl}`;

    if (telegraphUrl) {
      caption += `

> ⛈️ TelegraPh
${telegraphUrl}`;
    }

    caption += `

Silahkan Tekan Tombol Salin Sesuai Dengan Yang Anda Inginkan.`;

    /* ================= SEND ================= */
    await sock.sendMessage(
      m.chat,
      {
        text: caption,
        interactiveButtons: buttons
      },
      { quoted: qtxt }
    );

  } catch (err) {
    console.error("tourl error:", err);
    reply("Terjadi kesalahan saat upload media.");
  } finally {
    if (mediaPath && fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
  }
};

handler.command = ["tourl"];
export default handler;