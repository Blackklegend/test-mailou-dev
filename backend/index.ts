import {config} from "dotenv"
import Fastify, {FastifyInstance} from "fastify"
import {productRouter} from "./router/product-router"
import cors from '@fastify/cors'

config({path: "./.env"})

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000

async function startServer(): Promise<void> {
	const app: FastifyInstance = Fastify({logger: true})
	await app.register(cors)

	await registerRoutes(app)
	await startListening(app)
}

async function registerRoutes(app: FastifyInstance): Promise<void> {
	app.get("/", async () => "Hello world")
	await app.register(productRouter)
}

async function startListening(app: FastifyInstance): Promise<void> {
	try {
		await app.listen({port: PORT})
		console.log(`Server is running on port ${PORT}`)
	} catch (err) {
		app.log.error(err)
		process.exit(1)
	}
}

startServer().catch((err) => {
	console.error("Failed to start server:", err)
	process.exit(1)
})
