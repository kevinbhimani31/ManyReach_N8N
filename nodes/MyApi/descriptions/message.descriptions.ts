import { INodeProperties } from 'n8n-workflow';
import { createField } from './common/fields';

export const messageOperations: INodeProperties[] = [
  createField({
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    resource: 'message',
    default: 'create',
    optionsList: [
      { name: 'Create', value: 'create' }
    ],
  }),
];

export const messageFields: INodeProperties[] = [
  createField({
    displayName: 'Message Id',
    name: 'messageId',
    type: 'string',
    default: '',
    description: 'ID of the received message to reply to. This is the Message-ID from the email headers. Required field.',
    resource: 'message',
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
      show: { resource: ['message'], operation: ['create'] },
    },
    options: [
    { displayName: 'Subject', name: 'subject', type: 'string', default: '' },
    { displayName: 'Body', name: 'body', type: 'string', default: '' },
    { displayName: 'Cc Emails', name: 'ccEmails', type: 'string', default: '' },
    { displayName: 'Bcc Emails', name: 'bccEmails', type: 'string', default: '' },
    { displayName: 'Send As Reply', name: 'sendAsReply', type: 'boolean', default: false },
    { displayName: 'From Email', name: 'fromEmail', type: 'string', default: '' },
    { displayName: 'Reply To Email', name: 'replyToEmail', type: 'string', default: '' }
    ],
  }
];
