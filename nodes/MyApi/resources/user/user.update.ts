import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensureGuid } from '../../helpers/validation';

export async function updateUser(this: IExecuteFunctions, index: number) {
  const id = this.getNodeParameter('userId', index, '') as string;
  ensureGuid(id);

  let body = this.getNodeParameter('userBody', index, {}) as any;
  body = JSON.parse(body);
  const request: UpdateUserRequest = {
    FirstName: body.FirstName || body.firstName,
    LastName: body.LastName || body.lastName,  
    AccountType: body.AccountType || body.accountType,
    Active: body.Active || body.active || true,
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