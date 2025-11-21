import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensurePagination } from '../../helpers/validation';

/**
 * Get all senders (paginated)
 * - Expects: page and limit node parameters
 * - Returns: object { items: [...], pagination: {...} }
 */
export async function getAllSenders(this: IExecuteFunctions, index: number) {
  const page = this.getNodeParameter('page', index, 1) as number;
  const limit = this.getNodeParameter('limit', index, 100) as number;
  const folder = this.getNodeParameter('folder', index, '') as string;
  const status = this.getNodeParameter('status', index, '') as string;
  const warmOption = this.getNodeParameter('warm', index, 'any') as string;
  const search = this.getNodeParameter('search', index, '') as string;
  const startingAfter = this.getNodeParameter('startingAfter', index, 0) as number;

  ensurePagination(page, limit);

  // Build query string
  const qs: Record<string, any> = { page, limit };
  if (folder) qs.folder = folder;
  if (status) qs.status = status;
  if (search) qs.search = search;
  if (startingAfter && Number(startingAfter) > 0) qs.startingAfter = startingAfter;
  if (warmOption === 'true') qs.warm = true;
  if (warmOption === 'false') qs.warm = false;

  // Request
  const response = await apiRequest.call(this, 'GET', `/senders`, {}, qs);

  // common mapping: keep API response shape
  return {
    items: response?.data ?? response ?? [],
    pagination: {
      page,
      limit,
      total: response?.total ?? null,
    },
  };
}
