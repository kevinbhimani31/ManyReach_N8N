import { INodeProperties } from 'n8n-workflow';
import { createField } from './common/fields';

export const whitelabelOperations: INodeProperties[] = [
  createField({
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    resource: 'whitelabel',
    default: 'update',
    optionsList: [
      { name: 'Update', value: 'update' }
    ],
  }),
];

export const whitelabelFields: INodeProperties[] = [
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    default: {},
    placeholder: 'Add Field',
    displayOptions: {
      show: { resource: ['whitelabel'], operation: ['update'] },
    },
    options: [
    { displayName: 'Color', name: 'color', type: 'string', default: '' },
    { displayName: 'Custom Domain', name: 'customDomain', type: 'string', default: '' },
    { displayName: 'Logo Image Url', name: 'logoImageUrl', type: 'string', default: '' }
    ],
  }
];
