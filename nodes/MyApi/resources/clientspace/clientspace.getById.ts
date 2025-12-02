import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Get clientspace by ID
 * Retrieves details of a specific clientspace by its OrganizationID.

Behavior:
- Authenticates via API key
- Ensures the requested clientspace belongs to the authenticated parent organization
- Only users from the parent organization can access
 */
export async function getClientspaceById(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('clientspaceId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  const response = await apiRequest.call(this, 'GET', `/api/v2/clientspaces/${id}`);
  return response;
}
