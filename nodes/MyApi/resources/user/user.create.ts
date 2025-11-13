import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

export async function createUser(this: IExecuteFunctions, index: number) {
  // userBody node parameter is a JSON object
  let body = this.getNodeParameter('userBody', index, {}) as any;
  body = JSON.parse(body);
  
  const request : CreateUserRequest = {
    Email: body.Email || body.email,
    FirstName: body.FirstName || body.firstName,
    LastName: body.LastName || body.lastName,
    Active: body.Active || body.active || true,
    AccountType: body.AccountType || body.accountType,
  };
  
  // adapt endpoint and payload according to your API
  const response = await apiRequest.call(this, 'POST', `/users`, request);

  return response;
}

export interface CreateUserRequest{
  Email: string;
  FirstName: string;
  LastName: string;
  AccountType?: number;
  Active: boolean;
}
