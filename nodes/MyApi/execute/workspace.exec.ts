import { IExecuteFunctions } from 'n8n-workflow';
import { getAllWorkspaces } from '../resources/workspace/workspace.getAll';
import { getWorkspaceById } from '../resources/workspace/workspace.getById';
import { deleteWorkspace } from '../resources/workspace/workspace.delete';

export async function executeWorkspace(this: IExecuteFunctions, operation: string, i: number): Promise<any> {
  switch (operation) {
    case 'getAll':
      return await getAllWorkspaces.call(this, i);
    case 'getById':
      return await getWorkspaceById.call(this, i);
    case 'delete':
      return await deleteWorkspace.call(this, i);
    default:
      throw new Error(`Operation "${operation}" not supported for Workspace`);
  }
}


