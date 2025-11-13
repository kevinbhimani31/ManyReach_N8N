import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

export async function createClientspace(this: IExecuteFunctions, index: number) {
  // userBody node parameter is a JSON object
  let title = this.getNodeParameter('Title', index) as string;
  const separateCredits = this.getNodeParameter('SeparateCredits', index) as boolean;
  const autoAllocate = this.getNodeParameter('AutoAllocate', index) as boolean;
  const creditAmount = this.getNodeParameter('CreditAmount', index) as number;
  
  const request: CreateClientspaceRequest = {
    Title: title,
    SeparateCredits: separateCredits,
    AutoAllocate: autoAllocate,
    CreditAmount: creditAmount,
  };

  const response = await apiRequest.call(this, 'POST', `/clientspaces`, request);

  return response;
}

export interface CreateClientspaceRequest{
  Title: string;
  SeparateCredits?: boolean;
  AutoAllocate: boolean;
  CreditAmount: number;
}