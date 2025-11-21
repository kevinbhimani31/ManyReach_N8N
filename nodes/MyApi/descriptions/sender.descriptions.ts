import { INodeProperties } from 'n8n-workflow';
import { createField } from '../descriptions/common/fields';

export const senderOperations: INodeProperties[] = [
  createField({
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    resource: 'sender',
    default: 'getAll',
    optionsList: [
      { name: 'Get All', value: 'getAll' },
      { name: 'Get By ID', value: 'getById' },
      // { name: 'Create', value: 'create' },
      // { name: 'Update', value: 'update' },
      { name: 'Delete', value: 'delete' },
    ],
  }),
];

export const senderFields: INodeProperties[] = [
  // Pagination
  createField({
    displayName: 'Page',
    name: 'page',
    type: 'number',
    default: 1,
    resource: 'sender',
    operations: ['getAll'],
  }),

  createField({
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 100,
    resource: 'sender',
    operations: ['getAll'],
  }),

  // Filters
  createField({
    displayName: 'Folder',
    name: 'folder',
    type: 'string',
    default: '',
    description: 'Filter by folder name',
    resource: 'sender',
    operations: ['getAll'],
  }),

  createField({
    displayName: 'Status',
    name: 'status',
    type: 'string',
    default: '',
    description: 'Filter by status',
    resource: 'sender',
    operations: ['getAll'],
  }),

  createField({
    displayName: 'Warm',
    name: 'warm',
    type: 'options',
    default: 'any',
    description: 'Filter by warmup status',
    resource: 'sender',
    operations: ['getAll'],
    optionsList: [
      { name: 'Any', value: 'any' },
      { name: 'Enabled', value: 'true' },
      { name: 'Disabled', value: 'false' },
    ],
  }),

  createField({
    displayName: 'Search',
    name: 'search',
    type: 'string',
    default: '',
    description: 'Case-insensitive contains match on name or email',
    resource: 'sender',
    operations: ['getAll'],
  }),

  createField({
    displayName: 'Starting After',
    name: 'startingAfter',
    type: 'number',
    default: 0,
    description: 'Cursor for next page (omit or 0 to ignore)',
    resource: 'sender',
    operations: ['getAll'],
  }),

  // Get By ID
  createField({
    displayName: 'Sender',
    name: 'senderId',
    type: 'resourceLocator',
    description: 'Select a sender from the list or enter the sender ID manually',
    resource: 'sender',
    operations: ['getById', 'delete'],
    modes: [
      {
        displayName: 'From list',
        name: 'list',
        type: 'list',
        placeholder: 'Select a sender...',
        typeOptions: {
          searchListMethod: 'searchSenders',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'Enter sender ID (number)',
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
];
