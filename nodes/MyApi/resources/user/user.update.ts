import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensureGuid } from '../../helpers/validation';

export async function updateUser(this: IExecuteFunctions, index: number) {
  const id = this.getNodeParameter('userId', index, '') as string;
  ensureGuid(id);
   const firstName = this.getNodeParameter('FirstName', index) as string;
   const lastName = this.getNodeParameter('LastName', index) as string;
   const AccountType = this.getNodeParameter('AccountType', index) as number;
   const Active = this.getNodeParameter('Active', index) as boolean;
 
   const request: UpdateUserRequest = {
     FirstName: firstName,
     LastName: lastName,
     Active: Active,
     AccountType: AccountType,
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