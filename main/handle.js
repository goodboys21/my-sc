/*

   ~ Shota BASED
  > Jangan lupa baca README.md <

*/

process.on("uncaughtException", (err) => {
console.error("Caught exception:", err);
});

import fs from "fs";
import { fileTypeFromBuffer } from 'file-type';
import chalk from "chalk";
import { fileURLToPath, pathToFileURL } from "url";
import util from "util";
import axios from "axios";
import * as cheerio from "cheerio";
import fetch from "node-fetch";
import * as ssh2 from "ssh2";
import * as Obfus from "js-confuser";
import * as ytdl from "@vreden/youtube_scraper";
import yts from 'yt-search';
import FormData from 'form-data';
import path from "path";
import { exec, spawn, execSync } from 'child_process';
import similarity from "similarity";

//=============================================//
import { handleMessage, getPluginStats } from "./plugins.js"

const owners = JSON.parse(fs.readFileSync("./data/owner.json"))
const fitur = JSON.parse(fs.readFileSync('./data/setbot.json'));

//=============================================//
export async function caseHandler(sock, m, chatUpdate) {
const body = (
  m.mtype === "conversation" ? m.message.conversation :
  m.mtype === "imageMessage" ? m.message.imageMessage.caption :
  m.mtype === "videoMessage" ? m.message.videoMessage.caption :
  m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text :
  m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId :
  m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
  m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId :
  m.mtype === "interactiveResponseMessage" ? JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id :
  ""
) || "";
try {

//=============================================//
const prefix = ".";
const isCmd = body?.startsWith(prefix)
const quoted = m.quoted ? m.quoted : m
const mime = quoted?.msg?.mimetype || quoted?.mimetype || null
const args = body.trim().split(/ +/).slice(1)
const qmsg = (m.quoted || m)
const q = args.join(" ");
const text = q;
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''

//=============================================//
const botNumber = await sock.decodeJid(sock.user.id);
const isOwner = [botNumber, owner+"@s.whatsapp.net", ...owners].includes(m.sender) ? true : m.isDeveloper ? true : false

//=============================================//
// ** fungsi untuk group chat **
const groupMetadata = m?.isGroup ? await sock.groupMetadata(m.chat).catch(() => ({})) : {};
const groupName = m?.isGroup ? groupMetadata.subject || '' : '';
const participants = m?.isGroup ? groupMetadata.participants?.map(p => {
            let admin = null;
            if (p.admin === 'superadmin') admin = 'superadmin';
            else if (p.admin === 'admin') admin = 'admin';
            return {
                id: p.id || null,
                jid: p.jid || null,
                admin,
                full: p
            };
        }) || []: [];
const groupOwner = m?.isGroup ? participants.find(p => p.admin === 'superadmin')?.jid || '' : '';
const groupAdmins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(p => p.jid || p.id);

const isBotAdmin = groupAdmins.includes(botNumber);
const isAdmin = groupAdmins.includes(m.sender);

//=============================================//
// ** fake quoted **
const qtxt = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "0@s.whatsapp.net"
    },
    message: {
        newsletterAdminInviteMessage: {
            newsletterJid: "123@newsletter",
            newsletterName: "x",
            caption: `${global.namaOwner}`,
            inviteExpiration: "1757494779"
        }
    }
};

const fakeMsg = { key: { fromMe: false, participant: "0@s.whatsapp.net", ...(m.chat ? { remoteJid: "13135550202@s.whatsapp.net" } : {}) }, message: { "pollCreationMessageV3": { "name": `${global.namaOwner}`, "options": [ { "optionName": "1" }, { "optionName": "2" } ], "selectableOptionsCount": 1 }}};

//=============================================//
const botUptime = runtime(process.uptime());

const reply = m.reply = async (teks) => {
  return sock.sendMessage(m.chat, {
    text: `${teks}`,
    mentions: [m.sender],
    contextInfo: {
      externalAdReply: {
        title: `${namaBot}`,
        body: `${runtime(process.uptime())}`,
        thumbnailUrl: global.foto,
        sourceUrl: global.url,
      }
    }
  }, { quoted:qtxt });
};

