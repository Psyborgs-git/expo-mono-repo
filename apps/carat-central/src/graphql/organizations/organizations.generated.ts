import * as Types from '../../generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type Org_BasicFragment = {
  __typename?: 'Organization';
  id: string;
  name: string;
  description?: string | null;
  domain?: string | null;
  isActive: boolean;
  createdAt: any;
  updatedAt: any;
};

export type Org_MemberFragment = {
  __typename?: 'OrganizationMember';
  id: string;
  userId: string;
  organizationId: string;
  isOwner: boolean;
  isActive: boolean;
  joinedAt: any;
  roleId?: string | null;
  role?: {
    __typename?: 'Role';
    id: string;
    name: string;
    description?: string | null;
    isActive: boolean;
    isAdminRole: boolean;
  } | null;
  user: {
    __typename?: 'User';
    id: string;
    name: string;
    email: string;
    isActive: boolean;
  };
};

export type Org_DetailFragment = {
  __typename?: 'Organization';
  id: string;
  name: string;
  description?: string | null;
  domain?: string | null;
  isActive: boolean;
  createdAt: any;
  updatedAt: any;
  organizationUsers: Array<{
    __typename?: 'OrganizationMember';
    id: string;
    userId: string;
    organizationId: string;
    isOwner: boolean;
    isActive: boolean;
    joinedAt: any;
    roleId?: string | null;
    role?: {
      __typename?: 'Role';
      id: string;
      name: string;
      description?: string | null;
      isActive: boolean;
      isAdminRole: boolean;
    } | null;
    user: {
      __typename?: 'User';
      id: string;
      name: string;
      email: string;
      isActive: boolean;
    };
  }>;
  createdBy: { __typename?: 'User'; id: string; name: string; email: string };
};

export type Org_GetByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;

export type Org_GetByIdQuery = {
  __typename?: 'Query';
  organization?: {
    __typename?: 'Organization';
    id: string;
    name: string;
    description?: string | null;
    domain?: string | null;
    isActive: boolean;
    createdAt: any;
    updatedAt: any;
    organizationUsers: Array<{
      __typename?: 'OrganizationMember';
      id: string;
      userId: string;
      organizationId: string;
      isOwner: boolean;
      isActive: boolean;
      joinedAt: any;
      roleId?: string | null;
      role?: {
        __typename?: 'Role';
        id: string;
        name: string;
        description?: string | null;
        isActive: boolean;
        isAdminRole: boolean;
      } | null;
      user: {
        __typename?: 'User';
        id: string;
        name: string;
        email: string;
        isActive: boolean;
      };
    }>;
    createdBy: { __typename?: 'User'; id: string; name: string; email: string };
  } | null;
};

export type Org_GetRolesQueryVariables = Types.Exact<{
  organizationId: Types.Scalars['String']['input'];
}>;

export type Org_GetRolesQuery = {
  __typename?: 'Query';
  roles: Array<{
    __typename?: 'Role';
    id: string;
    name: string;
    description?: string | null;
    isActive: boolean;
    isAdminRole: boolean;
    createdAt: any;
    updatedAt: any;
  }>;
};

export type Org_GetPermissionsQueryVariables = Types.Exact<{
  organizationId: Types.Scalars['String']['input'];
}>;

export type Org_GetPermissionsQuery = {
  __typename?: 'Query';
  permissions: Array<{
    __typename?: 'Permission';
    id: string;
    resource: string;
    action: string;
    description?: string | null;
    isActive: boolean;
    createdAt: any;
  }>;
};

export type Org_UpdateMutationVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
  data: Types.UpdateOrganizationInput;
}>;

export type Org_UpdateMutation = {
  __typename?: 'Mutation';
  updateOrganization: {
    __typename?: 'Organization';
    id: string;
    name: string;
    description?: string | null;
    domain?: string | null;
    isActive: boolean;
    createdAt: any;
    updatedAt: any;
    organizationUsers: Array<{
      __typename?: 'OrganizationMember';
      id: string;
      userId: string;
      organizationId: string;
      isOwner: boolean;
      isActive: boolean;
      joinedAt: any;
      roleId?: string | null;
      role?: {
        __typename?: 'Role';
        id: string;
        name: string;
        description?: string | null;
        isActive: boolean;
        isAdminRole: boolean;
      } | null;
      user: {
        __typename?: 'User';
        id: string;
        name: string;
        email: string;
        isActive: boolean;
      };
    }>;
    createdBy: { __typename?: 'User'; id: string; name: string; email: string };
  };
};

export type Org_CreateMutationVariables = Types.Exact<{
  data: Types.CreateOrganizationInput;
}>;

