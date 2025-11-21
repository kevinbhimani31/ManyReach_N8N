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

  // Get By ID - resource locator
  createField({
    displayName: 'Tag',
    name: 'tagId',
    type: 'resourceLocator',
    description: 'Select a tag from the list or enter the tag ID manually',
    resource: 'tag',
    operations: ['getById', 'delete'],
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


