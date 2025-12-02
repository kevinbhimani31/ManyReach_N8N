import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Delete user
 * Deletes a user from the organization by GUID.

Behavior:
- Authenticates API/org context and permissions.
- Validates GUID and ensures user exists and is allowed to be deleted.
- Sets deleted/inactive and saves.
- Removes from cache and returns status.
 */
export async function deleteUser(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('userId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  const response = await apiRequest.call(this, 'DELETE', `/api/v2/users/${id}`);
  return response;
}
