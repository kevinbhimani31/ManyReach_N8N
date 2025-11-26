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
import { tagOperations, tagFields } from './descriptions/tag.descriptions';
import { workspaceOperations, workspaceFields } from './descriptions/workspace.descriptions';
import { sequenceOperations, sequenceFields } from './descriptions/sequence.descriptions';

// Import API handlers

// Users
import { getAllUsers } from './resources/user/user.getAll';
import { getUserById } from './resources/user/user.getById';
import { createUser } from './resources/user/user.create';
import { updateUser } from './resources/user/user.update';
import { deleteUser } from './resources/user/user.delete';

// Clientspaces
import { getAllClientspaces } from './resources/clientspace/clientspace.getAll';
import { getClientspaceById } from './resources/clientspace/clientspace.getById';
import { createClientspace } from './resources/clientspace/clientspace.create';
import { updateClientspace } from './resources/clientspace/clientspace.update';
import { deleteClientspace } from './resources/clientspace/clientspace.delete';

// Prospect
import { createProspect } from './resources/Prospect/prospect.create';
import { getAllProspects } from './resources/Prospect/prospect.getAll';
import { bulkAddProspects } from './resources/Prospect/prospect.bulkAdd';
import { getProspectById } from './resources/Prospect/prospect.getById';

// List controller
import { loadListsForDropdown, searchListsForResourceLocator } from './resources/list/load/list.load';
import { loadCampaignsForDropdown, loadSendersForDropdown, searchCampaignsForResourceLocator } from './resources/campaign/load/campaign.load';
import { loadUsersForDropdown, searchUsersForResourceLocator } from './resources/user/load/user.load';
import { loadClientspacesForDropdown, searchClientspacesForResourceLocator } from './resources/clientspace/load/clientspace.load';
import { searchSendersForResourceLocator } from './resources/sender/load/sender.load';
import { searchProspectsForResourceLocator } from './resources/Prospect/load/prospect.load';
import { loadProspectsForIdDropdown } from './resources/Prospect/load/prospect.load';

import { getAllLists } from './resources/list/list.getAll';
import { getListById } from './resources/list/list.getById';
import { createList } from './resources/list/list.create';
import { updateList } from './resources/list/list.update';

// Campaigns
import { getAllCampaigns } from './resources/campaign/campaign.getAll';
import { getCampaignById } from './resources/campaign/campaign.getById';
import { createCampaign } from './resources/campaign/campaign.create';
import { updateCampaign } from './resources/campaign/campaign.update';
import { deleteCampaign } from './resources/campaign/campaign.delete';

// Sender
import { getAllSenders } from './resources/sender/sender.getAll';
import { getSenderById } from './resources/sender/sender.getById';
import { deleteSender } from './resources/sender/sender.delete';
// Tags
import { getAllTags } from './resources/tag/tag.getAll';
import { getTagById } from './resources/tag/tag.getById';
import { searchTagsForResourceLocator } from './resources/tag/load/tag.load';
import { deleteTag } from './resources/tag/tag.delete';
// Workspaces
import { getAllWorkspaces } from './resources/workspace/workspace.getAll';
import { getWorkspaceById } from './resources/workspace/workspace.getById';
import { searchWorkspacesForResourceLocator } from './resources/workspace/load/workspace.load';
import { deleteWorkspace } from './resources/workspace/workspace.delete';
// Sequences
import { getAllSequences } from './resources/sequence/sequence.getAll';

// Error handling
import { handleExecutionError } from './helpers/errorHandler';
import { senderFields, senderOperations } from './descriptions/sender.descriptions';

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
          { name: 'Campaign', value: 'campaign' },
          { name: 'Prospect', value: 'prospect' },
          { name: 'List', value: 'list' },
          { name: 'Client Space', value: 'clientspace' },
          { name: 'Sender' , value: 'sender'},
          { name: 'Tag', value: 'tag' },
          { name: 'Workspace', value: 'workspace' },
          { name: 'Sequence', value: 'sequence' },
        ],
      },

      // Injected dynamic description files
      ...userOperations,
      ...userFields,

      ...campaignOperations,
      ...campaignFields,
      
      ...prospectOperations,
      ...prospectFields,
      
      ...listOperations,
      ...listFields,

      ...clientspaceOperations,
      ...clientspaceFields,

      ...senderOperations,
      ...senderFields,

      ...tagOperations,
      ...tagFields,

      ...workspaceOperations,
      ...workspaceFields,

      ...sequenceOperations,
      ...sequenceFields
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
      getSenders: loadSendersForDropdown,
      getProspects: loadProspectsForIdDropdown,
    },
    listSearch: {
      searchCampaigns: searchCampaignsForResourceLocator,
      searchUsers: searchUsersForResourceLocator,
      searchClientspaces: searchClientspacesForResourceLocator,
      searchSenders: searchSendersForResourceLocator,
      searchTags: searchTagsForResourceLocator,
      searchWorkspaces: searchWorkspacesForResourceLocator,
      searchProspects: searchProspectsForResourceLocator,
      searchLists: searchListsForResourceLocator,
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
        } else if (resource === 'workspace') {
          switch (operation) {
            case 'getAll':
              data = await getAllWorkspaces.call(this, i);
              break;
            case 'getById':
              data = await getWorkspaceById.call(this, i);
              break;
            case 'delete':
              data = await deleteWorkspace.call(this, i);
              break;
            default:
              throw new Error(`Operation "${operation}" not supported for Workspace`);
          }
        } else if (resource === 'sequence') {
          switch (operation) {
            case 'getAll':
              data = await getAllSequences.call(this, i);
              break;
            default:
              throw new Error(`Operation "${operation}" not supported for Sequence`);
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
            case 'update':
              data = await updateClientspace.call(this, i);
              break;
            case 'delete':
              data = await deleteClientspace.call(this, i);
              break;
            default:
              throw new Error(`Operation "${operation}" not supported for Clientspace`);
          }
        }

        // PROSPECT RESOURCE
        else if (resource === 'prospect') {
          switch (operation) {
            case 'getAll':
              data = await getAllProspects.call(this, i);
              break;
            case 'bulkAdd':
              data = await bulkAddProspects.call(this, i);
              break;
            case 'getById':
              data = await getProspectById.call(this, i);
              break;
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

            case 'getById':
              data = await getListById.call(this, i);
              break;

            case 'create':
              data = await createList.call(this, i);
              break;

            case 'update':
              data = await updateList.call(this, i);
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
        }else if(resource === 'sender'){
          switch (operation) {
            case 'getAll':
              data = await getAllSenders.call(this, i);
              break;
            case 'getById':
              data = await getSenderById.call(this, i);
              break;
            case 'delete':
              data = await deleteSender.call(this, i);
              break;
            default:
              throw new Error(`Operation "${operation}" not supported for Sender`);
          }
        } else if (resource === 'tag') {
          switch (operation) {
            case 'getAll':
              data = await getAllTags.call(this, i);
              break;
            case 'getById':
              data = await getTagById.call(this, i);
              break;
            case 'delete':
              data = await deleteTag.call(this, i);
              break;
            default:
              throw new Error(`Operation "${operation}" not supported for Tag`);
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
