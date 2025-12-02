import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensureGuid, extractStringId } from '../../helpers/validation';

export async function updateUser(this: IExecuteFunctions, index: number) {
  const rawId = this.getNodeParameter('userId', index) as any;
  const id = extractStringId(rawId, 'User ID');
  ensureGuid(id);

  const FirstName = this.getNodeParameter('FirstName', index, "") as string;
  const LastName = this.getNodeParameter('LastName', index, "") as string;
  const Active = this.getNodeParameter('Active', index, false) as boolean;
  const AccountType = this.getNodeParameter('AccountType', index, 0) as number;

  const qs: Record<string, any> = {};


  const body: Record<string, any> = {
    FirstName: FirstName,
    LastName: LastName,
    Active: Active,
    AccountType: AccountType,
  };

  const response = await apiRequest.call(this, 'PUT', `/users/${id}`, body, qs);

  return response;
}
