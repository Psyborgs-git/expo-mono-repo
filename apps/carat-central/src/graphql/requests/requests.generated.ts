import * as Types from '../../generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type Request_UserFragment = {
  __typename?: 'UserBasicInfo';
  id: string;
  name: string;
  email: string;
};

export type Request_OrganizationFragment = {
  __typename?: 'OrgBasicInfo';
  id: string;
  name: string;
};

export type Request_ResponseFragment = {
  __typename?: 'RequestResponse';
  id: string;
  requestId: string;
  responderId: string;
  responderOrgId: string;
  message: string;
  proposedDiamonds: Array<string>;
  proposedPrice?: number | null;
  currency: string;
  status: Types.ResponseStatus;
  createdAt: any;
  acceptedAt?: any | null;
  rejectedAt?: any | null;
  responder: {
    __typename?: 'UserBasicInfo';
    id: string;
    name: string;
    email: string;
  };
  responderOrg: { __typename?: 'OrgBasicInfo'; id: string; name: string };
};

export type Request_BasicFragment = {
  __typename?: 'DiamondRequest';
  id: string;
  requestNumber: string;
  title: string;
  description?: string | null;
  status: Types.RequestStatus;
  isPublic: boolean;
  minCarat?: number | null;
  maxCarat?: number | null;
  minBudget?: number | null;
  maxBudget?: number | null;
  currency: string;
  shapes: Array<string>;
  clarityGrades: Array<string>;
  colorGrades: Array<string>;
  cutGrades: Array<string>;
  certificates: Array<string>;
  tags: Array<string>;
  responseCount: number;
  expiresAt?: any | null;
  closedAt?: any | null;
  createdAt: any;
  updatedAt: any;
  requesterId: string;
  requesterOrgId?: string | null;
  requester: {
    __typename?: 'UserBasicInfo';
    id: string;
    name: string;
    email: string;
  };
  requesterOrg?: {
    __typename?: 'OrgBasicInfo';
    id: string;
    name: string;
  } | null;
};

export type Request_WithResponsesFragment = {
  __typename?: 'DiamondRequest';
  id: string;
  requestNumber: string;
  title: string;
  description?: string | null;
  status: Types.RequestStatus;
  isPublic: boolean;
  minCarat?: number | null;
  maxCarat?: number | null;
  minBudget?: number | null;
  maxBudget?: number | null;
  currency: string;
  shapes: Array<string>;
  clarityGrades: Array<string>;
  colorGrades: Array<string>;
  cutGrades: Array<string>;
  certificates: Array<string>;
  tags: Array<string>;
  responseCount: number;
  expiresAt?: any | null;
  closedAt?: any | null;
  createdAt: any;
  updatedAt: any;
  requesterId: string;
  requesterOrgId?: string | null;
  responses: Array<{
    __typename?: 'RequestResponse';
    id: string;
    requestId: string;
    responderId: string;
    responderOrgId: string;
    message: string;
    proposedDiamonds: Array<string>;
    proposedPrice?: number | null;
    currency: string;
    status: Types.ResponseStatus;
    createdAt: any;
    acceptedAt?: any | null;
    rejectedAt?: any | null;
    responder: {
      __typename?: 'UserBasicInfo';
      id: string;
      name: string;
      email: string;
    };
    responderOrg: { __typename?: 'OrgBasicInfo'; id: string; name: string };
  }>;
  requester: {
    __typename?: 'UserBasicInfo';
    id: string;
    name: string;
    email: string;
  };
  requesterOrg?: {
    __typename?: 'OrgBasicInfo';
    id: string;
    name: string;
  } | null;
};

export type Request_GetMyQueryVariables = Types.Exact<{ [key: string]: never }>;

export type Request_GetMyQuery = {
  __typename?: 'Query';
  myRequests: Array<{
    __typename?: 'DiamondRequest';
    id: string;
    requestNumber: string;
    title: string;
    description?: string | null;
    status: Types.RequestStatus;
    isPublic: boolean;
    minCarat?: number | null;
    maxCarat?: number | null;
    minBudget?: number | null;
    maxBudget?: number | null;
    currency: string;
    shapes: Array<string>;
    clarityGrades: Array<string>;
    colorGrades: Array<string>;
    cutGrades: Array<string>;
    certificates: Array<string>;
    tags: Array<string>;
    responseCount: number;
    expiresAt?: any | null;
    closedAt?: any | null;
    createdAt: any;
    updatedAt: any;
    requesterId: string;
    requesterOrgId?: string | null;
    requester: {
      __typename?: 'UserBasicInfo';
      id: string;
      name: string;
      email: string;
    };
    requesterOrg?: {
      __typename?: 'OrgBasicInfo';
      id: string;
      name: string;
    } | null;
  }>;
};

