export function generateApiKey(length: number) {
    const slug = 'tpx-';
    const keyLength = length - slug.length;

    if (keyLength <= 0) throw new Error("Length must be greater than the length of the slug.");

    const apiKey = Array.from(crypto.getRandomValues(new Uint8Array(keyLength)))
        .map(byte => ('0' + (byte % 36).toString(36)).slice(-1))
        .join('');

    return slug.toUpperCase() + apiKey.toUpperCase();
}