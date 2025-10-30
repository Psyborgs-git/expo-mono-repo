import * as Types from '../../generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type Order_UserFragment = {
  __typename?: 'UserBasic';
  id: string;
  name: string;
  email: string;
};

export type Order_OrganizationFragment = {
  __typename?: 'OrganizationBasic';
  id: string;
  name: string;
};

export type Order_ItemFragment = {
  __typename?: 'OrderItem';
  id: string;
  diamondId: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  diamondSnapshot?: any | null;
  createdAt: any;
};

export type Order_BasicFragment = {
  __typename?: 'Order';
  id: string;
  orderNumber: string;
  status: Types.OrderStatus;
  paymentStatus: Types.PaymentStatus;
  paymentMethod?: string | null;
  currency: string;
  totalAmount: number;
  buyerNotes?: string | null;
  sellerNotes?: string | null;
  shippingAddress?: any | null;
  createdAt: any;
  updatedAt: any;
  canceledAt?: any | null;
  completedAt?: any | null;
  shippedAt?: any | null;
  deliveredAt?: any | null;
  buyerId: string;
  buyerOrgId?: string | null;
  sellerId: string;
  sellerOrgId: string;
  buyer: { __typename?: 'UserBasic'; id: string; name: string; email: string };
  buyerOrg?: {
    __typename?: 'OrganizationBasic';
    id: string;
    name: string;
  } | null;
  seller: { __typename?: 'UserBasic'; id: string; name: string; email: string };
  sellerOrg: { __typename?: 'OrganizationBasic'; id: string; name: string };
  orderItems: Array<{
    __typename?: 'OrderItem';
    id: string;
    diamondId: string;
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
    diamondSnapshot?: any | null;
    createdAt: any;
  }>;
};

export type Order_GetMyQueryVariables = Types.Exact<{ [key: string]: never }>;

export type Order_GetMyQuery = {
  __typename?: 'Query';
  myOrders: Array<{
    __typename?: 'Order';
    id: string;
    orderNumber: string;
    status: Types.OrderStatus;
    paymentStatus: Types.PaymentStatus;
    paymentMethod?: string | null;
    currency: string;
    totalAmount: number;
    buyerNotes?: string | null;
    sellerNotes?: string | null;
    shippingAddress?: any | null;
    createdAt: any;
    updatedAt: any;
    canceledAt?: any | null;
    completedAt?: any | null;
    shippedAt?: any | null;
    deliveredAt?: any | null;
    buyerId: string;
    buyerOrgId?: string | null;
    sellerId: string;
    sellerOrgId: string;
    buyer: {
      __typename?: 'UserBasic';
      id: string;
      name: string;
      email: string;
    };
    buyerOrg?: {
      __typename?: 'OrganizationBasic';
      id: string;
      name: string;
    } | null;
    seller: {
      __typename?: 'UserBasic';
      id: string;
      name: string;
      email: string;
    };
    sellerOrg: { __typename?: 'OrganizationBasic'; id: string; name: string };
    orderItems: Array<{
      __typename?: 'OrderItem';
      id: string;
      diamondId: string;
      quantity: number;
      pricePerUnit: number;
      totalPrice: number;
      diamondSnapshot?: any | null;
      createdAt: any;
    }>;
  }>;
};

export type Order_GetMyOrgQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type Order_GetMyOrgQuery = {
  __typename?: 'Query';
  myOrgOrders: Array<{
    __typename?: 'Order';
    id: string;
    orderNumber: string;
    status: Types.OrderStatus;
    paymentStatus: Types.PaymentStatus;
    paymentMethod?: string | null;
    currency: string;
    totalAmount: number;
    buyerNotes?: string | null;
    sellerNotes?: string | null;
    shippingAddress?: any | null;
    createdAt: any;
    updatedAt: any;
    canceledAt?: any | null;
    completedAt?: any | null;
    shippedAt?: any | null;
    deliveredAt?: any | null;
    buyerId: string;
    buyerOrgId?: string | null;
    sellerId: string;
    sellerOrgId: string;
    buyer: {
      __typename?: 'UserBasic';
      id: string;
      name: string;
      email: string;
    };
    buyerOrg?: {
      __typename?: 'OrganizationBasic';
      id: string;
      name: string;
    } | null;
    seller: {
      __typename?: 'UserBasic';
      id: string;
      name: string;
      email: string;
    };
    sellerOrg: { __typename?: 'OrganizationBasic'; id: string; name: string };
    orderItems: Array<{
      __typename?: 'OrderItem';
      id: string;
      diamondId: string;
      quantity: number;
      pricePerUnit: number;
      totalPrice: number;
      diamondSnapshot?: any | null;
      createdAt: any;
    }>;
  }>;
};