export type Request_GetMyOrgQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type Request_GetMyOrgQuery = {
  __typename?: 'Query';
  myOrgRequests: Array<{
    __typename?: 'DiamondRequest';
    id: string;
    requestNumber: string;
    title: string;
    description?: string | null;
    status: Types.RequestStatus;
    isPublic: boolean;
    minCarat?: number | null;
    maxCarat?: number | null;
    minBudget?: number | null;
    maxBudget?: number | null;
    currency: string;
    shapes: Array<string>;
    clarityGrades: Array<string>;
    colorGrades: Array<string>;
    cutGrades: Array<string>;
    certificates: Array<string>;
    tags: Array<string>;
    responseCount: number;
    expiresAt?: any | null;
    closedAt?: any | null;
    createdAt: any;
    updatedAt: any;
    requesterId: string;
    requesterOrgId?: string | null;
    requester: {
      __typename?: 'UserBasicInfo';
      id: string;
      name: string;
      email: string;
    };
    requesterOrg?: {
      __typename?: 'OrgBasicInfo';
      id: string;
      name: string;
    } | null;
  }>;
};

export type Request_GetPublicQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type Request_GetPublicQuery = {
  __typename?: 'Query';
  publicRequests: Array<{
    __typename?: 'DiamondRequest';
    id: string;
    requestNumber: string;
    title: string;
    description?: string | null;
    status: Types.RequestStatus;
    isPublic: boolean;
    minCarat?: number | null;
    maxCarat?: number | null;
    minBudget?: number | null;
    maxBudget?: number | null;
    currency: string;
    shapes: Array<string>;
    clarityGrades: Array<string>;
    colorGrades: Array<string>;
    cutGrades: Array<string>;
    certificates: Array<string>;
    tags: Array<string>;
    responseCount: number;
    expiresAt?: any | null;
    closedAt?: any | null;
    createdAt: any;
    updatedAt: any;
    requesterId: string;
    requesterOrgId?: string | null;
    requester: {
      __typename?: 'UserBasicInfo';
      id: string;
      name: string;
      email: string;
    };
    requesterOrg?: {
      __typename?: 'OrgBasicInfo';
      id: string;
      name: string;
    } | null;
  }>;
};

export type Request_GetByIdQueryVariables = Types.Exact<{
  requestId: Types.Scalars['String']['input'];
}>;

export type Request_GetByIdQuery = {
  __typename?: 'Query';
  request?: {
    __typename?: 'DiamondRequest';
    id: string;
    requestNumber: string;
    title: string;
    description?: string | null;
    status: Types.RequestStatus;
    isPublic: boolean;
    minCarat?: number | null;
    maxCarat?: number | null;
    minBudget?: number | null;
    maxBudget?: number | null;
    currency: string;
    shapes: Array<string>;
    clarityGrades: Array<string>;
    colorGrades: Array<string>;
    cutGrades: Array<string>;
    certificates: Array<string>;
    tags: Array<string>;
    responseCount: number;
    expiresAt?: any | null;
    closedAt?: any | null;
    createdAt: any;
    updatedAt: any;
    requesterId: string;
    requesterOrgId?: string | null;
    responses: Array<{
      __typename?: 'RequestResponse';
      id: string;
      requestId: string;
      responderId: string;
      responderOrgId: string;
      message: string;
      proposedDiamonds: Array<string>;
      proposedPrice?: number | null;
      currency: string;
      status: Types.ResponseStatus;
      createdAt: any;
      acceptedAt?: any | null;
      rejectedAt?: any | null;
      responder: {
        __typename?: 'UserBasicInfo';
        id: string;
        name: string;
        email: string;
      };
      responderOrg: { __typename?: 'OrgBasicInfo'; id: string; name: string };
    }>;
    requester: {
      __typename?: 'UserBasicInfo';
      id: string;
      name: string;
      email: string;
    };
    requesterOrg?: {
      __typename?: 'OrgBasicInfo';
      id: string;
      name: string;
    } | null;
  } | null;
};

