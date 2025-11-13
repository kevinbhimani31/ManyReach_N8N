import { ICredentialType, NodePropertyTypes } from 'n8n-workflow';

export class MyApi implements ICredentialType {
  name = 'myApi';
  displayName = 'My API';
  documentationUrl = 'https://example.com';
  properties = [
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string' as NodePropertyTypes,
      default: '',
      placeholder: 'https://api.example.com',
      description: 'Base URL for the API (no trailing slash)',
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string' as NodePropertyTypes,
      default: '',
      description: 'API key or Bearer token to authenticate requests',
    },
  ];
}
