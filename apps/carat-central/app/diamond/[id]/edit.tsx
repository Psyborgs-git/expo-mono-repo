import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, YStack, XStack, Paragraph, Button, ScrollView } from 'tamagui';
import { ArrowLeft, Save, AlertTriangle } from '@tamagui/lucide-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { AuthGuard } from '../../../components/auth/AuthGuard';
import { Toast, Loading, ConfirmDialog } from '@bdt/components';
import {
  EditDiamondForm,
  EditDiamondFormRef,
} from '../../../components/diamond/EditDiamondForm';
import { useUpdateDiamond } from '../../../hooks/useUpdateDiamond';
import { useDiamond } from '../../../hooks/useDiamond';
import { UpdateDiamondInput } from '../../../src/generated/graphql';

// Header component
const EditDiamondHeader: React.FC<{
  onBack: () => void;
  onSave: () => void;
  loading: boolean;
  hasChanges: boolean;
  diamondName?: string | null;
}> = ({ onBack, onSave, loading, hasChanges, diamondName }) => (
  <XStack
    alignItems='center'
    justifyContent='space-between'
    paddingHorizontal='$4'
    paddingVertical='$3'
    backgroundColor='$background'
    borderBottomWidth={1}
    borderBottomColor='$gray6'
  >
    <XStack alignItems='center' gap='$3' flex={1}>
      <Button
        size='$3'
        variant='outlined'
        circular
        onPress={onBack}
        disabled={loading}
      >
        <ArrowLeft size={20} />
      </Button>

      <YStack flex={1}>
        <Paragraph fontSize='$6' fontWeight='bold' color='$gray12'>
          Edit Diamond
        </Paragraph>
        {diamondName && (
          <Paragraph fontSize='$3' color='$gray11' numberOfLines={1}>
            {diamondName}
          </Paragraph>
        )}
      </YStack>
    </XStack>

    <XStack alignItems='center' gap='$2'>
      {hasChanges && (
        <XStack alignItems='center' gap='$1'>
          <AlertTriangle size={14} color='$orange10' />
          <Paragraph fontSize='$2' color='orange'>
            Unsaved
          </Paragraph>
        </XStack>
      )}

      <Button
        size='$3'
        onPress={onSave}
        disabled={loading || !hasChanges}
        backgroundColor={hasChanges ? 'blue' : 'gray'}
      >
        <Save size={16} />
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </XStack>
  </XStack>
);

// Error state component
const ErrorState: React.FC<{
  error: string;
  onRetry: () => void;
  onBack: () => void;
}> = ({ error, onRetry, onBack }) => (
  <YStack
    flex={1}
    justifyContent='center'
    alignItems='center'
    paddingHorizontal='$6'
    gap='$4'
  >
    <Paragraph fontSize='$5' color='red' textAlign='center'>
      Error Loading Diamond
    </Paragraph>
    <Paragraph fontSize='$3' color='$gray11' textAlign='center'>
      {error}
    </Paragraph>
    <XStack gap='$3'>
      <Button variant='outlined' onPress={onBack}>
        Go Back
      </Button>
      <Button onPress={onRetry}>Try Again</Button>
    </XStack>
  </YStack>
);

export default function EditDiamondScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const formRef = useRef<EditDiamondFormRef>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showUnsavedChangesAlert, setShowUnsavedChangesAlert] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Hooks
  const {
    diamond,
    loading: diamondLoading,
    error: diamondError,
    refetch,
  } = useDiamond(id);
  const {
    updateDiamond,
    loading: updateLoading,
    error: updateError,
    success,
    reset,
  } = useUpdateDiamond();

  // Check for unsaved changes periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (formRef.current) {
        setHasUnsavedChanges(formRef.current.hasChanges());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle success
  useEffect(() => {
    if (success) {
      setToastMessage('Diamond updated successfully!');
      setToastType('success');
      setHasUnsavedChanges(false);

      // Navigate back after a short delay
      setTimeout(() => {
        router.back();
      }, 1500);
    }
  }, [success]);

  // Handle update error
  useEffect(() => {
    if (updateError) {
      setToastMessage(updateError);
      setToastType('error');
    }
  }, [updateError]);

  // Handle back navigation with unsaved changes check
  const handleBack = useCallback(() => {
    if (updateLoading) return;

    if (hasUnsavedChanges) {
      setShowUnsavedChangesAlert(true);
    } else {
      router.back();
    }
  }, [updateLoading, hasUnsavedChanges]);

  // Handle save action
  const handleSave = useCallback(async () => {
    if (formRef.current && diamond) {
      await formRef.current.submit();
    }
  }, [diamond]);

  // Handle form submission
  const handleFormSubmit = useCallback(
    async (formData: UpdateDiamondInput) => {
      if (!diamond) return;

      await updateDiamond(diamond.id, formData);
    },
    [diamond, updateDiamond]
  );

  // Handle toast dismiss
  const handleToastDismiss = useCallback(() => {
    setToastMessage(null);
    reset(); // Reset the hook state
  }, [reset]);

  // Handle unsaved changes alert
  const handleDiscardChanges = useCallback(() => {
    setShowUnsavedChangesAlert(false);
    setHasUnsavedChanges(false);
    router.back();
  }, []);

  const handleCancelDiscard = useCallback(() => {
    setShowUnsavedChangesAlert(false);
  }, []);

  // Loading state
  if (diamondLoading) {
    return (
      <AuthGuard requireOrganization={true}>
        <View flex={1} backgroundColor='$background'>
          <EditDiamondHeader
            onBack={handleBack}
            onSave={handleSave}
            loading={true}
            hasChanges={false}
          />

          <YStack flex={1} justifyContent='center' alignItems='center'>
            <Loading size='large' />
            <Paragraph color='$gray11' marginTop='$3'>
              Loading diamond...
            </Paragraph>
          </YStack>
        </View>
      </AuthGuard>
    );
  }

  // Error state
  if (diamondError || !diamond) {
    return (
      <AuthGuard requireOrganization={true}>
        <View flex={1} backgroundColor='$background'>
          <EditDiamondHeader
            onBack={() => router.back()}
            onSave={handleSave}
            loading={false}
            hasChanges={false}
          />

          <ErrorState
            error={diamondError || 'Diamond not found'}
            onRetry={refetch}
            onBack={() => router.back()}
          />
        </View>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireOrganization={true}>
      <View flex={1} backgroundColor='$background'>
        {/* Header */}
        <EditDiamondHeader
          onBack={handleBack}
          onSave={handleSave}
          loading={updateLoading}
          hasChanges={hasUnsavedChanges}
          diamondName={diamond.name || diamond.stockNumber || null}
        />

        {/* Form */}
        <ScrollView flex={1}>
          <EditDiamondForm
            ref={formRef}
            diamond={diamond}
            onSubmit={handleFormSubmit}
            onRefresh={refetch}
          />
        </ScrollView>

        {/* Toast */}
        {toastMessage && (
          <Toast
            variant={toastType}
            message={toastMessage}
            onDismiss={handleToastDismiss}
            duration={toastType === 'success' ? 3000 : 5000}
          />
        )}

        {/* Unsaved Changes Alert */}
        {showUnsavedChangesAlert && (
          <ConfirmDialog
            title='Unsaved Changes'
            message='You have unsaved changes. Are you sure you want to leave without saving?'
            confirmText='Discard Changes'
            cancelText='Cancel'
            confirmStyle='destructive'
            visible={showUnsavedChangesAlert}
            onConfirm={handleDiscardChanges}
            onCancel={handleCancelDiscard}
          />
        )}
      </View>
    </AuthGuard>
  );
}
