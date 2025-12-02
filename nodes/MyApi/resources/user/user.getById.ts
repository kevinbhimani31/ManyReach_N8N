import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Get user by ID
 * Retrieves a specific user's details by GUID for the authenticated organization.

Behavior:
- Authenticates and validates API key/org.
- Verifies user permissions vs. agency/whitelabel.
- Looks up user by id and org.
- Returns user DTO or error if not found/inaccessible.
 */
export async function getUserById(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('userId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  const response = await apiRequest.call(this, 'GET', `/api/v2/users/${id}`);
  return response;
}
