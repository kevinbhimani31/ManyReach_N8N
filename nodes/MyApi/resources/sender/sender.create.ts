import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

export async function createSender(this: IExecuteFunctions, index: number) {
  const Email = this.getNodeParameter('Email', index) as string;

  if (!Email || (typeof Email === 'string' && Email.trim() === '')) {
    throw new Error('Email is required');
  }

  const body: any = {};
  body.Email = Email.trim();

  const response = await apiRequest.call(this, 'POST', `/senders`, body);

  if (!response) {
    throw new Error('Failed to create sender: Empty response from API');
  }

  return response;
}
