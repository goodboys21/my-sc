import axios from "axios";

const handler = async (m, { sock, text, qtxt, reply, command, usedPrefix }) => {
  if (!text) {
    return reply(
      `Gunakan format:\n${usedPrefix + command} username\nContoh: ${usedPrefix + command} baguselek21`
    );
  }

  await reply("Proses Kak ~ 💫");

  try {
    const username = text.replace(/^@/, "").trim();
    const apiUrl = `https://api.baguss.xyz/api/stalker/instagram?username=${encodeURIComponent(username)}`;

    const { data } = await axios.get(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
      }
    });

    if (!data || !data.status) {
      throw new Error("Data tidak ditemukan");
    }

    let caption = `*INSTAGRAM STALK*\n\n`;
    caption += `*Username:* ${data.username}\n`;
    caption += `*Full Name:* ${data.fullname || "-"}\n`;
    caption += `*Followers:* ${Number(data.followers).toLocaleString()}\n`;
    caption += `*Following:* ${Number(data.following).toLocaleString()}\n`;
    caption += `*Posts:* ${Number(data.posts).toLocaleString()}\n`;
    caption += `*Bio:* ${data.bio || "-"}\n`;

    if (data.profile_pic) {
      await sock.sendMessage(
        m.chat,
        {
          image: { url: data.profile_pic },
          caption
        },
        { quoted: qtxt }
      );
    } else {
      await sock.sendMessage(
        m.chat,
        { text: caption },
        { quoted: qtxt }
      );
    }
  } catch (err) {
    await reply("Terjadi kesalahan atau akun tidak ditemukan.");
  }
};

handler.command = ["igstalk", "instagramstalk", "stalkig"];
export default handler;