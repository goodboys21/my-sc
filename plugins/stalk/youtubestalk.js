import axios from "axios";

const handler = async (m, { sock, text, qtxt, reply, command, usedPrefix }) => {
  if (!text) {
    return reply(
      `Gunakan format:\n${usedPrefix + command} username\nContoh: ${usedPrefix + command} bagusxixepen`
    );
  }

  await reply("Proses Kak ~ 💫");

  try {
    const username = text.replace(/^@/, "").trim();
    const apiUrl = `https://api.baguss.xyz/api/stalker/ytstalk?username=${encodeURIComponent(username)}`;

    const { data } = await axios.get(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json"
      },
      timeout: 30000
    });

    if (!data || !data.status) {
      throw new Error("Data tidak ditemukan");
    }

    const result = data.result;
    const channel = result.channelMetadata;
    const videos = (result.videoDataList || []).slice(0, 3);

    let caption = `*YOUTUBE STALK*\n\n`;
    caption += `*Channel:* ${channel.username}\n`;
    caption += `*Subscribers:* ${channel.subscriberCount}\n`;
    caption += `*Total Videos:* ${channel.videoCount}\n`;
    caption += `*Family Safe:* ${channel.isFamilySafe}\n`;
    caption += `*Description:* ${channel.description || "-"}\n`;
    caption += `*Channel URL:* ${channel.channelUrl}\n`;

    if (videos.length > 0) {
      caption += `\n*Latest Videos:*\n`;
      videos.forEach((v, i) => {
        caption += `\n${i + 1}. ${v.title}\n`;
        caption += `👁️ ${v.viewCount} | ⏱️ ${v.duration}\n`;
        caption += `https://youtube.com${v.navigationUrl}\n`;
      });
    }

    if (channel.avatarUrl) {
      await sock.sendMessage(
        m.chat,
        {
          image: { url: channel.avatarUrl },
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
    await reply("Terjadi kesalahan atau channel tidak ditemukan.");
  }
};

handler.command = [
  "ytstalk",
  "youtubestalk",
  "stalkyt",
  "stalkyoutube"
];

export default handler;