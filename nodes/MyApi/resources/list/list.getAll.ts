import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensurePagination } from '../../helpers/validation';

export async function getAllLists(this: IExecuteFunctions, index: number) {
  const page = this.getNodeParameter('page', index, 1) as number;
  const limit = this.getNodeParameter('limit', index, 100) as number;
  const startingAfter = this.getNodeParameter('startingAfter', index, 0) as number;

  ensurePagination(page, limit);

  const response = await apiRequest.call(this, 'GET', `/lists`, {}, { page, limit , startingAfter});

  const lists = response?.data ?? response ?? [];

  return {
    items: lists
  };
}

