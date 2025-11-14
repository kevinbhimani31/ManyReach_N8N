import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

// Import reusable descriptions
import { userOperations, userFields } from './descriptions/user.descriptions';
import { clientspaceOperations, clientspaceFields } from './descriptions/clientspace.descriptions';
import { prospectOperations, prospectFields } from './descriptions/prospect.descriptions';
import { listOperations, listFields } from './descriptions/list.descriptions';
import { campaignOperations, campaignFields } from './descriptions/campaign.descriptions';

// Import API handlers
import { getAllUsers } from './resources/user/user.getAll';
import { getUserById } from './resources/user/user.getById';
import { createUser } from './resources/user/user.create';
import { updateUser } from './resources/user/user.update';
import { deleteUser } from './resources/user/user.delete';

import { getAllClientspaces } from './resources/clientspace/clientspace.getAll';
import { getClientspaceById } from './resources/clientspace/clientspace.getById';
import { createClientspace } from './resources/clientspace/clientspace.create';

import { createProspect } from './resources/Prospect/prospect.create';

import { loadListsForDropdown } from './resources/list/list.load';
import { loadCampaignsForDropdown, searchCampaignsForResourceLocator } from './resources/campaign/load/campaign.load';
import { loadUsersForDropdown, searchUsersForResourceLocator } from './resources/user/load/user.load';
import { loadClientspacesForDropdown, searchClientspacesForResourceLocator } from './resources/clientspace/load/clientspace.load';

import { getAllLists } from './resources/list/list.getAll';

import { getAllCampaigns } from './resources/campaign/campaign.getAll';
import { getCampaignById } from './resources/campaign/campaign.getById';
import { createCampaign } from './resources/campaign/campaign.create';
import { updateCampaign } from './resources/campaign/campaign.update';
import { deleteCampaign } from './resources/campaign/campaign.delete';

// Error handling
import { handleExecutionError } from './helpers/errorHandler';

export class MyApi implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'ManyReach',
    name: 'myApi',
    icon: 'file:ManyReach.png',
    group: ['transform'],
    version: 1,
    description: 'Interact with ManyReach API',

    defaults: {
      name: 'MyApi',
      color: '#1A82e2',
    },

    inputs: ['main'],
    outputs: ['main'],

    credentials: [
      {
        name: 'myApi',
        required: true,
      },
    ],

    properties: [
      // Resource Selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        default: 'user',
        options: [
          { name: 'User', value: 'user' },
          { name: 'Client Space', value: 'clientspace' },
          { name: 'Prospect', value: 'prospect' },
          { name: 'List', value: 'list' },
          { name: 'Campaign', value: 'campaign' },
        ],
      },

      // Injected dynamic description files
      ...userOperations,
      ...userFields,

      ...clientspaceOperations,
      ...clientspaceFields,

      ...prospectOperations,
      ...prospectFields,

      ...listOperations,
      ...listFields,

      ...campaignOperations,
      ...campaignFields,
    ],
  };

  // ----------------------------
  // Load Options Methods
  // ----------------------------

  methods = {
    loadOptions: {
      getLists: loadListsForDropdown,
      getCampaigns: loadCampaignsForDropdown,
      getUsers: loadUsersForDropdown,
      getClientspaces: loadClientspacesForDropdown,
    },
    listSearch: {
      searchCampaigns: searchCampaignsForResourceLocator,
      searchUsers: searchUsersForResourceLocator,
      searchClientspaces: searchClientspacesForResourceLocator,
    },
  };

  // ----------------------------
  // Main execute handler
  // ----------------------------

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let data;

        // USER RESOURCE
        if (resource === 'user') {
          switch (operation) {
            case 'getAll':
              data = await getAllUsers.call(this, i);
              break;

            case 'getById':
              data = await getUserById.call(this, i);
              break;

            case 'create':
              data = await createUser.call(this, i);
              break;

            case 'update':
              data = await updateUser.call(this, i);
              break;

            case 'delete':
              data = await deleteUser.call(this, i);
              break;

            default:
              throw new Error(`Operation "${operation}" not supported for User`);
          }
        }

        // CLIENTSPACE RESOURCE
        else if (resource === 'clientspace') {
          switch (operation) {
            case 'getAll':
              data = await getAllClientspaces.call(this, i);
              break;

            case 'getById':
              data = await getClientspaceById.call(this, i);
              break;

            case 'create':
              data = await createClientspace.call(this, i);
              break;

            default:
              throw new Error(`Operation "${operation}" not supported for Clientspace`);
          }
        }

        // PROSPECT RESOURCE
        else if (resource === 'prospect') {
          switch (operation) {
            case 'create':
              data = await createProspect.call(this, i);
              break;

            default:
              throw new Error(`Operation "${operation}" not supported for Prospect`);
          }
        }

        // LIST RESOURCE
        else if (resource === 'list') {
          switch (operation) {
            case 'getAll':
              data = await getAllLists.call(this, i);
              break;

            default:
              throw new Error(`Operation "${operation}" not supported for List`);
          }
        }

        // CAMPAIGN RESOURCE
        else if (resource === 'campaign') {
          switch (operation) {
            case 'getAll':
              data = await getAllCampaigns.call(this, i);
              break;

            case 'getById':
              data = await getCampaignById.call(this, i);
              break;
            case 'create':
              data = await createCampaign.call(this, i);
              break;
            case 'update':
              data = await updateCampaign.call(this, i);
              break;
            case 'delete':
              data = await deleteCampaign.call(this, i);
              break;
            default:
              throw new Error(`Operation "${operation}" not supported for Campaign`);
          }
        }

        else {
          throw new Error(`Resource "${resource}" not supported`);
        }

        returnData.push({ json: data });

      } catch (error) {
        const err = handleExecutionError(error);
        returnData.push({ json: err });
      }
    }

    return this.prepareOutputData(returnData);
  }
}
