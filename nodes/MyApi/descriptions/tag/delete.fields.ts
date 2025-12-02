import { INodeProperties } from 'n8n-workflow';
import { createField } from '../common/fields';

export const tagDeleteFields: INodeProperties[] = [
  // Tag selector for delete
  createField({
    displayName: 'Tag',
    name: 'tagId',
    type: 'resourceLocator',
    description: 'Select a tag from the list or enter the tag ID manually',
    resource: 'tag',
    operations: ['delete'],
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


