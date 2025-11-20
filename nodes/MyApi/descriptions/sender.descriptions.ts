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
      { name: 'Create', value: 'create' },
      { name: 'Update', value: 'update' },
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

  createField({
    displayName: 'Starting After',
    name: 'startingAfter',
    type: 'number',
    resource: 'sender',
    operations: ['getAll'],
  }),

  // Sender ID
  createField({
    displayName: 'Sender',
    name: 'senderId',
    type: 'resourceLocator',
    default: {
      mode: 'list',
      value: '',
    },
    description: 'Select a sender from the list or enter its ID manually',
    resource: 'sender',
    operations: ['getById', 'update', 'delete'],
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
        placeholder: 'Enter sender ID',
                validation: [
          {
            type: 'regex',
            properties: {
              regex: '^\\d+$',
              errorMessage: 'Only numeric IDs are allowed',
            },
          },
        ],
      },
    ],
  }),

  createField({
    displayName: 'Email',
    name: 'Email',
    type: 'string',
    description: 'Email of the sender',
    required: true,
    resource: 'sender',
    operations: ["create"],
  }),

  createField({
    displayName: 'FirstName',
    name: 'FirstName',
    type: 'string',
    description: 'FirstName of the sender',
    required: true,
    resource: 'sender',
    operations: ["update"],
  }),

  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: { resource: ['sender'], operation: ['update'] },
    },
    options: [
      // Add update fields here
    ],
  },
];
