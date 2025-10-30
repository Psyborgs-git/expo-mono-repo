import { useState } from 'react';
import { useCreateOrderMutation } from '../src/graphql/orders/orders.generated';
import { useToast } from '../components/hooks/useToast';

interface CreateOrderInput {
  diamondIds: string[];
  sellerOrgId: string;
  shippingAddress?: string;
  buyerNotes?: string;
}

export function useCreateOrder() {
  const [isCreating, setIsCreating] = useState(false);
  const { showSuccess, showError } = useToast();

  const [createOrderMutation] = useCreateOrderMutation({
    onCompleted: (data) => {
      setIsCreating(false);
      showSuccess(`Order ${data.createOrder.orderNumber} created successfully!`);
    },
    onError: (error) => {
      setIsCreating(false);
      showError(error.message || 'Failed to create order');
    },
  });

  const createOrder = async (input: CreateOrderInput) => {
    if (isCreating) return null;

    setIsCreating(true);

    try {
      const result = await createOrderMutation({
        variables: {
          diamondIds: input.diamondIds,
          sellerOrgId: input.sellerOrgId,
          shippingAddress: input.shippingAddress,
          buyerNotes: input.buyerNotes,
        },
        // Update cache to include the new order
        update: (cache, { data }) => {
          if (data?.createOrder) {
            // Invalidate orders queries to refetch
            cache.evict({ fieldName: 'myOrders' });
            cache.evict({ fieldName: 'myOrgOrders' });
            cache.gc();
          }
        },
      });

      return result.data?.createOrder || null;
    } catch (error) {
      console.error('Create order error:', error);
      setIsCreating(false);
      throw error;
    }
  };

  return {
    createOrder,
    isCreating,
  };
}