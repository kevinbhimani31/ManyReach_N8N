import { IExecuteFunctions } from 'n8n-workflow';
import { getAllUsers } from '../resources/user/user.getAll';
import { getUserById } from '../resources/user/user.getById';
import { createUser } from '../resources/user/user.create';
import { updateUser } from '../resources/user/user.update';
import { deleteUser } from '../resources/user/user.delete';

export async function executeUser(this: IExecuteFunctions, operation: string, i: number): Promise<any> {
  switch (operation) {
    case 'getAll':
      return await getAllUsers.call(this, i);
    case 'getById':
      return await getUserById.call(this, i);
    case 'create':
      return await createUser.call(this, i);
    case 'update':
      return await updateUser.call(this, i);
    case 'delete':
      return await deleteUser.call(this, i);
    default:
      throw new Error(`Operation "${operation}" not supported for User`);
  }
}


