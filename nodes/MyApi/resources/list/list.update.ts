import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensureId, extractNumericId } from '../../helpers/validation';

export async function updateList(this: IExecuteFunctions, index: number) {
  const rawId = this.getNodeParameter('listId', index) as any;
  const id = extractNumericId(rawId, 'List ID');
  ensureId(id);

  const title = this.getNodeParameter('Title', index) as string;
  const folderId = this.getNodeParameter('FolderId', index, null) as number | null;

  if (!title || title.trim() === '') {
    throw new Error('Title is required');
  }

  const request: UpdateListRequest = {
    Title: title.trim(),
  };

  if (folderId !== null && folderId !== undefined && folderId !== 0) {
    request.FolderId = folderId;
  }

  const response = await apiRequest.call(this, 'PATCH', `/lists/${id}`, request);

  if (!response) {
    throw new Error('Failed to update list: Empty API response');
  }

  return response;
}

export interface UpdateListRequest {
  Title: string;
  FolderId?: number;
}

