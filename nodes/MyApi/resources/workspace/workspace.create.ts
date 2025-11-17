import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

export async function createWorkspace(this: IExecuteFunctions, index: number) {
  const workspaceTitle = this.getNodeParameter('workspaceTitle', index) as string;

  if (!workspaceTitle || (typeof workspaceTitle === 'string' && workspaceTitle.trim() === '')) {
    throw new Error('Workspace Title is required');
  }

  const body: any = {};
  console.log('workspaceTitle:', workspaceTitle);
  body.Title = workspaceTitle;

  const response = await apiRequest.call(this, 'POST', `/workspaces`, body);

  return response;
}
