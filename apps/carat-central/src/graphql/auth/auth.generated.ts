import * as Types from '../../generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type Auth_RequestEmailOtpMutationVariables = Types.Exact<{
  email: Types.Scalars['String']['input'];
}>;

export type Auth_RequestEmailOtpMutation = {
  __typename?: 'Mutation';
  caratRequestEmailOTP: {
    __typename?: 'CaratOTPResponse';
    message: string;
    otpId: string;
  };
};

export type Auth_RequestMobileOtpMutationVariables = Types.Exact<{
  mobile: Types.Scalars['String']['input'];
  countryCode?: Types.Scalars['String']['input'];
}>;

export type Auth_RequestMobileOtpMutation = {
  __typename?: 'Mutation';
  caratRequestMobileOTP: {
    __typename?: 'CaratOTPResponse';
    message: string;
    otpId: string;
  };
};

export type Auth_VerifyEmailOtpMutationVariables = Types.Exact<{
  email: Types.Scalars['String']['input'];
  otp: Types.Scalars['String']['input'];
}>;

export type Auth_VerifyEmailOtpMutation = {
  __typename?: 'Mutation';
  caratVerifyEmailOTP: {
    __typename?: 'CaratAuthPayload';
    accessToken: string;
    refreshToken: string;
    users: {
      __typename?: 'CaratUserInfo';
      id: string;
      email?: string | null;
      mobile?: string | null;
      countryCode?: string | null;
    };
  };
};

export type Auth_VerifyMobileOtpMutationVariables = Types.Exact<{
  mobile: Types.Scalars['String']['input'];
  otp: Types.Scalars['String']['input'];
  countryCode?: Types.Scalars['String']['input'];
}>;

export type Auth_VerifyMobileOtpMutation = {
  __typename?: 'Mutation';
  caratVerifyMobileOTP: {
    __typename?: 'CaratAuthPayload';
    accessToken: string;
    refreshToken: string;
    users: {
      __typename?: 'CaratUserInfo';
      id: string;
      email?: string | null;
      mobile?: string | null;
      countryCode?: string | null;
    };
  };
};

export type Auth_RefreshTokenMutationVariables = Types.Exact<{
  refreshToken: Types.Scalars['String']['input'];
}>;

export type Auth_RefreshTokenMutation = {
  __typename?: 'Mutation';
  caratRefreshToken: {
    __typename?: 'CaratRefreshTokenResponse';
    accessToken: string;
    refreshToken: string;
  };
};

export type Auth_LogoutMutationVariables = Types.Exact<{
  [key: string]: never;
}>;

export type Auth_LogoutMutation = {
  __typename?: 'Mutation';
  caratLogout: { __typename?: 'CaratLogoutResponse'; message: string };
};

export type Auth_GetMeQueryVariables = Types.Exact<{ [key: string]: never }>;

export type Auth_GetMeQuery = {
  __typename?: 'Query';
  caratMe: {
    __typename?: 'CaratUserType';
    id: string;
    name?: string | null;
    email?: string | null;
    mobile?: string | null;
    countryCode?: string | null;
    companyName?: string | null;
    isActive: boolean;
  };
};

export type Auth_GetMyOrganizationsQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type Auth_GetMyOrganizationsQuery = {
  __typename?: 'Query';
  myOrganizations: {
    __typename?: 'Organization';
    id: string;
    name: string;
    description?: string | null;
    domain?: string | null;
    isActive: boolean;
    createdAt: any;
    updatedAt: any;
    organizationUsers: {
      __typename?: 'OrganizationMember';
      id: string;
      userId: string;
      isOwner: boolean;
      isActive: boolean;
      joinedAt: any;
      role?: {
        __typename?: 'Role';
        id: string;
        name: string;
        description?: string | null;
        isAdminRole: boolean;
      } | null;
    }[];
  }[];
};

export const Auth_RequestEmailOtpDocument = gql`
  mutation Auth_RequestEmailOTP($email: String!) {
    caratRequestEmailOTP(email: $email) {
      message
      otpId
    }
  }
`;
export type Auth_RequestEmailOtpMutationFn = Apollo.MutationFunction<
  Auth_RequestEmailOtpMutation,
  Auth_RequestEmailOtpMutationVariables
