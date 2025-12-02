import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

/**
 * Create workspace
 * Creates a new workspace (subaccount) under the calling agency org.

Behavior:
- Authenticates parent org context.
- Verifies not called from workspace/subaccount.
- Checks for title uniqueness, agency limits, and general access.
- Creates/workspace and applies limits; invalidates caches.
 */
export async function createWorkspace(this: IExecuteFunctions, index: number) {
  const body: any = {};
  
  // Required fields
  body.title = this.getNodeParameter('title', index) as any;
  
  // Optional fields
  
  
  const response = await apiRequest.call(this, 'POST', '/api/v2/workspaces', body);
  return response;
}
