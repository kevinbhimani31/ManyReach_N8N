import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

/**
 * Create prospect
 * Creates a single prospect in the CRM.
            
Behavior:
- Authenticates API request
- Validates required fields (email)
- Checks for duplicate email
- Creates prospect record
- Returns prospect details as DTO
 */
export async function createProspect(this: IExecuteFunctions, index: number) {
  const body: any = {};
  
  // Required fields
  body.email = this.getNodeParameter('email', index) as any;
  body.baseListId = this.getNodeParameter('baseListId', index) as any;
  
  // Optional fields
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as any;
  if (additionalFields.sendingStatus !== undefined) body.sendingStatus = additionalFields.sendingStatus;
  if (additionalFields.sendingActive !== undefined) body.sendingActive = additionalFields.sendingActive;
  if (additionalFields.industry !== undefined) body.industry = additionalFields.industry;
  if (additionalFields.city !== undefined) body.city = additionalFields.city;
  if (additionalFields.website !== undefined) body.website = additionalFields.website;
  if (additionalFields.phone !== undefined) body.phone = additionalFields.phone;
  if (additionalFields.firstName !== undefined) body.firstName = additionalFields.firstName;
  if (additionalFields.lastName !== undefined) body.lastName = additionalFields.lastName;
  if (additionalFields.company !== undefined) body.company = additionalFields.company;
  if (additionalFields.country !== undefined) body.country = additionalFields.country;
  if (additionalFields.domain !== undefined) body.domain = additionalFields.domain;
  if (additionalFields.companySocial !== undefined) body.companySocial = additionalFields.companySocial;
  if (additionalFields.companySize !== undefined) body.companySize = additionalFields.companySize;
  if (additionalFields.jobPosition !== undefined) body.jobPosition = additionalFields.jobPosition;
  if (additionalFields.location !== undefined) body.location = additionalFields.location;
  if (additionalFields.personalSocial !== undefined) body.personalSocial = additionalFields.personalSocial;
  if (additionalFields.customImageUrl !== undefined) body.customImageUrl = additionalFields.customImageUrl;
  if (additionalFields.screenshotUrl !== undefined) body.screenshotUrl = additionalFields.screenshotUrl;
  if (additionalFields.logoUrl !== undefined) body.logoUrl = additionalFields.logoUrl;
  if (additionalFields.state !== undefined) body.state = additionalFields.state;
  if (additionalFields.icebreaker !== undefined) body.icebreaker = additionalFields.icebreaker;
  if (additionalFields.custom1 !== undefined) body.custom1 = additionalFields.custom1;
  if (additionalFields.custom2 !== undefined) body.custom2 = additionalFields.custom2;
  if (additionalFields.custom3 !== undefined) body.custom3 = additionalFields.custom3;
  if (additionalFields.custom4 !== undefined) body.custom4 = additionalFields.custom4;
  if (additionalFields.custom5 !== undefined) body.custom5 = additionalFields.custom5;
  if (additionalFields.custom6 !== undefined) body.custom6 = additionalFields.custom6;
  if (additionalFields.custom7 !== undefined) body.custom7 = additionalFields.custom7;
  if (additionalFields.custom8 !== undefined) body.custom8 = additionalFields.custom8;
  if (additionalFields.custom9 !== undefined) body.custom9 = additionalFields.custom9;
  if (additionalFields.custom10 !== undefined) body.custom10 = additionalFields.custom10;
  if (additionalFields.custom11 !== undefined) body.custom11 = additionalFields.custom11;
  if (additionalFields.custom12 !== undefined) body.custom12 = additionalFields.custom12;
  if (additionalFields.custom13 !== undefined) body.custom13 = additionalFields.custom13;
  if (additionalFields.custom14 !== undefined) body.custom14 = additionalFields.custom14;
  if (additionalFields.custom15 !== undefined) body.custom15 = additionalFields.custom15;
  if (additionalFields.custom16 !== undefined) body.custom16 = additionalFields.custom16;
  if (additionalFields.custom17 !== undefined) body.custom17 = additionalFields.custom17;
  if (additionalFields.custom18 !== undefined) body.custom18 = additionalFields.custom18;
  if (additionalFields.custom19 !== undefined) body.custom19 = additionalFields.custom19;
  if (additionalFields.custom20 !== undefined) body.custom20 = additionalFields.custom20;
  if (additionalFields.notes !== undefined) body.notes = additionalFields.notes;
  
  const response = await apiRequest.call(this, 'POST', '/api/v2/prospects', body);
  return response;
}
