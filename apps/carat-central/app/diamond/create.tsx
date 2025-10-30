import React, { useState, useCallback, useEffect } from 'react';
import { View, YStack, XStack, Paragraph, Button, ScrollView } from 'tamagui';
import { ArrowLeft, Save } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { AuthGuard } from '../../components/auth/AuthGuard';
import { Toast } from '@bdt/components';
import { DiamondForm } from '../../components/diamond/DiamondForm';
import { useCreateDiamond } from '../../hooks/useCreateDiamond';
import { CreateDiamondInput } from '../../src/generated/graphql';

// Header component
const CreateDiamondHeader: React.FC<{
  onBack: () => void;
  onSave: () => void;
  loading: boolean;
}> = ({ onBack, onSave, loading }) => (
  <XStack
    alignItems='center'
    justifyContent='space-between'
    paddingHorizontal='$4'
    paddingVertical='$3'
    backgroundColor='$background'
    borderBottomWidth={1}
    borderBottomColor='$borderColor'
  >
    <XStack alignItems='center' gap='$3'>
      <Button
        size='$3'
        variant='ghost'
        circular
        onPress={onBack}
        disabled={loading}
      >
        <ArrowLeft size={20} />
      </Button>

      <Paragraph fontSize='$6' fontWeight='bold' color='$colorStrong'>
        Add Diamond
      </Paragraph>
    </XStack>

    <Button
      size='$3'
      onPress={onSave}
      disabled={loading}
      backgroundColor='$primary'
    >
      <Save size={16} />
      {loading ? 'Saving...' : 'Save'}
    </Button>
  </XStack>
);

export default function CreateDiamondScreen() {
  const [formRef, setFormRef] = useState<{
    submit: () => Promise<void>;
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const { createDiamond, loading, error, success, reset } = useCreateDiamond();

  // Handle success
  useEffect(() => {
    if (success) {
      setToastMessage('Diamond created successfully!');
      setToastType('success');

      // Navigate back to inventory after a short delay
      setTimeout(() => {
        router.back();
      }, 1500);
    }
  }, [success]);

  // Handle error
  useEffect(() => {
    if (error) {
      setToastMessage(error);
      setToastType('error');
    }
  }, [error]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (loading) return;
    router.back();
  }, [loading]);

  // Handle save action
  const handleSave = useCallback(async () => {
    if (formRef) {
      await formRef.submit();
    }
  }, [formRef]);

  // Handle form submission
  const handleFormSubmit = useCallback(
    async (formData: CreateDiamondInput) => {
      await createDiamond(formData);
    },
    [createDiamond]
  );

  // Handle toast dismiss
  const handleToastDismiss = useCallback(() => {
    setToastMessage(null);
    reset(); // Reset the hook state
  }, [reset]);

  return (
    <AuthGuard requireOrganization={true}>
      <View flex={1} backgroundColor='$background'>
        {/* Header */}
        <CreateDiamondHeader
          onBack={handleBack}
          onSave={handleSave}
          loading={loading}
        />

        {/* Form */}
        <ScrollView flex={1}>
          <DiamondForm
            ref={setFormRef}
            onSubmit={handleFormSubmit}
            loading={loading}
            mode='create'
          />
        </ScrollView>

        {/* Toast */}
        {toastMessage && (
          <Toast
            type={toastType}
            message={toastMessage}
            visible={true}
            onDismiss={handleToastDismiss}
            duration={toastType === 'success' ? 3000 : 5000}
          />
        )}
      </View>
    </AuthGuard>
  );
}
