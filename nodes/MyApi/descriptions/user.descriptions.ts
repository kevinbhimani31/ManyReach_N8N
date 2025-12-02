import { INodeProperties } from 'n8n-workflow';
import { createField } from './common/fields';

export const userOperations: INodeProperties[] = [
  createField({
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    resource: 'user',
    default: 'getAll',
    optionsList: [
      { name: 'Get All', value: 'getAll' },
      { name: 'Create', value: 'create' },
      { name: 'Get By ID', value: 'getById' },
      { name: 'Delete', value: 'delete' },
      { name: 'Update', value: 'update' }
    ],
  }),
];

export const userFields: INodeProperties[] = [
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

  createField({
    displayName: 'Starting After',
    name: 'startingAfter',
    type: 'string',
    default: '',
    description: 'Cursor for next page (optional, for cursor-based pagination)',
    resource: 'user',
    operations: ['getAll'],
    
  }),

  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    default: {},
    placeholder: 'Add Field',
    displayOptions: {
      show: { resource: ['user'], operation: ['create'] },
    },
    options: [
    { displayName: 'Email', name: 'email', type: 'string', default: '' },
    { displayName: 'First Name', name: 'firstName', type: 'string', default: '' },
    { displayName: 'Last Name', name: 'lastName', type: 'string', default: '' },
    { displayName: 'Account Type', name: 'accountType', type: 'string', default: '' }
    ],
  },

  createField({
    displayName: 'User',
    name: 'userId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a user from the list or enter its ID',
    resource: 'user',
    operations: ['getById'],
    modes: [
      {
        displayName: 'From list',
        name: 'list',
        type: 'list',
        placeholder: 'Select a user...',
        typeOptions: {
          searchListMethod: 'searchUsers',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'Enter user ID',
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
    displayName: 'User',
    name: 'userId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a user from the list or enter its ID',
    resource: 'user',
    operations: ['delete'],
    modes: [
      {
        displayName: 'From list',
        name: 'list',
        type: 'list',
        placeholder: 'Select a user...',
        typeOptions: {
          searchListMethod: 'searchUsers',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'Enter user ID',
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
      show: { resource: ['user'], operation: ['update'] },
    },
    options: [
    { displayName: 'First Name', name: 'firstName', type: 'string', default: '' },
    { displayName: 'Last Name', name: 'lastName', type: 'string', default: '' },
    { displayName: 'Account Type', name: 'accountType', type: 'string', default: '' }
    ],
  },

  createField({
    displayName: 'User',
    name: 'userId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a user from the list or enter its ID',
    resource: 'user',
    operations: ['update'],
    modes: [
      {
        displayName: 'From list',
        name: 'list',
        type: 'list',
        placeholder: 'Select a user...',
        typeOptions: {
          searchListMethod: 'searchUsers',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'Enter user ID',
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
  })
];
