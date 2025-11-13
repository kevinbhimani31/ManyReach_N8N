import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

export interface CreateCampaignRequest {
  name: string;
  description?: string;
  CcEmails?: string;
  BccEmails?: string;
  DailyLimit?: number;
}

/**
 * Create a new campaign
 * - Expects: campaignName (required), campaignDescription, and optional additional fields
 * - Returns: created campaign object with campaign details
 */
export async function createCampaign(this: IExecuteFunctions, index: number) {
  // Get required parameters
  const campaignName = this.getNodeParameter('campaignName', index) as string;
  const campaignDescription = this.getNodeParameter('campaignDescription', index, '') as string;

  // Get optional additional fields
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as any;

  // Validate required fields
  if (!campaignName || campaignName.trim() === '') {
    throw new Error('Campaign Name is required');
  }

  if (campaignName.length < 3) {
    throw new Error('Campaign Name must be at least 3 characters long');
  }

  // Build the request body
  const body: CreateCampaignRequest = {
    name: campaignName.trim(),
  };

  // Add optional description if provided
  if (campaignDescription && campaignDescription.trim() !== '') {
    body.description = campaignDescription.trim();
  }

  // Add additional fields if provided
  if (additionalFields && typeof additionalFields === 'object') {
    if (additionalFields.CcEmails) {
      body.CcEmails = additionalFields.CcEmails;
    }
    if (additionalFields.BccEmails) {
      body.BccEmails = additionalFields.BccEmails;
    }
    if (additionalFields.dailyLimit) {
      body.DailyLimit = additionalFields.dailyLimit || 50;
    }
  }

  // Make API request to create campaign
  const response = await apiRequest.call(this, 'POST', `/campaigns`, body);

  // Validate API response
  if (!response) {
    throw new Error('Failed to create campaign: Empty response from API');
  }

  return response;
}
