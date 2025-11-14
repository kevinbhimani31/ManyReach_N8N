import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensureId, extractNumericId } from '../../helpers/validation';

export async function deleteClientspace(this: IExecuteFunctions, index: number) {
  const rawId = this.getNodeParameter('clientspaceId', index) as any;
  const id = extractNumericId(rawId, 'Clientspace ID');
  ensureId(id);

  // depending on API semantics, you may do soft-delete or hard-delete
  const response = await apiRequest.call(this, 'DELETE', `/clientspaces/${id}`);

  // If API returns no content, return success body
  return response ?? { success: true, id };
}
