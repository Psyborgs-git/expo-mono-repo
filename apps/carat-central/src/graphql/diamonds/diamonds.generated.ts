import * as Types from '../../generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type Diamond_BasicFragment = {
  __typename?: 'Diamond';
  id: string;
  name?: string | null;
  carat: number;
  pricePerCarat: number;
  totalPrice: number;
  clarity: Types.ClarityGrade;
  color: Types.ColorGrade;
  cut: Types.CutGrade;
  shape: Types.DiamondShape;
  status: Types.DiamondStatus;
  isPublic: boolean;
  stockNumber?: string | null;
  certificate?: string | null;
  certificateNumber?: string | null;
  createdAt: any;
  updatedAt: any;
  organizationId: string;
  ownerId: string;
};

export type Diamond_ConnectionFragment = {
  __typename?: 'DiamondConnection';
  totalCount: number;
  edges: Array<{
    __typename?: 'DiamondEdge';
    cursor: string;
    node: {
      __typename?: 'Diamond';
      id: string;
      name?: string | null;
      carat: number;
      pricePerCarat: number;
      totalPrice: number;
      clarity: Types.ClarityGrade;
      color: Types.ColorGrade;
      cut: Types.CutGrade;
      shape: Types.DiamondShape;
      status: Types.DiamondStatus;
      isPublic: boolean;
      stockNumber?: string | null;
      certificate?: string | null;
      certificateNumber?: string | null;
      createdAt: any;
      updatedAt: any;
      organizationId: string;
      ownerId: string;
    };
  }>;
  pageInfo: {
    __typename?: 'PageInfo';
    endCursor?: string | null;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string | null;
  };
};

