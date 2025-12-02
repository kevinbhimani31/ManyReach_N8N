import { IExecuteFunctions } from 'n8n-workflow';
import { getAllCampaigns } from '../resources/campaign/campaign.getAll';
import { getCampaignById } from '../resources/campaign/campaign.getById';
import { createCampaign } from '../resources/campaign/campaign.create';
import { updateCampaign } from '../resources/campaign/campaign.update';
import { deleteCampaign } from '../resources/campaign/campaign.delete';

export async function executeCampaign(this: IExecuteFunctions, operation: string, i: number): Promise<any> {
  switch (operation) {
    case 'getAll':
      return await getAllCampaigns.call(this, i);
    case 'getById':
      return await getCampaignById.call(this, i);
    case 'create':
      return await createCampaign.call(this, i);
    case 'update':
      return await updateCampaign.call(this, i);
    case 'delete':
      return await deleteCampaign.call(this, i);
    default:
      throw new Error(`Operation "${operation}" not supported for Campaign`);
  }
}