export type Org_CreateMutation = {
  __typename?: 'Mutation';
  createOrganization: {
    __typename?: 'Organization';
    id: string;
    name: string;
    description?: string | null;
    domain?: string | null;
    isActive: boolean;
    createdAt: any;
    updatedAt: any;
    organizationUsers: Array<{
      __typename?: 'OrganizationMember';
      id: string;
      userId: string;
      organizationId: string;
      isOwner: boolean;
      isActive: boolean;
      joinedAt: any;
      roleId?: string | null;
      role?: {
        __typename?: 'Role';
        id: string;
        name: string;
        description?: string | null;
        isActive: boolean;
        isAdminRole: boolean;
      } | null;
      user: {
        __typename?: 'User';
        id: string;
        name: string;
        email: string;
        isActive: boolean;
      };
    }>;
    createdBy: { __typename?: 'User'; id: string; name: string; email: string };
  };
};

export type Org_InviteUserMutationVariables = Types.Exact<{
  organizationId: Types.Scalars['String']['input'];
  userId: Types.Scalars['String']['input'];
  roleId?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;

export type Org_InviteUserMutation = {
  __typename?: 'Mutation';
  inviteUserToOrganization: {
    __typename?: 'User';
    id: string;
    name: string;
    email: string;
    isActive: boolean;
  };
};

export type Org_RemoveUserMutationVariables = Types.Exact<{
  organizationId: Types.Scalars['String']['input'];
  userId: Types.Scalars['String']['input'];
}>;

export type Org_RemoveUserMutation = {
  __typename?: 'Mutation';
  removeUserFromOrganization: boolean;
};

export type Org_AssignRoleMutationVariables = Types.Exact<{
  organizationId: Types.Scalars['String']['input'];
  userId: Types.Scalars['String']['input'];
  roleId: Types.Scalars['String']['input'];
}>;

export type Org_AssignRoleMutation = {
  __typename?: 'Mutation';
  assignRole: {
    __typename?: 'User';
    id: string;
    name: string;
    email: string;
    isActive: boolean;
  };
};

export const Org_BasicFragmentDoc = gql`
  fragment Org_Basic on Organization {
    id
    name
    description
    domain
    isActive
    createdAt
    updatedAt
  }
`;
export const Org_MemberFragmentDoc = gql`
  fragment Org_Member on OrganizationMember {
    id
    userId
    organizationId
    isOwner
    isActive
    joinedAt
    roleId
    role {
      id
      name
      description
      isActive
      isAdminRole
    }
    user {
      id
      name
      email
      isActive
    }
  }
`;
export const Org_DetailFragmentDoc = gql`
  fragment Org_Detail on Organization {
    ...Org_Basic
    organizationUsers {
      ...Org_Member
    }
    createdBy {
      id
      name
      email
    }
  }
  ${Org_BasicFragmentDoc}
  ${Org_MemberFragmentDoc}
`;
export const Org_GetByIdDocument = gql`
  query Org_GetById($id: String!) {
    organization(id: $id) {
      ...Org_Detail
    }
  }
  ${Org_DetailFragmentDoc}
`;

/**
 * __useOrg_GetByIdQuery__
 *
 * To run a query within a React component, call `useOrg_GetByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrg_GetByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrg_GetByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOrg_GetByIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    Org_GetByIdQuery,
    Org_GetByIdQueryVariables
  > &
    (
      | { variables: Org_GetByIdQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Org_GetByIdQuery, Org_GetByIdQueryVariables>(
    Org_GetByIdDocument,
    options
  );
}
export function useOrg_GetByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Org_GetByIdQuery,
    Org_GetByIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<Org_GetByIdQuery, Org_GetByIdQueryVariables>(
    Org_GetByIdDocument,
    options
  );
}
export function useOrg_GetByIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        Org_GetByIdQuery,
        Org_GetByIdQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<Org_GetByIdQuery, Org_GetByIdQueryVariables>(
    Org_GetByIdDocument,
    options
  );
}
export type Org_GetByIdQueryHookResult = ReturnType<typeof useOrg_GetByIdQuery>;
export type Org_GetByIdLazyQueryHookResult = ReturnType<
  typeof useOrg_GetByIdLazyQuery
>;
export type Org_GetByIdSuspenseQueryHookResult = ReturnType<
  typeof useOrg_GetByIdSuspenseQuery
>;
export type Org_GetByIdQueryResult = Apollo.QueryResult<
  Org_GetByIdQuery,
  Org_GetByIdQueryVariables
>;
export const Org_GetRolesDocument = gql`
  query Org_GetRoles($organizationId: String!) {
    roles(organizationId: $organizationId) {
      id
      name
      description
      isActive
      isAdminRole
      createdAt
      updatedAt
    }
  }
`;

/**
 * __useOrg_GetRolesQuery__
 *
 * To run a query within a React component, call `useOrg_GetRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrg_GetRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrg_GetRolesQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *   },
 * });
 */
export function useOrg_GetRolesQuery(
  baseOptions: Apollo.QueryHookOptions<
    Org_GetRolesQuery,
    Org_GetRolesQueryVariables
  > &
    (
      | { variables: Org_GetRolesQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Org_GetRolesQuery, Org_GetRolesQueryVariables>(
    Org_GetRolesDocument,
    options
  );
}
export function useOrg_GetRolesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Org_GetRolesQuery,
    Org_GetRolesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<Org_GetRolesQuery, Org_GetRolesQueryVariables>(
    Org_GetRolesDocument,
    options
  );
}
export function useOrg_GetRolesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        Org_GetRolesQuery,
        Org_GetRolesQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<Org_GetRolesQuery, Org_GetRolesQueryVariables>(
    Org_GetRolesDocument,
    options
  );
}
export type Org_GetRolesQueryHookResult = ReturnType<
  typeof useOrg_GetRolesQuery
>;
export type Org_GetRolesLazyQueryHookResult = ReturnType<
  typeof useOrg_GetRolesLazyQuery
>;
export type Org_GetRolesSuspenseQueryHookResult = ReturnType<
  typeof useOrg_GetRolesSuspenseQuery
>;
export type Org_GetRolesQueryResult = Apollo.QueryResult<
  Org_GetRolesQuery,
  Org_GetRolesQueryVariables
>;
export const Org_GetPermissionsDocument = gql`
  query Org_GetPermissions($organizationId: String!) {
    permissions(organizationId: $organizationId) {
      id
      resource
      action
      description
      isActive
      createdAt
    }
  }
`;

/**
 * __useOrg_GetPermissionsQuery__
 *
 * To run a query within a React component, call `useOrg_GetPermissionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrg_GetPermissionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrg_GetPermissionsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *   },
 * });
 */
export function useOrg_GetPermissionsQuery(
  baseOptions: Apollo.QueryHookOptions<
    Org_GetPermissionsQuery,
    Org_GetPermissionsQueryVariables
  > &
    (
      | { variables: Org_GetPermissionsQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Org_GetPermissionsQuery,
    Org_GetPermissionsQueryVariables
  >(Org_GetPermissionsDocument, options);
}
export function useOrg_GetPermissionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Org_GetPermissionsQuery,
    Org_GetPermissionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Org_GetPermissionsQuery,
    Org_GetPermissionsQueryVariables
  >(Org_GetPermissionsDocument, options);
}
export function useOrg_GetPermissionsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        Org_GetPermissionsQuery,
        Org_GetPermissionsQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    Org_GetPermissionsQuery,
    Org_GetPermissionsQueryVariables
  >(Org_GetPermissionsDocument, options);
}
export type Org_GetPermissionsQueryHookResult = ReturnType<
  typeof useOrg_GetPermissionsQuery
>;
export type Org_GetPermissionsLazyQueryHookResult = ReturnType<
  typeof useOrg_GetPermissionsLazyQuery
>;
export type Org_GetPermissionsSuspenseQueryHookResult = ReturnType<
  typeof useOrg_GetPermissionsSuspenseQuery
>;
export type Org_GetPermissionsQueryResult = Apollo.QueryResult<
  Org_GetPermissionsQuery,
  Org_GetPermissionsQueryVariables
>;
export const Org_UpdateDocument = gql`
  mutation Org_Update($id: String!, $data: UpdateOrganizationInput!) {
    updateOrganization(id: $id, data: $data) {
      ...Org_Detail
    }
  }
  ${Org_DetailFragmentDoc}
`;
export type Org_UpdateMutationFn = Apollo.MutationFunction<
  Org_UpdateMutation,
  Org_UpdateMutationVariables
>;

/**
 * __useOrg_UpdateMutation__
 *
 * To run a mutation, you first call `useOrg_UpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrg_UpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orgUpdateMutation, { data, loading, error }] = useOrg_UpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useOrg_UpdateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Org_UpdateMutation,
    Org_UpdateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<Org_UpdateMutation, Org_UpdateMutationVariables>(
    Org_UpdateDocument,
    options
  );
}
export type Org_UpdateMutationHookResult = ReturnType<
  typeof useOrg_UpdateMutation
>;
export type Org_UpdateMutationResult =
  Apollo.MutationResult<Org_UpdateMutation>;
export type Org_UpdateMutationOptions = Apollo.BaseMutationOptions<
  Org_UpdateMutation,
  Org_UpdateMutationVariables
>;
export const Org_CreateDocument = gql`
  mutation Org_Create($data: CreateOrganizationInput!) {
    createOrganization(data: $data) {
      ...Org_Detail
    }
  }
  ${Org_DetailFragmentDoc}
`;
export type Org_CreateMutationFn = Apollo.MutationFunction<
  Org_CreateMutation,
  Org_CreateMutationVariables
>;

/**
 * __useOrg_CreateMutation__
 *
 * To run a mutation, you first call `useOrg_CreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrg_CreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orgCreateMutation, { data, loading, error }] = useOrg_CreateMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useOrg_CreateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Org_CreateMutation,
    Org_CreateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<Org_CreateMutation, Org_CreateMutationVariables>(
    Org_CreateDocument,
    options
  );
}
export type Org_CreateMutationHookResult = ReturnType<
  typeof useOrg_CreateMutation
>;
export type Org_CreateMutationResult =
  Apollo.MutationResult<Org_CreateMutation>;
export type Org_CreateMutationOptions = Apollo.BaseMutationOptions<
  Org_CreateMutation,
  Org_CreateMutationVariables
>;
export const Org_InviteUserDocument = gql`
  mutation Org_InviteUser(
    $organizationId: String!
    $userId: String!
    $roleId: String
  ) {
    inviteUserToOrganization(
      organizationId: $organizationId
      userId: $userId
      roleId: $roleId
    ) {
      id
      name
      email
      isActive
    }
  }
`;
export type Org_InviteUserMutationFn = Apollo.MutationFunction<
  Org_InviteUserMutation,
  Org_InviteUserMutationVariables
>;

/**
 * __useOrg_InviteUserMutation__
 *
 * To run a mutation, you first call `useOrg_InviteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrg_InviteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orgInviteUserMutation, { data, loading, error }] = useOrg_InviteUserMutation({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      userId: // value for 'userId'
 *      roleId: // value for 'roleId'
 *   },
 * });
 */
export function useOrg_InviteUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Org_InviteUserMutation,
    Org_InviteUserMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Org_InviteUserMutation,
    Org_InviteUserMutationVariables
  >(Org_InviteUserDocument, options);
}
export type Org_InviteUserMutationHookResult = ReturnType<
  typeof useOrg_InviteUserMutation