export type Diamond_GetAllQueryVariables = Types.Exact<{
  first?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  last?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
  before?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;

export type Diamond_GetAllQuery = {
  __typename?: 'Query';
  diamonds: {
    __typename?: 'DiamondConnection';
    totalCount: number;
    edges: Array<{
      __typename?: 'DiamondEdge';
      cursor: string;
      node: {
        __typename?: 'Diamond';
        id: string;
        name?: string | null;
        carat: number;
        pricePerCarat: number;
        totalPrice: number;
        clarity: Types.ClarityGrade;
        color: Types.ColorGrade;
        cut: Types.CutGrade;
        shape: Types.DiamondShape;
        status: Types.DiamondStatus;
        isPublic: boolean;
        stockNumber?: string | null;
        certificate?: string | null;
        certificateNumber?: string | null;
        createdAt: any;
        updatedAt: any;
        organizationId: string;
        ownerId: string;
      };
    }>;
    pageInfo: {
      __typename?: 'PageInfo';
      endCursor?: string | null;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
    };
  };
};

export type Diamond_GetPublicQueryVariables = Types.Exact<{
  first?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  last?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
  before?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;

export type Diamond_GetPublicQuery = {
  __typename?: 'Query';
  publicDiamonds: {
    __typename?: 'DiamondConnection';
    totalCount: number;
    edges: Array<{
      __typename?: 'DiamondEdge';
      cursor: string;
      node: {
        __typename?: 'Diamond';
        id: string;
        name?: string | null;
        carat: number;
        pricePerCarat: number;
        totalPrice: number;
        clarity: Types.ClarityGrade;
        color: Types.ColorGrade;
        cut: Types.CutGrade;
        shape: Types.DiamondShape;
        status: Types.DiamondStatus;
        isPublic: boolean;
        stockNumber?: string | null;
        certificate?: string | null;
        certificateNumber?: string | null;
        createdAt: any;
        updatedAt: any;
        organizationId: string;
        ownerId: string;
      };
    }>;
    pageInfo: {
      __typename?: 'PageInfo';
      endCursor?: string | null;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
    };
  };
};

export type Diamond_GetByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;

export type Diamond_GetByIdQuery = {
  __typename?: 'Query';
  diamond: {
    __typename?: 'Diamond';
    id: string;
    name?: string | null;
    carat: number;
    pricePerCarat: number;
    totalPrice: number;
    clarity: Types.ClarityGrade;
    color: Types.ColorGrade;
    cut: Types.CutGrade;
    shape: Types.DiamondShape;
    status: Types.DiamondStatus;
    isPublic: boolean;
    stockNumber?: string | null;
    certificate?: string | null;
    certificateNumber?: string | null;
    createdAt: any;
    updatedAt: any;
    organizationId: string;
    ownerId: string;
  };
};

export type Diamond_SearchQueryVariables = Types.Exact<{
  filters: Types.Scalars['String']['input'];
}>;

export type Diamond_SearchQuery = {
  __typename?: 'Query';
  searchDiamonds: Array<{
    __typename?: 'DiamondSearchResult';
    id: string;
    name: string;
    carat: number;
    pricePerCarat: number;
    totalPrice: number;
    clarity: string;
    color: string;
    cut: string;
    shape: string;
    stockNumber: string;
    similarity?: number | null;
  }>;
};

export type Diamond_FindSimilarQueryVariables = Types.Exact<{
  diamondId: Types.Scalars['String']['input'];
  limit?: Types.InputMaybe<Types.Scalars['Float']['input']>;
}>;

export type Diamond_FindSimilarQuery = {
  __typename?: 'Query';
  findSimilarDiamonds: Array<{
    __typename?: 'DiamondSearchResult';
    id: string;
    name: string;
    carat: number;
    pricePerCarat: number;
    totalPrice: number;
    clarity: string;
    color: string;
    cut: string;
    shape: string;
    stockNumber: string;
    similarity?: number | null;
  }>;
};

export type Diamond_CreateMutationVariables = Types.Exact<{
  input: Types.CreateDiamondInput;
}>;

export type Diamond_CreateMutation = {
  __typename?: 'Mutation';
  createDiamond: {
    __typename?: 'Diamond';
    id: string;
    name?: string | null;
    carat: number;
    pricePerCarat: number;
    totalPrice: number;
    clarity: Types.ClarityGrade;
    color: Types.ColorGrade;
    cut: Types.CutGrade;
    shape: Types.DiamondShape;
    status: Types.DiamondStatus;
    isPublic: boolean;
    stockNumber?: string | null;
    certificate?: string | null;
    certificateNumber?: string | null;
    createdAt: any;
    updatedAt: any;
    organizationId: string;
    ownerId: string;
  };
};

export type Diamond_UpdateMutationVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
  input: Types.UpdateDiamondInput;
}>;

export type Diamond_UpdateMutation = {
  __typename?: 'Mutation';
  updateDiamond: {
    __typename?: 'Diamond';
    id: string;
    name?: string | null;
    carat: number;
    pricePerCarat: number;
    totalPrice: number;
    clarity: Types.ClarityGrade;
    color: Types.ColorGrade;
    cut: Types.CutGrade;
    shape: Types.DiamondShape;
    status: Types.DiamondStatus;
    isPublic: boolean;
    stockNumber?: string | null;
    certificate?: string | null;
    certificateNumber?: string | null;
    createdAt: any;
    updatedAt: any;
    organizationId: string;
    ownerId: string;
  };
};

export type Diamond_DeleteMutationVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;

export type Diamond_DeleteMutation = {
  __typename?: 'Mutation';
  deleteDiamond: {
    __typename?: 'DeleteResult';
    success: boolean;
    message: string;
  };
};

export type Diamond_PublishMutationVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;

export type Diamond_PublishMutation = {
  __typename?: 'Mutation';
  publishDiamond: {
    __typename?: 'Diamond';
    id: string;
    name?: string | null;
    carat: number;
    pricePerCarat: number;
    totalPrice: number;
    clarity: Types.ClarityGrade;
    color: Types.ColorGrade;
    cut: Types.CutGrade;
    shape: Types.DiamondShape;
    status: Types.DiamondStatus;
    isPublic: boolean;
    stockNumber?: string | null;
    certificate?: string | null;
    certificateNumber?: string | null;
    createdAt: any;
    updatedAt: any;
    organizationId: string;
    ownerId: string;
  };
};

export type Diamond_UnpublishMutationVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;

export type Diamond_UnpublishMutation = {
  __typename?: 'Mutation';
  unpublishDiamond: {
    __typename?: 'Diamond';
    id: string;
    name?: string | null;
    carat: number;
    pricePerCarat: number;
    totalPrice: number;
    clarity: Types.ClarityGrade;
    color: Types.ColorGrade;
    cut: Types.CutGrade;
    shape: Types.DiamondShape;
    status: Types.DiamondStatus;
    isPublic: boolean;
    stockNumber?: string | null;
    certificate?: string | null;
    certificateNumber?: string | null;
    createdAt: any;
    updatedAt: any;
    organizationId: string;
    ownerId: string;
  };
};

export const Diamond_BasicFragmentDoc = gql`
  fragment Diamond_Basic on Diamond {
    id
    name
    carat
    pricePerCarat
    totalPrice
    clarity
    color
    cut
    shape
    status
    isPublic
    stockNumber
    certificate
    certificateNumber
    createdAt
    updatedAt
    organizationId
    ownerId
  }
`;
export const Diamond_ConnectionFragmentDoc = gql`
  fragment Diamond_Connection on DiamondConnection {
    edges {
      cursor
      node {
        ...Diamond_Basic
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
    totalCount
  }
  ${Diamond_BasicFragmentDoc}
`;
export const Diamond_GetAllDocument = gql`
  query Diamond_GetAll(
    $first: Int
    $last: Int
    $after: String
    $before: String
  ) {
    diamonds(first: $first, last: $last, after: $after, before: $before) {
      ...Diamond_Connection
    }
  }
  ${Diamond_ConnectionFragmentDoc}
`;

/**
 * __useDiamond_GetAllQuery__
 *
 * To run a query within a React component, call `useDiamond_GetAllQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiamond_GetAllQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiamond_GetAllQuery({
 *   variables: {
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useDiamond_GetAllQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Diamond_GetAllQuery,
    Diamond_GetAllQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Diamond_GetAllQuery, Diamond_GetAllQueryVariables>(
    Diamond_GetAllDocument,
    options
  );
}
export function useDiamond_GetAllLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Diamond_GetAllQuery,
    Diamond_GetAllQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<Diamond_GetAllQuery, Diamond_GetAllQueryVariables>(
    Diamond_GetAllDocument,
    options
  );
}
export function useDiamond_GetAllSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        Diamond_GetAllQuery,
        Diamond_GetAllQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    Diamond_GetAllQuery,
    Diamond_GetAllQueryVariables
  >(Diamond_GetAllDocument, options);
}
export type Diamond_GetAllQueryHookResult = ReturnType<
  typeof useDiamond_GetAllQuery
>;
export type Diamond_GetAllLazyQueryHookResult = ReturnType<
  typeof useDiamond_GetAllLazyQuery
>;
export type Diamond_GetAllSuspenseQueryHookResult = ReturnType<
  typeof useDiamond_GetAllSuspenseQuery
>;
export type Diamond_GetAllQueryResult = Apollo.QueryResult<
  Diamond_GetAllQuery,
  Diamond_GetAllQueryVariables
>;
export const Diamond_GetPublicDocument = gql`
  query Diamond_GetPublic(
    $first: Int
    $last: Int
    $after: String
    $before: String
  ) {
    publicDiamonds(first: $first, last: $last, after: $after, before: $before) {
      ...Diamond_Connection
    }
  }
  ${Diamond_ConnectionFragmentDoc}
`;

/**
 * __useDiamond_GetPublicQuery__
 *
 * To run a query within a React component, call `useDiamond_GetPublicQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiamond_GetPublicQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiamond_GetPublicQuery({
 *   variables: {
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useDiamond_GetPublicQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Diamond_GetPublicQuery,
    Diamond_GetPublicQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Diamond_GetPublicQuery,
    Diamond_GetPublicQueryVariables
  >(Diamond_GetPublicDocument, options);
}
export function useDiamond_GetPublicLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Diamond_GetPublicQuery,
    Diamond_GetPublicQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Diamond_GetPublicQuery,
    Diamond_GetPublicQueryVariables
  >(Diamond_GetPublicDocument, options);
}
export function useDiamond_GetPublicSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        Diamond_GetPublicQuery,
        Diamond_GetPublicQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    Diamond_GetPublicQuery,
    Diamond_GetPublicQueryVariables
  >(Diamond_GetPublicDocument, options);
}
export type Diamond_GetPublicQueryHookResult = ReturnType<
  typeof useDiamond_GetPublicQuery
>;
export type Diamond_GetPublicLazyQueryHookResult = ReturnType<
  typeof useDiamond_GetPublicLazyQuery
>;
export type Diamond_GetPublicSuspenseQueryHookResult = ReturnType<
  typeof useDiamond_GetPublicSuspenseQuery
>;
export type Diamond_GetPublicQueryResult = Apollo.QueryResult<
  Diamond_GetPublicQuery,
  Diamond_GetPublicQueryVariables
>;
export const Diamond_GetByIdDocument = gql`
  query Diamond_GetById($id: String!) {
    diamond(id: $id) {
      ...Diamond_Basic
    }
  }
  ${Diamond_BasicFragmentDoc}
`;

/**
 * __useDiamond_GetByIdQuery__
 *
 * To run a query within a React component, call `useDiamond_GetByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiamond_GetByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiamond_GetByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDiamond_GetByIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    Diamond_GetByIdQuery,
    Diamond_GetByIdQueryVariables
  > &
    (
      | { variables: Diamond_GetByIdQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Diamond_GetByIdQuery, Diamond_GetByIdQueryVariables>(
    Diamond_GetByIdDocument,
    options
  );
}
export function useDiamond_GetByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Diamond_GetByIdQuery,
    Diamond_GetByIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Diamond_GetByIdQuery,
    Diamond_GetByIdQueryVariables
  >(Diamond_GetByIdDocument, options);
}
export function useDiamond_GetByIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        Diamond_GetByIdQuery,
        Diamond_GetByIdQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    Diamond_GetByIdQuery,
    Diamond_GetByIdQueryVariables
  >(Diamond_GetByIdDocument, options);
}
export type Diamond_GetByIdQueryHookResult = ReturnType<
  typeof useDiamond_GetByIdQuery
>;
export type Diamond_GetByIdLazyQueryHookResult = ReturnType<
  typeof useDiamond_GetByIdLazyQuery
>;
export type Diamond_GetByIdSuspenseQueryHookResult = ReturnType<
  typeof useDiamond_GetByIdSuspenseQuery
>;
export type Diamond_GetByIdQueryResult = Apollo.QueryResult<
  Diamond_GetByIdQuery,
  Diamond_GetByIdQueryVariables
>;
export const Diamond_SearchDocument = gql`
  query Diamond_Search($filters: String!) {
    searchDiamonds(filters: $filters) {
      id
      name
      carat
      pricePerCarat
      totalPrice
      clarity
      color
      cut
      shape
      stockNumber
      similarity
    }
  }
`;

/**
 * __useDiamond_SearchQuery__
 *
 * To run a query within a React component, call `useDiamond_SearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiamond_SearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiamond_SearchQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useDiamond_SearchQuery(
  baseOptions: Apollo.QueryHookOptions<
    Diamond_SearchQuery,
    Diamond_SearchQueryVariables
  > &
    (
      | { variables: Diamond_SearchQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Diamond_SearchQuery, Diamond_SearchQueryVariables>(
    Diamond_SearchDocument,
    options
  );
}
export function useDiamond_SearchLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Diamond_SearchQuery,
    Diamond_SearchQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<Diamond_SearchQuery, Diamond_SearchQueryVariables>(
    Diamond_SearchDocument,
    options
  );
}
export function useDiamond_SearchSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        Diamond_SearchQuery,
        Diamond_SearchQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    Diamond_SearchQuery,
    Diamond_SearchQueryVariables
  >(Diamond_SearchDocument, options);
}
export type Diamond_SearchQueryHookResult = ReturnType<
  typeof useDiamond_SearchQuery
>;
export type Diamond_SearchLazyQueryHookResult = ReturnType<
  typeof useDiamond_SearchLazyQuery
>;
export type Diamond_SearchSuspenseQueryHookResult = ReturnType<
  typeof useDiamond_SearchSuspenseQuery
>;
export type Diamond_SearchQueryResult = Apollo.QueryResult<
  Diamond_SearchQuery,
  Diamond_SearchQueryVariables
>;
export const Diamond_FindSimilarDocument = gql`
  query Diamond_FindSimilar($diamondId: String!, $limit: Float = 10) {
    findSimilarDiamonds(diamondId: $diamondId, limit: $limit) {
      id
      name
      carat
      pricePerCarat
      totalPrice
      clarity
      color
      cut
      shape
      stockNumber
      similarity
    }
  }
`;

/**
 * __useDiamond_FindSimilarQuery__
 *
 * To run a query within a React component, call `useDiamond_FindSimilarQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiamond_FindSimilarQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiamond_FindSimilarQuery({
 *   variables: {
 *      diamondId: // value for 'diamondId'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useDiamond_FindSimilarQuery(
  baseOptions: Apollo.QueryHookOptions<
    Diamond_FindSimilarQuery,
    Diamond_FindSimilarQueryVariables
  > &
    (
      | { variables: Diamond_FindSimilarQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Diamond_FindSimilarQuery,
    Diamond_FindSimilarQueryVariables
  >(Diamond_FindSimilarDocument, options);
}
export function useDiamond_FindSimilarLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Diamond_FindSimilarQuery,
    Diamond_FindSimilarQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Diamond_FindSimilarQuery,
    Diamond_FindSimilarQueryVariables
  >(Diamond_FindSimilarDocument, options);
}
export function useDiamond_FindSimilarSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        Diamond_FindSimilarQuery,
        Diamond_FindSimilarQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    Diamond_FindSimilarQuery,
    Diamond_FindSimilarQueryVariables
  >(Diamond_FindSimilarDocument, options);
}
export type Diamond_FindSimilarQueryHookResult = ReturnType<
  typeof useDiamond_FindSimilarQuery
>;
export type Diamond_FindSimilarLazyQueryHookResult = ReturnType<
  typeof useDiamond_FindSimilarLazyQuery
>;
export type Diamond_FindSimilarSuspenseQueryHookResult = ReturnType<
  typeof useDiamond_FindSimilarSuspenseQuery
>;
export type Diamond_FindSimilarQueryResult = Apollo.QueryResult<
  Diamond_FindSimilarQuery,
  Diamond_FindSimilarQueryVariables
>;
export const Diamond_CreateDocument = gql`
  mutation Diamond_Create($input: CreateDiamondInput!) {
    createDiamond(input: $input) {
      ...Diamond_Basic
    }
  }
  ${Diamond_BasicFragmentDoc}
`;
export type Diamond_CreateMutationFn = Apollo.MutationFunction<
  Diamond_CreateMutation,
  Diamond_CreateMutationVariables
>;

/**
 * __useDiamond_CreateMutation__
 *
 * To run a mutation, you first call `useDiamond_CreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDiamond_CreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [diamondCreateMutation, { data, loading, error }] = useDiamond_CreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDiamond_CreateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Diamond_CreateMutation,
    Diamond_CreateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Diamond_CreateMutation,
    Diamond_CreateMutationVariables
  >(Diamond_CreateDocument, options);
}
export type Diamond_CreateMutationHookResult = ReturnType<
  typeof useDiamond_CreateMutation
>;
export type Diamond_CreateMutationResult =
  Apollo.MutationResult<Diamond_CreateMutation>;
export type Diamond_CreateMutationOptions = Apollo.BaseMutationOptions<
  Diamond_CreateMutation,
  Diamond_CreateMutationVariables
>;
export const Diamond_UpdateDocument = gql`
  mutation Diamond_Update($id: String!, $input: UpdateDiamondInput!) {
    updateDiamond(id: $id, input: $input) {
      ...Diamond_Basic
    }
  }
  ${Diamond_BasicFragmentDoc}
`;
export type Diamond_UpdateMutationFn = Apollo.MutationFunction<
  Diamond_UpdateMutation,
  Diamond_UpdateMutationVariables
>;

/**
 * __useDiamond_UpdateMutation__
 *
 * To run a mutation, you first call `useDiamond_UpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDiamond_UpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [diamondUpdateMutation, { data, loading, error }] = useDiamond_UpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDiamond_UpdateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Diamond_UpdateMutation,
    Diamond_UpdateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Diamond_UpdateMutation,
    Diamond_UpdateMutationVariables
  >(Diamond_UpdateDocument, options);
}
export type Diamond_UpdateMutationHookResult = ReturnType<
  typeof useDiamond_UpdateMutation
>;
export type Diamond_UpdateMutationResult =
  Apollo.MutationResult<Diamond_UpdateMutation>;
export type Diamond_UpdateMutationOptions = Apollo.BaseMutationOptions<
  Diamond_UpdateMutation,
  Diamond_UpdateMutationVariables
>;
export const Diamond_DeleteDocument = gql`
  mutation Diamond_Delete($id: String!) {
    deleteDiamond(id: $id) {
      success
      message
    }
  }
`;
export type Diamond_DeleteMutationFn = Apollo.MutationFunction<
  Diamond_DeleteMutation,
  Diamond_DeleteMutationVariables
>;

/**
 * __useDiamond_DeleteMutation__
 *
 * To run a mutation, you first call `useDiamond_DeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDiamond_DeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [diamondDeleteMutation, { data, loading, error }] = useDiamond_DeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDiamond_DeleteMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Diamond_DeleteMutation,
    Diamond_DeleteMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Diamond_DeleteMutation,
    Diamond_DeleteMutationVariables
  >(Diamond_DeleteDocument, options);
}
export type Diamond_DeleteMutationHookResult = ReturnType<
  typeof useDiamond_DeleteMutation
>;
export type Diamond_DeleteMutationResult =
  Apollo.MutationResult<Diamond_DeleteMutation>;
export type Diamond_DeleteMutationOptions = Apollo.BaseMutationOptions<
  Diamond_DeleteMutation,
  Diamond_DeleteMutationVariables
>;
export const Diamond_PublishDocument = gql`
  mutation Diamond_Publish($id: String!) {
    publishDiamond(id: $id) {
      ...Diamond_Basic
    }
  }
  ${Diamond_BasicFragmentDoc}
`;
export type Diamond_PublishMutationFn = Apollo.MutationFunction<
  Diamond_PublishMutation,
  Diamond_PublishMutationVariables
>;

/**
 * __useDiamond_PublishMutation__
 *
 * To run a mutation, you first call `useDiamond_PublishMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDiamond_PublishMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [diamondPublishMutation, { data, loading, error }] = useDiamond_PublishMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDiamond_PublishMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Diamond_PublishMutation,
    Diamond_PublishMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Diamond_PublishMutation,
    Diamond_PublishMutationVariables
  >(Diamond_PublishDocument, options);
}
export type Diamond_PublishMutationHookResult = ReturnType<
  typeof useDiamond_PublishMutation
>;
export type Diamond_PublishMutationResult =
  Apollo.MutationResult<Diamond_PublishMutation>;
export type Diamond_PublishMutationOptions = Apollo.BaseMutationOptions<
  Diamond_PublishMutation,
  Diamond_PublishMutationVariables
>;
export const Diamond_UnpublishDocument = gql`
  mutation Diamond_Unpublish($id: String!) {
    unpublishDiamond(id: $id) {
      ...Diamond_Basic
    }
  }
  ${Diamond_BasicFragmentDoc}
`;
export type Diamond_UnpublishMutationFn = Apollo.MutationFunction<
  Diamond_UnpublishMutation,
  Diamond_UnpublishMutationVariables
>;

/**
 * __useDiamond_UnpublishMutation__
 *
 * To run a mutation, you first call `useDiamond_UnpublishMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDiamond_UnpublishMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [diamondUnpublishMutation, { data, loading, error }] = useDiamond_UnpublishMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDiamond_UnpublishMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Diamond_UnpublishMutation,
    Diamond_UnpublishMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Diamond_UnpublishMutation,
    Diamond_UnpublishMutationVariables
  >(Diamond_UnpublishDocument, options);
}
export type Diamond_UnpublishMutationHookResult = ReturnType<
  typeof useDiamond_UnpublishMutation
>;
export type Diamond_UnpublishMutationResult =
  Apollo.MutationResult<Diamond_UnpublishMutation>;
export type Diamond_UnpublishMutationOptions = Apollo.BaseMutationOptions<
  Diamond_UnpublishMutation,
  Diamond_UnpublishMutationVariables
>;
