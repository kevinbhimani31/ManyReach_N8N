import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensurePagination } from '../../helpers/validation';

/**
 * Get all users (paginated)
 * - Expects: page and limit node parameters
 * - Returns: object { items: [...], pagination: {...} }
 */
export async function getAllUsers(this: IExecuteFunctions, index: number) {
  const page = this.getNodeParameter('page', index, 1) as number;
  const limit = this.getNodeParameter('limit', index, 100) as number;

  ensurePagination(page, limit);

  // adapt endpoint as your API expects, e.g. /users?page=1&limit=100
  // n8n sends a real request to your API endpoint
  const response = await apiRequest.call(this, 'GET', `/users`, {}, { page, limit });

  // common mapping: keep API response shape
  return response; 
}
