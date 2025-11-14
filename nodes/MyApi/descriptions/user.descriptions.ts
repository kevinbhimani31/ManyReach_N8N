import { INodeProperties } from 'n8n-workflow';
import { createField } from '../descriptions/common/fields';
import { CreateUserRoles } from '../resources/user/user.create';
import { UpdateUserRoles } from '../resources/user/user.update';

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
    displayName: 'User',
    name: 'userId',
    type: 'resourceLocator',
    description: 'Select a user from the list or enter the user ID manually',
    resource: 'user',
    operations: ['getById', 'update', 'delete'],
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
        placeholder: 'Enter user ID (GUID)',
        validation: [
          {
            type: 'regex',
            properties: {
              regex: '^[0-9a-fA-F]{8}\\b-[0-9a-fA-F]{4}\\b-[1-5][0-9a-fA-F]{3}\\b-[89abAB][0-9a-fA-F]{3}\\b-[0-9a-fA-F]{12}$',
              errorMessage: 'Enter a valid GUID',
            },
          },
        ],
      },
    ],
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
    type: 'options',
    description: 'AccountType for creating a user',
    resource: 'user',
    operations: ['create'],
    optionsList: CreateUserRoles,
  }),

  createField({
    displayName: 'AccountType',
    name: 'AccountType',
    type: 'options',
    description: 'AccountType for updating a user',
    resource: 'user',
    operations: ['update'],
    optionsList: UpdateUserRoles,
  }),

];