>;

/**
 * __useAuth_RequestEmailOtpMutation__
 *
 * To run a mutation, you first call `useAuth_RequestEmailOtpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAuth_RequestEmailOtpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [authRequestEmailOtpMutation, { data, loading, error }] = useAuth_RequestEmailOtpMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useAuth_RequestEmailOtpMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Auth_RequestEmailOtpMutation,
    Auth_RequestEmailOtpMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Auth_RequestEmailOtpMutation,
    Auth_RequestEmailOtpMutationVariables
  >(Auth_RequestEmailOtpDocument, options);
}
export type Auth_RequestEmailOtpMutationHookResult = ReturnType<
  typeof useAuth_RequestEmailOtpMutation
>;
export type Auth_RequestEmailOtpMutationResult =
  Apollo.MutationResult<Auth_RequestEmailOtpMutation>;
export type Auth_RequestEmailOtpMutationOptions = Apollo.BaseMutationOptions<
  Auth_RequestEmailOtpMutation,
  Auth_RequestEmailOtpMutationVariables
>;
export const Auth_RequestMobileOtpDocument = gql`
  mutation Auth_RequestMobileOTP(
    $mobile: String!
    $countryCode: String! = "1"
  ) {
    caratRequestMobileOTP(mobile: $mobile, countryCode: $countryCode) {
      message
      otpId
    }
  }
`;
export type Auth_RequestMobileOtpMutationFn = Apollo.MutationFunction<
  Auth_RequestMobileOtpMutation,
  Auth_RequestMobileOtpMutationVariables
>;

/**
 * __useAuth_RequestMobileOtpMutation__
 *
 * To run a mutation, you first call `useAuth_RequestMobileOtpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAuth_RequestMobileOtpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [authRequestMobileOtpMutation, { data, loading, error }] = useAuth_RequestMobileOtpMutation({
 *   variables: {
 *      mobile: // value for 'mobile'
 *      countryCode: // value for 'countryCode'
 *   },
 * });
 */
export function useAuth_RequestMobileOtpMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Auth_RequestMobileOtpMutation,
    Auth_RequestMobileOtpMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Auth_RequestMobileOtpMutation,
    Auth_RequestMobileOtpMutationVariables
  >(Auth_RequestMobileOtpDocument, options);
}
export type Auth_RequestMobileOtpMutationHookResult = ReturnType<
  typeof useAuth_RequestMobileOtpMutation
>;
export type Auth_RequestMobileOtpMutationResult =
  Apollo.MutationResult<Auth_RequestMobileOtpMutation>;
export type Auth_RequestMobileOtpMutationOptions = Apollo.BaseMutationOptions<
  Auth_RequestMobileOtpMutation,
  Auth_RequestMobileOtpMutationVariables
>;
export const Auth_VerifyEmailOtpDocument = gql`
  mutation Auth_VerifyEmailOTP($email: String!, $otp: String!) {
    caratVerifyEmailOTP(email: $email, otp: $otp) {
      accessToken
      refreshToken
      users {
        id
        email
        mobile
        countryCode
      }
    }
  }
`;
export type Auth_VerifyEmailOtpMutationFn = Apollo.MutationFunction<
  Auth_VerifyEmailOtpMutation,
  Auth_VerifyEmailOtpMutationVariables
>;

/**
 * __useAuth_VerifyEmailOtpMutation__
 *
 * To run a mutation, you first call `useAuth_VerifyEmailOtpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAuth_VerifyEmailOtpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [authVerifyEmailOtpMutation, { data, loading, error }] = useAuth_VerifyEmailOtpMutation({
 *   variables: {
 *      email: // value for 'email'
 *      otp: // value for 'otp'
 *   },
 * });
 */
export function useAuth_VerifyEmailOtpMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Auth_VerifyEmailOtpMutation,
    Auth_VerifyEmailOtpMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Auth_VerifyEmailOtpMutation,
    Auth_VerifyEmailOtpMutationVariables
  >(Auth_VerifyEmailOtpDocument, options);
}
export type Auth_VerifyEmailOtpMutationHookResult = ReturnType<
  typeof useAuth_VerifyEmailOtpMutation
