import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensureId, extractNumericId } from '../../helpers/validation';

export async function getWorkspaceById(this: IExecuteFunctions, index: number) {
  const rawId = this.getNodeParameter('workspaceId', index) as any;
  const id = extractNumericId(rawId, 'Workspace ID');
  ensureId(id);

  const response = await apiRequest.call(this, 'GET', `/workspaces/${id}`);

  if (!response) {
    throw new Error(`Workspace with ID ${id} not found`);
  }

  return response;
}


