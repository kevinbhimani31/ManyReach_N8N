import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Get tags by ID
 * Retrieves details of a specific tag.
            
Behavior:
- Authenticates API request
- Validates tag belongs to authenticated organization
- Optionally includes prospect count via include=prospectCount
- Returns tag details
 */
export async function getTagsById(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('tagsId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  const response = await apiRequest.call(this, 'GET', `/api/v2/tags/${id}`);
  return response;
}
