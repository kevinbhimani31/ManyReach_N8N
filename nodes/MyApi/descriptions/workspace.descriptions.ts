import { INodeProperties } from 'n8n-workflow';
import { createField } from '../descriptions/common/fields';

export const workspaceOperations: INodeProperties[] = [
  createField({
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    resource: 'workspace',
    default: 'getAll',
    optionsList: [
      { name: 'Get All', value: 'getAll' },
      { name: 'Get By ID', value: 'getById' },
      { name: 'Create', value: 'create' },
      { name: 'Update', value: 'update' },
    ],
  }),
];

export const workspaceFields: INodeProperties[] = [
  // Pagination
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
    resource: 'workspace',
    operations: ['getAll'],
  }),

  // Workspace ID
  createField({
    displayName: 'Workspace',
    name: 'workspaceId',
    type: 'resourceLocator',
    default: {
      mode: 'list',
      value: '',
    },
    description: 'Select a workspace from the list or enter its ID manually',
    resource: 'workspace',
    operations: ['getById', 'update', 'delete'],
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
              regex: '^\\d+$',
              errorMessage: 'Only numeric IDs are allowed',
            },
          },
        ],
      },
    ],
  }),

  createField({
    displayName: 'Workspace Title',
    name: 'workspaceTitle',
    type: 'string',
    description: 'Title of the workspace',
    required: true,
    resource: 'workspace',
  }),

  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: { resource: ['workspace'], operation: ['update'] },
    },
    options: [
      // Add update fields here
    ],
  },
];
