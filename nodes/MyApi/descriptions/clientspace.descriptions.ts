import { INodeProperties } from 'n8n-workflow';
import { createField } from '../descriptions/common/fields';

export const clientspaceOperations: INodeProperties[] = [
  createField({
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    resource: 'clientspace',
    default: 'getAll',
    optionsList: [
      { name: 'Get All', value: 'getAll' },
      { name: 'Get By ID', value: 'getById' },
      { name: 'Create', value: 'create' },
    ],
  }),
];

export const clientspaceFields: INodeProperties[] = [
  // Pagination
  createField({
    displayName: 'Page',
    name: 'page',
    type: 'number',
    default: 1,
    resource: 'clientspace',
    operations: ['getAll'],
  }),

  createField({
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 100,
    resource: 'clientspace',
    operations: ['getAll'],
  }),

  // Starting After
  createField({
    displayName: 'Starting After',
    name: 'startingAfter',
    type: 'number',
    resource: 'clientspace',
    operations: ['getAll'],
  }),

  // Clientspace ID
  createField({
    displayName: 'Clientspace ID',
    name: 'clientspaceId',
    type: 'number',
    resource: 'clientspace',
    operations: ['getById'],
  }),

  // Body
 createField({
    displayName: 'Title',
    name: 'Title',
    type: 'string',
    description: 'Title for creating or updating a clientspace',
    resource: 'clientspace',
    operations: ['create'],
  }),

  createField({
    displayName: 'SeparateCredits',
    name: 'SeparateCredits',
    type: 'boolean',
    description: 'SeparateCredits for creating or updating a clientspace',
    resource: 'clientspace',
    operations: ['create', 'update'],
  }),

  createField({
    displayName: 'AutoAllocate',
    name: 'AutoAllocate',
    type: 'boolean',
    description: 'AutoAllocate for creating or updating a clientspace',
    resource: 'clientspace',
    operations: ['create', 'update'],
  }),

  createField({
    displayName: 'CreditAmount',
    name: 'CreditAmount',
    type: 'number',
    description: 'CreditAmount for creating or updating a clientspace',
    resource: 'clientspace',
    operations: ['create', 'update'],
  }),

];
