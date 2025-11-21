import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensurePagination } from '../../helpers/validation';

/**
 * Get all tags (paginated, with optional search/include/cursor)
 */
export async function getAllTags(this: IExecuteFunctions, index: number) {
  const page = this.getNodeParameter('page', index, 1) as number;
  const limit = this.getNodeParameter('limit', index, 100) as number;
  const startingAfter = this.getNodeParameter('startingAfter', index, 0) as number;
  const search = this.getNodeParameter('search', index, '') as string;
  const include = this.getNodeParameter('include', index, []) as string[];

  ensurePagination(page, limit);

  const qs: Record<string, any> = { page, limit };
  if (startingAfter && Number(startingAfter) > 0) qs.startingAfter = startingAfter;
  if (search) qs.search = search;
  if (Array.isArray(include) && include.length > 0) qs.include = include.join(',');

  const response = await apiRequest.call(this, 'GET', `/tags`, {}, qs);

  return {
    items: response?.data ?? response ?? [],
    pagination: {
      page,
      limit,
      total: response?.total ?? null,
    },
  };
}


