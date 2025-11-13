import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

export async function createUser(this: IExecuteFunctions, index: number) {
  // userBody node parameter is a JSON object
  const body = this.getNodeParameter('userBody', index, {}) as any;
 console.log(body); 

 const request : CreateUserRequest = {
    Email: body.Email,
    FirstName: body.FirstName,  
    LastName: body.LastName,
    AccountType: body.AccountType,
    Active: body.Active,
  };
  
  console.log("request : ",request);
  // adapt endpoint and payload according to your API
  const response = await apiRequest.call(this, 'POST', `/users`, body);

  return response;
}

export interface CreateUserRequest{
  Email: string;
  FirstName: string;
  LastName: string;
  AccountType?: number;
  Active: boolean;
}
