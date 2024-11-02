import Fastify from 'fastify'
import { connectDb } from './db'
import pg from 'pg';
import { configDotenv } from 'dotenv';


configDotenv({path: "./.env"})

const client = new pg.Client({
	connectionString: process.env.DATABASE_URL
});

async function startServer() {
	const app = Fastify({ logger: true })

	app.get('/', (req, res) => {
			res.send("Hello world")
	})

	await connectDb(client)

	app.listen({port: 3000}, (err, address) => {
		if (err) {
			app.log.error(err)
			process.exit(1)
		}
	})
}

startServer()