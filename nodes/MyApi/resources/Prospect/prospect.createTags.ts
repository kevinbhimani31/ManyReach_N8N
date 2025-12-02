import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * CreateTags prospect
 * API endpoint for AddProspectTags
 */
export async function createTagsProspect(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('prospectId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  
  
  const body: any = {};
  
  // Required fields
  body.tagId = this.getNodeParameter('tagId', index) as any;
  
  // Optional fields
  
  
  const qs: any = {};
  
  
  const response = await apiRequest.call(this, 'POST', `/api/v2/prospects/${id}/tags`, body, qs);
  return response;
}