export type Request_GetResponsesQueryVariables = Types.Exact<{
  requestId: Types.Scalars['String']['input'];
}>;

export type Request_GetResponsesQuery = {
  __typename?: 'Query';
  requestResponses: Array<{
    __typename?: 'RequestResponse';
    id: string;
    requestId: string;
    responderId: string;
    responderOrgId: string;
    message: string;
    proposedDiamonds: Array<string>;
    proposedPrice?: number | null;
    currency: string;
    status: Types.ResponseStatus;
    createdAt: any;
    acceptedAt?: any | null;
    rejectedAt?: any | null;
    responder: {
      __typename?: 'UserBasicInfo';
      id: string;
      name: string;
      email: string;
    };
    responderOrg: { __typename?: 'OrgBasicInfo'; id: string; name: string };
  }>;
};

export type Request_CreateMutationVariables = Types.Exact<{
  input: Types.CreateRequestInput;
}>;

export type Request_CreateMutation = {
  __typename?: 'Mutation';
  createRequest: {
    __typename?: 'DiamondRequest';
    id: string;
    requestNumber: string;
    title: string;
    description?: string | null;
    status: Types.RequestStatus;
    isPublic: boolean;
    minCarat?: number | null;
    maxCarat?: number | null;
    minBudget?: number | null;
    maxBudget?: number | null;
    currency: string;
    shapes: Array<string>;
    clarityGrades: Array<string>;
    colorGrades: Array<string>;
    cutGrades: Array<string>;
    certificates: Array<string>;
    tags: Array<string>;
    responseCount: number;
    expiresAt?: any | null;
    closedAt?: any | null;
    createdAt: any;
    updatedAt: any;
    requesterId: string;
    requesterOrgId?: string | null;
    requester: {
      __typename?: 'UserBasicInfo';
      id: string;
      name: string;
      email: string;
    };
    requesterOrg?: {
      __typename?: 'OrgBasicInfo';
      id: string;
      name: string;
    } | null;
  };
};

export type Request_UpdateMutationVariables = Types.Exact<{
  requestId: Types.Scalars['String']['input'];
  data: Types.Scalars['String']['input'];
}>;

export type Request_UpdateMutation = {
  __typename?: 'Mutation';
  updateRequest: string;
};

export type Request_SubmitResponseMutationVariables = Types.Exact<{
  requestId: Types.Scalars['String']['input'];
  input: Types.SubmitResponseInput;
}>;

export type Request_SubmitResponseMutation = {
  __typename?: 'Mutation';
  submitResponse: {
    __typename?: 'RequestResponse';
    id: string;
    requestId: string;
    responderId: string;
    responderOrgId: string;
    message: string;
    proposedDiamonds: Array<string>;
    proposedPrice?: number | null;
    currency: string;
    status: Types.ResponseStatus;
    createdAt: any;
    acceptedAt?: any | null;
    rejectedAt?: any | null;
    responder: {
      __typename?: 'UserBasicInfo';
      id: string;
      name: string;
      email: string;
    };
    responderOrg: { __typename?: 'OrgBasicInfo'; id: string; name: string };
  };
};

export type Request_AcceptResponseMutationVariables = Types.Exact<{
  responseId: Types.Scalars['String']['input'];
}>;

export type Request_AcceptResponseMutation = {
  __typename?: 'Mutation';
  acceptResponse: {
    __typename?: 'RequestResponse';
    id: string;
    requestId: string;
    responderId: string;
    responderOrgId: string;
    message: string;
    proposedDiamonds: Array<string>;
    proposedPrice?: number | null;
    currency: string;
    status: Types.ResponseStatus;
    createdAt: any;
    acceptedAt?: any | null;
    rejectedAt?: any | null;
    responder: {
      __typename?: 'UserBasicInfo';
      id: string;
      name: string;
      email: string;
    };
    responderOrg: { __typename?: 'OrgBasicInfo'; id: string; name: string };
  };
};

