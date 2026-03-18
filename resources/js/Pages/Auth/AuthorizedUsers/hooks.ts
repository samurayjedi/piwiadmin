import _ from 'lodash';
import { useAppPage } from '@/hooks';
import { useRoles, type Role } from '../Roles/hooks';

export function useAuthorizedUsers() {
  const { authorized_users } = useAppPage().props;
  if (!authorized_users) {
    throw new Error(
      'For some reason, autorized users prop is not available in this page.',
    );
  }

  return authorized_users as AuthorizedUsers[];
}

export function useRolesSelectItems() {
  const roles = useRoles();
  const hashmap: Record<string, string> = {};
  _.forEach(roles, (role) => {
    hashmap[role.slug] = role.name;
  });

  return hashmap;
}

export interface AuthorizedUsers {
  id: number;
  email: string;
  name: string;
  role_slug: string;
  role: Role;
}
