import { IExecuteFunctions } from 'n8n-workflow';
import { getAllTags } from '../resources/tag/tag.getAll';
import { getTagById } from '../resources/tag/tag.getById';
import { deleteTag } from '../resources/tag/tag.delete';

export async function executeTag(this: IExecuteFunctions, operation: string, i: number): Promise<any> {
  switch (operation) {
    case 'getAll':
      return await getAllTags.call(this, i);
    case 'getById':
      return await getTagById.call(this, i);
    case 'delete':
      return await deleteTag.call(this, i);
    default:
      throw new Error(`Operation "${operation}" not supported for Tag`);
  }
}


