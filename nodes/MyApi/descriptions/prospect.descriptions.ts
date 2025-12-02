import { INodeProperties } from 'n8n-workflow';
import { createField } from './common/fields';

export const prospectOperations: INodeProperties[] = [
  createField({
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    resource: 'prospect',
    default: 'create',
    optionsList: [
      { name: 'Create', value: 'create' },
      { name: 'Get All', value: 'getAll' },
      { name: 'Get By ID', value: 'getById' },
      { name: 'Delete', value: 'delete' },
      { name: 'Update', value: 'update' },
      { name: 'GetTags', value: 'getTags' },
      { name: 'CreateTags', value: 'createTags' },
      { name: 'GetMessages', value: 'getMessages' }
    ],
  }),
];

export const prospectFields: INodeProperties[] = [
  createField({
    displayName: 'Page',
    name: 'page',
    type: 'number',
    default: 1,
    resource: 'prospect',
    operations: ['getAll'],
  }),

  createField({
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 100,
    resource: 'prospect',
    operations: ['getAll'],
  }),

  createField({
    displayName: 'Prospects',
    name: 'prospects',
    type: 'multiOptions',
    default: '',
    description: 'Array of prospect IDs to add to the campaign',
    resource: 'prospect',
    operations: ['create'],
    required: true,
  }),

  createField({
    displayName: 'List Id',
    name: 'listId',
    type: 'number',
    default: 0,
    description: 'Required list ID to which all prospects will be added',
    resource: 'prospect',
    operations: ['create'],
    required: true,
  }),

  createField({
    displayName: 'Campaign Id',
    name: 'campaignId',
    type: 'number',
    default: 0,
    description: 'Optional campaign ID to add prospects to',
    resource: 'prospect',
    operations: ['create'],
    
  }),

  createField({
    displayName: 'Add Only If New',
    name: 'addOnlyIfNew',
    type: 'boolean',
    default: false,
    description: 'If true, skips prospects already in the list/campaign',
    resource: 'prospect',
    operations: ['create'],
    
  }),

  createField({
    displayName: 'Not In Other Campaign',
    name: 'notInOtherCampaign',
    type: 'boolean',
    default: true,
    description: 'If true, checks if prospect is in other campaigns',
    resource: 'prospect',
    operations: ['create'],
    
  }),

  createField({
    displayName: 'Email',
    name: 'email',
    type: 'string',
    default: '',
    description: 'Filter by exact email match (used for email-to-ID lookup)',
    resource: 'prospect',
    operations: ['getAll'],
    
  }),

  createField({
    displayName: 'Status',
    name: 'status',
    type: 'string',
    default: '',
    description: 'Filter by CRM status',
    resource: 'prospect',
    operations: ['getAll'],
    
  }),

  createField({
    displayName: 'Tags',
    name: 'tags',
    type: 'string',
    default: '',
    description: 'Filter by tags (comma-separated)',
    resource: 'prospect',
    operations: ['getAll'],
    
  }),

  createField({
    displayName: 'Search',
    name: 'search',
    type: 'string',
    default: '',
    description: 'Search in email, first name, last name',
    resource: 'prospect',
    operations: ['getAll'],
    
  }),

  createField({
    displayName: 'Starting After',
    name: 'startingAfter',
    type: 'number',
    default: 0,
    description: 'Cursor for next page (optional, for cursor-based pagination)',
    resource: 'prospect',
    operations: ['getAll'],
    
  }),

  createField({
    displayName: 'Email',
    name: 'email',
    type: 'string',
    default: '',
    description: 'Email address of the prospect; must be valid email format with maximum 256 characters.',
    resource: 'prospect',
    operations: ['create'],
    required: true,
  }),

  createField({
    displayName: 'Base List Id',
    name: 'baseListId',
    type: 'number',
    default: 0,
    description: 'Base mailing list identifier that this prospect belongs to; must be a positive integer.',
    resource: 'prospect',
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
      show: { resource: ['prospect'], operation: ['create'] },
    },
    options: [
    { displayName: 'Sending Status', name: 'sendingStatus', type: 'string', default: '' },
    { displayName: 'Sending Active', name: 'sendingActive', type: 'boolean', default: true },
    { displayName: 'Industry', name: 'industry', type: 'string', default: '' },
    { displayName: 'City', name: 'city', type: 'string', default: '' },
    { displayName: 'Website', name: 'website', type: 'string', default: '' },
    { displayName: 'Phone', name: 'phone', type: 'string', default: '' },
    { displayName: 'First Name', name: 'firstName', type: 'string', default: '' },
    { displayName: 'Last Name', name: 'lastName', type: 'string', default: '' },
    { displayName: 'Company', name: 'company', type: 'string', default: '' },
    { displayName: 'Country', name: 'country', type: 'string', default: '' },
    { displayName: 'Domain', name: 'domain', type: 'string', default: '' },
    { displayName: 'Company Social', name: 'companySocial', type: 'string', default: '' },
    { displayName: 'Company Size', name: 'companySize', type: 'string', default: '' },
    { displayName: 'Job Position', name: 'jobPosition', type: 'string', default: '' },
    { displayName: 'Location', name: 'location', type: 'string', default: '' },
    { displayName: 'Personal Social', name: 'personalSocial', type: 'string', default: '' },
    { displayName: 'Custom Image Url', name: 'customImageUrl', type: 'string', default: '' },
    { displayName: 'Screenshot Url', name: 'screenshotUrl', type: 'string', default: '' },
    { displayName: 'Logo Url', name: 'logoUrl', type: 'string', default: '' },
    { displayName: 'State', name: 'state', type: 'string', default: '' },
    { displayName: 'Icebreaker', name: 'icebreaker', type: 'string', default: '' },
    { displayName: 'Custom1', name: 'custom1', type: 'string', default: '' },
    { displayName: 'Custom2', name: 'custom2', type: 'string', default: '' },
    { displayName: 'Custom3', name: 'custom3', type: 'string', default: '' },
    { displayName: 'Custom4', name: 'custom4', type: 'string', default: '' },
    { displayName: 'Custom5', name: 'custom5', type: 'string', default: '' },
    { displayName: 'Custom6', name: 'custom6', type: 'string', default: '' },
    { displayName: 'Custom7', name: 'custom7', type: 'string', default: '' },
    { displayName: 'Custom8', name: 'custom8', type: 'string', default: '' },
    { displayName: 'Custom9', name: 'custom9', type: 'string', default: '' },
    { displayName: 'Custom10', name: 'custom10', type: 'string', default: '' },
    { displayName: 'Custom11', name: 'custom11', type: 'string', default: '' },
    { displayName: 'Custom12', name: 'custom12', type: 'string', default: '' },
    { displayName: 'Custom13', name: 'custom13', type: 'string', default: '' },
    { displayName: 'Custom14', name: 'custom14', type: 'string', default: '' },
    { displayName: 'Custom15', name: 'custom15', type: 'string', default: '' },
    { displayName: 'Custom16', name: 'custom16', type: 'string', default: '' },
    { displayName: 'Custom17', name: 'custom17', type: 'string', default: '' },
    { displayName: 'Custom18', name: 'custom18', type: 'string', default: '' },
    { displayName: 'Custom19', name: 'custom19', type: 'string', default: '' },
    { displayName: 'Custom20', name: 'custom20', type: 'string', default: '' },
    { displayName: 'Notes', name: 'notes', type: 'string', default: '' }
    ],
  },

  createField({
    displayName: 'Prospect',
    name: 'prospectId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a prospect from the list or enter its ID',
    resource: 'prospect',
    operations: ['getById'],
    modes: [
      {
        displayName: 'From list',
        name: 'list',
        type: 'list',
        placeholder: 'Select a prospect...',
        typeOptions: {
          searchListMethod: 'searchProspects',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'Enter prospect ID',
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
    displayName: 'Prospect',
    name: 'prospectId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a prospect from the list or enter its ID',
    resource: 'prospect',
    operations: ['delete'],
    modes: [
      {
        displayName: 'From list',
        name: 'list',
        type: 'list',
        placeholder: 'Select a prospect...',
        typeOptions: {
          searchListMethod: 'searchProspects',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'Enter prospect ID',
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
    displayName: 'Prospect',
    name: 'prospectId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a prospect from the list or enter its ID',
    resource: 'prospect',
    operations: ['update'],
    modes: [
      {
        displayName: 'From list',
        name: 'list',
        type: 'list',
        placeholder: 'Select a prospect...',
        typeOptions: {
          searchListMethod: 'searchProspects',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'Enter prospect ID',
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
      show: { resource: ['prospect'], operation: ['update'] },
    },
    options: [
    { displayName: 'Base List Id', name: 'baseListId', type: 'number', default: 0 },
    { displayName: 'Sending Status', name: 'sendingStatus', type: 'string', default: '' },
    { displayName: 'Sending Active', name: 'sendingActive', type: 'boolean', default: false },
    { displayName: 'Industry', name: 'industry', type: 'string', default: '' },
    { displayName: 'City', name: 'city', type: 'string', default: '' },
    { displayName: 'Website', name: 'website', type: 'string', default: '' },
    { displayName: 'Phone', name: 'phone', type: 'string', default: '' },
    { displayName: 'First Name', name: 'firstName', type: 'string', default: '' },
    { displayName: 'Last Name', name: 'lastName', type: 'string', default: '' },
    { displayName: 'Company', name: 'company', type: 'string', default: '' },
    { displayName: 'Country', name: 'country', type: 'string', default: '' },
    { displayName: 'Domain', name: 'domain', type: 'string', default: '' },
    { displayName: 'Company Social', name: 'companySocial', type: 'string', default: '' },
    { displayName: 'Company Size', name: 'companySize', type: 'string', default: '' },
    { displayName: 'Job Position', name: 'jobPosition', type: 'string', default: '' },
    { displayName: 'Location', name: 'location', type: 'string', default: '' },
    { displayName: 'Personal Social', name: 'personalSocial', type: 'string', default: '' },
    { displayName: 'Custom Image Url', name: 'customImageUrl', type: 'string', default: '' },
    { displayName: 'Screenshot Url', name: 'screenshotUrl', type: 'string', default: '' },
    { displayName: 'Logo Url', name: 'logoUrl', type: 'string', default: '' },
    { displayName: 'State', name: 'state', type: 'string', default: '' },
    { displayName: 'Icebreaker', name: 'icebreaker', type: 'string', default: '' },
    { displayName: 'Custom1', name: 'custom1', type: 'string', default: '' },
    { displayName: 'Custom2', name: 'custom2', type: 'string', default: '' },
    { displayName: 'Custom3', name: 'custom3', type: 'string', default: '' },
    { displayName: 'Custom4', name: 'custom4', type: 'string', default: '' },
    { displayName: 'Custom5', name: 'custom5', type: 'string', default: '' },
    { displayName: 'Custom6', name: 'custom6', type: 'string', default: '' },
    { displayName: 'Custom7', name: 'custom7', type: 'string', default: '' },
    { displayName: 'Custom8', name: 'custom8', type: 'string', default: '' },
    { displayName: 'Custom9', name: 'custom9', type: 'string', default: '' },
    { displayName: 'Custom10', name: 'custom10', type: 'string', default: '' },
    { displayName: 'Custom11', name: 'custom11', type: 'string', default: '' },
    { displayName: 'Custom12', name: 'custom12', type: 'string', default: '' },
    { displayName: 'Custom13', name: 'custom13', type: 'string', default: '' },
    { displayName: 'Custom14', name: 'custom14', type: 'string', default: '' },
    { displayName: 'Custom15', name: 'custom15', type: 'string', default: '' },
    { displayName: 'Custom16', name: 'custom16', type: 'string', default: '' },
    { displayName: 'Custom17', name: 'custom17', type: 'string', default: '' },
    { displayName: 'Custom18', name: 'custom18', type: 'string', default: '' },
    { displayName: 'Custom19', name: 'custom19', type: 'string', default: '' },
    { displayName: 'Custom20', name: 'custom20', type: 'string', default: '' },
    { displayName: 'Notes', name: 'notes', type: 'string', default: '' }
    ],
  },

  createField({
    displayName: 'Prospect',
    name: 'prospectId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a prospect from the list or enter its ID',
    resource: 'prospect',
    operations: ['getTags'],
    modes: [
      {
        displayName: 'From list',
        name: 'list',
        type: 'list',
        placeholder: 'Select a prospect...',
        typeOptions: {
          searchListMethod: 'searchProspects',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'Enter prospect ID',
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
    displayName: 'Starting After',
    name: 'startingAfter',
    type: 'number',
    default: 0,
    description: 'Cursor for next page (optional, for cursor-based pagination)',
    resource: 'prospect',
    operations: ['getTags'],
    
  }),

  createField({
    displayName: 'Prospect',
    name: 'prospectId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a prospect from the list or enter its ID',
    resource: 'prospect',
    operations: ['createTags'],
    modes: [
      {
        displayName: 'From list',
        name: 'list',
        type: 'list',
        placeholder: 'Select a prospect...',
        typeOptions: {
          searchListMethod: 'searchProspects',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'Enter prospect ID',
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
    displayName: 'Tag Id',
    name: 'tagId',
    type: 'number',
    default: 0,
    description: 'Tag ID to add to the prospect',
    resource: 'prospect',
    operations: ['createTags'],
    required: true,
  }),

  createField({
    displayName: 'Prospect',
    name: 'prospectId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a prospect from the list or enter its ID',
    resource: 'prospect',
    operations: ['getMessages'],
    modes: [
      {
        displayName: 'From list',
        name: 'list',
        type: 'list',
        placeholder: 'Select a prospect...',
        typeOptions: {
          searchListMethod: 'searchProspects',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'Enter prospect ID',
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
    displayName: 'Starting After',
    name: 'startingAfter',
    type: 'string',
    default: '',
    description: 'Cursor for next page (optional, for cursor-based pagination)',
    resource: 'prospect',
    operations: ['getMessages'],
    
  })
];
