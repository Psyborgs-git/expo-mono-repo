import { useQuery } from '@apollo/client';
import {
  GetMyRequestsDocument,
  GetMyRequestsQuery,
  GetMyOrgRequestsDocument,
  GetMyOrgRequestsQuery,
  GetPublicRequestsDocument,
  GetPublicRequestsQuery,
} from '../src/generated/graphql';

export function useMyRequests() {
  const { data, loading, error, refetch } = useQuery<GetMyRequestsQuery>(GetMyRequestsDocument);

  return {
    requests: data?.myRequests || [],
    loading,
    error,
    refetch,
  };
}

export function useMyOrgRequests() {
  const { data, loading, error, refetch } = useQuery<GetMyOrgRequestsQuery>(GetMyOrgRequestsDocument);

  return {
    requests: data?.myOrgRequests || [],
    loading,
    error,
    refetch,
  };
}

export function usePublicRequests() {
  const { data, loading, error, refetch } = useQuery<GetPublicRequestsQuery>(GetPublicRequestsDocument);

  return {
    requests: data?.publicRequests || [],
    loading,
    error,
    refetch,
  };
}