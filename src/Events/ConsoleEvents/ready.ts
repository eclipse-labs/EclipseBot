import { WebhookClient } from "discord.js"
import { inspect } from "util"
import Event from "../../Structures/Event"
import EclipseClient from "../../Structures/EclipseClient"
import Logger from "../../Utils/Logger"
import { hooks } from "../../Utils/Config"
import { DatabaseManager } from "../../Database/index"

declare global {
    var db: DatabaseManager
    var mostPlayed: DatabaseManager
}

global.mostPlayed = new DatabaseManager("mostPlayed")
global.db = new DatabaseManager("db")

export default class ReadyEvent extends Event {

    constructor(client: EclipseClient) {
        super(client, {
            name: "ready",
        })
    }

    async run() {

        this.client.music.init(this.client.user?.id)

        this.client.user?.setPresence({
            activities: [{
                name: `Shard ${this.client.ws.shards.first()?.id} - ${this.client.ws.shards.last()?.id}`,
            }]
        })


        if (hooks.status.sendLogs) {
            new WebhookClient({
                url: hooks.status.cluster
            }).send({
                embeds: [{
                    title: `Cluster ${this.client.cluster.id} está online!`,
                    description: `Shards ${this.client.ws.shards.first()?.id} - ${this.client.ws.shards.last()?.id} estão operando!`,
                }]
            })
        }

        Logger.ready("Client is ready!")

        process.on("unhandledRejection", async (err) => {
            console.log(err)

            if (hooks.status.sendLogs) {
                new WebhookClient({
                    url: hooks.status.cluster
                }).send({
                    content: await (this.client.utils.fetchOwners(this.client.owners, false)),
                    embeds: [{
                        title: `:warning: | Um erro aconteceu!`,
                        description: "```ts\n" + inspect(err, { depth: 0 }) + "```"
                    }]
                })
            }
        })

        process.on("uncaughtException", async (err) => {
            console.log(err)

            if (hooks.status.sendLogs) {
                new WebhookClient({
                    url: hooks.status.cluster
                }).send({
                    content: await (this.client.utils.fetchOwners(this.client.owners, false)),
                    embeds: [{
                        title: `:warning: | Um erro aconteceu!`,
                        description: "```ts\n" + inspect(err, { depth: 0 }) + "```"
                    }]
                })
            }
        })
    }
}