import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Update tags
 * Updates the title and description of an existing tag.
            
Behavior:
- Authenticates API request
- Validates tag exists and belongs to authenticated organization
- Validates new title is unique within organization (case-insensitive)
- Updates tag title and description
- Returns updated tag details
 */
export async function updateTags(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('tagsId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  const updateFields = this.getNodeParameter('updateFields', index, {}) as any;
  
  const response = await apiRequest.call(this, 'PUT', `/api/v2/tags/${id}`, updateFields);
  return response;
}
