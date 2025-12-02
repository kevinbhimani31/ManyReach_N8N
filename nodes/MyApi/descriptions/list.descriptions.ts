import { INodeProperties } from 'n8n-workflow';
import { createField } from './common/fields';

export const listOperations: INodeProperties[] = [
  createField({
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    resource: 'list',
    default: 'getAll',
    optionsList: [
      { name: 'Get All', value: 'getAll' },
      { name: 'Create', value: 'create' },
      { name: 'Get By ID', value: 'getById' },
      { name: 'Update', value: 'update' }
    ],
  }),
];

export const listFields: INodeProperties[] = [
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

  createField({
    displayName: 'Starting After',
    name: 'startingAfter',
    type: 'number',
    default: 0,
    description: 'Cursor for next page (optional, for cursor-based pagination)',
    resource: 'list',
    operations: ['getAll'],
    
  }),

  createField({
    displayName: 'Title',
    name: 'title',
    type: 'string',
    default: '',
    description: 'Display name of the mailing list; maximum 256 characters.',
    resource: 'list',
    operations: ['create'],
    required: true,
  }),

  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    default: {},
    placeholder: 'Add Field',
    displayOptions: {
      show: { resource: ['list'], operation: ['create'] },
    },
    options: [
    { displayName: 'Folder Id', name: 'folderId', type: 'number', default: 0 }
    ],
  },

  createField({
    displayName: 'List',
    name: 'listId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a list from the list or enter its ID',
    resource: 'list',
    operations: ['getById'],
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
        placeholder: 'Enter list ID',
        validation: [
          {
            type: 'regex',
            properties: {
              regex: '^\\\\d+$',
              errorMessage: 'Only numeric IDs are allowed',
            },
          },
        ],
      },
    ],
  }),

  createField({
    displayName: 'List',
    name: 'listId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a list from the list or enter its ID',
    resource: 'list',
    operations: ['update'],
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
        placeholder: 'Enter list ID',
        validation: [
          {
            type: 'regex',
            properties: {
              regex: '^\\\\d+$',
              errorMessage: 'Only numeric IDs are allowed',
            },
          },
        ],
      },
    ],
  }),

  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    default: {},
    placeholder: 'Add Field',
    displayOptions: {
      show: { resource: ['list'], operation: ['update'] },
    },
    options: [
    { displayName: 'Folder Id', name: 'folderId', type: 'number', default: 0 },
    { displayName: 'Title', name: 'title', type: 'string', default: '' }
    ],
  }
];
