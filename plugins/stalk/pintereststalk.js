import axios from "axios";

/* =======================
   PINTEREST STALK FUNCTION
   ======================= */
async function pinterestStalk(username, cookies = "") {
  if (!username) throw new Error("Username cannot be empty");

  const baseURL = "https://www.pinterest.com";
  const headers = {
    accept: "application/json, text/javascript, */*; q=0.01",
    referer: "https://www.pinterest.com/",
    "user-agent": "Postify/1.0.0",
    "x-app-version": "xxx",
    "x-pinterest-appstate": "active",
    "x-pinterest-pws-handler": `www/${username}/[slug].js`,
    "x-pinterest-source-url": `/${username}/`,
    "x-requested-with": "XMLHttpRequest",
    cookie: cookies
  };

  const client = axios.create({ baseURL, headers });

  if (!cookies) {
    try {
      const res = await client.get("/");
      const setCookies = res.headers["set-cookie"];
      if (setCookies) {
        cookies = setCookies.map(c => c.split(";")[0].trim()).join("; ");
        client.defaults.headers.cookie = cookies;
      }
    } catch {
      throw new Error("Failed to initialize cookies");
    }
  }

  const params = {
    source_url: `/${username}/`,
    data: JSON.stringify({
      options: {
        username,
        field_set_key: "profile",
        isPrefetch: false
      },
      context: {}
    }),
    _: Date.now()
  };

  const { data } = await client.get("/resource/UserResource/get/", { params });

  if (!data?.resource_response?.data)
    throw new Error("User not found");

  const userx = data.resource_response.data;

  return {
    id: userx.id,
    username: userx.username,
    full_name: userx.full_name || "",
    bio: userx.about || "",
    profile_url: `https://pinterest.com/${userx.username}`,
    stats: {
      pins: userx.pin_count || 0,
      followers: userx.follower_count || 0,
      following: userx.following_count || 0,
      boards: userx.board_count || 0,
      likes: userx.like_count || 0
    },
    image: {
      small: userx.image_small_url || null,
      medium: userx.image_medium_url || null,
      large: userx.image_large_url || null,
      original: userx.image_xlarge_url || null
    },
    website: userx.website_url || null,
    social_links: {
      twitter: userx.twitter_url || null,
      facebook: userx.facebook_url || null,
      instagram: userx.instagram_url || null
    }
  };
}

/* =======================
   BOT HANDLER
   ======================= */
const handler = async (m, { sock, text, qtxt, reply, command, usedPrefix }) => {
  if (!text) {
    return reply(
      `Gunakan format:\n${usedPrefix + command} username\nContoh: ${usedPrefix + command} pinterest`
    );
  }

  await reply("Proses Kak ~ 💫");

  try {
    const username = text.replace(/^@/, "").trim();
    const data = await pinterestStalk(username);

    let caption = `*PINTEREST STALK*\n\n`;
    caption += `*Username:* ${data.username}\n`;
    caption += `*Full Name:* ${data.full_name || "-"}\n`;
    caption += `*Followers:* ${data.stats.followers.toLocaleString()}\n`;
    caption += `*Following:* ${data.stats.following.toLocaleString()}\n`;
    caption += `*Pins:* ${data.stats.pins.toLocaleString()}\n`;
    caption += `*Boards:* ${data.stats.boards.toLocaleString()}\n`;
    caption += `*Likes:* ${data.stats.likes.toLocaleString()}\n`;
    caption += `*Bio:* ${data.bio || "-"}\n`;
    caption += `*Profile:* ${data.profile_url}\n`;

    if (data.website) {
      caption += `*Website:* ${data.website}\n`;
    }

    const imageUrl =
      data.image.original ||
      data.image.large ||
      data.image.medium ||
      data.image.small;

    if (imageUrl) {
      await sock.sendMessage(
        m.chat,
        {
          image: { url: imageUrl },
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

handler.command = ["pinstalk", "pintereststalk", "stalkpin"];
export default handler;