export type Order_GetByIdQueryVariables = Types.Exact<{
  orderId: Types.Scalars['String']['input'];
}>;

export type Order_GetByIdQuery = {
  __typename?: 'Query';
  order?: {
    __typename?: 'Order';
    id: string;
    orderNumber: string;
    status: Types.OrderStatus;
    paymentStatus: Types.PaymentStatus;
    paymentMethod?: string | null;
    currency: string;
    totalAmount: number;
    buyerNotes?: string | null;
    sellerNotes?: string | null;
    shippingAddress?: any | null;
    createdAt: any;
    updatedAt: any;
    canceledAt?: any | null;
    completedAt?: any | null;
    shippedAt?: any | null;
    deliveredAt?: any | null;
    buyerId: string;
    buyerOrgId?: string | null;
    sellerId: string;
    sellerOrgId: string;
    buyer: {
      __typename?: 'UserBasic';
      id: string;
      name: string;
      email: string;
    };
    buyerOrg?: {
      __typename?: 'OrganizationBasic';
      id: string;
      name: string;
    } | null;
    seller: {
      __typename?: 'UserBasic';
      id: string;
      name: string;
      email: string;
    };
    sellerOrg: { __typename?: 'OrganizationBasic'; id: string; name: string };
    orderItems: Array<{
      __typename?: 'OrderItem';
      id: string;
      diamondId: string;
      quantity: number;
      pricePerUnit: number;
      totalPrice: number;
      diamondSnapshot?: any | null;
      createdAt: any;
    }>;
  } | null;
};

