import { FastifyInstance, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { fromError } from "zod-validation-error";
import { createKey, deleteKey, findKeys } from "../lib/prisma";
import { createApiSchema } from "../lib/zodSchema";

const masterKey = process.env.MASTER_KEY

export async function routes(router: FastifyInstance) {
    router.post('/api/manage/keys', async (request, reply) => {
        if (request.headers.authorization?.includes(masterKey as string)) {
            try {
                const { name, email, keyName } = createApiSchema.parse(request.body);
                const createApiKey = await createKey({ name, email, keyName })
                return createApiKey
            } catch (err) {
                if (err instanceof ZodError) {
                    const validationError = fromError(err)
                    return reply.code(400).send({ error: validationError.toString() })
                } else return reply.code(500).send({ error: err })
            }
        }
        return reply.code(403).send({ message: 'Missing Authorization key' })
    })

    type deleteKeyBody = {
        apiKey: string
        email: string
    }

    router.delete('/api/manage/keys', async (request: FastifyRequest<{ Body: deleteKeyBody }>, reply) => {
        if (request.headers.authorization?.includes(masterKey as string)) {
            const { apiKey, email } = request.body
            const deleteKeys = await deleteKey({ apiKey, email })
            return deleteKeys
        }
        return reply.code(403).send({ message: 'Missing Authorization key' })
    })

    router.get('/api/manage/keys', async (request: FastifyRequest<{ Headers: deleteKeyBody }>, reply) => {
        if (request.headers.authorization?.includes(masterKey as string)) {
            const { email } = request.headers
            const getKeys = await findKeys({ email })
            return getKeys
        }
        return reply.code(403).send({ message: 'Missing Authorization key' })
    })
}