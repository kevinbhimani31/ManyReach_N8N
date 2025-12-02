import { INodeProperties } from 'n8n-workflow';
import { createField } from './common/fields';

export const campaignOperations: INodeProperties[] = [
  createField({
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    resource: 'campaign',
    default: 'getAll',
    optionsList: [
      { name: 'Get All', value: 'getAll' },
      { name: 'Create', value: 'create' },
      { name: 'Get By ID', value: 'getById' },
      { name: 'Delete', value: 'delete' },
      { name: 'Update', value: 'update' },
      { name: 'Start', value: 'start' },
      { name: 'Pause', value: 'pause' },
      { name: 'GetSequences', value: 'getSequences' },
      { name: 'CreateSequences', value: 'createSequences' },
      { name: 'Copy', value: 'copy' },
      { name: 'GetStats', value: 'getStats' }
    ],
  }),
];

export const campaignFields: INodeProperties[] = [
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

  createField({
    displayName: 'Starting After',
    name: 'startingAfter',
    type: 'number',
    default: 0,
    description: 'Cursor for next page (optional, for cursor-based pagination)',
    resource: 'campaign',
    operations: ['getAll'],
    
  }),

  createField({
    displayName: 'Name',
    name: 'name',
    type: 'string',
    default: '',
    description: 'Campaign display name for identification and organization; maximum 256 characters.',
    resource: 'campaign',
    operations: ['create'],
    required: true,
  }),

  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    default: {},
    placeholder: 'Add Field',
    displayOptions: {
      show: { resource: ['campaign'], operation: ['create'] },
    },
    options: [
    { displayName: 'Folder Id', name: 'folderId', type: 'number', default: 0 },
    { displayName: 'Description', name: 'description', type: 'string', default: '' },
    { displayName: 'From Emails', name: 'fromEmails', type: 'string', default: '' },
    { displayName: 'From Name', name: 'fromName', type: 'string', default: '' },
    { displayName: 'Reply To Email', name: 'replyToEmail', type: 'string', default: '' },
    { displayName: 'Subject', name: 'subject', type: 'string', default: '' },
    { displayName: 'Body', name: 'body', type: 'string', default: '' },
    { displayName: 'Text Only Emails', name: 'textOnlyEmails', type: 'boolean', default: false },
    { displayName: 'Cc Emails', name: 'ccEmails', type: 'string', default: '' },
    { displayName: 'Bcc Emails', name: 'bccEmails', type: 'string', default: '' },
    { displayName: 'Reply Bcc Emails', name: 'replyBccEmails', type: 'string', default: '' },
    { displayName: 'Reply Cc Emails', name: 'replyCcEmails', type: 'string', default: '' },
    { displayName: 'Send Unsubscribe List Header', name: 'sendUnsubscribeListHeader', type: 'boolean', default: false },
    { displayName: 'Deactivate If Missing Placeholder', name: 'deactivateIfMissingPlaceholder', type: 'boolean', default: false },
    { displayName: 'Stop Coworkers On Reply', name: 'stopCoworkersOnReply', type: 'boolean', default: false },
    { displayName: 'Track Opens', name: 'trackOpens', type: 'boolean', default: false },
    { displayName: 'Track Clicks', name: 'trackClicks', type: 'boolean', default: false },
    { displayName: 'Prospect Value', name: 'prospectValue', type: 'number', default: 0 },
    { displayName: 'Daily Limit', name: 'dailyLimit', type: 'number', default: 50 },
    { displayName: 'Daily Limit Per', name: 'dailyLimitPer', type: 'string', default: 'Campaign' },
    { displayName: 'Daily Limit Increase', name: 'dailyLimitIncrease', type: 'boolean', default: false },
    { displayName: 'Daily Limit Increase To Max', name: 'dailyLimitIncreaseToMax', type: 'number', default: 0 },
    { displayName: 'Daily Limit Increase Percent', name: 'dailyLimitIncreasePercent', type: 'number', default: 0 },
    { displayName: 'Daily Limit On Date', name: 'dailyLimitOnDate', type: 'string', default: '' },
    { displayName: 'Daily Limit Prioritize', name: 'dailyLimitPrioritize', type: 'string', default: 'Followup' },
    { displayName: 'Daily Limit Initial', name: 'dailyLimitInitial', type: 'number', default: 0 },
    { displayName: 'Daily Limit Initial Enabled', name: 'dailyLimitInitialEnabled', type: 'boolean', default: false },
    { displayName: 'Daily Limit Which Emails Count', name: 'dailyLimitWhichEmailsCount', type: 'string', default: 'All' },
    { displayName: 'Schedule Sending', name: 'scheduleSending', type: 'boolean', default: false },
    { displayName: 'Schedule Time Zone', name: 'scheduleTimeZone', type: 'string', default: 'UTC' },
    { displayName: 'Use Prospects Time Zone', name: 'useProspectsTimeZone', type: 'boolean', default: false },
    { displayName: 'Schedule Send On Date', name: 'scheduleSendOnDate', type: 'string', default: '' },
    { displayName: 'Schedule Send On Date Minutes', name: 'scheduleSendOnDateMinutes', type: 'number', default: 10 },
    { displayName: 'Schedule Send On Date Enabled', name: 'scheduleSendOnDateEnabled', type: 'boolean', default: false },
    { displayName: 'Schedule Send On Date Hours', name: 'scheduleSendOnDateHours', type: 'number', default: 10 },
    { displayName: 'Delay Min Minutes', name: 'delayMinMinutes', type: 'number', default: 30 },
    { displayName: 'Esp Match Type', name: 'espMatchType', type: 'string', default: '' },
    { displayName: 'Esp Match Enabled', name: 'espMatchEnabled', type: 'boolean', default: false },
    { displayName: 'Esp Limit Enabled', name: 'espLimitEnabled', type: 'boolean', default: false },
    { displayName: 'Esp Limit To Microsoft', name: 'espLimitToMicrosoft', type: 'boolean', default: false },
    { displayName: 'Esp Limit To Google', name: 'espLimitToGoogle', type: 'boolean', default: false },
    { displayName: 'Esp Limit To Other', name: 'espLimitToOther', type: 'boolean', default: false },
    { displayName: 'Send Mon After', name: 'sendMonAfter', type: 'number', default: 0 },
    { displayName: 'Send Mon Before', name: 'sendMonBefore', type: 'number', default: 0 },
    { displayName: 'Send Mon', name: 'sendMon', type: 'boolean', default: true },
    { displayName: 'Send Tue After', name: 'sendTueAfter', type: 'number', default: 0 },
    { displayName: 'Send Tue Before', name: 'sendTueBefore', type: 'number', default: 0 },
    { displayName: 'Send Tue', name: 'sendTue', type: 'boolean', default: true },
    { displayName: 'Send Wed After', name: 'sendWedAfter', type: 'number', default: 0 },
    { displayName: 'Send Wed Before', name: 'sendWedBefore', type: 'number', default: 0 },
    { displayName: 'Send Wed', name: 'sendWed', type: 'boolean', default: true },
    { displayName: 'Send Thu After', name: 'sendThuAfter', type: 'number', default: 0 },
    { displayName: 'Send Thu Before', name: 'sendThuBefore', type: 'number', default: 0 },
    { displayName: 'Send Thu', name: 'sendThu', type: 'boolean', default: true },
    { displayName: 'Send Fri After', name: 'sendFriAfter', type: 'number', default: 0 },
    { displayName: 'Send Fri Before', name: 'sendFriBefore', type: 'number', default: 0 },
    { displayName: 'Send Fri', name: 'sendFri', type: 'boolean', default: true },
    { displayName: 'Send Sat After', name: 'sendSatAfter', type: 'number', default: 0 },
    { displayName: 'Send Sat Before', name: 'sendSatBefore', type: 'number', default: 0 },
    { displayName: 'Send Sat', name: 'sendSat', type: 'boolean', default: true },
    { displayName: 'Send Sun After', name: 'sendSunAfter', type: 'number', default: 0 },
    { displayName: 'Send Sun Before', name: 'sendSunBefore', type: 'number', default: 0 },
    { displayName: 'Send Sun', name: 'sendSun', type: 'boolean', default: true },
    { displayName: 'Check', name: 'check', type: 'string', default: '' },
    { displayName: 'Ischecked', name: 'ischecked', type: 'boolean', default: false }
    ],
  },

  createField({
    displayName: 'Campaign',
    name: 'campaignId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a campaign from the list or enter its ID',
    resource: 'campaign',
    operations: ['getById'],
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
              regex: '^\\\\d+$',
              errorMessage: 'Only numeric IDs are allowed',
            },
          },
        ],
      },
    ],
  }),

  createField({
    displayName: 'Campaign',
    name: 'campaignId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a campaign from the list or enter its ID',
    resource: 'campaign',
    operations: ['delete'],
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
      show: { resource: ['campaign'], operation: ['update'] },
    },
    options: [
    { displayName: 'Folder Id', name: 'folderId', type: 'number', default: 0 },
    { displayName: 'Name', name: 'name', type: 'string', default: '' },
    { displayName: 'Description', name: 'description', type: 'string', default: '' },
    { displayName: 'From Emails', name: 'fromEmails', type: 'string', default: '' },
    { displayName: 'From Name', name: 'fromName', type: 'string', default: '' },
    { displayName: 'Reply To Email', name: 'replyToEmail', type: 'string', default: '' },
    { displayName: 'Subject', name: 'subject', type: 'string', default: '' },
    { displayName: 'Body', name: 'body', type: 'string', default: '' },
    { displayName: 'Text Only Emails', name: 'textOnlyEmails', type: 'boolean', default: false },
    { displayName: 'Cc Emails', name: 'ccEmails', type: 'string', default: '' },
    { displayName: 'Bcc Emails', name: 'bccEmails', type: 'string', default: '' },
    { displayName: 'Reply Bcc Emails', name: 'replyBccEmails', type: 'string', default: '' },
    { displayName: 'Reply Cc Emails', name: 'replyCcEmails', type: 'string', default: '' },
    { displayName: 'Send Unsubscribe List Header', name: 'sendUnsubscribeListHeader', type: 'boolean', default: false },
    { displayName: 'Deactivate If Missing Placeholder', name: 'deactivateIfMissingPlaceholder', type: 'boolean', default: false },
    { displayName: 'Stop Coworkers On Reply', name: 'stopCoworkersOnReply', type: 'boolean', default: false },
    { displayName: 'Track Opens', name: 'trackOpens', type: 'boolean', default: false },
    { displayName: 'Track Clicks', name: 'trackClicks', type: 'boolean', default: false },
    { displayName: 'Prospect Value', name: 'prospectValue', type: 'number', default: 0 },
    { displayName: 'Daily Limit', name: 'dailyLimit', type: 'number', default: 0 },
    { displayName: 'Daily Limit Per', name: 'dailyLimitPer', type: 'string', default: '' },
    { displayName: 'Daily Limit Increase', name: 'dailyLimitIncrease', type: 'boolean', default: false },
    { displayName: 'Daily Limit Increase To Max', name: 'dailyLimitIncreaseToMax', type: 'number', default: 0 },
    { displayName: 'Daily Limit Increase Percent', name: 'dailyLimitIncreasePercent', type: 'number', default: 0 },
    { displayName: 'Daily Limit On Date', name: 'dailyLimitOnDate', type: 'string', default: '' },
    { displayName: 'Daily Limit Prioritize', name: 'dailyLimitPrioritize', type: 'string', default: '' },
    { displayName: 'Daily Limit Initial', name: 'dailyLimitInitial', type: 'number', default: 0 },
    { displayName: 'Daily Limit Initial Enabled', name: 'dailyLimitInitialEnabled', type: 'boolean', default: false },
    { displayName: 'Daily Limit Which Emails Count', name: 'dailyLimitWhichEmailsCount', type: 'string', default: '' },
    { displayName: 'Schedule Sending', name: 'scheduleSending', type: 'boolean', default: false },
    { displayName: 'Schedule Time Zone', name: 'scheduleTimeZone', type: 'string', default: '' },
    { displayName: 'Use Prospects Time Zone', name: 'useProspectsTimeZone', type: 'boolean', default: false },
    { displayName: 'Schedule Send On Date', name: 'scheduleSendOnDate', type: 'string', default: '' },
    { displayName: 'Schedule Send On Date Minutes', name: 'scheduleSendOnDateMinutes', type: 'number', default: 0 },
    { displayName: 'Schedule Send On Date Enabled', name: 'scheduleSendOnDateEnabled', type: 'boolean', default: false },
    { displayName: 'Schedule Send On Date Hours', name: 'scheduleSendOnDateHours', type: 'number', default: 0 },
    { displayName: 'Delay Min Minutes', name: 'delayMinMinutes', type: 'number', default: 0 },
    { displayName: 'Esp Match Type', name: 'espMatchType', type: 'string', default: '' },
    { displayName: 'Esp Match Enabled', name: 'espMatchEnabled', type: 'boolean', default: false },
    { displayName: 'Esp Limit Enabled', name: 'espLimitEnabled', type: 'boolean', default: false },
    { displayName: 'Esp Limit To Microsoft', name: 'espLimitToMicrosoft', type: 'boolean', default: false },
    { displayName: 'Esp Limit To Google', name: 'espLimitToGoogle', type: 'boolean', default: false },
    { displayName: 'Esp Limit To Other', name: 'espLimitToOther', type: 'boolean', default: false },
    { displayName: 'Send Mon After', name: 'sendMonAfter', type: 'number', default: 0 },
    { displayName: 'Send Mon Before', name: 'sendMonBefore', type: 'number', default: 0 },
    { displayName: 'Send Mon', name: 'sendMon', type: 'boolean', default: false },
    { displayName: 'Send Tue After', name: 'sendTueAfter', type: 'number', default: 0 },
    { displayName: 'Send Tue Before', name: 'sendTueBefore', type: 'number', default: 0 },
    { displayName: 'Send Tue', name: 'sendTue', type: 'boolean', default: false },
    { displayName: 'Send Wed After', name: 'sendWedAfter', type: 'number', default: 0 },
    { displayName: 'Send Wed Before', name: 'sendWedBefore', type: 'number', default: 0 },
    { displayName: 'Send Wed', name: 'sendWed', type: 'boolean', default: false },
    { displayName: 'Send Thu After', name: 'sendThuAfter', type: 'number', default: 0 },
    { displayName: 'Send Thu Before', name: 'sendThuBefore', type: 'number', default: 0 },
    { displayName: 'Send Thu', name: 'sendThu', type: 'boolean', default: false },
    { displayName: 'Send Fri After', name: 'sendFriAfter', type: 'number', default: 0 },
    { displayName: 'Send Fri Before', name: 'sendFriBefore', type: 'number', default: 0 },
    { displayName: 'Send Fri', name: 'sendFri', type: 'boolean', default: false },
    { displayName: 'Send Sat After', name: 'sendSatAfter', type: 'number', default: 0 },
    { displayName: 'Send Sat Before', name: 'sendSatBefore', type: 'number', default: 0 },
    { displayName: 'Send Sat', name: 'sendSat', type: 'boolean', default: false },
    { displayName: 'Send Sun After', name: 'sendSunAfter', type: 'number', default: 0 },
    { displayName: 'Send Sun Before', name: 'sendSunBefore', type: 'number', default: 0 },
    { displayName: 'Send Sun', name: 'sendSun', type: 'boolean', default: false }
    ],
  },

  createField({
    displayName: 'Campaign',
    name: 'campaignId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a campaign from the list or enter its ID',
    resource: 'campaign',
    operations: ['update'],
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
              regex: '^\\\\d+$',
              errorMessage: 'Only numeric IDs are allowed',
            },
          },
        ],
      },
    ],
  }),

  createField({
    displayName: 'Campaign',
    name: 'campaignId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a campaign from the list or enter its ID',
    resource: 'campaign',
    operations: ['start'],
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
              regex: '^\\\\d+$',
              errorMessage: 'Only numeric IDs are allowed',
            },
          },
        ],
      },
    ],
  }),

  createField({
    displayName: 'Campaign',
    name: 'campaignId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a campaign from the list or enter its ID',
    resource: 'campaign',
    operations: ['pause'],
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
              regex: '^\\\\d+$',
              errorMessage: 'Only numeric IDs are allowed',
            },
          },
        ],
      },
    ],
  }),

  createField({
    displayName: 'Campaign',
    name: 'campaignId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a campaign from the list or enter its ID',
    resource: 'campaign',
    operations: ['getSequences'],
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
              regex: '^\\\\d+$',
              errorMessage: 'Only numeric IDs are allowed',
            },
          },
        ],
      },
    ],
  }),

  createField({
    displayName: 'Campaign',
    name: 'campaignId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a campaign from the list or enter its ID',
    resource: 'campaign',
    operations: ['createSequences'],
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
              regex: '^\\\\d+$',
              errorMessage: 'Only numeric IDs are allowed',
            },
          },
        ],
      },
    ],
  }),

  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    default: {},
    placeholder: 'Add Field',
    displayOptions: {
      show: { resource: ['campaign'], operation: ['createSequences'] },
    },
    options: [
    { displayName: 'Name', name: 'name', type: 'string', default: '' },
    { displayName: 'Short Name', name: 'shortName', type: 'string', default: '' },
    { displayName: 'Condition Extra', name: 'conditionExtra', type: 'boolean', default: false },
    { displayName: 'Condition Negate', name: 'conditionNegate', type: 'boolean', default: false },
    { displayName: 'Condition Times', name: 'conditionTimes', type: 'number', default: 0 },
    { displayName: 'Condition Reply', name: 'conditionReply', type: 'string', default: '' },
    { displayName: 'Condition Action', name: 'conditionAction', type: 'string', default: '' },
    { displayName: 'Condition Operator', name: 'conditionOperator', type: 'string', default: '' }
    ],
  },

  createField({
    displayName: 'Campaign',
    name: 'campaignId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a campaign from the list or enter its ID',
    resource: 'campaign',
    operations: ['copy'],
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
              regex: '^\\\\d+$',
              errorMessage: 'Only numeric IDs are allowed',
            },
          },
        ],
      },
    ],
  }),

  createField({
    displayName: 'New Campaign Name',
    name: 'newCampaignName',
    type: 'string',
    default: '',
    description: 'Parameter: newCampaignName',
    resource: 'campaign',
    operations: ['copy'],
    
  }),

  createField({
    displayName: 'Campaign',
    name: 'campaignId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a campaign from the list or enter its ID',
    resource: 'campaign',
    operations: ['getStats'],
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
              regex: '^\\\\d+$',
              errorMessage: 'Only numeric IDs are allowed',
            },
          },
        ],
      },
    ],
  }),

  createField({
    displayName: 'Date Start',
    name: 'dateStart',
    type: 'string',
    default: '',
    description: 'Optional. The start date (inclusive) for the statistics data range. Accepts ISO 8601 format: yyyy-MM-dd or yyyy-MM-ddTHH:mm:ss.fffZ (Z is optional, always interpreted as UTC). If not provided, defaults to the campaign creation date.',
    resource: 'campaign',
    operations: ['getStats'],
    
  }),

  createField({
    displayName: 'Date End',
    name: 'dateEnd',
    type: 'string',
    default: '',
    description: 'Optional. The end date (inclusive) for the statistics data range. Accepts ISO 8601 format: yyyy-MM-dd or yyyy-MM-ddTHH:mm:ss.fffZ (Z is optional, always interpreted as UTC). If not provided, defaults to the current date.',
    resource: 'campaign',
    operations: ['getStats'],
    
  }),

  createField({
    displayName: 'Refresh',
    name: 'refresh',
    type: 'boolean',
    default: false,
    description: 'Optional. Set to true to force refresh campaign statistics before retrieval. When true, recalculates all stats, processes A/B test variants, refreshes followups, and clears caches. Defaults to false for faster response times.',
    resource: 'campaign',
    operations: ['getStats'],
    
  })
];
