import { INodeProperties } from 'n8n-workflow';
import { createField } from '../descriptions/common/fields';

export const prospectOperations: INodeProperties[] = [
  createField({
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    resource: 'prospect',
    default: 'getAll',
    optionsList: [
      { name: 'Get All', value: 'getAll' },
      { name: 'Get By ID', value: 'getById' },
      { name: 'Create', value: 'create' },
      { name: 'Bulk Add', value: 'bulkAdd' },
    ],
  }),
];

export const prospectFields: INodeProperties[] = [
  // Get All - pagination and filters
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
    displayName: 'Starting After',
    name: 'startingAfter',
    type: 'number',
    default: 0,
    description: 'Prospect ID for cursor-based pagination',
    resource: 'prospect',
    operations: ['getAll'],
  }),
  createField({
    displayName: 'Email',
    name: 'email',
    type: 'string',
    default: '',
    description: 'Filter by exact email (email-to-ID lookup)',
    resource: 'prospect',
    operations: ['getAll'],
    placeholder: 'user@example.com',
  }),
  createField({
    displayName: 'Status',
    name: 'status',
    type: 'string',
    default: '',
    description: 'Filter by CRM status (string)',
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
    placeholder: 'tagA,tagB',
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

  // Get By ID - resource locator and include
  createField({
    displayName: 'Prospect',
    name: 'prospectId',
    type: 'resourceLocator',
    description: 'Select a prospect from the list or enter the prospect ID',
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
        placeholder: 'Enter prospect ID (number)',
        validation: [
          {
            type: 'regex',
            properties: {
              regex: '^[0-9]+$',
              errorMessage: 'Enter a valid numeric ID',
            },
          },
        ],
      },
    ],
  }),

  createField({
    displayName: 'Include',
    name: 'include',
    type: 'multiOptions',
    default: [],
    description: 'Include related entity IDs',
    resource: 'prospect',
    operations: ['getById'],
    optionsList: [
      { name: 'Campaign IDs', value: 'campaignIds' },
      { name: 'List IDs', value: 'listIds' },
      { name: 'Tag IDs', value: 'tagIds' },
    ],
  }),

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

  // -----------------------------
  // Bulk Add Prospects
  // -----------------------------
  createField({
    displayName: 'Prospects',
    name: 'prospects',
    type: 'multiOptions',
    description: 'Select one or more prospects by email (IDs are sent to API)',
    resource: 'prospect',
    operations: ['bulkAdd'],
    typeOptions: {
      loadOptionsMethod: 'getProspects',
      customValue: true,
      customValueType: 'number',
    },
  }),
  createField({
    displayName: 'List',
    name: 'listId',
    type: 'options',
    default: 0,
    required: true,
    description: 'Target list to add prospects to',
    typeOptions: {
      loadOptionsMethod: 'getLists',
      customValue: true,
      customValueType: 'number',
    },
    resource: 'prospect',
    operations: ['bulkAdd'],
  }),
  createField({
    displayName: 'Campaign',
    name: 'campaignId',
    type: 'options',
    default: 0,
    description: 'Optional campaign to add prospects to',
    typeOptions: {
      loadOptionsMethod: 'getCampaigns',
      customValue: true,
      customValueType: 'number',
    },
    resource: 'prospect',
    operations: ['bulkAdd'],
  }),
  createField({
    displayName: 'Add Only If New',
    name: 'addOnlyIfNew',
    type: 'boolean',
    default: false,
    description: 'Skip prospects already in the list/campaign',
    resource: 'prospect',
    operations: ['bulkAdd'],
  }),
  createField({
    displayName: 'Not In Other Campaign',
    name: 'notInOtherCampaign',
    type: 'boolean',
    default: true,
    description: 'Ensure prospects are not already in other campaigns',
    resource: 'prospect',
    operations: ['bulkAdd'],
  }),
];
