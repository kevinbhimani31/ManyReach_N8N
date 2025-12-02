import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

// Campaign descriptions
import { campaignOperations, campaignFields } from './descriptions/campaign.descriptions';

// Campaign operations
import { copyCampaign } from './resources/campaign/campaign.copy';
import { createCampaign } from './resources/campaign/campaign.create';
import { createSequencesCampaign } from './resources/campaign/campaign.createSequences';
import { deleteCampaign } from './resources/campaign/campaign.delete';
import { getAllCampaigns } from './resources/campaign/campaign.getAll';
import { getCampaignById } from './resources/campaign/campaign.getById';
import { getSequencesCampaign } from './resources/campaign/campaign.getSequences';
import { getStatsCampaign } from './resources/campaign/campaign.getStats';
import { pauseCampaign } from './resources/campaign/campaign.pause';
import { startCampaign } from './resources/campaign/campaign.start';
import { updateCampaign } from './resources/campaign/campaign.update';
import { loadCampaignsForDropdown, searchCampaignsForResourceLocator } from './resources/campaign/load/campaign.load';

// Clientspace descriptions
import { clientspaceOperations, clientspaceFields } from './descriptions/clientspace.descriptions';

// Clientspace operations
import { createClientspace } from './resources/clientspace/clientspace.create';
import { deleteClientspace } from './resources/clientspace/clientspace.delete';
import { getAllClientspaces } from './resources/clientspace/clientspace.getAll';
import { getClientspaceById } from './resources/clientspace/clientspace.getById';
import { updateClientspace } from './resources/clientspace/clientspace.update';
import { loadClientspacesForDropdown, searchClientspacesForResourceLocator } from './resources/clientspace/load/clientspace.load';

// Followup descriptions
import { followupOperations, followupFields } from './descriptions/followup.descriptions';

// Followup operations
import { deleteFollowup } from './resources/followup/followup.delete';
import { getFollowupById } from './resources/followup/followup.getById';
import { updateFollowup } from './resources/followup/followup.update';
import { loadFollowupsForDropdown, searchFollowupsForResourceLocator } from './resources/followup/load/followup.load';

// List descriptions
import { listOperations, listFields } from './descriptions/list.descriptions';

// List operations
import { createList } from './resources/list/list.create';
import { getAllLists } from './resources/list/list.getAll';
import { getListById } from './resources/list/list.getById';
import { updateList } from './resources/list/list.update';
import { loadListsForDropdown, searchListsForResourceLocator } from './resources/list/load/list.load';

// Message descriptions
import { messageOperations, messageFields } from './descriptions/message.descriptions';

// Message operations
import { createMessage } from './resources/message/message.create';
import { loadMessagesForDropdown, searchMessagesForResourceLocator } from './resources/message/load/message.load';

// Prospect descriptions
import { prospectOperations, prospectFields } from './descriptions/prospect.descriptions';

// Prospect operations
import { createProspect } from './resources/prospect/prospect.create';
import { createTagsProspect } from './resources/prospect/prospect.createTags';
import { deleteProspect } from './resources/prospect/prospect.delete';
import { getAllProspects } from './resources/prospect/prospect.getAll';
import { getProspectById } from './resources/prospect/prospect.getById';
import { getMessagesProspect } from './resources/prospect/prospect.getMessages';
import { getTagsProspect } from './resources/prospect/prospect.getTags';
import { updateProspect } from './resources/prospect/prospect.update';
import { loadProspectsForDropdown, searchProspectsForResourceLocator } from './resources/prospect/load/prospect.load';

// Sender descriptions
import { senderOperations, senderFields } from './descriptions/sender.descriptions';

// Sender operations
import { createSender } from './resources/sender/sender.create';
import { deleteSender } from './resources/sender/sender.delete';
import { getAllSenders } from './resources/sender/sender.getAll';
import { getSenderById } from './resources/sender/sender.getById';
import { getErrorsSender } from './resources/sender/sender.getErrors';
import { updateSender } from './resources/sender/sender.update';
import { loadSendersForDropdown, searchSendersForResourceLocator } from './resources/sender/load/sender.load';

