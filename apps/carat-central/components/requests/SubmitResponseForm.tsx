import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  Button,
  Input,
  TextArea,
  ScrollView,
  Card,
  Checkbox,
  Label,
} from 'tamagui';
import { Alert, FlatList } from 'react-native';
import { Check, Diamond, DollarSign } from '@tamagui/lucide-icons';
import { useMutation } from '@apollo/client';
import { useDiamonds } from '../../hooks/useDiamonds';
import {
  SubmitResponseDocument,
  SubmitResponseMutation,
  SubmitResponseMutationVariables,
  SubmitResponseInput,
  Diamond as DiamondType,
} from '../../src/generated/graphql';

interface SubmitResponseFormProps {
  requestId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface DiamondSelectionItemProps {
  diamond: DiamondType;
  isSelected: boolean;
  onToggle: (diamondId: string) => void;
}

function DiamondSelectionItem({ diamond, isSelected, onToggle }: DiamondSelectionItemProps) {
  return (
    <Card
      elevate
      size="$3"
      bordered
      animation="bouncy"
      scale={0.9}
      hoverStyle={{ scale: 0.925 }}
      pressStyle={{ scale: 0.875 }}
      backgroundColor={isSelected ? '$blue2' : '$background'}
      borderColor={isSelected ? '$blue8' : '$borderColor'}
      onPress={() => onToggle(diamond.id)}
      marginBottom="$2"
    >
      <Card.Header padded>
        <XStack justifyContent="space-between" alignItems="center">
          <YStack flex={1} space="$1">
            <XStack alignItems="center" space="$2">
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggle(diamond.id)}
              />
              <Text fontSize="$4" fontWeight="600" color="$color">
                {diamond.name || `${diamond.carat}ct ${diamond.shape}`}
              </Text>
            </XStack>
            
            <Text fontSize="$3" color="$gray10">
              {diamond.carat}ct • {diamond.clarity} • {diamond.color} • {diamond.cut}
            </Text>
            
            <Text fontSize="$4" fontWeight="600" color="$green9">
              ${diamond.totalPrice.toLocaleString()}
            </Text>
          </YStack>
        </XStack>
      </Card.Header>
    </Card>
  );
}

