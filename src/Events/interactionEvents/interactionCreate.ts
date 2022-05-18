import Event from "../../Structures/Event"
import { Interaction, GuildMember, ChatInputCommandInteraction, PermissionsBitField } from "discord.js"
import Command, { RunCommand } from "../../Structures/Command"
import EclipseClient from "../../Structures/EclipseClient"

export default class InteractionCreateEvent extends Event {


    constructor(client: EclipseClient) {
        super(client, {
            name: "interactionCreate",
        })
    }

    async run(interaction: Interaction) {

        if (interaction.isChatInputCommand()) {

            const command = this.client.commands.get(interaction.commandName) ?? this.client.commands.get(interaction.options.getSubcommand())

            if (command) {

                command.ephemeral ? await interaction.deferReply({ ephemeral: true, fetchReply: true }) : await interaction.deferReply({ fetchReply: true })

                if (command.ownerOnly && !this.client.utils.checkOwner(interaction.user.id)) {
                    return interaction.followUp(":x: | Você não pode usar este comando!")
                }

                if (!interaction?.inGuild()) {
                    return interaction.followUp(":x: | Esté comando não pode ser usado fora de um servidor!")
                }

                if (interaction?.inGuild()) {
                    if (!InteractionCreateEvent.checkBotPermissions(interaction, command)) return;
                    if (!InteractionCreateEvent.checkMemberPermissions(interaction, command)) return;
                }

                try {
                    command?.run({ interaction } as RunCommand)
                } catch (error) {
                    return interaction.followUp(`⚠️ | Um erro aconteceu\n\`\`\`js\n${error}\`\`\``)
                }
            }
        }
    }

    static checkBotPermissions(interaction: ChatInputCommandInteraction, command: Command): boolean {
        if (command.botPerms.length == 0) return true;
        if (!interaction.guild?.members.me?.permissions.has(command.botPerms)) {
            const permissions = new PermissionsBitField(command.botPerms)
                .toArray()
                .map(p => p)
                .join(', ')
            interaction.reply({
                content: `❌ | Está me faltando permissões para rodar o comando \`${permissions.toString()}\``,
                ephemeral: true
            })
            return false;
        }
        return true;
    }

    static checkMemberPermissions(interaction: ChatInputCommandInteraction, command: Command): boolean {
        if (command.userPerms.length == 0) return true;
        if (!(interaction.member as GuildMember).permissions.has(command.userPerms)) {
            const permissions = new PermissionsBitField(command.userPerms)
                .toArray()
                .map(p => p)
                .join(', ')
            interaction.reply({
                content: `❌ | Você não pode usar esté comando pois está te faltando permissões \`${permissions.toString()}\``,
                ephemeral: true
            })
            return false;
        }
        return true;
    }
}