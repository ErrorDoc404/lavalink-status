const { Client, EmbedBuilder, ActivityType  } = require("discord.js");
const { logs } = require("../config.js");
const si = require('systeminformation');
const os = require("node:os");
const pretty = require('prettysize');
const moment = require("moment");
const fetch = require('node-fetch');
const fs = require('fs');
require("moment-duration-format");
/**
 *
 * @param {Client} client
 */
module.exports = async (client) => {
    client.manager.init(client.user.id);
    console.log(`${client.user.username} online!`);
    client.user.setPresence({
      activities: [{ name: `Lavalink Server`, type: ActivityType.Competing }],
      status: 'dnd',
    });

    const channel = await client.channels.fetch(logs);


    let cl = await si.currentLoad();
    const embed = new EmbedBuilder()
        .setColor("#2F3136")
        .setDescription("Please wait for a minute!\nStatus is being ready!")
    channel.bulkDelete(10);
    channel.send({ embeds: [embed] }).then((msg) => {
        setInterval(async () => {

            let netdata = await si.networkStats();
            let memdata = await si.mem();
            let diskdata = await si.fsSize();
            let osdata = await si.osInfo();
            let cpudata = await si.cpu();
            let uptime = await os.uptime();

            // console.log(client.manager.nodes);

            const rembed = new EmbedBuilder()
                // .setDescription(`__**Server Information**__`)
                .addFields([
                    {
                        name: "**Lavalink**",
                        value: `\`\`\`nim\n${client.manager.nodes.map((node) =>
                            `\n\n\nNode : ${node.connected ? "🟢 Online" : "🔴 Offline"}
Host : '${node.options.host}'
Port : '${node.options.port}'
Password : '${node.options.password}'
Secure : '${node.options.secure}'
version: '${node.version}'
Memory Usage : ${formatBytes(node.stats.memory.allocated)} - ${node.stats.cpu.lavalinkLoad.toFixed(2)}%
Connections : ${node.stats.playingPlayers} / ${node.stats.players}
Uptime : ${moment(node.stats.uptime).format(
                                "D[ days], H[ hours], M[ minutes], S[ seconds]"
                            )}`)}\`\`\``,
                          inline: true
                    },
                ])
                .setColor("#2F3136")
                .setFooter({ text: `Update at ` })
                .setTimestamp(Date.now());
            msg.edit({ embeds: [rembed] });

        }, 5000);
    })

}

function uptimer(seconds) {
    seconds = seconds || 0;
    seconds = Number(seconds);
    seconds = Math.abs(seconds);

    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var parts = new Array();

    if (d > 0) {
        var dDisplay = d > 0 ? d + ' ' + (d == 1 ? "day" : "days") : "";
        parts.push(dDisplay);
    }

    if (h > 0) {
        var hDisplay = h > 0 ? h + ' ' + (h == 1 ? "hour" : "hours") : "";
        parts.push(hDisplay)
    }

    if (m > 0) {
        var mDisplay = m > 0 ? m + ' ' + (m == 1 ? "minute" : "minutes") : "";
        parts.push(mDisplay)
    }

    if (s > 0) {
        var sDisplay = s > 0 ? s + ' ' + (s == 1 ? "second" : "seconds") : "";
        parts.push(sDisplay)
    }

    return parts.join(', ', parts);
}
function formatBytes(bytes) {
    if (bytes === 0) return "0 B";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    return `${(
        bytes / Math.pow(1024, Math.floor(Math.log(bytes) / Math.log(1024)))
    ).toFixed(2)} ${sizes[Math.floor(Math.log(bytes) / Math.log(1024))]}`;
}
