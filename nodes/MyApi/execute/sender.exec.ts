import { IExecuteFunctions } from 'n8n-workflow';
import { getAllSenders } from '../resources/sender/sender.getAll';
import { getSenderById } from '../resources/sender/sender.getById';
import { deleteSender } from '../resources/sender/sender.delete';

export async function executeSender(this: IExecuteFunctions, operation: string, i: number): Promise<any> {
  switch (operation) {
    case 'getAll':
      return await getAllSenders.call(this, i);
    case 'getById':
      return await getSenderById.call(this, i);
    case 'delete':
      return await deleteSender.call(this, i);
    default:
      throw new Error(`Operation "${operation}" not supported for Sender`);
  }
}


