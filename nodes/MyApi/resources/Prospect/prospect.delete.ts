import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Delete prospect
 * API endpoint for RemoveProspectTags
 */
export async function deleteProspect(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('prospectId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  const response = await apiRequest.call(this, 'DELETE', `/api/v2/prospects/${id}/tags/{tagId}`);
  return response;
}
