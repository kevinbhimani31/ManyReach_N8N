import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

/**
 * Create list
 * Creates a new list for the authenticated organization.

Behavior:
- Authenticates API request
- Validates required fields
- Checks for duplicate list name
- Creates list record
- Returns created list details
 */
export async function createList(this: IExecuteFunctions, index: number) {
  const body: any = {};
  
  // Required fields
  body.title = this.getNodeParameter('title', index) as any;
  
  // Optional fields
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as any;
  if (additionalFields.folderId !== undefined) body.folderId = additionalFields.folderId;
  
  const response = await apiRequest.call(this, 'POST', '/api/v2/lists', body);
  return response;
}
