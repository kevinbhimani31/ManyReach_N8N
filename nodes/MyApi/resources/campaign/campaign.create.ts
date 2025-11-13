import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

export async function createCampaign(this: IExecuteFunctions, index: number) {

  let name  = this.getNodeParameter('campaignName', index, {}) as any;
 

  const response = await apiRequest.call(this, 'POST', `/campaigns`, name);

  return response;
}

export interface CreateClientspaceRequest{
  title: string;
  SeparateCredits?: boolean;
  AutoAllocate: boolean;
  CreditAmount: number;
}