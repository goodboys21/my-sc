import axios from "axios";
import * as cheerio from "cheerio";

/* =========================
   HELPER STAT
   ========================= */
function getStatCount(statArray, actionType) {
  if (!Array.isArray(statArray)) return 0;
  const stat = statArray.find(
    s => s.interactionType?.["@type"]?.includes(actionType)
  );
  return stat ? Number(stat.userInteractionCount) || 0 : 0;
}

/* =========================
   SCRAPE PROFILE
   ========================= */
function scrapeProfileData($) {
  const script = $("#Person").html();
  if (!script) return null;

  const jsonData = JSON.parse(script);
  const profile = jsonData.mainEntity;

  return {
    name: profile.name || "",
    username: profile.alternateName || "",
    bio: profile.description || "",
    profile_pic: profile.image || null,
    followers: getStatCount(
      profile.interactionStatistic,
      "FollowAction"
    ),
    total_likes: getStatCount(
      profile.interactionStatistic,
      "LikeAction"
    ),
    total_videos:
      Number(profile.agentInteractionStatistic?.userInteractionCount) || 0
  };
}

/* =========================
   SCRAPE VIDEOS
   ========================= */
function scrapeVideoData($) {
  const script = $("#ItemList").html();
  if (!script) return [];

  const jsonData = JSON.parse(script);
  const videos = jsonData.itemListElement.slice(0, 3);

  return videos.map(v => ({
    title: v.name || "",
    description: v.description || "",
    page_url: v.url,
    video_url: v.contentUrl,
    thumbnail: v.thumbnailUrl?.[0] || null,
    upload_date: v.uploadDate || null,
    views: getStatCount(v.interactionStatistic, "WatchAction"),
    likes: getStatCount(v.interactionStatistic, "LikeAction"),
    shares: getStatCount(v.interactionStatistic, "ShareAction")
  }));
}

/* =========================
   MAIN SCRAPER
   ========================= */
async function snackVideoStalk(username) {
  const url = `https://www.snackvideo.com/@${username}?page_source=new_discover`;

  const { data: html } = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
  });

  const $ = cheerio.load(html);

  const profile = scrapeProfileData($);
  const videos = scrapeVideoData($);

  if (!profile) throw new Error("User not found");

  return { profile, videos };
}

/* =========================
   BOT HANDLER
   ========================= */
const handler = async (m, { sock, text, qtxt, reply, command, usedPrefix }) => {
  if (!text) {
    return reply(
      `Gunakan format:\n${usedPrefix + command} username\nContoh: ${usedPrefix + command} snackvideoid`
    );
  }

  await reply("Proses Kak ~ 💫");

  try {
    const username = text.replace(/^@/, "").trim();
    const data = await snackVideoStalk(username);

    let caption = `*SNACKVIDEO STALK*\n\n`;
    caption += `*Username:* ${data.profile.username}\n`;
    caption += `*Name:* ${data.profile.name}\n`;
    caption += `*Followers:* ${data.profile.followers.toLocaleString()}\n`;
    caption += `*Total Likes:* ${data.profile.total_likes.toLocaleString()}\n`;
    caption += `*Total Videos:* ${data.profile.total_videos.toLocaleString()}\n`;
    caption += `*Bio:* ${data.profile.bio || "-"}\n`;

    if (data.videos.length > 0) {
      caption += `\n*Latest Videos:*\n`;
      data.videos.forEach((v, i) => {
        caption += `\n${i + 1}. ${v.title || "Untitled"}\n`;
        caption += `👁️ ${v.views.toLocaleString()} | ❤️ ${v.likes.toLocaleString()} | 🔁 ${v.shares.toLocaleString()}\n`;
        caption += `${v.page_url}\n`;
      });
    }

    if (data.profile.profile_pic) {
      await sock.sendMessage(
        m.chat,
        {
          image: { url: data.profile.profile_pic },
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

handler.command = ["snackvideostalk", "snackstalk", "stalksnack"];
export default handler;