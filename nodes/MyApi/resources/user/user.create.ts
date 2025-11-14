import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

export async function createUser(this: IExecuteFunctions, index: number) {
  // userBody node parameter is a JSON object
  const email = this.getNodeParameter('Email', index) as string;
  const firstName = this.getNodeParameter('FirstName', index) as string;
  const lastName = this.getNodeParameter('LastName', index) as string;
  const AccountType = this.getNodeParameter('AccountType', index) as number;
  const Active = this.getNodeParameter('Active', index) as boolean;

  const request: CreateUserRequest = {
    Email: email,
    FirstName: firstName,
    LastName: lastName,
    Active: Active,
    AccountType: AccountType,
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

export const CreateUserRoles = [
  { name: 'User', value: 30, description: 'User' },
  { name: 'Admin', value: 100, description: 'Admin' },
  { name: 'Super Admin', value: 110, description: 'Super Admin' },
];