export type Order_CreateMutationVariables = Types.Exact<{
  diamondIds:
    | Array<Types.Scalars['String']['input']>
    | Types.Scalars['String']['input'];
  sellerOrgId: Types.Scalars['String']['input'];
  shippingAddress?: Types.InputMaybe<Types.Scalars['String']['input']>;
  buyerNotes?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;

export type Order_CreateMutation = {
  __typename?: 'Mutation';
  createOrder: {
    __typename?: 'Order';
    id: string;
    orderNumber: string;
    status: Types.OrderStatus;
    paymentStatus: Types.PaymentStatus;
    paymentMethod?: string | null;
    currency: string;
    totalAmount: number;
    buyerNotes?: string | null;
    sellerNotes?: string | null;
    shippingAddress?: any | null;
    createdAt: any;
    updatedAt: any;
    canceledAt?: any | null;
    completedAt?: any | null;
    shippedAt?: any | null;
    deliveredAt?: any | null;
    buyerId: string;
    buyerOrgId?: string | null;
    sellerId: string;
    sellerOrgId: string;
    buyer: {
      __typename?: 'UserBasic';
      id: string;
      name: string;
      email: string;
    };
    buyerOrg?: {
      __typename?: 'OrganizationBasic';
      id: string;
      name: string;
    } | null;
    seller: {
      __typename?: 'UserBasic';
      id: string;
      name: string;
      email: string;
    };
    sellerOrg: { __typename?: 'OrganizationBasic'; id: string; name: string };
    orderItems: Array<{
      __typename?: 'OrderItem';
      id: string;
      diamondId: string;
      quantity: number;
      pricePerUnit: number;
      totalPrice: number;
      diamondSnapshot?: any | null;
      createdAt: any;
    }>;
  };
};

export type Order_UpdateStatusMutationVariables = Types.Exact<{
  orderId: Types.Scalars['String']['input'];
  status: Types.Scalars['String']['input'];
  sellerNotes?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;

export type Order_UpdateStatusMutation = {
  __typename?: 'Mutation';
  updateOrderStatus: {
    __typename?: 'Order';
    id: string;
    orderNumber: string;
    status: Types.OrderStatus;
    paymentStatus: Types.PaymentStatus;
    paymentMethod?: string | null;
    currency: string;
    totalAmount: number;
    buyerNotes?: string | null;
    sellerNotes?: string | null;
    shippingAddress?: any | null;
    createdAt: any;
    updatedAt: any;
    canceledAt?: any | null;
    completedAt?: any | null;
    shippedAt?: any | null;
    deliveredAt?: any | null;
    buyerId: string;
    buyerOrgId?: string | null;
    sellerId: string;
    sellerOrgId: string;
    buyer: {
      __typename?: 'UserBasic';
      id: string;
      name: string;
      email: string;
    };
    buyerOrg?: {
      __typename?: 'OrganizationBasic';
      id: string;
      name: string;
    } | null;
    seller: {
      __typename?: 'UserBasic';
      id: string;
      name: string;
      email: string;
    };
    sellerOrg: { __typename?: 'OrganizationBasic'; id: string; name: string };
    orderItems: Array<{
      __typename?: 'OrderItem';
      id: string;
      diamondId: string;
      quantity: number;
      pricePerUnit: number;
      totalPrice: number;
      diamondSnapshot?: any | null;
      createdAt: any;
    }>;
  };
};

export type Order_UpdatePaymentStatusMutationVariables = Types.Exact<{
  orderId: Types.Scalars['String']['input'];
  paymentStatus: Types.Scalars['String']['input'];
  paymentMethod?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;

export type Order_UpdatePaymentStatusMutation = {
  __typename?: 'Mutation';
  updatePaymentStatus: {
    __typename?: 'Order';
    id: string;
    orderNumber: string;
    status: Types.OrderStatus;
    paymentStatus: Types.PaymentStatus;
    paymentMethod?: string | null;
    currency: string;
    totalAmount: number;
    buyerNotes?: string | null;
    sellerNotes?: string | null;
    shippingAddress?: any | null;
    createdAt: any;
    updatedAt: any;
    canceledAt?: any | null;
    completedAt?: any | null;
    shippedAt?: any | null;
    deliveredAt?: any | null;
    buyerId: string;
    buyerOrgId?: string | null;
    sellerId: string;
    sellerOrgId: string;
    buyer: {
      __typename?: 'UserBasic';
      id: string;
      name: string;
      email: string;
    };
    buyerOrg?: {
      __typename?: 'OrganizationBasic';
      id: string;
      name: string;
    } | null;
    seller: {
      __typename?: 'UserBasic';
      id: string;
      name: string;
      email: string;
    };
    sellerOrg: { __typename?: 'OrganizationBasic'; id: string; name: string };
    orderItems: Array<{
      __typename?: 'OrderItem';
      id: string;
      diamondId: string;
      quantity: number;
      pricePerUnit: number;
      totalPrice: number;
      diamondSnapshot?: any | null;
      createdAt: any;
    }>;
  };
};

export type Order_CancelMutationVariables = Types.Exact<{
  orderId: Types.Scalars['String']['input'];
}>;

export type Order_CancelMutation = {
  __typename?: 'Mutation';
  cancelOrder: {
    __typename?: 'Order';
    id: string;
    orderNumber: string;
    status: Types.OrderStatus;
    paymentStatus: Types.PaymentStatus;
    paymentMethod?: string | null;
    currency: string;
    totalAmount: number;
    buyerNotes?: string | null;
    sellerNotes?: string | null;
    shippingAddress?: any | null;
    createdAt: any;
    updatedAt: any;
    canceledAt?: any | null;
    completedAt?: any | null;
    shippedAt?: any | null;
    deliveredAt?: any | null;
    buyerId: string;
    buyerOrgId?: string | null;
    sellerId: string;
    sellerOrgId: string;
    buyer: {
      __typename?: 'UserBasic';
      id: string;
      name: string;
      email: string;
    };
    buyerOrg?: {
      __typename?: 'OrganizationBasic';
      id: string;
      name: string;
    } | null;
    seller: {
      __typename?: 'UserBasic';
      id: string;
      name: string;
      email: string;
    };
    sellerOrg: { __typename?: 'OrganizationBasic'; id: string; name: string };
    orderItems: Array<{
      __typename?: 'OrderItem';
      id: string;
      diamondId: string;
      quantity: number;
      pricePerUnit: number;
      totalPrice: number;
      diamondSnapshot?: any | null;
      createdAt: any;
    }>;
  };
};

export const Order_UserFragmentDoc = gql`
  fragment Order_User on UserBasic {
    id
    name
    email
  }
`;
export const Order_OrganizationFragmentDoc = gql`
  fragment Order_Organization on OrganizationBasic {
    id
    name
  }
`;
export const Order_ItemFragmentDoc = gql`
  fragment Order_Item on OrderItem {
    id
    diamondId
    quantity
    pricePerUnit
    totalPrice
    diamondSnapshot
    createdAt
  }
`;
export const Order_BasicFragmentDoc = gql`
  fragment Order_Basic on Order {
    id
    orderNumber
    status
    paymentStatus
    paymentMethod
    currency
    totalAmount
    buyerNotes
    sellerNotes
    shippingAddress
    createdAt
    updatedAt
    canceledAt
    completedAt
    shippedAt
    deliveredAt
    buyer {
      ...Order_User
    }
    buyerId
    buyerOrg {
      ...Order_Organization
    }
    buyerOrgId
    seller {
      ...Order_User
    }
    sellerId
    sellerOrg {
      ...Order_Organization
    }
    sellerOrgId
    orderItems {
      ...Order_Item
    }
  }
  ${Order_UserFragmentDoc}
  ${Order_OrganizationFragmentDoc}
  ${Order_ItemFragmentDoc}
`;
export const Order_GetMyDocument = gql`
  query Order_GetMy {
    myOrders {
      ...Order_Basic
    }
  }
  ${Order_BasicFragmentDoc}
`;

/**
 * __useOrder_GetMyQuery__
 *
 * To run a query within a React component, call `useOrder_GetMyQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrder_GetMyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrder_GetMyQuery({
 *   variables: {
 *   },
 * });
 */
export function useOrder_GetMyQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Order_GetMyQuery,
    Order_GetMyQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Order_GetMyQuery, Order_GetMyQueryVariables>(
    Order_GetMyDocument,
    options
  );
}
export function useOrder_GetMyLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Order_GetMyQuery,
    Order_GetMyQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<Order_GetMyQuery, Order_GetMyQueryVariables>(
    Order_GetMyDocument,
    options
  );
}
export function useOrder_GetMySuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        Order_GetMyQuery,
        Order_GetMyQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<Order_GetMyQuery, Order_GetMyQueryVariables>(
    Order_GetMyDocument,
    options
  );
}
export type Order_GetMyQueryHookResult = ReturnType<typeof useOrder_GetMyQuery>;
export type Order_GetMyLazyQueryHookResult = ReturnType<
  typeof useOrder_GetMyLazyQuery
