import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

export async function createClientspace(this: IExecuteFunctions, index: number) {
  // userBody node parameter is a JSON object
  const body = this.getNodeParameter('clientspaceBody', index, {}) as any;
  console.log(body);
  

  // adapt endpoint and payload according to your API
  const response = await apiRequest.call(this, 'POST', `/clientspaces`, body);

  return response;
}

export interface CreateClientspaceRequest{
  title: string;
  SeparateCredits?: boolean;
  AutoAllocate: boolean;
  CreditAmount: number;
}