export function SubmitResponseForm({ requestId, onSuccess, onCancel }: SubmitResponseFormProps) {
  const [formData, setFormData] = useState<Partial<SubmitResponseInput>>({
    message: '',
    proposedDiamonds: [],
    proposedPrice: undefined,
    currency: 'USD',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { diamonds, loading: diamondsLoading } = useDiamonds();

  const [submitResponse, { loading: submitting }] = useMutation<
    SubmitResponseMutation,
    SubmitResponseMutationVariables
  >(SubmitResponseDocument, {
    refetchQueries: ['GetRequest', 'GetRequestResponses'],
    awaitRefetchQueries: true,
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.message?.trim()) {
      newErrors.message = 'Message is required';
    }

    if (!formData.proposedDiamonds || formData.proposedDiamonds.length === 0) {
      newErrors.diamonds = 'Please select at least one diamond';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await submitResponse({
        variables: {
          requestId,
          input: {
            message: formData.message!,
            proposedDiamonds: formData.proposedDiamonds || [],
            proposedPrice: formData.proposedPrice || undefined,
            currency: formData.currency || 'USD',
          },
        },
      });

      Alert.alert('Success', 'Response submitted successfully');
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting response:', error);
      Alert.alert('Error', 'Failed to submit response. Please try again.');
    }
  };

  const updateFormData = (field: keyof SubmitResponseInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleDiamondSelection = (diamondId: string) => {
    const currentDiamonds = formData.proposedDiamonds || [];
    const newDiamonds = currentDiamonds.includes(diamondId)
      ? currentDiamonds.filter(id => id !== diamondId)
      : [...currentDiamonds, diamondId];
    
    updateFormData('proposedDiamonds', newDiamonds);
    
    // Clear diamonds error when user selects diamonds
    if (errors.diamonds && newDiamonds.length > 0) {
      setErrors(prev => ({ ...prev, diamonds: '' }));
    }
  };

  const selectedDiamonds = diamonds.filter(d => 
    formData.proposedDiamonds?.includes(d.id)
  );

  const totalSelectedValue = selectedDiamonds.reduce((sum, diamond) => 
    sum + diamond.totalPrice, 0
  );

  return (
    <ScrollView flex={1} padding="$4">
      <YStack space="$4">
        {/* Header */}
        <YStack space="$2">
          <Text fontSize="$6" fontWeight="bold" color="$color">
            Submit Response
          </Text>
          <Text fontSize="$4" color="$gray10">
            Propose diamonds and pricing for this request
          </Text>
        </YStack>

        {/* Message */}
        <YStack space="$2">
          <Label htmlFor="message">Message *</Label>
          <TextArea
            id="message"
            placeholder="Describe your proposal and why these diamonds are perfect for the request..."
            value={formData.message}
            onChangeText={(text) => updateFormData('message', text)}
            minHeight={100}
            borderColor={errors.message ? '$red10' : '$borderColor'}
          />
          {errors.message && <Text color="$red10" fontSize="$2">{errors.message}</Text>}
        </YStack>

        {/* Diamond Selection */}
        <YStack space="$2">
          <XStack justifyContent="space-between" alignItems="center">
            <Label>Select Diamonds *</Label>
            {formData.proposedDiamonds && formData.proposedDiamonds.length > 0 && (
              <Text fontSize="$3" color="$blue9">
                {formData.proposedDiamonds.length} selected
              </Text>
            )}
          </XStack>

          {errors.diamonds && <Text color="$red10" fontSize="$2">{errors.diamonds}</Text>}

          {diamondsLoading ? (
            <Text fontSize="$4" color="$gray10" textAlign="center" padding="$4">
              Loading diamonds...
            </Text>
          ) : diamonds.length === 0 ? (
            <Card bordered padding="$4">
              <YStack alignItems="center" space="$2">
                <Diamond size={32} color="$gray10" />
                <Text fontSize="$4" color="$gray10" textAlign="center">
                  No diamonds available
                </Text>
                <Text fontSize="$3" color="$gray9" textAlign="center">
                  Add diamonds to your inventory to propose them in responses
                </Text>
              </YStack>
            </Card>
          ) : (
            <YStack space="$2" maxHeight={300}>
              <FlatList
                data={diamonds}
                renderItem={({ item }) => (
                  <DiamondSelectionItem
                    diamond={item}
                    isSelected={formData.proposedDiamonds?.includes(item.id) || false}
                    onToggle={toggleDiamondSelection}
                  />
                )}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={true}
              />
            </YStack>
          )}
        </YStack>

        {/* Selected Diamonds Summary */}
        {selectedDiamonds.length > 0 && (
          <Card elevate bordered>
            <Card.Header padded>
              <Text fontSize="$5" fontWeight="600" color="$color">
                Selected Diamonds ({selectedDiamonds.length})
              </Text>
            </Card.Header>
            <Card.Footer padded>
              <YStack space="$2">
                {selectedDiamonds.map((diamond) => (
                  <XStack key={diamond.id} justifyContent="space-between" alignItems="center">
                    <Text fontSize="$3" color="$color">
                      {diamond.name || `${diamond.carat}ct ${diamond.shape}`}
                    </Text>
                    <Text fontSize="$3" fontWeight="500" color="$green9">
                      ${diamond.totalPrice.toLocaleString()}
                    </Text>
                  </XStack>
                ))}
                <XStack justifyContent="space-between" alignItems="center" paddingTop="$2" borderTopWidth={1} borderTopColor="$borderColor">
                  <Text fontSize="$4" fontWeight="600" color="$color">
                    Total Value:
                  </Text>
                  <Text fontSize="$4" fontWeight="600" color="$green9">
                    ${totalSelectedValue.toLocaleString()}
                  </Text>
                </XStack>
              </YStack>
            </Card.Footer>
          </Card>
        )}

        {/* Proposed Price */}
        <YStack space="$2">
          <Label htmlFor="proposedPrice">Proposed Price (Optional)</Label>
          <XStack space="$2" alignItems="center">
            <Text fontSize="$4" color="$gray10">{formData.currency}</Text>
            <Input
              id="proposedPrice"
              flex={1}
              placeholder="Enter your proposed price"
              value={formData.proposedPrice?.toString() || ''}
              onChangeText={(text) => updateFormData('proposedPrice', text ? parseFloat(text) : undefined)}
              keyboardType="decimal-pad"
            />
          </XStack>
          <Text fontSize="$2" color="$gray9">
            Leave empty to use individual diamond prices
          </Text>
        </YStack>

        {/* Action Buttons */}
        <XStack space="$3" marginTop="$4">
          <Button
            flex={1}
            variant="outlined"
            onPress={onCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            flex={1}
            backgroundColor="$blue9"
            color="white"
            icon={Check}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Response'}
          </Button>
        </XStack>
      </YStack>
    </ScrollView>
  );
}