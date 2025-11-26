import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

export async function createList(this: IExecuteFunctions, index: number) {
  const title = this.getNodeParameter('Title', index) as string;
  const folderId = this.getNodeParameter('FolderId', index, null) as number | null;

  if (!title || title.trim() === '') {
    throw new Error('Title is required');
  }

  const request: CreateListRequest = {
    Title: title.trim(),
  };

  if (folderId !== null && folderId !== undefined && folderId !== 0) {
    request.FolderId = folderId;
  }

  const response = await apiRequest.call(this, 'POST', '/lists', request);

  if (!response) {
    throw new Error('Failed to create list: Empty API response');
  }

  return response;
}

export interface CreateListRequest {
  Title: string;
  FolderId?: number;
}

