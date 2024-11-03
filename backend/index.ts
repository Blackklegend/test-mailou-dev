import { configDotenv } from 'dotenv'
import Fastify, { FastifyReply, FastifyRequest } from 'fastify'

configDotenv({path: "./.env"})

async function startServer() {
	const app = Fastify({ logger: true })

	app.get('/', (req: FastifyRequest, res: FastifyReply) => {
			res.send("Hello world")
	})

	app.listen({port: 3000}, (err, address) => {
		if (err) {
			app.log.error(err)
			process.exit(1)
		}
	})
}

startServer()