import { INodeProperties } from 'n8n-workflow';
import { createField } from '../descriptions/common/fields';

export const prospectOperations: INodeProperties[] = [
  createField({
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    resource: 'prospect',
    default: 'create',
    optionsList: [
      { name: 'Create', value: 'create' },
    ],
  }),
];

export const prospectFields: INodeProperties[] = [
  createField({
    displayName: 'Email',
    name: 'Email',
    type: 'string',
    description: 'Email for create a prospect',
    resource: 'prospect',
    operations: ['create'],
    placeholder: 'Test@example.com',
  }),
  createField({
    displayName: 'First Name',
    name: 'FirstName',
    type: 'string',
    description: 'FirstName for create a prospect',
    resource: 'prospect',
    operations: ['create'],
  }),
  createField({
    displayName: 'Last Name',
    name: 'LastName',
    type: 'string',
    description: 'LastName for create a prospect',
    resource: 'prospect',
    operations: ['create'],
  }),
  createField({
    displayName: 'Company',
    name: 'company',
    type: 'string',
    description: 'company for create a prospect',
    resource: 'prospect',
    operations: ['create'],
  }),
  createField({
    displayName: 'Base List',
    name: 'baseListId',
    type: 'options',
    default: 0,
    description: 'Select the list to add this prospect to',
    typeOptions: {
      loadOptionsMethod: 'getLists',
      customValue: true,
      customValueType: 'number',
    },
    resource: 'prospect',
    operations: ['create'],
  }),
];
