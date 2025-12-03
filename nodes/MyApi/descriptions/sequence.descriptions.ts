import { INodeProperties } from 'n8n-workflow';
import { createField } from './common/fields';

export const sequenceOperations: INodeProperties[] = [
  createField({
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    resource: 'sequence',
    default: 'delete',
    optionsList: [
      { name: 'Delete', value: 'delete' },
      { name: 'Update', value: 'update' },
      { name: 'GetFollowups', value: 'getFollowups' },
      { name: 'CreateFollowups', value: 'createFollowups' }
    ],
  }),
];

export const sequenceFields: INodeProperties[] = [
  createField({
    displayName: 'Sequence',
    name: 'sequenceId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a sequence from the list or enter its ID',
    resource: 'sequence',
    operations: ['delete'],
    modes: [
      {
        displayName: 'From list',
        name: 'list',
        type: 'list',
        placeholder: 'Select a sequence...',
        typeOptions: {
          searchListMethod: 'searchSequences',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'Enter sequence ID',
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
    displayName: 'Sequence',
    name: 'sequenceId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a sequence from the list or enter its ID',
    resource: 'sequence',
    operations: ['update'],
    modes: [
      {
        displayName: 'From list',
        name: 'list',
        type: 'list',
        placeholder: 'Select a sequence...',
        typeOptions: {
          searchListMethod: 'searchSequences',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'Enter sequence ID',
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
      show: { resource: ['sequence'], operation: ['update'] },
    },
    options: [
    { displayName: 'Name', name: 'name', type: 'string', default: '' },
    { displayName: 'Short Name', name: 'shortName', type: 'string', default: '' },
    { displayName: 'Condition Extra', name: 'conditionExtra', type: 'boolean', default: false },
    { displayName: 'Condition Negate', name: 'conditionNegate', type: 'boolean', default: false },
    { displayName: 'Condition Times', name: 'conditionTimes', type: 'number', default: 0 },
    { displayName: 'Condition Reply', name: 'conditionReply', type: 'options', default: 'All', options: [{ name: 'All', value: 'All' }, { name: 'Opened', value: 'Opened' }, { name: 'NotOpened', value: 'NotOpened' }, { name: 'NotReplied', value: 'NotReplied' }, { name: 'Replied', value: 'Replied' }, { name: 'RepliedInterested', value: 'RepliedInterested' }, { name: 'RepliedNotInterested', value: 'RepliedNotInterested' }, { name: 'RepliedNeutral', value: 'RepliedNeutral' }, { name: 'RepliedMaybeLater', value: 'RepliedMaybeLater' }, { name: 'Converted', value: 'Converted' }, { name: 'NotConverted', value: 'NotConverted' }] },
    { displayName: 'Condition Action', name: 'conditionAction', type: 'options', default: 'Opened', options: [{ name: 'Opened', value: 'Opened' }, { name: 'Clicked', value: 'Clicked' }, { name: 'Bounced', value: 'Bounced' }, { name: 'Unsubscribed', value: 'Unsubscribed' }, { name: 'Converted', value: 'Converted' }] },
    { displayName: 'Condition Operator', name: 'conditionOperator', type: 'options', default: 'GreaterThanOrEqual', options: [{ name: 'GreaterThanOrEqual', value: 'GreaterThanOrEqual' }, { name: 'LessThanOrEqual', value: 'LessThanOrEqual' }, { name: 'Equal', value: 'Equal' }, { name: 'NotEqual', value: 'NotEqual' }, { name: 'GreaterThan', value: 'GreaterThan' }, { name: 'LessThan', value: 'LessThan' }] }
    ],
  },

  createField({
    displayName: 'Sequence',
    name: 'sequenceId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a sequence from the list or enter its ID',
    resource: 'sequence',
    operations: ['getFollowups'],
    modes: [
      {
        displayName: 'From list',
        name: 'list',
        type: 'list',
        placeholder: 'Select a sequence...',
        typeOptions: {
          searchListMethod: 'searchSequences',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'Enter sequence ID',
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
    displayName: 'Sequence',
    name: 'sequenceId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a sequence from the list or enter its ID',
    resource: 'sequence',
    operations: ['createFollowups'],
    modes: [
      {
        displayName: 'From list',
        name: 'list',
        type: 'list',
        placeholder: 'Select a sequence...',
        typeOptions: {
          searchListMethod: 'searchSequences',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'Enter sequence ID',
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
    displayName: 'Wait Min',
    name: 'waitMin',
    type: 'number',
    default: 0,
    description: 'Wait time duration before sending this followup; must be an integer between 1 and 1000',
    resource: 'sequence',
    operations: ['createFollowups'],
    required: true,
  }),

  createField({
    displayName: 'Wait Units',
    name: 'waitUnits',
    type: 'options',
    default: 'Minutes',
    description: 'Time unit for the wait period (e.g., \'minutes\', \'hours\', \'days\').',
    resource: 'sequence',
    operations: ['createFollowups'],
    required: true,
    optionsList: [
      { name: 'Minutes', value: 'Minutes' },
      { name: 'Hours', value: 'Hours' },
      { name: 'Days', value: 'Days' }
    ],
  }),

  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    default: {},
    placeholder: 'Add Field',
    displayOptions: {
      show: { resource: ['sequence'], operation: ['createFollowups'] },
    },
    options: [
    { displayName: 'Subject', name: 'subject', type: 'string', default: '' },
    { displayName: 'Body', name: 'body', type: 'string', default: '' },
    { displayName: 'Use Original Subject', name: 'useOriginalSubject', type: 'boolean', default: false },
    { displayName: 'Send In Same Thread', name: 'sendInSameThread', type: 'boolean', default: false },
    { displayName: 'Reply In Thread', name: 'replyInThread', type: 'boolean', default: false },
    { displayName: 'Reply In Thread To Followup Id', name: 'replyInThreadToFollowupId', type: 'number', default: 0 }
    ],
  }
];