>;
export type Order_GetMySuspenseQueryHookResult = ReturnType<
  typeof useOrder_GetMySuspenseQuery
>;
export type Order_GetMyQueryResult = Apollo.QueryResult<
  Order_GetMyQuery,
  Order_GetMyQueryVariables
>;
export const Order_GetMyOrgDocument = gql`
  query Order_GetMyOrg {
    myOrgOrders {
      ...Order_Basic
    }
  }
  ${Order_BasicFragmentDoc}
`;

/**
 * __useOrder_GetMyOrgQuery__
 *
 * To run a query within a React component, call `useOrder_GetMyOrgQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrder_GetMyOrgQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrder_GetMyOrgQuery({
 *   variables: {
 *   },
 * });
 */
export function useOrder_GetMyOrgQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Order_GetMyOrgQuery,
    Order_GetMyOrgQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Order_GetMyOrgQuery, Order_GetMyOrgQueryVariables>(
    Order_GetMyOrgDocument,
    options
  );
}
export function useOrder_GetMyOrgLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Order_GetMyOrgQuery,
    Order_GetMyOrgQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<Order_GetMyOrgQuery, Order_GetMyOrgQueryVariables>(
    Order_GetMyOrgDocument,
    options
  );
}
export function useOrder_GetMyOrgSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        Order_GetMyOrgQuery,
        Order_GetMyOrgQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    Order_GetMyOrgQuery,
    Order_GetMyOrgQueryVariables
  >(Order_GetMyOrgDocument, options);
}
export type Order_GetMyOrgQueryHookResult = ReturnType<
  typeof useOrder_GetMyOrgQuery
>;
export type Order_GetMyOrgLazyQueryHookResult = ReturnType<
  typeof useOrder_GetMyOrgLazyQuery
