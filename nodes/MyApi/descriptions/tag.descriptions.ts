import { INodeProperties } from 'n8n-workflow';
import { createField } from '../descriptions/common/fields';

export const tagOperations: INodeProperties[] = [
  createField({
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    resource: 'tag',
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

export const tagFields: INodeProperties[] = [
  // Pagination
  createField({
    displayName: 'Page',
    name: 'page',
    type: 'number',
    default: 1,
    resource: 'tag',
    operations: ['getAll'],
  }),

  createField({
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 100,
    resource: 'tag',
    operations: ['getAll'],
  }),

  // Cursor
  createField({
    displayName: 'Starting After',
    name: 'startingAfter',
    type: 'number',
    default: 0,
    description: 'Cursor-based pagination: Tag ID to start after',
    resource: 'tag',
    operations: ['getAll'],
  }),

  // Search
  createField({
    displayName: 'Search',
    name: 'search',
    type: 'string',
    default: '',
    description: 'Case-insensitive substring match for tag name',
    resource: 'tag',
    operations: ['getAll'],
  }),

  // Include flags
  createField({
    displayName: 'Include',
    name: 'include',
    type: 'multiOptions',
    default: [],
    description: 'Additional data to include',
    resource: 'tag',
    operations: ['getAll'],
    optionsList: [{ name: 'Prospect Count', value: 'prospectCount' }],
  }),

  // Get By ID and Update - resource locator
  createField({
    displayName: 'Tag',
    name: 'tagId',
    type: 'resourceLocator',
    description: 'Select a tag from the list or enter the tag ID manually',
    resource: 'tag',
    operations: ['getById', 'update', 'delete'],
    modes: [
      {
        displayName: 'From list',
        name: 'list',
        type: 'list',
        placeholder: 'Select a tag...',
        typeOptions: {
          searchListMethod: 'searchTags',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'Enter tag ID (number)',
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

  // Create Tag Fields
  createField({
    displayName: 'Title',
    name: 'Title',
    type: 'string',
    description: 'Tag name used for organizing and categorizing prospects. Maximum 128 characters.',
    resource: 'tag',
    operations: ['create','update'],
    required: true,
    typeOptions: {
      maxLength: 128,
    },
  }),

  createField({
    displayName: 'Description',
    name: 'Description',
    type: 'string',
    description: 'Optional description explaining the purpose or criteria for this tag. Maximum 1,000 characters.',
    resource: 'tag',
    operations: ['create','update'],
    typeOptions: {
      maxLength: 1000,
    },
  }),

  // Delete options
  createField({
    displayName: 'Force',
    name: 'force',
    type: 'boolean',
    default: false,
    description: 'Force delete even if tag has prospects (cascade relationships)',
    resource: 'tag',
    operations: ['delete'],
  }),
];


