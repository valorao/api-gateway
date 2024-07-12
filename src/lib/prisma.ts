import { PrismaClient } from '@prisma/client'
import { z, ZodError } from 'zod';
import { createApiSchema } from './zodSchema';
import { generateApiKey } from './generateApiKey';
import { fromError } from 'zod-validation-error';
type CreateKeyProps = z.infer<typeof createApiSchema>
const prisma = new PrismaClient();

const createKey = async ({ name, email, keyName }: CreateKeyProps) => {
    try {
        const parse = createApiSchema.parse({ name, email, keyName })
        const apiKey = generateApiKey(32)
        const findExisting = await prisma.apiKey.findFirst({
            where: { keyName }
        })
        if (findExisting) return { error: 'Theres already an API Key with this name.' }
        const create = await prisma.apiKey.create({
            data: {
                keyName,
                apiKey,
                ownerName: name,
                ownerEmail: email,

            }
        })
        return create
    } catch (err) {
        if (err instanceof ZodError) {
            const validationError = fromError(err);
            return { error: validationError.toString() }
        } else return { error: err }
    }
}

const findKey = async (apiKey: string) => {
    const find = await prisma.apiKey.findUnique({
        where: {
            apiKey,
        }
    })
    return find
}

const deleteKey = (async ({ apiKey, email }: { apiKey: string, email: string }) => {
    try {
        const findExisting = await prisma.apiKey.findUnique({
            where: { apiKey, ownerEmail: email }
        })
        if (findExisting) {
            const deleteKey = await prisma.apiKey.delete({
                where: { apiKey, ownerEmail: email }
            })
            return deleteKey
        }
        else return { message: 'No API Key was found with the provided params.' }
    } catch (error) {
        return { error }
    }
})

const findKeys = (async ({ email }: { email: string }) => {
    try {
        const findExisting = await prisma.apiKey.findMany({
            where: { ownerEmail: email }
        })
        if (findExisting) return findExisting
        return { message: 'No API Key was found with the provided params.' }
    } catch (error) {
        return { error }
    }
})

export { prisma, createKey, findKey, deleteKey, findKeys }