export type Request_RejectResponseMutationVariables = Types.Exact<{
  responseId: Types.Scalars['String']['input'];
  reason?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;

export type Request_RejectResponseMutation = {
  __typename?: 'Mutation';
  rejectResponse: {
    __typename?: 'RequestResponse';
    id: string;
    requestId: string;
    responderId: string;
    responderOrgId: string;
    message: string;
    proposedDiamonds: Array<string>;
    proposedPrice?: number | null;
    currency: string;
    status: Types.ResponseStatus;
    createdAt: any;
    acceptedAt?: any | null;
    rejectedAt?: any | null;
    responder: {
      __typename?: 'UserBasicInfo';
      id: string;
      name: string;
      email: string;
    };
    responderOrg: { __typename?: 'OrgBasicInfo'; id: string; name: string };
  };
};

export const Request_UserFragmentDoc = gql`
  fragment Request_User on UserBasicInfo {
    id
    name
    email
  }
`;
export const Request_OrganizationFragmentDoc = gql`
  fragment Request_Organization on OrgBasicInfo {
    id
    name
  }
`;
export const Request_BasicFragmentDoc = gql`
  fragment Request_Basic on DiamondRequest {
    id
    requestNumber
    title
    description
    status
    isPublic
    minCarat
    maxCarat
    minBudget
    maxBudget
    currency
    shapes
    clarityGrades
    colorGrades
    cutGrades
    certificates
    tags
    responseCount
    expiresAt
    closedAt
    createdAt
    updatedAt
    requesterId
    requesterOrgId
    requester {
      ...Request_User
    }
    requesterOrg {
      ...Request_Organization
    }
  }
  ${Request_UserFragmentDoc}
  ${Request_OrganizationFragmentDoc}
`;
export const Request_ResponseFragmentDoc = gql`
  fragment Request_Response on RequestResponse {
    id
    requestId
    responderId
    responderOrgId
    message
    proposedDiamonds
    proposedPrice
    currency
    status
    createdAt
    acceptedAt
    rejectedAt
    responder {
      ...Request_User
    }
    responderOrg {
      ...Request_Organization
    }
  }
  ${Request_UserFragmentDoc}
  ${Request_OrganizationFragmentDoc}
`;
export const Request_WithResponsesFragmentDoc = gql`
  fragment Request_WithResponses on DiamondRequest {
    ...Request_Basic
    responses {
      ...Request_Response
    }
  }
  ${Request_BasicFragmentDoc}
  ${Request_ResponseFragmentDoc}
`;
export const Request_GetMyDocument = gql`
  query Request_GetMy {
    myRequests {
      ...Request_Basic
    }
  }
  ${Request_BasicFragmentDoc}
`;

/**
 * __useRequest_GetMyQuery__
 *
 * To run a query within a React component, call `useRequest_GetMyQuery` and pass it any options that fit your needs.
 * When your component renders, `useRequest_GetMyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRequest_GetMyQuery({
 *   variables: {
 *   },
 * });
 */
export function useRequest_GetMyQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Request_GetMyQuery,
    Request_GetMyQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Request_GetMyQuery, Request_GetMyQueryVariables>(
    Request_GetMyDocument,
    options
  );
}
export function useRequest_GetMyLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Request_GetMyQuery,
    Request_GetMyQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<Request_GetMyQuery, Request_GetMyQueryVariables>(
    Request_GetMyDocument,
    options
  );
}
export function useRequest_GetMySuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        Request_GetMyQuery,
        Request_GetMyQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    Request_GetMyQuery,
    Request_GetMyQueryVariables
  >(Request_GetMyDocument, options);
}
export type Request_GetMyQueryHookResult = ReturnType<
  typeof useRequest_GetMyQuery
>;
export type Request_GetMyLazyQueryHookResult = ReturnType<
  typeof useRequest_GetMyLazyQuery
>;
export type Request_GetMySuspenseQueryHookResult = ReturnType<
  typeof useRequest_GetMySuspenseQuery
>;
export type Request_GetMyQueryResult = Apollo.QueryResult<
  Request_GetMyQuery,
  Request_GetMyQueryVariables
>;
export const Request_GetMyOrgDocument = gql`
  query Request_GetMyOrg {
    myOrgRequests {
      ...Request_Basic
    }
  }
  ${Request_BasicFragmentDoc}
`;

/**
 * __useRequest_GetMyOrgQuery__
 *
 * To run a query within a React component, call `useRequest_GetMyOrgQuery` and pass it any options that fit your needs.
 * When your component renders, `useRequest_GetMyOrgQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRequest_GetMyOrgQuery({
 *   variables: {
 *   },
 * });
 */
