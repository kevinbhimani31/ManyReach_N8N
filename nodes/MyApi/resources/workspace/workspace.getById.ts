import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

export async function getWorkspaceById(this: IExecuteFunctions, index: number) {
  const workspaceId = this.getNodeParameter('workspaceId', index) as string;
  const id = typeof workspaceId === 'object' ? workspaceId : workspaceId;

  const response = await apiRequest.call(this, 'GET', `/workspaces/${id}`);

  return response;
}
