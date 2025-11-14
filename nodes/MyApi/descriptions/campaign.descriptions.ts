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


  // ----------------------------
// CREATE — MAIN FIELDS
// ----------------------------
createField({
  displayName: 'Campaign Name',
  name: 'campaignName',
  type: 'string',
  description: 'Name of the campaign',
  resource: 'campaign',
  operations: ['create'],
}),

createField({
  displayName: 'Description',
  name: 'campaignDescription',
  type: 'string',
  description: 'Short description',
  resource: 'campaign',
  operations: ['create'],
}),

createField({
    displayName: 'From Email',
    name: 'fromEmail',
    type: 'options',
    description: 'Sender email address',
    required: false,                   
    typeOptions: {
      loadOptionsMethod: 'getSenders',
      customValue: true,
      customValueType: 'string',
    },
    resource: 'campaign',
    operations: ['create'],
  }),

createField({
  displayName: 'From Name',
  name: 'fromName',
  type: 'string',
  description: 'Sender name',
  resource: 'campaign',
  operations: ['create'],
}),

createField({
  displayName: 'Subject',
  name: 'subject',
  type: 'string',
  resource: 'campaign',
  operations: ['create'],
}),

createField({
  displayName: 'Body',
  name: 'body',
  type: 'string',
  typeOptions: { rows: 5 },
  resource: 'campaign',
  operations: ['create'],
}),

