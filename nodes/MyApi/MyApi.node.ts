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

import { createTag } from './resources/tag/tag.create';
// Modular execute handlers
import { executeUser } from './execute/user.exec';
import { executeClientspace } from './execute/clientspace.exec';
import { executeProspect } from './execute/prospect.exec';
import { executeList } from './execute/list.exec';
import { executeCampaign } from './execute/campaign.exec';
import { executeSender } from './execute/sender.exec';
import { executeTag } from './execute/tag.exec';
import { executeWorkspace } from './execute/workspace.exec';
import { executeSequence } from './execute/sequence.exec';

// List controller
import { loadListsForDropdown, searchListsForResourceLocator } from './resources/list/load/list.load';
import { loadCampaignsForDropdown, loadSendersForDropdown, searchCampaignsForResourceLocator } from './resources/campaign/load/campaign.load';
import { loadUsersForDropdown, searchUsersForResourceLocator } from './resources/user/load/user.load';
import { loadClientspacesForDropdown, searchClientspacesForResourceLocator } from './resources/clientspace/load/clientspace.load';
import { searchSendersForResourceLocator } from './resources/sender/load/sender.load';
import { searchProspectsForResourceLocator } from './resources/Prospect/load/prospect.load';
import { loadProspectsForIdDropdown } from './resources/Prospect/load/prospect.load';

import { searchTagsForResourceLocator } from './resources/tag/load/tag.load';
import { searchWorkspacesForResourceLocator } from './resources/workspace/load/workspace.load';

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

        // Dispatch to per-resource executors
        if (resource === 'user') {
          data = await executeUser.call(this, operation, i);
        } else if (resource === 'workspace') {
          data = await executeWorkspace.call(this, operation, i);
        } else if (resource === 'sequence') {
          data = await executeSequence.call(this, operation, i);
        } else if (resource === 'clientspace') {
          data = await executeClientspace.call(this, operation, i);
        } else if (resource === 'prospect') {
          data = await executeProspect.call(this, operation, i);
        } else if (resource === 'list') {
          data = await executeList.call(this, operation, i);
        } else if (resource === 'campaign') {
          data = await executeCampaign.call(this, operation, i);
        } else if (resource === 'sender') {
          data = await executeSender.call(this, operation, i);
        } else if (resource === 'tag') {
          data = await executeTag.call(this, operation, i);
        } else {
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
