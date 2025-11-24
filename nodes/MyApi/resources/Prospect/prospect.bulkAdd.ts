import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

export async function bulkAddProspects(this: IExecuteFunctions, index: number) {
  const selected = this.getNodeParameter('prospects', index, []) as Array<string | number>;
  const listId = this.getNodeParameter('listId', index) as number;
  const campaignId = this.getNodeParameter('campaignId', index, 0) as number;
  const addOnlyIfNew = this.getNodeParameter('addOnlyIfNew', index, false) as boolean;
  const notInOtherCampaign = this.getNodeParameter('notInOtherCampaign', index, true) as boolean;

  const prospectIds = (selected || []).map((v) => Number(v)).filter((v) => Number.isFinite(v));
  if (!Array.isArray(prospectIds) || prospectIds.length === 0) {
    throw new Error('Please select at least one prospect');
  }
  if (!listId || Number(listId) <= 0) {
    throw new Error('List ID is required');
  }

  // API requires Email in each prospect. Fetch minimal details to include Email.
  const details = await Promise.all(
    prospectIds.map(async (id) => {
      const res = await apiRequest.call(this, 'GET', `/prospects/${id}`);
      const email: string | undefined = res?.Email ?? res?.email;
      return { id, email, res };
    }),
  );

  const missingEmail = details.filter((d) => !d.email).map((d) => d.id);
  if (missingEmail.length > 0) {
    throw new Error(`Missing email for prospect IDs: ${missingEmail.join(', ')}`);
  }

  const body = {
    Prospects: details.map(({ id, email, res }) => ({
      ProspectId: res?.ProspectId ?? res?.prospectId ?? res?.LeadID ?? res?.Id ?? id,
      Email: email as string,
    })),
  };

  const qs: Record<string, any> = {
    listId,
    addOnlyIfNew,
    notInOtherCampaign,
  };
  if (campaignId && Number(campaignId) > 0) qs.campaignId = campaignId;

  const response = await apiRequest.call(this, 'POST', `/prospects/bulk`, body, qs);

  return response ?? { success: true, count: prospectIds.length };
}


