import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Update workspace
 * Updates the title of a workspace (organization) for agency-owned orgs.

Behavior:
- Authenticates/authorizes agency context.
- Looks up org; ensures org belongs to agency.
- Verifies new title is not a duplicate among siblings.
- Only updates the title.
 */
export async function updateWorkspace(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('workspaceId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  const updateFields = this.getNodeParameter('updateFields', index, {}) as any;
  
  const response = await apiRequest.call(this, 'PUT', `/api/v2/workspaces/${id}`, updateFields);
  return response;
}