>;
export type Order_GetMyOrgSuspenseQueryHookResult = ReturnType<
  typeof useOrder_GetMyOrgSuspenseQuery
>;
export type Order_GetMyOrgQueryResult = Apollo.QueryResult<
  Order_GetMyOrgQuery,
  Order_GetMyOrgQueryVariables
>;
export const Order_GetByIdDocument = gql`
  query Order_GetById($orderId: String!) {
    order(orderId: $orderId) {
      ...Order_Basic
    }
  }
  ${Order_BasicFragmentDoc}
`;

/**
 * __useOrder_GetByIdQuery__
 *
 * To run a query within a React component, call `useOrder_GetByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrder_GetByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrder_GetByIdQuery({
 *   variables: {
 *      orderId: // value for 'orderId'
 *   },
 * });
 */
export function useOrder_GetByIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    Order_GetByIdQuery,
    Order_GetByIdQueryVariables
  > &
    (
      | { variables: Order_GetByIdQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Order_GetByIdQuery, Order_GetByIdQueryVariables>(
    Order_GetByIdDocument,
    options
  );
}
export function useOrder_GetByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Order_GetByIdQuery,
    Order_GetByIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<Order_GetByIdQuery, Order_GetByIdQueryVariables>(
    Order_GetByIdDocument,
    options
  );
}
export function useOrder_GetByIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        Order_GetByIdQuery,
        Order_GetByIdQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    Order_GetByIdQuery,
    Order_GetByIdQueryVariables
  >(Order_GetByIdDocument, options);
}
export type Order_GetByIdQueryHookResult = ReturnType<
  typeof useOrder_GetByIdQuery
>;
export type Order_GetByIdLazyQueryHookResult = ReturnType<
  typeof useOrder_GetByIdLazyQuery
>;
export type Order_GetByIdSuspenseQueryHookResult = ReturnType<
  typeof useOrder_GetByIdSuspenseQuery
>;
export type Order_GetByIdQueryResult = Apollo.QueryResult<
  Order_GetByIdQuery,
  Order_GetByIdQueryVariables
>;
export const Order_CreateDocument = gql`
  mutation Order_Create(
    $diamondIds: [String!]!
    $sellerOrgId: String!
    $shippingAddress: String
    $buyerNotes: String
  ) {
    createOrder(
      diamondIds: $diamondIds
      sellerOrgId: $sellerOrgId
      shippingAddress: $shippingAddress
      buyerNotes: $buyerNotes
    ) {
      ...Order_Basic
    }
  }
  ${Order_BasicFragmentDoc}
`;
export type Order_CreateMutationFn = Apollo.MutationFunction<
  Order_CreateMutation,
  Order_CreateMutationVariables
>;

/**
 * __useOrder_CreateMutation__
 *
 * To run a mutation, you first call `useOrder_CreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrder_CreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderCreateMutation, { data, loading, error }] = useOrder_CreateMutation({
 *   variables: {
 *      diamondIds: // value for 'diamondIds'
 *      sellerOrgId: // value for 'sellerOrgId'
 *      shippingAddress: // value for 'shippingAddress'
 *      buyerNotes: // value for 'buyerNotes'
 *   },
 * });
 */
export function useOrder_CreateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Order_CreateMutation,
    Order_CreateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Order_CreateMutation,
    Order_CreateMutationVariables
  >(Order_CreateDocument, options);
}
export type Order_CreateMutationHookResult = ReturnType<
  typeof useOrder_CreateMutation
>;
export type Order_CreateMutationResult =
  Apollo.MutationResult<Order_CreateMutation>;
export type Order_CreateMutationOptions = Apollo.BaseMutationOptions<
  Order_CreateMutation,
  Order_CreateMutationVariables
>;
export const Order_UpdateStatusDocument = gql`
  mutation Order_UpdateStatus(
    $orderId: String!
    $status: String!
    $sellerNotes: String
  ) {
    updateOrderStatus(
      orderId: $orderId
      status: $status
      sellerNotes: $sellerNotes
    ) {
      ...Order_Basic
    }
  }
  ${Order_BasicFragmentDoc}
`;
export type Order_UpdateStatusMutationFn = Apollo.MutationFunction<
  Order_UpdateStatusMutation,
  Order_UpdateStatusMutationVariables
>;

