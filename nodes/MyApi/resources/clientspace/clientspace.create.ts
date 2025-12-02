import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

/**
 * Create clientspace
 * Creates a new clientspace under the authenticated parent organization (agency).

Behavior:
- Authenticates via API key
- Requires admin rights on parent organization
- Allocates fixed credits upon creation
- Title must be unique for organization
- Clientspace name/title. Must be unique within Organization
 */
export async function createClientspace(this: IExecuteFunctions, index: number) {
  const body: any = {};
  
  // Required fields
  body.title = this.getNodeParameter('title', index) as any;
  
  // Optional fields
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as any;
  if (additionalFields.separateCredits !== undefined) body.separateCredits = additionalFields.separateCredits;
  if (additionalFields.autoAllocate !== undefined) body.autoAllocate = additionalFields.autoAllocate;
  if (additionalFields.creditAmount !== undefined) body.creditAmount = additionalFields.creditAmount;
  
  const response = await apiRequest.call(this, 'POST', '/api/v2/clientspaces', body);
  return response;
}
