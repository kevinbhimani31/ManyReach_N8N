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
      { name: 'Update', value: 'update' },
      { name: 'Delete', value: 'delete' },
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

  // campaign ID
  createField({
    displayName: 'Campaign',
    name: 'campaignId',
    type: 'resourceLocator',
    default: {
      mode: 'list',
      value: '',
    },
    description: 'Select a campaign from the list or enter its numeric ID manually',
    resource: 'campaign',
    operations: ['getById', 'update', 'delete'],
    modes: [
      {
        displayName: 'From list',
        name: 'list',
        type: 'list',
        placeholder: 'Select a campaign...',
        typeOptions: {
          searchListMethod: 'searchCampaigns',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string', 
        placeholder: 'Enter campaign ID',
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
  },

  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['campaign'],
        operation: ['update'],
      },
    },
    options: [
      { displayName: 'Folder ID', name: 'FolderId', type: 'number', default: 0 },
      { displayName: 'Active', name: 'Active', type: 'boolean', default: false },
      { displayName: 'Name', name: 'Name', type: 'string', default: '' },
      { displayName: 'Description', name: 'Description', type: 'string', default: '' },
      { displayName: 'From Email', name: 'FromEmail', type: 'string', default: '' },
      { displayName: 'From Name', name: 'FromName', type: 'string', default: '' },
      { displayName: 'Reply To Email', name: 'ReplyToEmail', type: 'string', default: '' },
      { displayName: 'Subject', name: 'Subject', type: 'string', default: '' },
      { displayName: 'Body', name: 'Body', type: 'string', default: '' },
      { displayName: 'Text Only Emails', name: 'TextOnlyEmails', type: 'boolean', default: false },
      { displayName: 'CC Emails', name: 'CcEmails', type: 'string', default: '' },
      { displayName: 'BCC Emails', name: 'BccEmails', type: 'string', default: '' },
      { displayName: 'Reply BCC Emails', name: 'ReplyBccEmails', type: 'string', default: '' },
      { displayName: 'Reply CC Emails', name: 'ReplyCcEmails', type: 'string', default: '' },
      { displayName: 'Send Unsubscribe List Header', name: 'SendUnsubscribeListHeader', type: 'boolean', default: false },
      { displayName: 'Deactivate If Missing Placeholder', name: 'DeactivateIfMissingPlaceholder', type: 'boolean', default: false },
      { displayName: 'Stop Coworkers On Reply', name: 'StopCoworkersOnReply', type: 'boolean', default: false },
      { displayName: 'Track Opens', name: 'TrackOpens', type: 'boolean', default: false },
      { displayName: 'Track Clicks', name: 'TrackClicks', type: 'boolean', default: false },
      { displayName: 'Prospect Value', name: 'ProspectValue', type: 'number', default: 0 },
      { displayName: 'Daily Limit', name: 'DailyLimit', type: 'number', default: 0 },
      { displayName: 'Daily Limit Per', name: 'DailyLimitPer', type: 'string', default: '' },
      { displayName: 'Daily Limit Increase', name: 'DailyLimitIncrease', type: 'boolean', default: false },
      { displayName: 'Daily Limit Increase To Max', name: 'DailyLimitIncreaseToMax', type: 'number', default: 0 },
      { displayName: 'Daily Limit Increase Percent', name: 'DailyLimitIncreasePercent', type: 'number', default: 0 },
      { displayName: 'Daily Limit On Date', name: 'DailyLimitOnDate', type: 'string', default: '' },
      { displayName: 'Daily Limit Prioritize', name: 'DailyLimitPrioritize', type: 'string', default: '' },
      { displayName: 'Daily Limit Initial', name: 'DailyLimitInitial', type: 'number', default: 0 },
      { displayName: 'Daily Limit Initial Enabled', name: 'DailyLimitInitialEnabled', type: 'boolean', default: false },
      { displayName: 'Daily Limit Which Emails Count', name: 'DailyLimitWhichEmailsCount', type: 'string', default: '' },
      { displayName: 'Schedule Sending', name: 'ScheduleSending', type: 'boolean', default: false },
      { displayName: 'Schedule Time Zone', name: 'ScheduleTimeZone', type: 'string', default: '' },
      { displayName: 'Schedule Send On Date', name: 'ScheduleSendOnDate', type: 'string', default: '' },
      { displayName: 'Schedule Send On Date Minutes', name: 'ScheduleSendOnDateMinutes', type: 'number', default: 0 },
      { displayName: 'Schedule Send On Date Enabled', name: 'ScheduleSendOnDateEnabled', type: 'boolean', default: false },
      { displayName: 'Schedule Send On Date Hours', name: 'ScheduleSendOnDateHours', type: 'number', default: 0 },
      { displayName: 'Delay Min Minutes', name: 'DelayMinMinutes', type: 'number', default: 0 },
      { displayName: 'ESP Match Type', name: 'EspMatchType', type: 'number', default: 0 },
      { displayName: 'ESP Match Enabled', name: 'EspMatchEnabled', type: 'boolean', default: false },
      { displayName: 'ESP Limit Enabled', name: 'EspLimitEnabled', type: 'boolean', default: false },
      { displayName: 'ESP Limit To Microsoft', name: 'EspLimitToMicrosoft', type: 'boolean', default: false },
      { displayName: 'ESP Limit To Google', name: 'EspLimitToGoogle', type: 'boolean', default: false },
      { displayName: 'ESP Limit To Other', name: 'EspLimitToOther', type: 'boolean', default: false },
      { displayName: 'Send Monday After', name: 'SendMonAfter', type: 'number', default: 0 },
      { displayName: 'Send Monday Before', name: 'SendMonBefore', type: 'number', default: 0 },
      { displayName: 'Send Monday Enabled', name: 'SendMon', type: 'boolean', default: false },
      { displayName: 'Send Tuesday After', name: 'SendTueAfter', type: 'number', default: 0 },
      { displayName: 'Send Tuesday Before', name: 'SendTueBefore', type: 'number', default: 0 },
      { displayName: 'Send Tuesday Enabled', name: 'SendTue', type: 'boolean', default: false },
      { displayName: 'Send Wednesday After', name: 'SendWedAfter', type: 'number', default: 0 },
      { displayName: 'Send Wednesday Before', name: 'SendWedBefore', type: 'number', default: 0 },
      { displayName: 'Send Wednesday Enabled', name: 'SendWed', type: 'boolean', default: false },
      { displayName: 'Send Thursday After', name: 'SendThuAfter', type: 'number', default: 0 },
      { displayName: 'Send Thursday Before', name: 'SendThuBefore', type: 'number', default: 0 },
      { displayName: 'Send Thursday Enabled', name: 'SendThu', type: 'boolean', default: false },
      { displayName: 'Send Friday After', name: 'SendFriAfter', type: 'number', default: 0 },
      { displayName: 'Send Friday Before', name: 'SendFriBefore', type: 'number', default: 0 },
      { displayName: 'Send Friday Enabled', name: 'SendFri', type: 'boolean', default: false },
      { displayName: 'Send Saturday After', name: 'SendSatAfter', type: 'number', default: 0 },
      { displayName: 'Send Saturday Before', name: 'SendSatBefore', type: 'number', default: 0 },
      { displayName: 'Send Saturday Enabled', name: 'SendSat', type: 'boolean', default: false },
      { displayName: 'Send Sunday After', name: 'SendSunAfter', type: 'number', default: 0 },
      { displayName: 'Send Sunday Before', name: 'SendSunBefore', type: 'number', default: 0 },
      { displayName: 'Send Sunday Enabled', name: 'SendSun', type: 'boolean', default: false },
    ],
  },
];
