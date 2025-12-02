import { IExecuteFunctions } from 'n8n-workflow';
import { getAllLists } from '../resources/list/list.getAll';
import { getListById } from '../resources/list/list.getById';
import { createList } from '../resources/list/list.create';
import { updateList } from '../resources/list/list.update';

export async function executeList(this: IExecuteFunctions, operation: string, i: number): Promise<any> {
  switch (operation) {
    case 'getAll':
      return await getAllLists.call(this, i);
    case 'getById':
      return await getListById.call(this, i);
    case 'create':
      return await createList.call(this, i);
    case 'update':
      return await updateList.call(this, i);
    default:
      throw new Error(`Operation "${operation}" not supported for List`);
  }
}