export function useRequest_GetMyOrgQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Request_GetMyOrgQuery,
    Request_GetMyOrgQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Request_GetMyOrgQuery, Request_GetMyOrgQueryVariables>(
    Request_GetMyOrgDocument,
    options
  );
}
export function useRequest_GetMyOrgLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Request_GetMyOrgQuery,
    Request_GetMyOrgQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Request_GetMyOrgQuery,
    Request_GetMyOrgQueryVariables
  >(Request_GetMyOrgDocument, options);
}
export function useRequest_GetMyOrgSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        Request_GetMyOrgQuery,
        Request_GetMyOrgQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    Request_GetMyOrgQuery,
    Request_GetMyOrgQueryVariables
  >(Request_GetMyOrgDocument, options);
}
export type Request_GetMyOrgQueryHookResult = ReturnType<
  typeof useRequest_GetMyOrgQuery
>;
export type Request_GetMyOrgLazyQueryHookResult = ReturnType<
  typeof useRequest_GetMyOrgLazyQuery
>;
export type Request_GetMyOrgSuspenseQueryHookResult = ReturnType<
  typeof useRequest_GetMyOrgSuspenseQuery
>;
export type Request_GetMyOrgQueryResult = Apollo.QueryResult<
  Request_GetMyOrgQuery,
  Request_GetMyOrgQueryVariables
>;
export const Request_GetPublicDocument = gql`
  query Request_GetPublic {
    publicRequests {
      ...Request_Basic
    }
  }
  ${Request_BasicFragmentDoc}
`;

/**
 * __useRequest_GetPublicQuery__
 *
 * To run a query within a React component, call `useRequest_GetPublicQuery` and pass it any options that fit your needs.
 * When your component renders, `useRequest_GetPublicQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRequest_GetPublicQuery({
 *   variables: {
 *   },
 * });
 */
export function useRequest_GetPublicQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Request_GetPublicQuery,
    Request_GetPublicQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Request_GetPublicQuery,
    Request_GetPublicQueryVariables
  >(Request_GetPublicDocument, options);
}
export function useRequest_GetPublicLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Request_GetPublicQuery,
    Request_GetPublicQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Request_GetPublicQuery,
    Request_GetPublicQueryVariables
  >(Request_GetPublicDocument, options);
}
export function useRequest_GetPublicSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        Request_GetPublicQuery,
        Request_GetPublicQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    Request_GetPublicQuery,
    Request_GetPublicQueryVariables
  >(Request_GetPublicDocument, options);
}
export type Request_GetPublicQueryHookResult = ReturnType<
  typeof useRequest_GetPublicQuery
>;
export type Request_GetPublicLazyQueryHookResult = ReturnType<
  typeof useRequest_GetPublicLazyQuery
>;
export type Request_GetPublicSuspenseQueryHookResult = ReturnType<
  typeof useRequest_GetPublicSuspenseQuery
>;
export type Request_GetPublicQueryResult = Apollo.QueryResult<
  Request_GetPublicQuery,
  Request_GetPublicQueryVariables
>;
export const Request_GetByIdDocument = gql`
  query Request_GetById($requestId: String!) {
    request(requestId: $requestId) {
      ...Request_WithResponses
    }
  }
  ${Request_WithResponsesFragmentDoc}
`;

/**
 * __useRequest_GetByIdQuery__
 *
 * To run a query within a React component, call `useRequest_GetByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useRequest_GetByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRequest_GetByIdQuery({
 *   variables: {
 *      requestId: // value for 'requestId'
 *   },
 * });
 */
export function useRequest_GetByIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    Request_GetByIdQuery,
    Request_GetByIdQueryVariables
  > &
    (
      | { variables: Request_GetByIdQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Request_GetByIdQuery, Request_GetByIdQueryVariables>(
    Request_GetByIdDocument,
    options
  );
}
export function useRequest_GetByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Request_GetByIdQuery,
    Request_GetByIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Request_GetByIdQuery,
    Request_GetByIdQueryVariables
  >(Request_GetByIdDocument, options);
}
export function useRequest_GetByIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        Request_GetByIdQuery,
        Request_GetByIdQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    Request_GetByIdQuery,
    Request_GetByIdQueryVariables
  >(Request_GetByIdDocument, options);
}
export type Request_GetByIdQueryHookResult = ReturnType<
  typeof useRequest_GetByIdQuery
>;
export type Request_GetByIdLazyQueryHookResult = ReturnType<
  typeof useRequest_GetByIdLazyQuery
>;
export type Request_GetByIdSuspenseQueryHookResult = ReturnType<
  typeof useRequest_GetByIdSuspenseQuery
