import { IExecuteFunctions } from 'n8n-workflow';
import { getAllClientspaces } from '../resources/clientspace/clientspace.getAll';
import { getClientspaceById } from '../resources/clientspace/clientspace.getById';
import { createClientspace } from '../resources/clientspace/clientspace.create';
import { updateClientspace } from '../resources/clientspace/clientspace.update';
import { deleteClientspace } from '../resources/clientspace/clientspace.delete';

export async function executeClientspace(this: IExecuteFunctions, operation: string, i: number): Promise<any> {
  switch (operation) {
    case 'getAll':
      return await getAllClientspaces.call(this, i);
    case 'getById':
      return await getClientspaceById.call(this, i);
    case 'create':
      return await createClientspace.call(this, i);
    case 'update':
      return await updateClientspace.call(this, i);
    case 'delete':
      return await deleteClientspace.call(this, i);
    default:
      throw new Error(`Operation "${operation}" not supported for Clientspace`);
  }
}


