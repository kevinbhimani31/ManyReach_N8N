import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * CreateSequences campaign
 * Creates a new sequence for a specific campaign owned by the authenticated organization.
            
Behavior:
- Validates API key (header/query), campaign ID ownership, and input model.
- Checks campaign existence and per-campaign sequence limit.
- Saves sequence and clears relevant caches.
- Returns created sequence or error response.
 */
export async function createSequencesCampaign(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('campaignId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  
  
  const body: any = {};
  
  // Required fields
  
  
  // Optional fields
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as any;
  if (additionalFields.name !== undefined) body.name = additionalFields.name;
  if (additionalFields.shortName !== undefined) body.shortName = additionalFields.shortName;
  if (additionalFields.conditionExtra !== undefined) body.conditionExtra = additionalFields.conditionExtra;
  if (additionalFields.conditionNegate !== undefined) body.conditionNegate = additionalFields.conditionNegate;
  if (additionalFields.conditionTimes !== undefined) body.conditionTimes = additionalFields.conditionTimes;
  if (additionalFields.conditionReply !== undefined) body.conditionReply = additionalFields.conditionReply;
  if (additionalFields.conditionAction !== undefined) body.conditionAction = additionalFields.conditionAction;
  if (additionalFields.conditionOperator !== undefined) body.conditionOperator = additionalFields.conditionOperator;
  
  const qs: any = {};
  
  
  const response = await apiRequest.call(this, 'POST', `/api/v2/campaigns/${id}/sequences`, body, qs);
  return response;
}
