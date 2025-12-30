import axios from "axios";

/* =======================
   GITHUB STALK FUNCTION
   ======================= */
async function githubStalk(username) {
  if (!username) throw new Error("Username cannot be empty");

  const { data } = await axios.get(
    `https://api.github.com/users/${encodeURIComponent(username)}`,
    {
      headers: {
        "User-Agent": "github-scraper-bagus",
        "Accept": "application/vnd.github+json"
      },
      timeout: 30000
    }
  );

  return {
    status: true,
    creator: "Bagus Bahril",
    username: data.login || null,
    nickname: data.name || null,
    bio: data.bio || null,
    id: data.id || null,
    nodeId: data.node_id || null,
    profile_pic: data.avatar_url || null,
    url: data.html_url || null,
    type: data.type || null,
    admin: data.site_admin || false,
    company: data.company || null,
    blog: data.blog || null,
    location: data.location || null,
    email: data.email || null,
    public_repo: data.public_repos || 0,
    public_gists: data.public_gists || 0,
    followers: data.followers || 0,
    following: data.following || 0,
    created_at: data.created_at || null,
    updated_at: data.updated_at || null
  };
}

/* =======================
   BOT HANDLER
   ======================= */
const handler = async (m, { sock, text, qtxt, reply, command, usedPrefix }) => {
  if (!text) {
    return reply(
      `Gunakan format:\n${usedPrefix + command} username\nContoh: ${usedPrefix + command} torvalds`
    );
  }

  await reply("Proses Kak ~ 💫");

  try {
    const username = text.replace(/^@/, "").trim();
    const data = await githubStalk(username);

    let caption = `*GITHUB STALK*\n\n`;
    caption += `*Username:* ${data.username}\n`;
    caption += `*Name:* ${data.nickname || "-"}\n`;
    caption += `*Bio:* ${data.bio || "-"}\n`;
    caption += `*Followers:* ${data.followers.toLocaleString()}\n`;
    caption += `*Following:* ${data.following.toLocaleString()}\n`;
    caption += `*Public Repo:* ${data.public_repo.toLocaleString()}\n`;
    caption += `*Public Gists:* ${data.public_gists.toLocaleString()}\n`;
    caption += `*Company:* ${data.company || "-"}\n`;
    caption += `*Location:* ${data.location || "-"}\n`;
    caption += `*Blog:* ${data.blog || "-"}\n`;
    caption += `*Profile:* ${data.url}\n`;
    caption += `*Created At:* ${new Date(data.created_at).toLocaleString()}\n`;
    caption += `*Updated At:* ${new Date(data.updated_at).toLocaleString()}\n`;

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
    if (err.response?.status === 404) {
      return reply("Akun GitHub tidak ditemukan.");
    }
    await reply("Terjadi kesalahan saat mengambil data GitHub.");
  }
};

handler.command = ["gitstalk", "githubstalk", "stalkgithub"];
export default handler;