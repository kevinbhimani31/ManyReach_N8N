import { INodeProperties } from 'n8n-workflow';
import { createField } from '../descriptions/common/fields';

export const campaignOperations: INodeProperties[] = [
  createField({
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    resource: 'campaign',
    default: 'getAll',
    optionsList: [
      { name: 'Get All', value: 'getAll' },
      { name: 'Get By ID', value: 'getById' },
      { name: 'Create', value: 'create' },
    ],
  }),
];

export const campaignFields: INodeProperties[] = [
  // Pagination
  createField({
    displayName: 'Page',
    name: 'page',
    type: 'number',
    default: 1,
    resource: 'campaign',
    operations: ['getAll'],
  }),

  createField({
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 100,
    resource: 'campaign',
    operations: ['getAll'],
  }),

  // Starting After
  createField({
    displayName: 'Starting After',
    name: 'startingAfter',
    type: 'number',
    resource: 'campaign',
    operations: ['getAll'],
  }),

  // Clientspace ID
  createField({
    displayName: 'Campaign ID',
    name: 'campaignId',
    type: 'number',
    resource: 'campaign',
    operations: ['getById'],
  }),

  // Create
  createField({
    displayName: 'Campaign Name',
    name: 'campaignName',
    type: 'string',
    description: 'Campaign Name to create a clientspace',
    resource: 'campaign',
    operations: ['create'],
  }),
  createField({
    displayName: 'Campaign Description',
    name: 'campaignDescription',
    type: 'string',
    description: 'Campaign Description to create a clientspace',
    resource: 'campaign',
    operations: ['create'],
  }),
  {
  displayName: 'Additional Fields',
  name: 'additionalFields',
  type: 'collection',
  placeholder: 'Add Field',
  default: {},
  displayOptions: {
    show: {
      resource: ['campaign'],  // or your resource
      operation: ['create'],   // choose your operation
    },
  },
  options: [
    {
      displayName: 'CcEmails',
      name: 'CcEmails',
      type: 'string',
      default: "",
    },
    {
      displayName: 'BccEmails',
      name: 'BccEmails',
      type: 'string',
      default: '',
    },
    {
      displayName: 'Daily Limit',
      name: 'dailyLimit',
      type: 'number',
      default: 0,
    },
  ],
}
];
