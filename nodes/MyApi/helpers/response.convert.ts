export function extractArray(response: any, label: string = 'data') {
    if (!response) {
        throw new Error('Empty API response');
    }

    const candidates = [
        response,
        response?.data,
        response?.items,
        response?.records,
    ];

    for (const c of candidates) {
        if (Array.isArray(c)) return c;
    }

    throw new Error(`Unexpected API response format for ${label}`);
}
