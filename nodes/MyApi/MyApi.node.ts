import {
  IExecuteFunctions,
  INodeType,
  INodeExecutionData,
  INodeTypeDescription,
} from 'n8n-workflow';

import { handleExecutionError } from './helpers/errorHandler';
import { getAllUsers } from './resources/user/user.getAll';
import { getUserById } from './resources/user/user.getById';
import { createUser } from './resources/user/user.create';
import { updateUser } from './resources/user/user.update';
import { deleteUser } from './resources/user/user.delete';
import { getAllClientspaces } from './resources/clientspace/clientspace.getAll';
import { getClientspaceById } from './resources/clientspace/clientspace.getById';
import { createClientspace } from './resources/clientspace/clientspace.create';

// Model 
// import { CreateClientspaceRequest } from './resources/clientspace/clientspace.create';

export class MyApi implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'ManyReach',
    name: 'myApi',
    icon: 'file:icons8-iron-man-50.svg',
    group: ['transform'],
    version: 1,
    description: 'Interact with My API',
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
        options: [
          {
            name: 'User',
            value: 'user',
          },
          {
            name: 'Client Space',
            value: 'clientspace',
          }
        ],
        default: 'user',
        description: 'Resource to operate on',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['user'],
          },
        },
        options: [
          { name: 'Get All', value: 'getAll', description: 'Get all users' },
          { name: 'Get By ID', value: 'getById', description: 'Get user by ID' },
          { name: 'Create', value: 'create', description: 'Create a user' },
          { name: 'Update', value: 'update', description: 'Update user' },
          { name: 'Delete', value: 'delete', description: 'Delete user' },
        ],
        default: 'getAll',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['clientspace'],
          },
        },
        options: [
          { name: 'Get All', value: 'getAll', description: 'Get all client spaces' },
          { name: 'Get By ID', value: 'getById', description: 'Get client space by ID' },
          { name: 'Create', value: 'create', description: 'Create a client space' },
        ],
        default: 'getAll',
      },

      // Generic inputs used by operations; shown/hidden using displayOptions inside resource files below
      {
        displayName: 'Page',
        name: 'page',
        type: 'number',
        default: 1,
        displayOptions: { show: { resource: ['user', 'clientspace'], operation: ['getAll'] } },
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 100,
        displayOptions: { show: { resource: ['user', 'clientspace'], operation: ['getAll'] } },
      },
      {
        displayName: 'User ID (GUID)',
        name: 'userId',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            resource: ['user'],
            operation: ['getById', 'update', 'delete'],
          },
        },
      },
      {
        displayName: 'Clientspace ID (Number)',
        name: 'clientspaceId',
        type: 'number',
        default: '',
        displayOptions: {
          show: {
            resource: ['clientspace'],
            operation: ['getById'],
          },
        },
      },
      {
        displayName: 'User Body (JSON)',
        name: 'userBody',
        type: 'json',
        default: {},
        description: 'JSON object for create/update requests',
        displayOptions: {
          show: {
            resource: ['user'],
            operation: ['create', 'update'],
          },
        },
      },
      {
        displayName: 'Clientspace Body (JSON)',
        name: 'clientspaceBody',
        type: 'json',
        default: {},
        description: 'JSON object for create/update requests',
        displayOptions: {
          show: {
            resource: ['clientspace'],
            operation: ['create'],
          },
        },
      },
      {
        displayName: 'Starting After',
        name: 'startingAfter',
        type: 'number',
        default: 0,
        displayOptions: { show: { resource: ['clientspace'], operation: ['getAll'] } },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    const returnData: INodeExecutionData[] = [];
    // iterate items (support batch)
    for (let i = 0; i < items.length; i++) {
      try {
        if (resource === 'user') {
          switch (operation) {
            case 'getAll': {
              const data = await getAllUsers.call(this, i);
              returnData.push({ json: data } as INodeExecutionData);
              break;
            }
            case 'getById': {
              const data = await getUserById.call(this, i);
              returnData.push({ json: data } as INodeExecutionData);
              break;
            }
            case 'create': {
              const data = await createUser.call(this, i);
              returnData.push({ json: data } as INodeExecutionData);
              break;
            }
            case 'update': {
              const data = await updateUser.call(this, i);
              returnData.push({ json: data } as INodeExecutionData);
              break;
            }
            case 'delete': {
              const data = await deleteUser.call(this, i);
              returnData.push({ json: data } as INodeExecutionData);
              break;
            }
            default:
              throw new Error(`Operation "${operation}" is not supported for resource "${resource}"`);
          }
        } else if (resource === 'clientspace') {
          switch (operation) {
            case 'getAll': {
              const data = await getAllClientspaces.call(this, i);
              returnData.push({ json: data } as INodeExecutionData);
              break;
            }
            case 'getById': {
              const data = await getClientspaceById.call(this, i);
              returnData.push({ json: data } as INodeExecutionData);
              break;
            }
            case 'create': {
              const data = await createClientspace.call(this, i);
              returnData.push({ json: data } as INodeExecutionData);
              break;
            }
            default:
              throw new Error(`Operation "${operation}" is not supported for resource "${resource}"`);
          }
        } else {
          throw new Error(`Resource "${resource}" not supported`);
        }
      } catch (error) {
        // centralized handling - returns an item with error payload
        const errItem = handleExecutionError(error);
        returnData.push({ json: errItem } as INodeExecutionData);
      }
    }

    return this.prepareOutputData(returnData);
  }
}
