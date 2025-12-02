import { INodeProperties } from 'n8n-workflow';
import { createField } from './common/fields';

export const tagsOperations: INodeProperties[] = [
  createField({
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    resource: 'tags',
    default: 'getAll',
    optionsList: [
      { name: 'Get All', value: 'getAll' },
      { name: 'Create', value: 'create' },
      { name: 'Get By ID', value: 'getById' },
      { name: 'Delete', value: 'delete' },
      { name: 'Update', value: 'update' },
      { name: 'GetProspects', value: 'getProspects' }
    ],
  }),
];

export const tagsFields: INodeProperties[] = [
  createField({
    displayName: 'Page',
    name: 'page',
    type: 'number',
    default: 1,
    resource: 'tags',
    operations: ['getAll'],
  }),

  createField({
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 100,
    resource: 'tags',
    operations: ['getAll'],
  }),

  createField({
    displayName: 'Search',
    name: 'search',
    type: 'string',
    default: '',
    description: 'Optional case-insensitive search term for tag name',
    resource: 'tags',
    operations: ['getAll'],
    
  }),

  createField({
    displayName: 'Include',
    name: 'include',
    type: 'string',
    default: '',
    description: 'Comma-separated list of additional data to include (e.g., \"prospectCount\")',
    resource: 'tags',
    operations: ['getAll'],
    
  }),

  createField({
    displayName: 'Starting After',
    name: 'startingAfter',
    type: 'number',
    default: 0,
    description: 'Cursor for next page (optional, for cursor-based pagination)',
    resource: 'tags',
    operations: ['getAll'],
    
  }),

  createField({
    displayName: 'Title',
    name: 'title',
    type: 'string',
    default: '',
    description: 'Tag name used for organizing and categorizing prospects; maximum 128 characters.',
    resource: 'tags',
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
      show: { resource: ['tags'], operation: ['create'] },
    },
    options: [
    { displayName: 'Description', name: 'description', type: 'string', default: '' }
    ],
  },

  createField({
    displayName: 'Tags',
    name: 'tagsId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a tags from the list or enter its ID',
    resource: 'tags',
    operations: ['getById'],
    modes: [
      {
        displayName: 'From list',
        name: 'list',
        type: 'list',
        placeholder: 'Select a tags...',
        typeOptions: {
          searchListMethod: 'searchTagss',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'Enter tags ID',
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
    displayName: 'Tags',
    name: 'tagsId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a tags from the list or enter its ID',
    resource: 'tags',
    operations: ['delete'],
    modes: [
      {
        displayName: 'From list',
        name: 'list',
        type: 'list',
        placeholder: 'Select a tags...',
        typeOptions: {
          searchListMethod: 'searchTagss',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'Enter tags ID',
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
    displayName: 'Force',
    name: 'force',
    type: 'boolean',
    default: false,
    description: 'If true, force delete even if tag has prospects (cascade delete relationships). Default: false',
    resource: 'tags',
    operations: ['delete'],
    
  }),

  createField({
    displayName: 'Tags',
    name: 'tagsId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a tags from the list or enter its ID',
    resource: 'tags',
    operations: ['update'],
    modes: [
      {
        displayName: 'From list',
        name: 'list',
        type: 'list',
        placeholder: 'Select a tags...',
        typeOptions: {
          searchListMethod: 'searchTagss',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'Enter tags ID',
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
      show: { resource: ['tags'], operation: ['update'] },
    },
    options: [
    { displayName: 'Title', name: 'title', type: 'string', default: '' },
    { displayName: 'Description', name: 'description', type: 'string', default: '' }
    ],
  },

  createField({
    displayName: 'Tags',
    name: 'tagsId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a tags from the list or enter its ID',
    resource: 'tags',
    operations: ['getProspects'],
    modes: [
      {
        displayName: 'From list',
        name: 'list',
        type: 'list',
        placeholder: 'Select a tags...',
        typeOptions: {
          searchListMethod: 'searchTagss',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'Enter tags ID',
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
    resource: 'tags',
    operations: ['getProspects'],
    
  })
];
