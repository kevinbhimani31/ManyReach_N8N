import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

/**
 * Create tags
 * Creates a new tag for the authenticated organization.
            
Behavior:
- Authenticates API request
- Validates tag title is unique within organization (case-insensitive)
- Creates new tag
- Returns created tag details
 */
export async function createTags(this: IExecuteFunctions, index: number) {
  const body: any = {};
  
  // Required fields
  body.title = this.getNodeParameter('title', index) as any;
  
  // Optional fields
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as any;
  if (additionalFields.description !== undefined) body.description = additionalFields.description;
  
  const response = await apiRequest.call(this, 'POST', '/api/v2/tags', body);
  return response;
}
