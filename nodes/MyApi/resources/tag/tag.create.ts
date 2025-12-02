import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

export async function createTag(this: IExecuteFunctions, index: number) {


  const Title = this.getNodeParameter('Title', index, "") as string;
  const Description = this.getNodeParameter('Description', index, "") as string;

  const qs: Record<string, any> = {};


  const body: Record<string, any> = {
    Title: Title,
    Description: Description,
  };

  const response = await apiRequest.call(this, 'POST', `/tags`, body, qs);

  return response;
}
