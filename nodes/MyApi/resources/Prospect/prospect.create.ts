import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

export async function createProspect(this: IExecuteFunctions, index: number) {

  const email = this.getNodeParameter('Email', index) as string;
  const firstName = this.getNodeParameter('FirstName', index) as string;
  const lastName = this.getNodeParameter('LastName', index) as string;
  const company = this.getNodeParameter('company', index) as string;
  const baseListId = this.getNodeParameter('baseListId', index) as number;

  const request: CreateProspectRequest = {
    Email: email,
    FirstName: firstName,
    LastName: lastName,
    Company: company,
    BaseListId: baseListId,
  };

  const response = await apiRequest.call(this, 'POST', `/prospects`, request);

  return response;
}

export interface CreateProspectRequest {
  Email: string;
  FirstName: string;
  LastName: string;
  BaseListId?: number;
  Company?: string;
}
