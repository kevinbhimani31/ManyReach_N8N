import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Update clientspace
 * Updates one or more clientspace fields (Title, Credit Limit, Separate Credits) under the authenticated organization.

Behavior:
- Authenticates via API key
- Ensures the workspace belongs to caller's organization (as Agency)
- Allows updating Title, Auto Allocate, Credit Amount, HasSeparateCredits
- Ignores any fields not included in query
- New title (optional, must be unique in agency)
- Auto allocate credits (optional)
- Credit Amount (optional)
- Enable/disable separate credits (optional)
 */
export async function updateClientspace(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('clientspaceId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  const updateFields = this.getNodeParameter('updateFields', index, {}) as any;
  
  const response = await apiRequest.call(this, 'PUT', `/api/v2/clientspaces/${id}`, updateFields);
  return response;
}
