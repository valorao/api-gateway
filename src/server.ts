import Fastify, { FastifyRequest } from 'fastify'
import { routes } from './routes/routes'
import { proxyRoutes } from './routes/proxy'
import { fastifyRateLimit } from '@fastify/rate-limit';
import { rateLimiter } from './lib/rateLimit'

const app = Fastify()
const port = process.env.PORT

app.register(fastifyRateLimit, {
    max: async (request, key) => {
        if (!request.headers['x-api-key']) return 10
        const getLimit = await rateLimiter(request.headers['x-api-key'] as string)
        return getLimit
    },
    timeWindow: 60000,
    continueExceeding: false,
    keyGenerator: async function (request) {
        return (
            request.headers['x-api-key'] || request.ip
        ) as string
    },
    addHeaders: { 'x-ratelimit-limit': true, 'x-ratelimit-remaining': true, 'x-ratelimit-reset': true, 'retry-after': false },
    errorResponseBuilder: (request, context) => ({ statusCode: 429, error: 'Too Many Requests', ip: request.ip, requested: request.originalUrl })
})
app.register(routes);
app.register(proxyRoutes);

app.listen({ port: parseInt(port as string) || 3000, host: '0.0.0.0' }, () => {
    console.log(`API Gateway is ready to receive requests at port: ${port || 3000}`)
})
