import { INodeProperties } from 'n8n-workflow';
import { createField } from '../descriptions/common/fields';

export const sequenceOperations: INodeProperties[] = [
  createField({
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    resource: 'sequence',
    default: 'getAll',
    optionsList: [{ name: 'Get All', value: 'getAll' }],
  }),
];

export const sequenceFields: INodeProperties[] = [
  // Campaign required for Get All sequences
  createField({
    displayName: 'Campaign',
    name: 'campaignId',
    type: 'resourceLocator',
    description: 'Select a campaign or enter the campaign ID',
    resource: 'sequence',
    operations: ['getAll'],
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
        placeholder: 'Enter campaign ID (number)',
        validation: [
          {
            type: 'regex',
            properties: {
              regex: '^[0-9]+$',
              errorMessage: 'Enter a valid numeric campaign ID',
            },
          },
        ],
      },
    ],
  }),
];


