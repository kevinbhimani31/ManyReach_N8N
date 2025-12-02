import { INodeProperties } from 'n8n-workflow';
import { createField } from './common/fields';

export const followupOperations: INodeProperties[] = [
  createField({
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    resource: 'followup',
    default: 'getById',
    optionsList: [
      { name: 'Get By ID', value: 'getById' },
      { name: 'Delete', value: 'delete' },
      { name: 'Update', value: 'update' }
    ],
  }),
];

export const followupFields: INodeProperties[] = [
  createField({
    displayName: 'Followup',
    name: 'followupId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a followup from the list or enter its ID',
    resource: 'followup',
    operations: ['getById'],
    modes: [
      {
        displayName: 'From list',
        name: 'list',
        type: 'list',
        placeholder: 'Select a followup...',
        typeOptions: {
          searchListMethod: 'searchFollowups',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'Enter followup ID',
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
    displayName: 'Followup',
    name: 'followupId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a followup from the list or enter its ID',
    resource: 'followup',
    operations: ['delete'],
    modes: [
      {
        displayName: 'From list',
        name: 'list',
        type: 'list',
        placeholder: 'Select a followup...',
        typeOptions: {
          searchListMethod: 'searchFollowups',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'Enter followup ID',
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
    displayName: 'Followup',
    name: 'followupId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a followup from the list or enter its ID',
    resource: 'followup',
    operations: ['update'],
    modes: [
      {
        displayName: 'From list',
        name: 'list',
        type: 'list',
        placeholder: 'Select a followup...',
        typeOptions: {
          searchListMethod: 'searchFollowups',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'Enter followup ID',
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
      show: { resource: ['followup'], operation: ['update'] },
    },
    options: [
    { displayName: 'Subject', name: 'subject', type: 'string', default: '' },
    { displayName: 'Body', name: 'body', type: 'string', default: '' },
    { displayName: 'Wait Min', name: 'waitMin', type: 'number', default: 0 },
    { displayName: 'Wait Units', name: 'waitUnits', type: 'string', default: '' },
    { displayName: 'Use Original Subject', name: 'useOriginalSubject', type: 'boolean', default: false },
    { displayName: 'Send In Same Thread', name: 'sendInSameThread', type: 'boolean', default: false },
    { displayName: 'Reply In Thread', name: 'replyInThread', type: 'boolean', default: false },
    { displayName: 'Reply In Thread To Followup Id', name: 'replyInThreadToFollowupId', type: 'number', default: 0 }
    ],
  }
];
