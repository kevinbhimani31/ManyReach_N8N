import { INodeProperties } from 'n8n-workflow';
import { createField } from '../descriptions/common/fields';

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
      { name: 'Delete', value: 'delete' }
    ],
  }),
];

export const userFields: INodeProperties[] = [
  // === getAll fields ===
    createField({
      displayName: 'Page',
      name: 'page',
      type: 'number',
      description: 'Page',
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

  // === getById fields ===
    createField({
      displayName: 'User',
      name: 'userId',
      type: 'resourceLocator',
      description: 'Select a user from the list or enter the user ID (GUID)',
      resource: 'user',
      operations: ['getById'],
      modes: [{"displayName":"From list","name":"list","type":"list","typeOptions":{"searchListMethod":"searchUsers","searchable":true,"searchFilterRequired":false}},{"displayName":"By ID","name":"id","type":"string","placeholder":"Enter user ID (GUID)","validation":[{"type":"regex","properties":{"regex":"^[0-9a-fA-F]{8}\\\\b-[0-9a-fA-F]{4}\\\\b-[1-5][0-9a-fA-F]{3}\\\\b-[89abAB][0-9a-fA-F]{3}\\\\b-[0-9a-fA-F]{12}$","errorMessage":"Enter a valid GUID"}}]}],
    }),

  // === create fields ===
    createField({
      displayName: 'Email',
      name: 'Email',
      type: 'string',
      description: 'Email for creating a user',
      required: true,
      resource: 'user',
      operations: ['create'],
    }),
    createField({
      displayName: 'FirstName',
      name: 'FirstName',
      type: 'string',
      description: 'First name',
      resource: 'user',
      operations: ['create'],
    }),
    createField({
      displayName: 'LastName',
      name: 'LastName',
      type: 'string',
      description: 'Last name',
      resource: 'user',
      operations: ['create'],
    }),
    createField({
      displayName: 'Active',
      name: 'Active',
      type: 'boolean',
      description: 'Active status',
      default: false,
      resource: 'user',
      operations: ['create'],
    }),
    createField({
      displayName: 'AccountType',
      name: 'AccountType',
      type: 'options',
      description: 'User role',
      default: 30,
      optionsList: [{"name":"User","value":30,"description":"User"},{"name":"Admin","value":100,"description":"Admin"},{"name":"Super Admin","value":110,"description":"Super Admin"}],
      resource: 'user',
      operations: ['create'],
    }),

  // === update fields ===
    createField({
      displayName: 'User',
      name: 'userId',
      type: 'resourceLocator',
      description: 'Select a user or enter the user ID (GUID)',
      resource: 'user',
      operations: ['update'],
      modes: [{"displayName":"From list","name":"list","type":"list","typeOptions":{"searchListMethod":"searchUsers","searchable":true,"searchFilterRequired":false}},{"displayName":"By ID","name":"id","type":"string","placeholder":"Enter user ID (GUID)"}],
    }),
    createField({
      displayName: 'FirstName',
      name: 'FirstName',
      type: 'string',
      description: 'First name',
      resource: 'user',
      operations: ['update'],
    }),
    createField({
      displayName: 'LastName',
      name: 'LastName',
      type: 'string',
      description: 'Last name',
      resource: 'user',
      operations: ['update'],
    }),
    createField({
      displayName: 'Active',
      name: 'Active',
      type: 'boolean',
      description: 'Active status',
      resource: 'user',
      operations: ['update'],
    }),
    createField({
      displayName: 'AccountType',
      name: 'AccountType',
      type: 'options',
      description: 'User role',
      optionsList: [{"name":"User","value":30,"description":"User"},{"name":"Admin","value":100,"description":"Admin"},{"name":"Super Admin","value":110,"description":"Super Admin"}],
      resource: 'user',
      operations: ['update'],
    }),

  // === delete fields ===
    createField({
      displayName: 'User',
      name: 'userId',
      type: 'resourceLocator',
      description: 'Select a user or enter the user ID (GUID)',
      resource: 'user',
      operations: ['delete'],
      modes: [{"displayName":"From list","name":"list","type":"list","typeOptions":{"searchListMethod":"searchUsers","searchable":true,"searchFilterRequired":false}},{"displayName":"By ID","name":"id","type":"string","placeholder":"Enter user ID (GUID)"}],
    }),

];
