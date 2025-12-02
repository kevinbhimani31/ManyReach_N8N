import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Delete workspace
 * Deletes a workspace (subaccount) for the parent agency org.

Behavior:
- Authenticates agency/parent context and permissions.
- Verifies org/subaccount belongs to agency.
- Soft-deletes subaccount and invalidates caches.
- Returns result or relevant error.
 */
export async function deleteWorkspace(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('workspaceId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  const response = await apiRequest.call(this, 'DELETE', `/api/v2/workspaces/${id}`);
  return response;
}
