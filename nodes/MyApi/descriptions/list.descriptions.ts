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
      { name: 'Get By ID', value: 'getById' },
      { name: 'Create', value: 'create' },
      { name: 'Update', value: 'update' },
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

  // Get By ID and Update - resource locator
  createField({
    displayName: 'List',
    name: 'listId',
    type: 'resourceLocator',
    description: 'Select a list from the list or enter the list ID manually',
    resource: 'list',
    operations: ['getById', 'update'],
    required: true,
    modes: [
      {
        displayName: 'From list',
        name: 'list',
        type: 'list',
        placeholder: 'Select a list...',
        typeOptions: {
          searchListMethod: 'searchLists',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'Enter list ID (number)',
        validation: [
          {
            type: 'regex',
            properties: {
              regex: '^[0-9]+$',
              errorMessage: 'Enter a valid numeric ID',
            },
          },
        ],
      },
    ],
  }),

  // Create List Fields
  createField({
    displayName: 'Title',
    name: 'Title',
    type: 'string',
    description: 'Title of the list',
    resource: 'list',
    operations: ['create'],
    required: true,
  }),

  createField({
    displayName: 'Folder ID',
    name: 'FolderId',
    type: 'number',
    description: 'Optional folder ID to organize the list. Leave empty or set to 0 if not using folders.',
    resource: 'list',
    operations: ['create'],
    default: 0,
  }),

  // Update List Fields
  createField({
    displayName: 'Title',
    name: 'Title',
    type: 'string',
    description: 'Title of the list',
    resource: 'list',
    operations: ['update'],
    required: true,
  }),

  createField({
    displayName: 'Folder ID',
    name: 'FolderId',
    type: 'number',
    description: 'Optional folder ID to organize the list. Leave empty or set to 0 if not using folders.',
    resource: 'list',
    operations: ['update'],
    default: 0,
  }),
];
