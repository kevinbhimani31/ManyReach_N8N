import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * CreateFollowups sequence
 * Creates and attaches a new follow-up to the given sequence in the authenticated organization.
            
Behavior:
- Validates API key, sequence ID, and input body.
- Checks sequence/campaign existence and ownership.
- Verifies org-specific follow-up limits.
- Persists follow-up and clears relevant cache.
- Returns created follow-up or error code as appropriate.
 */
export async function createFollowupsSequence(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('sequenceId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  
  
  const body: any = {};
  
  // Required fields
  body.waitMin = this.getNodeParameter('waitMin', index) as any;
  body.waitUnits = this.getNodeParameter('waitUnits', index) as any;
  
  // Optional fields
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as any;
  if (additionalFields.subject !== undefined) body.subject = additionalFields.subject;
  if (additionalFields.body !== undefined) body.body = additionalFields.body;
  if (additionalFields.useOriginalSubject !== undefined) body.useOriginalSubject = additionalFields.useOriginalSubject;
  if (additionalFields.sendInSameThread !== undefined) body.sendInSameThread = additionalFields.sendInSameThread;
  if (additionalFields.replyInThread !== undefined) body.replyInThread = additionalFields.replyInThread;
  if (additionalFields.replyInThreadToFollowupId !== undefined) body.replyInThreadToFollowupId = additionalFields.replyInThreadToFollowupId;
  
  const qs: any = {};
  
  
  const response = await apiRequest.call(this, 'POST', `/api/v2/sequences/${id}/followups`, body, qs);
  return response;
}
