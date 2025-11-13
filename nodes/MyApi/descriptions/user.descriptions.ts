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
    displayName: 'Email',
    name: 'Email',
    type: 'string',
    description: 'Email for creating or updating a user',
    resource: 'user',
    operations: ['create'],
  }),

  createField({
    displayName: 'FirstName',
    name: 'FirstName',
    type: 'string',
    description: 'FirstName for creating or updating a user',
    resource: 'user',
    operations: ['create', 'update'],
  }),
  createField({
    displayName: 'LastName',
    name: 'LastName',
    type: 'string',
    description: 'LastName for creating or updating a user',
    resource: 'user',
    operations: ['create', 'update'],
  }),

  createField({
    displayName: 'Active',
    name: 'Active',
    type: 'boolean',
    description: 'boolean for creating or updating a user',
    resource: 'user',
    operations: ['create', 'update'],
  }),

  createField({
    displayName: 'AccountType',
    name: 'AccountType',
    type: 'number',
    description: 'AccountType for creating or updating a user',
    resource: 'user',
    operations: ['create', 'update'],
  }),

];
