import { FastifyInstance } from "fastify";
import { fastifyHttpProxy } from '@fastify/http-proxy';
import { findKey } from '../lib/prisma';

export async function proxyRoutes(app: FastifyInstance) {
    const rsoAPIURL = process.env.RSO_API_UPSTREAM
    const vlrggAPIURL = process.env.VLRGG_API_UPSTREAM
    const mailAPIURL = process.env.MAIL_API_UPSTREAM

    if (rsoAPIURL) {
        app.register((fastifyHttpProxy), {
            upstream: rsoAPIURL,
            prefix: '/v1/val',
            rewritePrefix: '/v1/riot',
            replyOptions: {
                onResponse: (request, reply, res) => {
                    reply
                        .header('X-Proxied-By', 'Trafalgar')
                        .header('X-Resolver', 'cloudflare')
                        .send(res)
                }
            },
            preValidation: async (request, reply) => {
                if (request.headers['x-api-key']) {
                    const check = await findKey(request.headers['x-api-key'] as string)
                    if (!check) return reply.code(403).send({ status: 403, message: 'This API Key is not valid' })
                } else {
                    return reply.code(400).send({ status: 400, message: 'Missing API Key' })
                }
            },
        })
    }
    if (vlrggAPIURL) {
        app.register((fastifyHttpProxy), {
            upstream: vlrggAPIURL,
            prefix: '/v1/vlr',
            rewritePrefix: '/v1/vlr',
            replyOptions: {
                onResponse: (request, reply, res) => {
                    reply
                        .header('X-Proxied-By', 'Trafalgar')
                        .header('X-Resolver', 'cloudflare')
                        .send(res)
                }
            },
            preValidation: async (request, reply) => {
                if (request.headers['x-api-key']) {
                    const check = await findKey(request.headers['x-api-key'] as string)
                    if (!check) return reply.code(403).send({ status: 403, message: 'This API Key is not valid' })
                } else {
                    return reply.code(400).send({ status: 400, message: 'Missing API Key' })
                }
            },
        })
    }
    if (mailAPIURL) {
        app.register((fastifyHttpProxy), {
            upstream: mailAPIURL,
            prefix: '/cloud-mail',
            replyOptions: {
                onResponse: (request, reply, res) => {
                    reply
                        .header('X-Proxied-By', 'Trafalgar')
                        .header('X-Resolver', 'cloudflare')
                        .send(res)
                }
            },
        })
    }
}