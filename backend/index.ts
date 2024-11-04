import {config} from "dotenv"
import Fastify, {FastifyInstance} from "fastify"
import {productRouter} from "./router/product-router"
import cors from "@fastify/cors"

config({path: "./.env"})

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 9000

async function startServer(): Promise<void> {
	const app: FastifyInstance = Fastify({logger: true})
	await app.register(cors)
	await app.register(productRouter)

	await startListening(app)
}

async function startListening(app: FastifyInstance): Promise<void> {
	try {
		await app.listen({port: PORT, host: '0.0.0.0'})
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