>;
export type Request_GetByIdQueryResult = Apollo.QueryResult<
  Request_GetByIdQuery,
  Request_GetByIdQueryVariables
>;
export const Request_GetResponsesDocument = gql`
  query Request_GetResponses($requestId: String!) {
    requestResponses(requestId: $requestId) {
      ...Request_Response
    }
  }
  ${Request_ResponseFragmentDoc}
`;

/**
 * __useRequest_GetResponsesQuery__
 *
 * To run a query within a React component, call `useRequest_GetResponsesQuery` and pass it any options that fit your needs.
 * When your component renders, `useRequest_GetResponsesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRequest_GetResponsesQuery({
 *   variables: {
 *      requestId: // value for 'requestId'
 *   },
 * });
 */
export function useRequest_GetResponsesQuery(
  baseOptions: Apollo.QueryHookOptions<
    Request_GetResponsesQuery,
    Request_GetResponsesQueryVariables
  > &
    (
      | { variables: Request_GetResponsesQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Request_GetResponsesQuery,
    Request_GetResponsesQueryVariables
  >(Request_GetResponsesDocument, options);
}
export function useRequest_GetResponsesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Request_GetResponsesQuery,
    Request_GetResponsesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Request_GetResponsesQuery,
    Request_GetResponsesQueryVariables
  >(Request_GetResponsesDocument, options);
}
export function useRequest_GetResponsesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        Request_GetResponsesQuery,
        Request_GetResponsesQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    Request_GetResponsesQuery,
    Request_GetResponsesQueryVariables
  >(Request_GetResponsesDocument, options);
}
export type Request_GetResponsesQueryHookResult = ReturnType<
  typeof useRequest_GetResponsesQuery
>;
export type Request_GetResponsesLazyQueryHookResult = ReturnType<
  typeof useRequest_GetResponsesLazyQuery
>;
export type Request_GetResponsesSuspenseQueryHookResult = ReturnType<
  typeof useRequest_GetResponsesSuspenseQuery
>;
export type Request_GetResponsesQueryResult = Apollo.QueryResult<
  Request_GetResponsesQuery,
  Request_GetResponsesQueryVariables
>;
export const Request_CreateDocument = gql`
  mutation Request_Create($input: CreateRequestInput!) {
    createRequest(input: $input) {
      ...Request_Basic
    }
  }
  ${Request_BasicFragmentDoc}
`;
export type Request_CreateMutationFn = Apollo.MutationFunction<
  Request_CreateMutation,
  Request_CreateMutationVariables
>;

