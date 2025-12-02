import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Get workspace by ID
 * Retrieves a specific workspace by id, if owned by the caller's organization.

Behavior:
- Authenticates request and confirms parent org.
- Checks organization/ownership rules using agency ID.
- Returns workspace details DTO or error.
 */
export async function getWorkspaceById(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('workspaceId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  const response = await apiRequest.call(this, 'GET', `/api/v2/workspaces/${id}`);
  return response;
}
