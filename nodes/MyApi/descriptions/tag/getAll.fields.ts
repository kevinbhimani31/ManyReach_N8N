import { INodeProperties } from 'n8n-workflow';
import { createField } from '../common/fields';

export const tagGetAllFields: INodeProperties[] = [
  createField({
    displayName: 'Page',
    name: 'page',
    type: 'number',
    description: 'Page',
    default: 1,
    resource: 'tag',
    operations: ['getAll'],
  }),

  createField({
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 100,
    resource: 'tag',
    operations: ['getAll'],
  }),
];
