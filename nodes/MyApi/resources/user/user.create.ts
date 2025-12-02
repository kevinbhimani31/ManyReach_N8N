import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

/**
 * Create user
 * Registers a new user account or edits existing based on guid.

Behavior:
- Authenticates API and organization context.
- Validates request data and permissions to create/edit.
- Checks per-organization user limits.
- Registers or edits user details as needed.
- Returns created user info.
 */
export async function createUser(this: IExecuteFunctions, index: number) {
  const body: any = {};
  
  // Required fields

  
  // Optional fields
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as any;
  if (additionalFields.email !== undefined) body.email = additionalFields.email;
  if (additionalFields.firstName !== undefined) body.firstName = additionalFields.firstName;
  if (additionalFields.lastName !== undefined) body.lastName = additionalFields.lastName;
  if (additionalFields.accountType !== undefined) body.accountType = additionalFields.accountType;
  
  const response = await apiRequest.call(this, 'POST', '/api/v2/users', body);
  return response;
}
