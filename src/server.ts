import Fastify from 'fastify';
import { routes } from './routes/routes';
import { proxyRoutes } from './routes/proxy';

const app = Fastify()
const port = process.env.PORT
app.register(routes)
app.register(proxyRoutes)

app.listen({ port: parseInt(port as string) || 3000 }, () => {
    console.log('Server running')
})
