import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensureGuid, extractStringId } from '../../helpers/validation';

export async function updateUser(this: IExecuteFunctions, index: number) {
  const rawId = this.getNodeParameter('userId', index) as any;
  const id = extractStringId(rawId, 'User ID');
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

export const UpdateUserRoles = [
  { name: 'User', value: 30, description: 'User' },
  { name: 'Admin', value: 100, description: 'Admin' },
  { name: 'Super Admin', value: 110, description: 'Super Admin' },
  {name : 'Unibox Only' , value: 21, description: 'Unibox Only' },
  { name: 'Reports Only', value: 22, description: 'Reports Only' },
];