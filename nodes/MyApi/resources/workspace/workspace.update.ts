import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

export async function updateWorkspace(this: IExecuteFunctions, index: number) {
  const workspaceId = this.getNodeParameter('workspaceId', index) as string;
  const id = typeof workspaceId === 'object' ? workspaceId : workspaceId;
  const workspaceTitle = this.getNodeParameter('workspaceTitle', index) as string;

  const body: any = {};
  if (workspaceTitle !== undefined && workspaceTitle !== '') {
    body.workspaceTitle = workspaceTitle;
  }

  const updateFields = this.getNodeParameter('updateFields', index, {}) as any;
  Object.assign(body, updateFields);

  const response = await apiRequest.call(this, 'PATCH', `/workspaces/${id}`, body);

  return response;
}