createField({
  displayName: 'Timezone',
  name: 'timezone',
  type: 'string',
  default: 'UTC',
  resource: 'campaign',
  operations: ['create'],
}),
{
  displayName: 'Days to Send',
  name: 'daysOfWeek',
  type: 'multiOptions',
  default: ['mon','tue','wed','thu','fri','sat','sun'],   // <-- all selected
  displayOptions: { show: { resource: ['campaign'], operation: ['create'] }},
  options: [
    { name: 'Monday', value: 'mon' },
    { name: 'Tuesday', value: 'tue' },
    { name: 'Wednesday', value: 'wed' },
    { name: 'Thursday', value: 'thu' },
    { name: 'Friday', value: 'fri' },
    { name: 'Saturday', value: 'sat' },
    { name: 'Sunday', value: 'sun' },
  ],
},
createField({
  displayName: 'Daily Limit Increase Percent',
  name: 'dailyLimitIncreasePercent',
  type: 'number',
  default: 1,
  resource: 'campaign',
  operations: ['create'],
}),
{
  displayName: 'Additional Fields',
  name: 'additionalFields',
  type: 'collection',
  default: {},
  placeholder: 'Add Optional Field',
  displayOptions: {
    show: { resource: ['campaign'], operation: ['create'] },
  },
  options: [
  { displayName: 'CC Emails', name: 'ccEmails', type: 'string', default: '' },
  { displayName: 'BCC Emails', name: 'bccEmails', type: 'string', default: '' },
  { displayName: 'Reply To Email', name: 'replyToEmail', type: 'string', default: '' },
  { displayName: 'Reply CC Emails', name: 'replyCcEmails', type: 'string', default: '' },
  { displayName: 'Reply BCC Emails', name: 'replyBccEmails', type: 'string', default: '' },

  // ------------------------
  // DAILY LIMIT SECTION
  // ------------------------
  { displayName: 'Daily Limit', name: 'dailyLimit', type: 'number', default: 10000 },
  { displayName: 'Daily Limit Per', name: 'dailyLimitPer', type: 'string', default: '' },
  { displayName: 'Daily Limit Increase', name: 'dailyLimitIncrease', type: 'boolean', default: true },
  { displayName: 'Daily Limit Increase To Max', name: 'dailyLimitIncreaseToMax', type: 'number', default: 10000 },
  { displayName: 'Daily Limit On Date', name: 'dailyLimitOnDate', type: 'string', default: '' },
  { displayName: 'Daily Limit Prioritize', name: 'dailyLimitPrioritize', type: 'string', default: '' },
  { displayName: 'Daily Limit Initial', name: 'dailyLimitInitial', type: 'number', default: 10000 },
  { displayName: 'Daily Limit Initial Enabled', name: 'dailyLimitInitialEnabled', type: 'boolean', default: true },
  { displayName: 'Daily Limit Which Emails Count', name: 'dailyLimitWhichEmailsCount', type: 'string', default: '' },

  // ------------------------
  // BOOLEAN FLAGS
  // ------------------------
  { displayName: 'Send Unsubscribe List Header', name: 'sendUnsubscribeListHeader', type: 'boolean', default: true },
  { displayName: 'Deactivate If Missing Placeholder', name: 'deactivateIfMissingPlaceholder', type: 'boolean', default: true },
  { displayName: 'Stop Coworkers On Reply', name: 'stopCoworkersOnReply', type: 'boolean', default: true },
  { displayName: 'Text Only Emails', name: 'textOnlyEmails', type: 'boolean', default: true },
  { displayName: 'Track Opens', name: 'trackOpens', type: 'boolean', default: true },
  { displayName: 'Track Clicks', name: 'trackClicks', type: 'boolean', default: true },

  // ------------------------
  // ESP LIMIT FIELDS
  // ------------------------
  { displayName: 'ESP Match Type', name: 'espMatchType', type: 'number', default: 2 },
  { displayName: 'ESP Match Enabled', name: 'espMatchEnabled', type: 'boolean', default: true },
  { displayName: 'ESP Limit Enabled', name: 'espLimitEnabled', type: 'boolean', default: true },
  { displayName: 'ESP Limit To Microsoft', name: 'espLimitToMicrosoft', type: 'boolean', default: true },
  { displayName: 'ESP Limit To Google', name: 'espLimitToGoogle', type: 'boolean', default: true },
  { displayName: 'ESP Limit To Other', name: 'espLimitToOther', type: 'boolean', default: true },

  // ------------------------
  // SCHEDULE SETTINGS
  // ------------------------
  { displayName: 'Schedule Sending Enabled', name: 'scheduleSending', type: 'boolean', default: true },
  { displayName: 'Schedule Time Zone', name: 'scheduleTimeZone', type: 'string', default: '' },
  { displayName: 'Schedule Send On Date', name: 'scheduleSendOnDate', type: 'string', default: '' },
  { displayName: 'Schedule Send On Date Minutes', name: 'scheduleSendOnDateMinutes', type: 'number', default: 1439 },
  { displayName: 'Schedule Send On Date Enabled', name: 'scheduleSendOnDateEnabled', type: 'boolean', default: true },
  { displayName: 'Schedule Send On Date Hours', name: 'scheduleSendOnDateHours', type: 'number', default: 23 },

  // Delay
  { displayName: 'Delay Min Minutes', name: 'delayMinMinutes', type: 'number', default: 1440 },

  // ------------------------
  // WEEKDAY TIME WINDOWS (defaults copied from Swagger)
  // ------------------------
  { displayName: 'Monday: After (minutes)', name: 'sendMonAfter', type: 'number', default: 1439 },
  { displayName: 'Monday: Before (minutes)', name: 'sendMonBefore', type: 'number', default: 1439 },

  { displayName: 'Tuesday: After (minutes)', name: 'sendTueAfter', type: 'number', default: 1439 },
  { displayName: 'Tuesday: Before (minutes)', name: 'sendTueBefore', type: 'number', default: 1439 },

  { displayName: 'Wednesday: After (minutes)', name: 'sendWedAfter', type: 'number', default: 1439 },
  { displayName: 'Wednesday: Before (minutes)', name: 'sendWedBefore', type: 'number', default: 1439 },

  { displayName: 'Thursday: After (minutes)', name: 'sendThuAfter', type: 'number', default: 1439 },
  { displayName: 'Thursday: Before (minutes)', name: 'sendThuBefore', type: 'number', default: 1439 },

  { displayName: 'Friday: After (minutes)', name: 'sendFriAfter', type: 'number', default: 1439 },
  { displayName: 'Friday: Before (minutes)', name: 'sendFriBefore', type: 'number', default: 1439 },

  { displayName: 'Saturday: After (minutes)', name: 'sendSatAfter', type: 'number', default: 1439 },
  { displayName: 'Saturday: Before (minutes)', name: 'sendSatBefore', type: 'number', default: 1439 },

  { displayName: 'Sunday: After (minutes)', name: 'sendSunAfter', type: 'number', default: 1439 },
  { displayName: 'Sunday: Before (minutes)', name: 'sendSunBefore', type: 'number', default: 1439 },
]
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
