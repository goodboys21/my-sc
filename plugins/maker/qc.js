import fetch from "node-fetch";
import fs from "fs";
import path from "path";

const handler = async (m, { sock, text, reply, pushname }) => {
  if (!text) return reply("Kirim teksnya kak, contoh: .qc Halo");

  await reply("Proses Kak ~ 💫");

  try {
    let pp;
    try {
      pp = await sock.profilePictureUrl(m.sender, "image");
    } catch {
      pp = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
    }

    const body = {
      messages: [
        {
          from: {
            id: 1,
            first_name: pushname,
            last_name: "",
            name: pushname,
            photo: { url: pp }
          },
          text,
          entities: [],
          avatar: true
        }
      ],
      backgroundColor: "#292232",
      width: 512,
      height: 512,
      scale: 2,
      type: "quote",
      format: "png",
      emojiStyle: "apple"
    };

    const res = await fetch("https://brat.siputzx.my.id/quoted", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error("API error");

    const buffer = await res.buffer();

    const tmpPath = path.join(
      process.cwd(),
      `./tmp/qc_${Date.now()}.png`
    );

    fs.writeFileSync(tmpPath, buffer);

    await sock.sendImageAsSticker(
      m.chat,
      tmpPath,
      m,
      {
        author: pushname || "Quote Chat"
      }
    );

    fs.unlinkSync(tmpPath);
  } catch (e) {
    console.error(e);
    reply("❌ Terjadi kesalahan sistem.");
  }
};

handler.command = ["qc", "quotechat"];
export default handler;