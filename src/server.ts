import Fastify from 'fastify';
import fastifyCaching from '@fastify/caching';
import { routes } from './routes/routes';
import { proxyRoutes } from './routes/proxy';

const app = Fastify()
const port = process.env.PORT
app.register(fastifyCaching, {
    serverExpiresIn: 30,
    expiresIn: 30,
})
app.register(routes)
app.register(proxyRoutes)

app.listen({ port: parseInt(port as string) || 3000 }, () => {
    console.log(`API Gateway is ready to receive requests at port: ${port || 3000}`)
})
