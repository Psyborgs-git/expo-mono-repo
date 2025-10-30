import { useMutation } from '@apollo/client';
import { CreateRequestDocument, CreateRequestMutation, CreateRequestMutationVariables } from '../src/generated/graphql';

export function useCreateRequest() {
  const [createRequestMutation, { data, loading, error }] = useMutation<
    CreateRequestMutation,
    CreateRequestMutationVariables
  >(CreateRequestDocument, {
    refetchQueries: ['GetMyRequests', 'GetMyOrgRequests'],
    awaitRefetchQueries: true,
  });

  const createRequest = async (options: { variables: CreateRequestMutationVariables }) => {
    return createRequestMutation(options);
  };

  return {
    createRequest,
    data: data?.createRequest,
    loading,
    error,
  };
}