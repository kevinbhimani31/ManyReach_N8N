import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

export async function getAllTags(this: IExecuteFunctions, index: number) {

  const page = this.getNodeParameter('page', index, 1) as number;
  const limit = this.getNodeParameter('limit', index, 100) as number;


  const qs: Record<string, any> = {};
  if (page !== undefined && page !== null) qs.page = page;
  if (limit !== undefined && limit !== null) qs.limit = limit;

  const body: Record<string, any> = {};

  const response = await apiRequest.call(this, 'GET', `/tags`, body, qs);

  return {
    items: response?.data ?? response ?? [],
    pagination: {
      page: (qs as any)?.page ?? undefined,
      limit: (qs as any)?.limit ?? undefined,
      total: response?.total ?? null,
    },
  };
}
