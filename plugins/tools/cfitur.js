import fetch from "node-fetch"

class GeminiClient {
  constructor() {
    this.s = null
    this.r = 1
  }

  async init() {
    const res = await fetch("https://gemini.google.com/", {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36"
      }
    })

    const h = await res.text()

    this.s = {
      a: h.match(/"SNlM0e":"(.*?)"/)?.[1] || "",
      b: h.match(/"cfb2h":"(.*?)"/)?.[1] || "",
      c: h.match(/"FdrFJe":"(.*?)"/)?.[1] || ""
    }

    return this.s
  }

  async ask(m) {
    if (!this.s) await this.init()

    const p = [null, JSON.stringify([[m, 0, null, null, null, null, 0]])]
    const q = new URLSearchParams({
      bl: this.s.b,
      "f.sid": this.s.c,
      hl: "id",
      _reqid: this.r++,
      rt: "c"
    })

    const res = await fetch(
      `https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?${q}`,
      {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
          "user-agent":
            "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
          "x-same-domain": "1"
        },
        body: `f.req=${encodeURIComponent(JSON.stringify(p))}&at=${this.s.a}`
      }
    )

    return this.parse(await res.text())
  }

  parse(t) {
    let l = null
    for (const ln of t.split("\n").filter(x => x.startsWith('[["wrb.fr"'))) {
      try {
        const d = JSON.parse(JSON.parse(ln)[0][2])
        if (d[4]?.[0]?.[1]) {
          l = {
            text: Array.isArray(d[4][0][1])
              ? d[4][0][1][0]
              : d[4][0][1]
          }
        }
      } catch {}
    }
    return l
  }
}


function sanitizeCode(text) {
  if (!text) return text

  return text
    // hapus code fence
    .replace(/```[a-zA-Z]*\n?/g, "")
    .replace(/```/g, "")

    // FIX markdown link -> URL polos
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, "$2")

    // FIX escape underscore (PALING PENTING)
    .replace(/\\_/g, "_")

    // FIX escape tilde
    .replace(/\\~/g, "~")

    // FIX escape backslash sisa sebelum karakter non-special
    .replace(/\\([a-zA-Z])/g, "$1")

    // normalisasi arrow function & operator
    .replace(/=\s*\\?>/g, "=>")
    .replace(/\\!/g, "!")
    .replace(/\(\s*!/g, "(!")

    // trim spasi aneh
    .replace(/[ \t]+$/gm, "")
    .trim()
}

const gemini = new GeminiClient()

const basePrompt = `
Kamu adalah mesin generator kode JavaScript ESM untuk plugin bot WhatsApp.

PERATURAN MUTLAK:

- Output HARUS berupa KODE MURNI JavaScript.

- DILARANG menggunakan:

  - \`\`\`

  - kata "javascript"

  - penjelasan, narasi, atau komentar

  - // atau /* */

- dilarang menggunakan \ di bagian code contoh : const handler = async (m, { sock, text, command, usedPrefix }) =\> { , itu salah harusnya : const handler = async (m, { sock, text, command, usedPrefix }) => {

- Output HARUS dimulai langsung dari kode dan diakhiri kode.

- Jika output mengandung \`\`\` atau teks non-kode, MAKA OUTPUT SALAH.

- Kirim kodenya dengan module module yang di perlukan untuk request ke api/scrapenya

ATURAN REQUEST API:
- Kirim pesan awal: "Proses Kak ~ 💫" (Pakai await reply ya untuk teks ini)
- Gunakan async/await
- Gunakan try/catch
- Kode harus clean dan bebas error

VALIDASI DIRI (WAJIB):
Sebelum mengirim output, CEK ULANG:
1. Apakah ada \`\`\`? Jika iya, HAPUS.
2. Apakah ada teks penjelasan? Jika iya, HAPUS.
3. Pastikan output hanya JavaScript valid.

JIKA TIDAK BISA MEMENUHI SEMUA ATURAN, JANGAN KIRIM APA PUN.

CONTOH STRUKTUR YANG BENAR:
const handler = async (m, { sock, text, qtxt, reply, command, usedPrefix }) => {
  const replyText = text
    ? "✅ Test berhasil.\\n\\nInput kamu: " + text
    : "✅ Test berhasil.\\n\\nGunakan:\\n.test halo"

  await sock.sendMessage(
    m.chat,
    {
      text: replyText,
      mentions: [m.sender]
    },
    { quoted: qtxt }
  )
}

handler.command = ["test"]
export default handler

KALO REQUEST KE API SELALU PAKE URLENCODED KALO PARAMSNYA BERUPA LINK/URL DAN JANGAN DUPLIKAT URL ALIAS URL NYA JANGAN GANDA SAAT REQUEST CONTOH DUPLIKAT: 

const response = await fetch('[https://api.baguss.xyz/api/berita/detik](https://api.baguss.xyz/api/berita/detik)')

ITU TIDAK BOLEH, YANG BENER :

const response = await fetch('https://api.baguss.xyz/api/berita/detik')

BUATKAN FITUR SESUAI INPUT USER DI BAWAH INI.
OUTPUT HANYA KODE.
`
const handler = async (m, { sock, text, usedPrefix, command }) => {
  if (!text) {
    return sock.sendMessage(
      m.chat,
      {
        text: `Contoh penggunaan:\n${usedPrefix + command} nama fitur api/scrape`
      },
      { quoted: m }
    )
  }

  const prompt = `${basePrompt}\n\nUser: ${text}\n\nFitur:`

  try {
    await sock.sendPresenceUpdate("composing", m.chat)

    const res = await gemini.ask(prompt)

    const reply = sanitizeCode(res?.text) || "Maaf kak, aku belum bisa jawab 😢"

    sock.sendMessage(

      m.chat,

      {

        text: reply,

        mentions: [m.sender]

      },

      { quoted: m }

    )
  } catch (e) {
    await sock.sendMessage(
      m.chat,
      {
        text: "⚠️ Maaf kak, sistem sedang sibuk. Coba lagi sebentar ya 😊"
      },
      { quoted: m }
    )
  }
}

handler.command = ["cfitur"]
export default handler