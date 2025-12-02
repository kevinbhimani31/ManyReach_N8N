import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Delete tags
 * Deletes a tag from the organization.
            
Behavior:
- Authenticates API request
- Validates tag exists and belongs to authenticated organization
- If force=false (default): Fails with 409 Conflict if tag has prospects
- If force=true: Cascade deletes all tag-prospect relationships and then deletes tag
- Returns 204 No Content on successful deletion
 */
export async function deleteTags(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('tagsId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  const response = await apiRequest.call(this, 'DELETE', `/api/v2/tags/${id}`);
  return response;
}
