import { useMutation } from '@apollo/client';
import {
  AcceptResponseDocument,
  AcceptResponseMutation,
  AcceptResponseMutationVariables,
  RejectResponseDocument,
  RejectResponseMutation,
  RejectResponseMutationVariables,
} from '../src/generated/graphql';

export function useAcceptResponse() {
  const [acceptResponseMutation, { data, loading, error }] = useMutation<
    AcceptResponseMutation,
    AcceptResponseMutationVariables
  >(AcceptResponseDocument, {
    refetchQueries: ['GetRequest', 'GetRequestResponses', 'GetMyRequests', 'GetMyOrgRequests'],
    awaitRefetchQueries: true,
  });

  const acceptResponse = async (responseId: string) => {
    return acceptResponseMutation({
      variables: { responseId },
    });
  };

  return {
    acceptResponse,
    data: data?.acceptResponse,
    loading,
    error,
  };
}

export function useRejectResponse() {
  const [rejectResponseMutation, { data, loading, error }] = useMutation<
    RejectResponseMutation,
    RejectResponseMutationVariables
  >(RejectResponseDocument, {
    refetchQueries: ['GetRequest', 'GetRequestResponses', 'GetMyRequests', 'GetMyOrgRequests'],
    awaitRefetchQueries: true,
  });

  const rejectResponse = async (responseId: string, reason?: string) => {
    return rejectResponseMutation({
      variables: { responseId, reason },
    });
  };

  return {
    rejectResponse,
    data: data?.rejectResponse,
    loading,
    error,
  };
}