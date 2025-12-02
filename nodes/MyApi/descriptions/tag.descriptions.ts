import { INodeProperties } from 'n8n-workflow';
import { createField } from '../descriptions/common/fields';
import { tagGetAllFields } from './tag/getAll.fields';
import { tagGetByIdFields } from './tag/getById.fields';
import { tagDeleteFields } from './tag/delete.fields';

import { tagCreateFields } from './tag/create.fields';
export const tagOperations: INodeProperties[] = [
  createField({
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    resource: 'tag',
    default: 'getAll',
    optionsList: [

{ name: 'Get All', value: 'getAll' },
      { name: 'Get By ID', value: 'getById' },
      { name: 'Delete', value: 'delete' },
      { name: 'Create', value: 'create' },
],
  }),
];

export const tagFields: INodeProperties[] = [
  ...tagGetAllFields,
  ...tagGetByIdFields,
  ...tagDeleteFields,

  ...tagCreateFields,
];


