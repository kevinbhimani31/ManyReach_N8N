import { INodeProperties } from 'n8n-workflow';
import { createField } from '../descriptions/common/fields';

export const listOperations: INodeProperties[] = [
  createField({
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    resource: 'list',
    default: 'getAll',
    optionsList: [
      { name: 'Get All', value: 'getAll' },
    ],
  }),
];

export const listFields: INodeProperties[] = [
  // Pagination
  createField({
    displayName: 'Page',
    name: 'page',
    type: 'number',
    default: 1,
    resource: 'list',
    operations: ['getAll'],
  }),
   createField({
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 100,
    resource: 'list',
    operations: ['getAll'],
  }),

  // Starting After
  createField({
    displayName: 'Starting After',
    name: 'startingAfter',
    type: 'number',
    resource: 'list',
    operations: ['getAll'],
  }),
];
