import { INodeProperties } from 'n8n-workflow';
import { createField } from '../common/fields';

export const tagCreateFields: INodeProperties[] = [
  createField({
    displayName: 'Title',
    name: 'Title',
    type: 'string',
    resource: 'tag',
    operations: ['create'],
  }),

  createField({
    displayName: 'Description',
    name: 'Description',
    type: 'string',
    resource: 'tag',
    operations: ['create'],
  }),
];