>;
export type Org_InviteUserMutationResult =
  Apollo.MutationResult<Org_InviteUserMutation>;
export type Org_InviteUserMutationOptions = Apollo.BaseMutationOptions<
  Org_InviteUserMutation,
  Org_InviteUserMutationVariables
>;
export const Org_RemoveUserDocument = gql`
  mutation Org_RemoveUser($organizationId: String!, $userId: String!) {
    removeUserFromOrganization(organizationId: $organizationId, userId: $userId)
  }
`;
export type Org_RemoveUserMutationFn = Apollo.MutationFunction<
  Org_RemoveUserMutation,
  Org_RemoveUserMutationVariables
>;

/**
 * __useOrg_RemoveUserMutation__
 *
 * To run a mutation, you first call `useOrg_RemoveUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrg_RemoveUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orgRemoveUserMutation, { data, loading, error }] = useOrg_RemoveUserMutation({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useOrg_RemoveUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Org_RemoveUserMutation,
    Org_RemoveUserMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Org_RemoveUserMutation,
    Org_RemoveUserMutationVariables
  >(Org_RemoveUserDocument, options);
}
export type Org_RemoveUserMutationHookResult = ReturnType<
  typeof useOrg_RemoveUserMutation
>;
export type Org_RemoveUserMutationResult =
  Apollo.MutationResult<Org_RemoveUserMutation>;
export type Org_RemoveUserMutationOptions = Apollo.BaseMutationOptions<
  Org_RemoveUserMutation,
  Org_RemoveUserMutationVariables
>;
export const Org_AssignRoleDocument = gql`
  mutation Org_AssignRole(
    $organizationId: String!
    $userId: String!
    $roleId: String!
  ) {
    assignRole(
      organizationId: $organizationId
      userId: $userId
      roleId: $roleId
    ) {
      id
      name
      email
      isActive
    }
  }
`;
export type Org_AssignRoleMutationFn = Apollo.MutationFunction<
  Org_AssignRoleMutation,
  Org_AssignRoleMutationVariables
>;

/**
 * __useOrg_AssignRoleMutation__
 *
 * To run a mutation, you first call `useOrg_AssignRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrg_AssignRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orgAssignRoleMutation, { data, loading, error }] = useOrg_AssignRoleMutation({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      userId: // value for 'userId'
 *      roleId: // value for 'roleId'
 *   },
 * });
 */
export function useOrg_AssignRoleMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Org_AssignRoleMutation,
    Org_AssignRoleMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Org_AssignRoleMutation,
    Org_AssignRoleMutationVariables
  >(Org_AssignRoleDocument, options);
}
export type Org_AssignRoleMutationHookResult = ReturnType<
  typeof useOrg_AssignRoleMutation
>;
export type Org_AssignRoleMutationResult =
  Apollo.MutationResult<Org_AssignRoleMutation>;
export type Org_AssignRoleMutationOptions = Apollo.BaseMutationOptions<
  Org_AssignRoleMutation,
  Org_AssignRoleMutationVariables
>;
