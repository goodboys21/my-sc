import fs from "fs"
const path = "./data/setbot.json";

const handler = async (m, { sock, isOwner, command }) => {
  const data = JSON.parse(fs.readFileSync(path));

  switch (command) {
    case "bot-on":
      if (!isOwner) return m.reply(mess.owner)
      if (data.botActive) return m.reply("Bot udah online");
      data.botActive = true;
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      return m.reply("[BOT - ON] • *Semua pengguna dapat menggunakan bot!*")

    case "bot-off":
      if (!isOwner) return m.reply(mess.owner)
      if (!data.botActive) return m.reply("Bot udah offline!");
      data.botActive = false;
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      return m.reply("[BOT OFF] • *Bot offline hanya dapat di akses owner!*");

    case "bot":
      return m.reply(`*Status Bot:* ${data.botActive ? "✅ ON" : "🔴 OFF"}

*INFORMASI 📢*
[✅] *ON* - All pengguna dapat menggunakan bot 
[🔴] *OFF* - Hanya owner yang dapat menggunakan!
`);
  }
};

handler.command = ["bot-on", "bot-off", "bot"];
export default handler;