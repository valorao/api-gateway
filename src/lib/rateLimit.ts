import { prisma } from "./prisma";

export async function rateLimiter(apiKey: string) {
    const keyLimit = await prisma.apiKey.findUnique({
        where: {
            apiKey,
        }
    })
    if (!keyLimit) return 10
    return keyLimit.keyLimit
}
