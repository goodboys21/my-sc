/*

   ~ Shota BASED
  > Jangan lupa baca README.md <

*/

import fs from "fs";
import chalk from "chalk";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);

// ~~ setting pairing kode ~~
global.pairingKode = "BAGUSAPI" //pairing kode

// ~~ setting bot ~~
global.owner = "6283893773129" //pemilik bot
global.owner2 = [
"6283893773129",
"6283893773129",
"6283893773129"
] //buat fitur bot mode on atau off 

global.url = "https://api.baguss.xyz"
global.footer = `© Bagus Xixepen`

global.namaOwner = "- bagus xixepen"
global.namaBot = "Stoic - Botz"

// ~~ setting saluran ~~
global.idChanel = "120363420389509771@newsletter"
global.namaChanel = "Stoic - Information"

// ~~ setting foto ~~
global.thumb = "https://raw.githubusercontent.com/bagus-api/storage/master/zBAR8.jpg"
global.foto = "https://raw.githubusercontent.com/bagus-api/storage/master/o6Ona.jpg"

global.mess = {
 owner: "*[REJECT]* - ONLY OWNER",
 admin: "*[REJECT]* - ONLY ADMINS GROUPS",
 botAdmin: "*[REJECT]* - BOT HARUS ADMIN",
 group: "*[REJECT]* - ONLY IN THE GROUP",
 sewa: "*[REJECT]* - ONLY USER PREMIUM",
 vip: "*[REJECT]* - ONLY ONWER & PREMIUM USERS",
 ownadmin: "*[REJECT]* - ONLY OWNER & ADMINS"
}

fs.watchFile(__filename, () => {
    fs.unwatchFile(__filename);
    console.log(chalk.white.bold("~> Update File :"), chalk.green.bold(__filename));
    import(`${pathToFileURL(__filename).href}?update=${Date.now()}`);
});