// Sequence descriptions
import { sequenceOperations, sequenceFields } from './descriptions/sequence.descriptions';

// Sequence operations
import { createFollowupsSequence } from './resources/sequence/sequence.createFollowups';
import { deleteSequence } from './resources/sequence/sequence.delete';
import { getFollowupsSequence } from './resources/sequence/sequence.getFollowups';
import { updateSequence } from './resources/sequence/sequence.update';
import { loadSequencesForDropdown, searchSequencesForResourceLocator } from './resources/sequence/load/sequence.load';

// Tags descriptions
import { tagsOperations, tagsFields } from './descriptions/tags.descriptions';

// Tags operations
import { createTags } from './resources/tags/tags.create';
import { deleteTags } from './resources/tags/tags.delete';
import { getAllTagss } from './resources/tags/tags.getAll';
import { getTagsById } from './resources/tags/tags.getById';
import { getProspectsTags } from './resources/tags/tags.getProspects';
import { updateTags } from './resources/tags/tags.update';
import { loadTagssForDropdown, searchTagssForResourceLocator } from './resources/tags/load/tags.load';

// User descriptions
import { userOperations, userFields } from './descriptions/user.descriptions';

// User operations
import { createUser } from './resources/user/user.create';
import { deleteUser } from './resources/user/user.delete';
import { getAllUsers } from './resources/user/user.getAll';
import { getUserById } from './resources/user/user.getById';
import { updateUser } from './resources/user/user.update';
import { loadUsersForDropdown, searchUsersForResourceLocator } from './resources/user/load/user.load';

// Whitelabel descriptions
import { whitelabelOperations, whitelabelFields } from './descriptions/whitelabel.descriptions';

// Whitelabel operations
import { updateWhitelabel } from './resources/whitelabel/whitelabel.update';
import { loadWhitelabelsForDropdown, searchWhitelabelsForResourceLocator } from './resources/whitelabel/load/whitelabel.load';

// Workspace descriptions
import { workspaceOperations, workspaceFields } from './descriptions/workspace.descriptions';