/**
 * __useRequest_CreateMutation__
 *
 * To run a mutation, you first call `useRequest_CreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequest_CreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestCreateMutation, { data, loading, error }] = useRequest_CreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRequest_CreateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Request_CreateMutation,
    Request_CreateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Request_CreateMutation,
    Request_CreateMutationVariables
  >(Request_CreateDocument, options);
}
export type Request_CreateMutationHookResult = ReturnType<
  typeof useRequest_CreateMutation
>;
export type Request_CreateMutationResult =
  Apollo.MutationResult<Request_CreateMutation>;
export type Request_CreateMutationOptions = Apollo.BaseMutationOptions<
  Request_CreateMutation,
  Request_CreateMutationVariables
>;
export const Request_UpdateDocument = gql`
  mutation Request_Update($requestId: String!, $data: String!) {
    updateRequest(requestId: $requestId, data: $data)
  }
`;
export type Request_UpdateMutationFn = Apollo.MutationFunction<
  Request_UpdateMutation,
  Request_UpdateMutationVariables
>;

/**
 * __useRequest_UpdateMutation__
 *
 * To run a mutation, you first call `useRequest_UpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequest_UpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestUpdateMutation, { data, loading, error }] = useRequest_UpdateMutation({
 *   variables: {
 *      requestId: // value for 'requestId'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRequest_UpdateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Request_UpdateMutation,
    Request_UpdateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Request_UpdateMutation,
    Request_UpdateMutationVariables
  >(Request_UpdateDocument, options);
}
export type Request_UpdateMutationHookResult = ReturnType<
  typeof useRequest_UpdateMutation
>;
export type Request_UpdateMutationResult =
  Apollo.MutationResult<Request_UpdateMutation>;
export type Request_UpdateMutationOptions = Apollo.BaseMutationOptions<
  Request_UpdateMutation,
  Request_UpdateMutationVariables
>;
export const Request_SubmitResponseDocument = gql`
  mutation Request_SubmitResponse(
    $requestId: String!
    $input: SubmitResponseInput!
  ) {
    submitResponse(requestId: $requestId, input: $input) {
      ...Request_Response
    }
  }
  ${Request_ResponseFragmentDoc}
`;
export type Request_SubmitResponseMutationFn = Apollo.MutationFunction<
  Request_SubmitResponseMutation,
  Request_SubmitResponseMutationVariables
>;

/**
 * __useRequest_SubmitResponseMutation__
 *
 * To run a mutation, you first call `useRequest_SubmitResponseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequest_SubmitResponseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestSubmitResponseMutation, { data, loading, error }] = useRequest_SubmitResponseMutation({
 *   variables: {
 *      requestId: // value for 'requestId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRequest_SubmitResponseMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Request_SubmitResponseMutation,
    Request_SubmitResponseMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Request_SubmitResponseMutation,
    Request_SubmitResponseMutationVariables
  >(Request_SubmitResponseDocument, options);
}
export type Request_SubmitResponseMutationHookResult = ReturnType<
  typeof useRequest_SubmitResponseMutation
>;
export type Request_SubmitResponseMutationResult =
  Apollo.MutationResult<Request_SubmitResponseMutation>;
export type Request_SubmitResponseMutationOptions = Apollo.BaseMutationOptions<
  Request_SubmitResponseMutation,
  Request_SubmitResponseMutationVariables
>;
export const Request_AcceptResponseDocument = gql`
  mutation Request_AcceptResponse($responseId: String!) {
    acceptResponse(responseId: $responseId) {
      ...Request_Response
    }
  }
  ${Request_ResponseFragmentDoc}
`;
export type Request_AcceptResponseMutationFn = Apollo.MutationFunction<
  Request_AcceptResponseMutation,
  Request_AcceptResponseMutationVariables
>;

/**
 * __useRequest_AcceptResponseMutation__
 *
 * To run a mutation, you first call `useRequest_AcceptResponseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequest_AcceptResponseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestAcceptResponseMutation, { data, loading, error }] = useRequest_AcceptResponseMutation({
 *   variables: {
 *      responseId: // value for 'responseId'
 *   },
 * });
 */
export function useRequest_AcceptResponseMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Request_AcceptResponseMutation,
    Request_AcceptResponseMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Request_AcceptResponseMutation,
    Request_AcceptResponseMutationVariables
  >(Request_AcceptResponseDocument, options);
}
export type Request_AcceptResponseMutationHookResult = ReturnType<
  typeof useRequest_AcceptResponseMutation
>;
export type Request_AcceptResponseMutationResult =
  Apollo.MutationResult<Request_AcceptResponseMutation>;
export type Request_AcceptResponseMutationOptions = Apollo.BaseMutationOptions<
  Request_AcceptResponseMutation,
  Request_AcceptResponseMutationVariables
>;
export const Request_RejectResponseDocument = gql`
  mutation Request_RejectResponse($responseId: String!, $reason: String) {
    rejectResponse(responseId: $responseId, reason: $reason) {
      ...Request_Response
    }
  }
  ${Request_ResponseFragmentDoc}
`;
export type Request_RejectResponseMutationFn = Apollo.MutationFunction<
  Request_RejectResponseMutation,
  Request_RejectResponseMutationVariables
>;

/**
 * __useRequest_RejectResponseMutation__
 *
 * To run a mutation, you first call `useRequest_RejectResponseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequest_RejectResponseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestRejectResponseMutation, { data, loading, error }] = useRequest_RejectResponseMutation({
 *   variables: {
 *      responseId: // value for 'responseId'
 *      reason: // value for 'reason'
 *   },
 * });
 */
export function useRequest_RejectResponseMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Request_RejectResponseMutation,
    Request_RejectResponseMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Request_RejectResponseMutation,
    Request_RejectResponseMutationVariables
  >(Request_RejectResponseDocument, options);
}
export type Request_RejectResponseMutationHookResult = ReturnType<
  typeof useRequest_RejectResponseMutation
>;
export type Request_RejectResponseMutationResult =
  Apollo.MutationResult<Request_RejectResponseMutation>;
export type Request_RejectResponseMutationOptions = Apollo.BaseMutationOptions<
  Request_RejectResponseMutation,
  Request_RejectResponseMutationVariables
>;
