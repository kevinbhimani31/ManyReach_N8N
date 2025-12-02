import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * GetStats campaign
 * Retrieves all statistical data for the specified campaign in the authenticated organization.
            
Behavior:
- Validates API key/org and campaign existence.
- Optionally refreshes statistics when refresh=true (checks completion status, recalculates stats, processes A/B tests, clears caches).
- Verifies/normalizes date parameters and their ranges.
- Returns statistics for the specified date range.
            
Date Defaults (if not provided):
- dateStart: Campaign creation date
- dateEnd: Current date/time
 */
export async function getStatsCampaign(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('campaignId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  
  
  const body = {};
  
  const qs: any = {};
  const dateStart = this.getNodeParameter('dateStart', index, undefined) as any;
  if (dateStart !== undefined) {
    qs.dateStart = dateStart;
  }
  const dateEnd = this.getNodeParameter('dateEnd', index, undefined) as any;
  if (dateEnd !== undefined) {
    qs.dateEnd = dateEnd;
  }
  const refresh = this.getNodeParameter('refresh', index, undefined) as any;
  if (refresh !== undefined) {
    qs.refresh = refresh;
  }
  
  const response = await apiRequest.call(this, 'GET', `/api/v2/campaigns/${id}/stats`, body, qs);
  return response;
}
