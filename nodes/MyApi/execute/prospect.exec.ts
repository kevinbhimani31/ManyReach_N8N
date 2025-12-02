import { IExecuteFunctions } from 'n8n-workflow';
import { createProspect } from '../resources/Prospect/prospect.create';
import { getAllProspects } from '../resources/Prospect/prospect.getAll';
import { bulkAddProspects } from '../resources/Prospect/prospect.bulkAdd';
import { getProspectById } from '../resources/Prospect/prospect.getById';

export async function executeProspect(this: IExecuteFunctions, operation: string, i: number): Promise<any> {
  switch (operation) {
    case 'getAll':
      return await getAllProspects.call(this, i);
    case 'bulkAdd':
      return await bulkAddProspects.call(this, i);
    case 'getById':
      return await getProspectById.call(this, i);
    case 'create':
      return await createProspect.call(this, i);
    default:
      throw new Error(`Operation "${operation}" not supported for Prospect`);
  }
}


