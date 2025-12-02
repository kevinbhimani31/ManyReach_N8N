import { INodeProperties } from 'n8n-workflow';
import { createField } from '../common/fields';

export const tagGetByIdFields: INodeProperties[] = [
  // Get By ID - resource locator
  createField({
    displayName: 'Tag',
    name: 'tagId',
    type: 'resourceLocator',
    description: 'Select a tag from the list or enter the tag ID manually',
    resource: 'tag',
    operations: ['getById'],
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
];