const example = (teks) => {
return `Cara pengguna:\n*${prefix+command}* ${teks}`
}

//=============================================//
// ** handle agar plugin bisa di pke **
const handleData = { text, args, isCmd, mime, qmsg, isOwner, command, qtxt, fakeMsg, reply, example, prefix, isBotAdmin, getPluginStats, botNumber } // tambah sesuai kebutuhan 

if (isCmd) {
  await handleMessage(m, sock, command, handleData);
}

//=============================================//
// ** desain console.log panel **
if (isCmd) {
  const from = m.key.remoteJid;
  const chatType = from.endsWith("@g.us") ? "GROUP" : "PRIVATE";
 
  const fullCommand = `${prefix}${command}`; 
  
  const logMessage = 
    chalk.bgCyan.white.bold(`\n [ COMMAND RECEIVED ] `) + 
    chalk.white(`\n • Message:   `) + chalk.yellow.bold(fullCommand) +
    chalk.white(`\n • Chat In:   `) + chalk.magenta(chatType) +
    chalk.white(`\n • Name:      `) + chalk.cyan(m.pushName || 'N/A') + 
    chalk.white(`\n • Sender ID: `) + chalk.blue(m.sender) + '\n';
  console.log(logMessage);
}

//=============================================//
// ## End Code ## //
if (m.text.startsWith("ambilq") || m.text.startsWith("q")) {
    if (!isOwner) return reply(mess.owner);

    try {
        if (!m.quoted) return reply("Balas pesan yang ingin kamu ambil (quoted).");
        const result = m.quoted.fakeObj?.message || "Tidak ditemukan isi quoted.";
        const output = typeof result !== "string" ? util.inspect(result, { depth: 3 }) : result;

        return sock.sendMessage(
            m.chat,
            { text: util.format(output) },
            { quoted: m }
        );
    } catch (err) {
        return sock.sendMessage(
            m.chat,
            { text: util.format(err) },
            { quoted: m }
        );
    }
}

if (m.text.startsWith("eval")) {
    if (!isOwner) return reply(mess.owner);

    try {
        const result = await eval(`(async () => { ${text} })()`);
        const output = typeof result !== "string" ? util.inspect(result) : result;
        return sock.sendMessage(m.chat, { text: util.format(output) }, { quoted: m });
    } catch (err) {
        return sock.sendMessage(m.chat, { text: util.format(err) }, { quoted: m });
    }
}

if (m.text.startsWith(">")) {
    if (!isOwner) return reply(mess.owner);

    try {
        let result = await eval(text);
        if (typeof result !== "string") result = util.inspect(result);
        return sock.sendMessage(m.chat, { text: util.format(result) }, { quoted: m });
    } catch (err) {
        return sock.sendMessage(m.chat, { text: util.format(err) }, { quoted: m });
    }
}

if (m.text.startsWith('$')) {
    if (!isOwner) return reply(mess.owner);
    
    exec(m.text.slice(2), (err, stdout) => {
        if (err) {
            return sock.sendMessage(m.chat, { text: err.toString() }, { quoted: m });
        }
        if (stdout) {
            return sock.sendMessage(m.chat, { text: util.format(stdout) }, { quoted: m });
        }
    });
}

// ** lapor bila ada error **
} catch (err) {
console.log(err)
await sock.sendMessage(global.owner+"@s.whatsapp.net", {text: err.toString()}, {quoted: m})
}}

//=============================================//
const __filename = fileURLToPath(import.meta.url);
fs.watchFile(__filename, () => {
    fs.unwatchFile(__filename);
    console.log(chalk.white.bold("~> Update File :"), chalk.green.bold(__filename));
    import(`${pathToFileURL(__filename).href}?update=${Date.now()}`);
});