// Workspace operations
import { createWorkspace } from './resources/workspace/workspace.create';
import { deleteWorkspace } from './resources/workspace/workspace.delete';
import { getAllWorkspaces } from './resources/workspace/workspace.getAll';
import { getWorkspaceById } from './resources/workspace/workspace.getById';
import { updateWorkspace } from './resources/workspace/workspace.update';
import { loadWorkspacesForDropdown, searchWorkspacesForResourceLocator } from './resources/workspace/load/workspace.load';


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
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        default: 'campaign',
        options: [
          { name: 'Campaign', value: 'campaign' },
          { name: 'Clientspace', value: 'clientspace' },
          { name: 'Followup', value: 'followup' },
          { name: 'List', value: 'list' },
          { name: 'Message', value: 'message' },
          { name: 'Prospect', value: 'prospect' },
          { name: 'Sender', value: 'sender' },
          { name: 'Sequence', value: 'sequence' },
          { name: 'Tags', value: 'tags' },
          { name: 'User', value: 'user' },
          { name: 'Whitelabel', value: 'whitelabel' },
          { name: 'Workspace', value: 'workspace' }
        ],
      },

      ...campaignOperations,
      ...campaignFields,

      ...clientspaceOperations,
      ...clientspaceFields,

      ...followupOperations,
      ...followupFields,

      ...listOperations,
      ...listFields,

      ...messageOperations,
      ...messageFields,

      ...prospectOperations,
      ...prospectFields,

      ...senderOperations,
      ...senderFields,

      ...sequenceOperations,
      ...sequenceFields,

      ...tagsOperations,
      ...tagsFields,

      ...userOperations,
      ...userFields,

      ...whitelabelOperations,
      ...whitelabelFields,

      ...workspaceOperations,
      ...workspaceFields
    ],
  };

  methods = {
    loadOptions: {
      getCampaigns: loadCampaignsForDropdown,
      getClientspaces: loadClientspacesForDropdown,
      getFollowups: loadFollowupsForDropdown,
      getLists: loadListsForDropdown,
      getMessages: loadMessagesForDropdown,
      getProspects: loadProspectsForDropdown,
      getSenders: loadSendersForDropdown,
      getSequences: loadSequencesForDropdown,
      getTagss: loadTagssForDropdown,
      getUsers: loadUsersForDropdown,
      getWhitelabels: loadWhitelabelsForDropdown,
      getWorkspaces: loadWorkspacesForDropdown
    },
    listSearch: {
      searchCampaigns: searchCampaignsForResourceLocator,
      searchClientspaces: searchClientspacesForResourceLocator,
      searchFollowups: searchFollowupsForResourceLocator,
      searchLists: searchListsForResourceLocator,
      searchMessages: searchMessagesForResourceLocator,
      searchProspects: searchProspectsForResourceLocator,
      searchSenders: searchSendersForResourceLocator,
      searchSequences: searchSequencesForResourceLocator,
      searchTagss: searchTagssForResourceLocator,
      searchUsers: searchUsersForResourceLocator,
      searchWhitelabels: searchWhitelabelsForResourceLocator,
      searchWorkspaces: searchWorkspacesForResourceLocator
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let data;

        if (resource === 'campaign') {
          switch (operation) {
            case 'copy':
              data = await copyCampaign.call(this, i);
              break;
            case 'create':
              data = await createCampaign.call(this, i);
              break;
            case 'createSequences':
              data = await createSequencesCampaign.call(this, i);
              break;
            case 'delete':
              data = await deleteCampaign.call(this, i);
              break;
            case 'getAll':
              data = await getAllCampaigns.call(this, i);
              break;
            case 'getById':
              data = await getCampaignById.call(this, i);
              break;
            case 'getSequences':
              data = await getSequencesCampaign.call(this, i);
              break;
            case 'getStats':
              data = await getStatsCampaign.call(this, i);
              break;
            case 'pause':
              data = await pauseCampaign.call(this, i);
              break;
            case 'start':
              data = await startCampaign.call(this, i);
              break;
            case 'update':
              data = await updateCampaign.call(this, i);
              break;

            default:
              throw new Error(`Operation "${operation}" not supported for Campaign`);
          }
        }
        else if (resource === 'clientspace') {
          switch (operation) {
            case 'create':
              data = await createClientspace.call(this, i);
              break;
            case 'delete':
              data = await deleteClientspace.call(this, i);
              break;
            case 'getAll':
              data = await getAllClientspaces.call(this, i);
              break;
            case 'getById':
              data = await getClientspaceById.call(this, i);
              break;
            case 'update':
              data = await updateClientspace.call(this, i);
              break;

            default:
              throw new Error(`Operation "${operation}" not supported for Clientspace`);
          }
        }
        else if (resource === 'followup') {
          switch (operation) {
            case 'delete':
              data = await deleteFollowup.call(this, i);
              break;
            case 'getById':
              data = await getFollowupById.call(this, i);
              break;
            case 'update':
              data = await updateFollowup.call(this, i);
              break;

            default:
              throw new Error(`Operation "${operation}" not supported for Followup`);
          }
        }
        else if (resource === 'list') {
          switch (operation) {
            case 'create':
              data = await createList.call(this, i);
              break;
            case 'getAll':
              data = await getAllLists.call(this, i);
              break;
            case 'getById':
              data = await getListById.call(this, i);
              break;
            case 'update':
              data = await updateList.call(this, i);
              break;

            default:
              throw new Error(`Operation "${operation}" not supported for List`);
          }
        }
        else if (resource === 'message') {
          switch (operation) {
            case 'create':
              data = await createMessage.call(this, i);
              break;

            default:
              throw new Error(`Operation "${operation}" not supported for Message`);
          }
        }
        else if (resource === 'prospect') {
          switch (operation) {
            case 'create':
              data = await createProspect.call(this, i);
              break;
            case 'createTags':
              data = await createTagsProspect.call(this, i);
              break;
            case 'delete':
              data = await deleteProspect.call(this, i);
              break;
            case 'getAll':
              data = await getAllProspects.call(this, i);
              break;
            case 'getById':
              data = await getProspectById.call(this, i);
              break;
            case 'getMessages':
              data = await getMessagesProspect.call(this, i);
              break;
            case 'getTags':
              data = await getTagsProspect.call(this, i);
              break;
            case 'update':
              data = await updateProspect.call(this, i);
              break;

            default:
              throw new Error(`Operation "${operation}" not supported for Prospect`);
          }
        }
        else if (resource === 'sender') {
          switch (operation) {
            case 'create':
              data = await createSender.call(this, i);
              break;
            case 'delete':
              data = await deleteSender.call(this, i);
              break;
            case 'getAll':
              data = await getAllSenders.call(this, i);
              break;
            case 'getById':
              data = await getSenderById.call(this, i);
              break;
            case 'getErrors':
              data = await getErrorsSender.call(this, i);
              break;
            case 'update':
              data = await updateSender.call(this, i);
              break;

            default:
              throw new Error(`Operation "${operation}" not supported for Sender`);
          }
        }
        else if (resource === 'sequence') {
          switch (operation) {
            case 'createFollowups':
              data = await createFollowupsSequence.call(this, i);
              break;
            case 'delete':
              data = await deleteSequence.call(this, i);
              break;
            case 'getFollowups':
              data = await getFollowupsSequence.call(this, i);
              break;
            case 'update':
              data = await updateSequence.call(this, i);
              break;

            default:
              throw new Error(`Operation "${operation}" not supported for Sequence`);
          }
        }
        else if (resource === 'tags') {
          switch (operation) {
            case 'create':
              data = await createTags.call(this, i);
              break;
            case 'delete':
              data = await deleteTags.call(this, i);
              break;
            case 'getAll':
              data = await getAllTagss.call(this, i);
              break;
            case 'getById':
              data = await getTagsById.call(this, i);
              break;
            case 'getProspects':
              data = await getProspectsTags.call(this, i);
              break;
            case 'update':
              data = await updateTags.call(this, i);
              break;

            default:
              throw new Error(`Operation "${operation}" not supported for Tags`);
          }
        }
        else if (resource === 'user') {
          switch (operation) {
            case 'create':
              data = await createUser.call(this, i);
              break;
            case 'delete':
              data = await deleteUser.call(this, i);
              break;
            case 'getAll':
              data = await getAllUsers.call(this, i);
              break;
            case 'getById':
              data = await getUserById.call(this, i);
              break;
            case 'update':
              data = await updateUser.call(this, i);
              break;

            default:
              throw new Error(`Operation "${operation}" not supported for User`);
          }
        }
        else if (resource === 'whitelabel') {
          switch (operation) {
            case 'update':
              data = await updateWhitelabel.call(this, i);
              break;

            default:
              throw new Error(`Operation "${operation}" not supported for Whitelabel`);
          }
        }
        else if (resource === 'workspace') {
          switch (operation) {
            case 'create':
              data = await createWorkspace.call(this, i);
              break;
            case 'delete':
              data = await deleteWorkspace.call(this, i);
              break;
            case 'getAll':
              data = await getAllWorkspaces.call(this, i);
              break;
            case 'getById':
              data = await getWorkspaceById.call(this, i);
              break;
            case 'update':
              data = await updateWorkspace.call(this, i);
              break;

            default:
              throw new Error(`Operation "${operation}" not supported for Workspace`);
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
