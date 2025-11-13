import { IExecuteFunctions } from 'n8n-workflow';

export async function apiRequest(
  this: IExecuteFunctions,
  method: string,
  endpoint: string,
  body: any = {},
  qs: any = {},
) {
  const credentials = await this.getCredentials('myApi');
  if (!credentials) {
    throw new Error('No credentials for MyApi!');
  }

  const baseUrl = (credentials as any).baseUrl;
  const apiKey = (credentials as any).apiKey;

  if (!baseUrl) {
    throw new Error('Base URL missing in credentials');
  }

  const options: any = {
    method,
    uri: `${baseUrl}${endpoint}`,
    qs,
    body,
    json: true,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-API-Key': apiKey, // ✅ Add your API key header (no Bearer)
    },
    rejectUnauthorized: false, // ✅ Ignore SSL for localhost
  };

  try {
    const response = await this.helpers.request!(options);
    return response;
  } catch (err: any) {
    const msg = err?.error?.message || err?.message || 'API request failed';
    const status = err?.statusCode || err?.status || 500;
    const error = new Error(`${msg}`);
    (error as any).statusCode = status;
    throw error;
  }
}
