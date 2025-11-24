import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensurePagination } from '../../helpers/validation';

/**
 * Get all prospects with optional filters and pagination
 */
export async function getAllProspects(this: IExecuteFunctions, index: number) {
  const page = this.getNodeParameter('page', index, 1) as number;
  const limit = this.getNodeParameter('limit', index, 100) as number;
  const startingAfter = this.getNodeParameter('startingAfter', index, 0) as number;
  const email = this.getNodeParameter('email', index, '') as string;
  const status = this.getNodeParameter('status', index, '') as string;
  const tags = this.getNodeParameter('tags', index, '') as string;
  const search = this.getNodeParameter('search', index, '') as string;

  ensurePagination(page, limit);

  const qs: Record<string, any> = { page, limit };
  if (startingAfter && Number(startingAfter) > 0) qs.startingAfter = startingAfter;
  if (email) qs.email = email;
  if (status) qs.status = status;
  if (tags) qs.tags = tags;
  if (search) qs.search = search;

  const response = await apiRequest.call(this, 'GET', `/prospects`, {}, qs);

  return {
    items: response?.data ?? response ?? [],
    pagination: {
      page,
      limit,
      total: response?.total ?? null,
    },
  };
}


