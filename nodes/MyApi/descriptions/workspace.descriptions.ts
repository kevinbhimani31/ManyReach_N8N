import { INodeProperties } from 'n8n-workflow';
import { createField } from './common/fields';

export const workspaceOperations: INodeProperties[] = [
  createField({
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    resource: 'workspace',
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

export const workspaceFields: INodeProperties[] = [
  createField({
    displayName: 'Page',
    name: 'page',
    type: 'number',
    default: 1,
    resource: 'workspace',
    operations: ['getAll'],
  }),

  createField({
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 100,
    resource: 'workspace',
    operations: ['getAll'],
  }),

  createField({
    displayName: 'Starting After',
    name: 'startingAfter',
    type: 'number',
    default: 0,
    description: 'Cursor for next page (optional, for cursor-based pagination)',
    resource: 'workspace',
    operations: ['getAll'],
    
  }),

  createField({
    displayName: 'Title',
    name: 'title',
    type: 'string',
    default: '',
    description: 'Display name of the workspace; maximum 256 characters.',
    resource: 'workspace',
    operations: ['create'],
    required: true,
  }),

  createField({
    displayName: 'Workspace',
    name: 'workspaceId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a workspace from the list or enter its ID',
    resource: 'workspace',
    operations: ['getById'],
    modes: [
      {
        displayName: 'From list',
        name: 'list',
        type: 'list',
        placeholder: 'Select a workspace...',
        typeOptions: {
          searchListMethod: 'searchWorkspaces',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'Enter workspace ID',
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
    displayName: 'Workspace',
    name: 'workspaceId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a workspace from the list or enter its ID',
    resource: 'workspace',
    operations: ['delete'],
    modes: [
      {
        displayName: 'From list',
        name: 'list',
        type: 'list',
        placeholder: 'Select a workspace...',
        typeOptions: {
          searchListMethod: 'searchWorkspaces',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'Enter workspace ID',
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
    displayName: 'Workspace',
    name: 'workspaceId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a workspace from the list or enter its ID',
    resource: 'workspace',
    operations: ['update'],
    modes: [
      {
        displayName: 'From list',
        name: 'list',
        type: 'list',
        placeholder: 'Select a workspace...',
        typeOptions: {
          searchListMethod: 'searchWorkspaces',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'Enter workspace ID',
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
      show: { resource: ['workspace'], operation: ['update'] },
    },
    options: [
    { displayName: 'Title', name: 'title', type: 'string', default: '' }
    ],
  }
];
