import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

/**
 * Create message
 * Sends an email reply to an existing received message.  
Supports quoting the original message, personalization placeholders, CC/BCC,  
sender override, and campaign-based tracking (opens/clicks).

Behavior:
- Validates the request and authentication.
- Retrieves the original received message by ID (from request body).
- Sanitizes the original body (removes tracking pixels and tracked links).
- Verifies user permissions to access the organization inbox.
- Selects the sender (original sender or `fromEmail` override).
- Builds the reply content and applies personalization.
- Optionally appends the quoted original message (`sendAsReply`).
- Applies tracking if required by the campaign.
- Sends the email via the external sending service.
- Stores a record of the sent reply.

Tracking And Personalization:
- Automatically adds tracking pixels and click-tracking if the message belongs to a tracked campaign.
- Personalization placeholders (e.g., {FirstName}, {Company}) are replaced with prospect data.
 */
export async function createMessage(this: IExecuteFunctions, index: number) {
  const body: any = {};
  
  // Required fields
  body.messageId = this.getNodeParameter('messageId', index) as any;
  
  // Optional fields
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as any;
  if (additionalFields.subject !== undefined) body.subject = additionalFields.subject;
  if (additionalFields.body !== undefined) body.body = additionalFields.body;
  if (additionalFields.ccEmails !== undefined) body.ccEmails = additionalFields.ccEmails;
  if (additionalFields.bccEmails !== undefined) body.bccEmails = additionalFields.bccEmails;
  if (additionalFields.sendAsReply !== undefined) body.sendAsReply = additionalFields.sendAsReply;
  if (additionalFields.fromEmail !== undefined) body.fromEmail = additionalFields.fromEmail;
  if (additionalFields.replyToEmail !== undefined) body.replyToEmail = additionalFields.replyToEmail;
  
  const response = await apiRequest.call(this, 'POST', '/api/v2/messages/reply', body);
  return response;
}