>;
export type Auth_VerifyEmailOtpMutationResult =
  Apollo.MutationResult<Auth_VerifyEmailOtpMutation>;
export type Auth_VerifyEmailOtpMutationOptions = Apollo.BaseMutationOptions<
  Auth_VerifyEmailOtpMutation,
  Auth_VerifyEmailOtpMutationVariables
>;
export const Auth_VerifyMobileOtpDocument = gql`
  mutation Auth_VerifyMobileOTP(
    $mobile: String!
    $otp: String!
    $countryCode: String! = "1"
  ) {
    caratVerifyMobileOTP(
      mobile: $mobile
      otp: $otp
      countryCode: $countryCode
    ) {
      accessToken
      refreshToken
      users {
        id
        email
        mobile
        countryCode
      }
    }
  }
`;
export type Auth_VerifyMobileOtpMutationFn = Apollo.MutationFunction<
  Auth_VerifyMobileOtpMutation,
  Auth_VerifyMobileOtpMutationVariables
>;

/**
 * __useAuth_VerifyMobileOtpMutation__
 *
 * To run a mutation, you first call `useAuth_VerifyMobileOtpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAuth_VerifyMobileOtpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [authVerifyMobileOtpMutation, { data, loading, error }] = useAuth_VerifyMobileOtpMutation({
 *   variables: {
 *      mobile: // value for 'mobile'
 *      otp: // value for 'otp'
 *      countryCode: // value for 'countryCode'
 *   },
 * });
 */
export function useAuth_VerifyMobileOtpMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Auth_VerifyMobileOtpMutation,
    Auth_VerifyMobileOtpMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Auth_VerifyMobileOtpMutation,
    Auth_VerifyMobileOtpMutationVariables
  >(Auth_VerifyMobileOtpDocument, options);
}
export type Auth_VerifyMobileOtpMutationHookResult = ReturnType<
  typeof useAuth_VerifyMobileOtpMutation
>;
export type Auth_VerifyMobileOtpMutationResult =
  Apollo.MutationResult<Auth_VerifyMobileOtpMutation>;
export type Auth_VerifyMobileOtpMutationOptions = Apollo.BaseMutationOptions<
  Auth_VerifyMobileOtpMutation,
  Auth_VerifyMobileOtpMutationVariables
>;
export const Auth_RefreshTokenDocument = gql`
  mutation Auth_RefreshToken($refreshToken: String!) {
    caratRefreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
    }
  }
`;
export type Auth_RefreshTokenMutationFn = Apollo.MutationFunction<
  Auth_RefreshTokenMutation,
  Auth_RefreshTokenMutationVariables
>;

/**
 * __useAuth_RefreshTokenMutation__
 *
 * To run a mutation, you first call `useAuth_RefreshTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAuth_RefreshTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [authRefreshTokenMutation, { data, loading, error }] = useAuth_RefreshTokenMutation({
 *   variables: {
 *      refreshToken: // value for 'refreshToken'
 *   },
 * });
 */
export function useAuth_RefreshTokenMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Auth_RefreshTokenMutation,
    Auth_RefreshTokenMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Auth_RefreshTokenMutation,
    Auth_RefreshTokenMutationVariables
  >(Auth_RefreshTokenDocument, options);
}
export type Auth_RefreshTokenMutationHookResult = ReturnType<
  typeof useAuth_RefreshTokenMutation
>;
export type Auth_RefreshTokenMutationResult =
  Apollo.MutationResult<Auth_RefreshTokenMutation>;
export type Auth_RefreshTokenMutationOptions = Apollo.BaseMutationOptions<
  Auth_RefreshTokenMutation,
  Auth_RefreshTokenMutationVariables
>;
export const Auth_LogoutDocument = gql`
  mutation Auth_Logout {
    caratLogout {
      message
    }
  }
`;
export type Auth_LogoutMutationFn = Apollo.MutationFunction<
  Auth_LogoutMutation,
  Auth_LogoutMutationVariables
>;

