import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensureId, extractNumericId } from '../../helpers/validation';

export async function deleteWorkspace(this: IExecuteFunctions, index: number) {
  const rawId = this.getNodeParameter('workspaceId', index) as any;
  const id = extractNumericId(rawId, 'Workspace ID');
  ensureId(id);

  const response = await apiRequest.call(this, 'DELETE', `/workspaces/${id}`);

  return response ?? { success: true, id };
}


