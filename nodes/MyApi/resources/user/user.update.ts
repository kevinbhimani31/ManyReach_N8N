import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensureGuid } from '../../helpers/validation';

export async function updateUser(this: IExecuteFunctions, index: number) {
  const id = this.getNodeParameter('userId', index, '') as string;
  ensureGuid(id);

  const body = this.getNodeParameter('userBody', index, {}) as any;
  const request: UpdateUserRequest = {
    FirstName: body.FirstName,
    LastName: body.LastName,  
    AccountType: body.AccountType,
    Active: body.Active,
  };

  const response = await apiRequest.call(this, 'PATCH', `/users/${id}`, request);

  return response;
}

export interface UpdateUserRequest{
  FirstName?: string;
  LastName?: string;
  AccountType?: number;
  Active?: boolean;
}