import Command from "../../Structures/Command"
import EclipseClient from "../../Structures/EclipseClient"
import { RunCommand } from "../../Structures/Command"

export default class PingCommand extends Command {
    constructor(client: EclipseClient) {
        super(client, {
            name: "ping",
            category: "Outros",
            description: "Mostra o meu ping e o uptime",
        })
    }

    async run({ interaction }: RunCommand) {
        await interaction.deferReply({ ephemeral: true, fetchReply: true })

        const start = Date.now()
        await interaction.followUp({ content: "🏓" })
        const apiPing = Date.now() - start

        await interaction.editReply({
            content: `**Pong!** (Shard ${this.client.ws.shards.first()?.id} - ${this.client.ws.shards.last()?.id})\nMeu ping é de \`${this.client.ws.ping}ms\`. A latencia da API é \`${apiPing}ms\`\n**Uptime:** ${this.client.utils.time(this.client?.uptime ?? 0)}`
        })
    }
}