import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * GetTags prospect
 * API endpoint for GetProspectTags
 */
export async function getTagsProspect(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('prospectId', index) as any;
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
  
  const response = await apiRequest.call(this, 'GET', `/api/v2/prospects/${id}/tags`, body, qs);
  return response;
}
