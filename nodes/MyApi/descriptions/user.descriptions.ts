import { INodeProperties } from 'n8n-workflow';
import { createField } from '../descriptions/common/fields';

export const userOperations: INodeProperties[] = [
  createField({
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    resource: 'user',
    default: 'getAll',
    optionsList: [
      { name: 'Get All', value: 'getAll' },
      { name: 'Get By ID', value: 'getById' },
      { name: 'Create', value: 'create' },
      { name: 'Update', value: 'update' },
      { name: 'Delete', value: 'delete' },
    ],
  }),
];

export const userFields: INodeProperties[] = [
  // Pagination
  createField({
    displayName: 'Page',
    name: 'page',
    type: 'number',
    default: 1,
    resource: 'user',
    operations: ['getAll'],
  }),

  createField({
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 100,
    resource: 'user',
    operations: ['getAll'],
  }),

  // User ID
  createField({
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    resource: 'user',
    operations: ['getById', 'update', 'delete'],
  }),

  // User Body
  createField({
    displayName: 'User Body',
    name: 'userBody',
    type: 'json',
    description: 'JSON object for creating or updating a user',
    resource: 'user',
    operations: ['create', 'update'],
  }),
];
