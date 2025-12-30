import os from 'os';
import nou from 'node-os-utils';
import speed from 'performance-now';

const handler = async (m, { sock }) => {
  async function getServerInfo(m) {
    const timestamp = speed();
    const tio = await nou.os.oos();
    const tot = await nou.drive.info();
    const memInfo = await nou.mem.info();

    const totalGB = (memInfo.totalMemMb / 1024).toFixed(2);
    const usedGB = (memInfo.usedMemMb / 1024).toFixed(2);
    const freeGB = (memInfo.freeMemMb / 1024).toFixed(2);
    const cpuCores = os.cpus().length;
    const vpsUptime = runtime(os.uptime());
    const botUptime = runtime(process.uptime());
    const latency = (speed() - timestamp).toFixed(4);

    const respon = `*server information 💻*
- os platform : ${nou.os.type()}
- ram : ${usedGB}/${totalGB} GB used (${freeGB} GB free)
- disk space : ${tot.usedGb}/${tot.totalGb} GB used
- cpu cores : ${cpuCores} core(s)
- vps uptime : ${vpsUptime}

*bot information 🤖*
- response bot : ${latency} sec
- bot uptime : ${botUptime}
- cpu : ${os.cpus()[0].model}`;

    return m.reply(respon);
  }

  return getServerInfo(m);
};

handler.command = ["ping"];
export default handler;