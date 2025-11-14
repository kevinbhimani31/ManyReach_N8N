import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensureId, extractNumericId } from '../../helpers/validation';

export async function updateClientspace(this: IExecuteFunctions, index: number) {
  const rawId = this.getNodeParameter('clientspaceId', index) as any;
  const id = extractNumericId(rawId, 'Clientspace ID');
  ensureId(id);
  const title = this.getNodeParameter('Title', index) as string;
  console.log('Update Clientspace called');
  const separateCredits = this.getNodeParameter('SeparateCredits', index) as boolean;
  const autoAllocate = this.getNodeParameter('AutoAllocate', index) as boolean;
  const creditAmount = this.getNodeParameter('CreditAmount', index) as number;
  const request: UpdateClientspaceRequest = {
    Title: title,
    SeparateCredits: separateCredits,
    AutoAllocate: autoAllocate,
    CreditAmount: creditAmount,
  };

  const response = await apiRequest.call(this, 'PATCH', `/clientspaces/${id}`, request);

  return response;
}

export interface UpdateClientspaceRequest{
  Title: string;
  SeparateCredits?: boolean;
  AutoAllocate: boolean;
  CreditAmount: number;
}