/**
 * __useAuth_LogoutMutation__
 *
 * To run a mutation, you first call `useAuth_LogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAuth_LogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [authLogoutMutation, { data, loading, error }] = useAuth_LogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useAuth_LogoutMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Auth_LogoutMutation,
    Auth_LogoutMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<Auth_LogoutMutation, Auth_LogoutMutationVariables>(
    Auth_LogoutDocument,
    options
  );
}
export type Auth_LogoutMutationHookResult = ReturnType<
  typeof useAuth_LogoutMutation
>;
export type Auth_LogoutMutationResult =
  Apollo.MutationResult<Auth_LogoutMutation>;
export type Auth_LogoutMutationOptions = Apollo.BaseMutationOptions<
  Auth_LogoutMutation,
  Auth_LogoutMutationVariables
>;
export const Auth_GetMeDocument = gql`
  query Auth_GetMe {
    caratMe {
      id
      name
      email
      mobile
      countryCode
      companyName
      isActive
    }
  }
`;

/**
 * __useAuth_GetMeQuery__
 *
 * To run a query within a React component, call `useAuth_GetMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useAuth_GetMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAuth_GetMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useAuth_GetMeQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Auth_GetMeQuery,
    Auth_GetMeQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Auth_GetMeQuery, Auth_GetMeQueryVariables>(
    Auth_GetMeDocument,
    options
  );
}
export function useAuth_GetMeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Auth_GetMeQuery,
    Auth_GetMeQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<Auth_GetMeQuery, Auth_GetMeQueryVariables>(
    Auth_GetMeDocument,
    options
  );
}
export function useAuth_GetMeSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<Auth_GetMeQuery, Auth_GetMeQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<Auth_GetMeQuery, Auth_GetMeQueryVariables>(
    Auth_GetMeDocument,
    options
  );
}
export type Auth_GetMeQueryHookResult = ReturnType<typeof useAuth_GetMeQuery>;
export type Auth_GetMeLazyQueryHookResult = ReturnType<
  typeof useAuth_GetMeLazyQuery
>;
export type Auth_GetMeSuspenseQueryHookResult = ReturnType<
  typeof useAuth_GetMeSuspenseQuery
>;
export type Auth_GetMeQueryResult = Apollo.QueryResult<
  Auth_GetMeQuery,
  Auth_GetMeQueryVariables
>;
export const Auth_GetMyOrganizationsDocument = gql`
  query Auth_GetMyOrganizations {
    myOrganizations {
      id
      name
      description
      domain
      isActive
      createdAt
      updatedAt
      organizationUsers {
        id
        userId
        isOwner
        isActive
        joinedAt
        role {
          id
          name
          description
          isAdminRole
        }
      }
    }
  }
`;

/**
 * __useAuth_GetMyOrganizationsQuery__
 *
 * To run a query within a React component, call `useAuth_GetMyOrganizationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAuth_GetMyOrganizationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAuth_GetMyOrganizationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAuth_GetMyOrganizationsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Auth_GetMyOrganizationsQuery,
    Auth_GetMyOrganizationsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Auth_GetMyOrganizationsQuery,
    Auth_GetMyOrganizationsQueryVariables
  >(Auth_GetMyOrganizationsDocument, options);
}
export function useAuth_GetMyOrganizationsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Auth_GetMyOrganizationsQuery,
    Auth_GetMyOrganizationsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Auth_GetMyOrganizationsQuery,
    Auth_GetMyOrganizationsQueryVariables
  >(Auth_GetMyOrganizationsDocument, options);
}
export function useAuth_GetMyOrganizationsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        Auth_GetMyOrganizationsQuery,
        Auth_GetMyOrganizationsQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    Auth_GetMyOrganizationsQuery,
    Auth_GetMyOrganizationsQueryVariables
  >(Auth_GetMyOrganizationsDocument, options);
}
export type Auth_GetMyOrganizationsQueryHookResult = ReturnType<
  typeof useAuth_GetMyOrganizationsQuery
>;
export type Auth_GetMyOrganizationsLazyQueryHookResult = ReturnType<
  typeof useAuth_GetMyOrganizationsLazyQuery
>;
export type Auth_GetMyOrganizationsSuspenseQueryHookResult = ReturnType<
  typeof useAuth_GetMyOrganizationsSuspenseQuery
>;
export type Auth_GetMyOrganizationsQueryResult = Apollo.QueryResult<
  Auth_GetMyOrganizationsQuery,
  Auth_GetMyOrganizationsQueryVariables
>;
