import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Update user
 * Updates one or more fields of an existing user for the authenticated organization.

Behavior:
- Authenticates API/org context and permissions.
- Validates non-empty GUID and patch body.
- Checks canAdminOrg security on user.
- Applies/updates non-null user fields, including permissions, name, subscription.
- Persists and returns updated fields or errors.
 */
export async function updateUser(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('userId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  const updateFields = this.getNodeParameter('updateFields', index, {}) as any;
  
  const response = await apiRequest.call(this, 'PUT', `/api/v2/users/${id}`, updateFields);
  return response;
}
