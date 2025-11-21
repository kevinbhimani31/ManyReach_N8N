import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensurePagination } from '../../helpers/validation';

/**
 * Get all workspaces (paginated, with optional cursor)
 */
export async function getAllWorkspaces(this: IExecuteFunctions, index: number) {
  const page = this.getNodeParameter('page', index, 1) as number;
  const limit = this.getNodeParameter('limit', index, 100) as number;
  const startingAfter = this.getNodeParameter('startingAfter', index, 0) as number;

  ensurePagination(page, limit);

  const qs: Record<string, any> = { page, limit };
  if (startingAfter && Number(startingAfter) > 0) qs.startingAfter = startingAfter;

  const response = await apiRequest.call(this, 'GET', `/workspaces`, {}, qs);

  return {
    items: response?.data ?? response ?? [],
    pagination: {
      page,
      limit,
      total: response?.total ?? null,
    },
  };
}


