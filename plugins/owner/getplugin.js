import fs from "fs"
import path from "path"
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handler = async (m, { sock, isOwner, text, command, reply, totalFitur, totalPlugin, usedPrefix }) => {
  try {
    if (!isOwner) return reply(mess.own);

    const baseDir = path.join(__dirname, "../../plugins");

    if (!text.endsWith(".js")) return reply(`Contoh: *${usedPrefix + command}* command/menu.js\n\nKetik: *${usedPrefix}listplugin* untuk lihat file plugins`);

    const targetPath = path.join(baseDir, text.trim());
    if (!fs.existsSync(targetPath)) return reply("Plugin tidak ditemukan.");

    const fileContent = fs.readFileSync(targetPath, "utf8");
    return reply(fileContent);
  } catch (err) {
    console.error(err);
    return reply("Terjadi kesalahan saat membaca plugin.");
  }
};

handler.command = ["getp", "gp", "getplugin", "getplugins"];
export default handler;