/**
 * __useOrder_UpdateStatusMutation__
 *
 * To run a mutation, you first call `useOrder_UpdateStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrder_UpdateStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderUpdateStatusMutation, { data, loading, error }] = useOrder_UpdateStatusMutation({
 *   variables: {
 *      orderId: // value for 'orderId'
 *      status: // value for 'status'
 *      sellerNotes: // value for 'sellerNotes'
 *   },
 * });
 */
export function useOrder_UpdateStatusMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Order_UpdateStatusMutation,
    Order_UpdateStatusMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Order_UpdateStatusMutation,
    Order_UpdateStatusMutationVariables
  >(Order_UpdateStatusDocument, options);
}
export type Order_UpdateStatusMutationHookResult = ReturnType<
  typeof useOrder_UpdateStatusMutation
>;
export type Order_UpdateStatusMutationResult =
  Apollo.MutationResult<Order_UpdateStatusMutation>;
export type Order_UpdateStatusMutationOptions = Apollo.BaseMutationOptions<
  Order_UpdateStatusMutation,
  Order_UpdateStatusMutationVariables
>;
export const Order_UpdatePaymentStatusDocument = gql`
  mutation Order_UpdatePaymentStatus(
    $orderId: String!
    $paymentStatus: String!
    $paymentMethod: String
  ) {
    updatePaymentStatus(
      orderId: $orderId
      paymentStatus: $paymentStatus
      paymentMethod: $paymentMethod
    ) {
      ...Order_Basic
    }
  }
  ${Order_BasicFragmentDoc}
`;
export type Order_UpdatePaymentStatusMutationFn = Apollo.MutationFunction<
  Order_UpdatePaymentStatusMutation,
  Order_UpdatePaymentStatusMutationVariables
>;

/**
 * __useOrder_UpdatePaymentStatusMutation__
 *
 * To run a mutation, you first call `useOrder_UpdatePaymentStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrder_UpdatePaymentStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderUpdatePaymentStatusMutation, { data, loading, error }] = useOrder_UpdatePaymentStatusMutation({
 *   variables: {
 *      orderId: // value for 'orderId'
 *      paymentStatus: // value for 'paymentStatus'
 *      paymentMethod: // value for 'paymentMethod'
 *   },
 * });
 */
export function useOrder_UpdatePaymentStatusMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Order_UpdatePaymentStatusMutation,
    Order_UpdatePaymentStatusMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Order_UpdatePaymentStatusMutation,
    Order_UpdatePaymentStatusMutationVariables
  >(Order_UpdatePaymentStatusDocument, options);
}
export type Order_UpdatePaymentStatusMutationHookResult = ReturnType<
  typeof useOrder_UpdatePaymentStatusMutation
>;
export type Order_UpdatePaymentStatusMutationResult =
  Apollo.MutationResult<Order_UpdatePaymentStatusMutation>;
export type Order_UpdatePaymentStatusMutationOptions =
  Apollo.BaseMutationOptions<
    Order_UpdatePaymentStatusMutation,
    Order_UpdatePaymentStatusMutationVariables
  >;
export const Order_CancelDocument = gql`
  mutation Order_Cancel($orderId: String!) {
    cancelOrder(orderId: $orderId) {
      ...Order_Basic
    }
  }
  ${Order_BasicFragmentDoc}
`;
export type Order_CancelMutationFn = Apollo.MutationFunction<
  Order_CancelMutation,
  Order_CancelMutationVariables
>;

/**
 * __useOrder_CancelMutation__
 *
 * To run a mutation, you first call `useOrder_CancelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrder_CancelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderCancelMutation, { data, loading, error }] = useOrder_CancelMutation({
 *   variables: {
 *      orderId: // value for 'orderId'
 *   },
 * });
 */
export function useOrder_CancelMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Order_CancelMutation,
    Order_CancelMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Order_CancelMutation,
    Order_CancelMutationVariables
  >(Order_CancelDocument, options);
}
export type Order_CancelMutationHookResult = ReturnType<
  typeof useOrder_CancelMutation
>;
export type Order_CancelMutationResult =
  Apollo.MutationResult<Order_CancelMutation>;
export type Order_CancelMutationOptions = Apollo.BaseMutationOptions<
  Order_CancelMutation,
  Order_CancelMutationVariables
>;
