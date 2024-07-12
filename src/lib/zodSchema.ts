import { z } from 'zod'

export const createApiSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1, 'Name is too short'),
    keyName: z.string().min(1, 'Key name is too short')
}) 