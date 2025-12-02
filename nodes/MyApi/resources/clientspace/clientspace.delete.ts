import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Delete clientspace
 * Deletes a clientspace under the authenticated parent organization (agency).

Behavior:
- Authenticates via API key
- Only parent org/agency can delete clientspaces
- Requires Super Admin permissions
- Removes organization from agency cache
 */
export async function deleteClientspace(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('clientspaceId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  const response = await apiRequest.call(this, 'DELETE', `/api/v2/clientspaces/${id}`);
  return response;
}
