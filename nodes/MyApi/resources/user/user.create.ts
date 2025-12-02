import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

export async function createUser(this: IExecuteFunctions, index: number) {


  const Email = this.getNodeParameter('Email', index, "") as string;
  const FirstName = this.getNodeParameter('FirstName', index, "") as string;
  const LastName = this.getNodeParameter('LastName', index, "") as string;
  const Active = this.getNodeParameter('Active', index, false) as boolean;
  const AccountType = this.getNodeParameter('AccountType', index, 0) as number;

  const qs: Record<string, any> = {};


  const body: Record<string, any> = {
    Email: Email,
    FirstName: FirstName,
    LastName: LastName,
    Active: Active,
    AccountType: AccountType,
  };

  const response = await apiRequest.call(this, 'POST', `/users`, body, qs);

  return response;
}
