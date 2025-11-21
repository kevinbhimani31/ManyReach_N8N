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
      { name: 'Delete', value: 'delete' },
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
    default: 0,
    description: 'Last workspace ID from previous page (cursor)',
    resource: 'workspace',
    operations: ['getAll'],
  }),

  // Get By ID - resource locator
  createField({
    displayName: 'Workspace',
    name: 'workspaceId',
    type: 'resourceLocator',
    description: 'Select a workspace or enter the organization ID',
    resource: 'workspace',
    operations: ['getById', 'delete'],
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
        placeholder: 'Enter organization ID (number)',
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


