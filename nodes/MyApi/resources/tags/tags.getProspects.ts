import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * GetProspects tags
 * Retrieves a paginated list of prospects with the specified tag.
            
Behavior:
- Authenticates API request
- Validates tag belongs to authenticated organization
- Returns paginated list of prospects with this tag
 */
export async function getProspectsTags(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('tagsId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  
  
  const body = {};
  
  const qs: any = {};
  const page = this.getNodeParameter('page', index, undefined) as any;
  if (page !== undefined) {
    qs.page = page;
  }
  const limit = this.getNodeParameter('limit', index, undefined) as any;
  if (limit !== undefined) {
    qs.limit = limit;
  }
  const startingAfter = this.getNodeParameter('startingAfter', index, undefined) as any;
  if (startingAfter !== undefined) {
    qs.startingAfter = startingAfter;
  }
  
  const response = await apiRequest.call(this, 'GET', `/api/v2/tags/${id}/prospects`, body, qs);
  return response;
}
