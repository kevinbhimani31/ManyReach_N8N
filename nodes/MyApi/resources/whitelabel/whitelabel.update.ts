import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';


/**
 * Update whitelabel
 * Updates whitelabel-related appearance and domain settings for the authenticated organization.

Behavior:
- Authenticates via API key and verifies permissions (must be org admin)
- Validates supplied image data (logo), color, and custom domain parameters
- Saves new logo (if provided)
- Updates color theme and custom domain as supplied
- Handles error and permission scenarios as needed
- Logo image as Base64 data (required for logo update)
- Color code for header (optional)
- Domain value to associate (optional)
 */
export async function updateWhitelabel(this: IExecuteFunctions, index: number) {

  
  const updateFields = this.getNodeParameter('updateFields', index, {}) as any;
  
  const response = await apiRequest.call(this, 'PUT', `/api/v2/whitelabel`, updateFields);
  return response;
}
