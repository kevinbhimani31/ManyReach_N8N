import { IExecuteFunctions } from 'n8n-workflow';
import { getAllSequences } from '../resources/sequence/sequence.getAll';

export async function executeSequence(this: IExecuteFunctions, operation: string, i: number): Promise<any> {
  switch (operation) {
    case 'getAll':
      return await getAllSequences.call(this, i);
    default:
      throw new Error(`Operation "${operation}" not supported for Sequence`);
  }
}


