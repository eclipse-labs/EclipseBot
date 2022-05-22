import Command, { RunCommand } from "../../Structures/Command"
import EclipseClient from "../../Structures/EclipseClient"

export default class ForceSkipCommand extends Command {
    constructor(client: EclipseClient) {
        super(client, {
            name: "force",
            description: "Skipa a música tocando no momento",
            usage: "skip",
            category: "DJ",
            djOnly: true
        })
    }

    async run({ interaction }: RunCommand) {

        const player = this.client.music.players.get(interaction.guild?.id ?? "")

        if (player?.trackRepeat) player?.setTrackRepeat(false)
        if (player?.queueRepeat) player?.setQueueRepeat(false)
        player?.stop()
        interaction.followUp({
            content: `✅ | **${player?.queue.current?.title}** Pulada (Solicitado por **${interaction.user.username}**)`
        })
    }
}