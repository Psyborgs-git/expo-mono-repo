import React, {
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from 'react';
import { YStack, XStack, Paragraph, H4, Switch, Button } from 'tamagui';
import { AlertTriangle, RefreshCw } from '@tamagui/lucide-icons';

import TextInput from '../ui/TextInput';
import PriceInput from '../ui/PriceInput';
import ConfirmDialog from '../ui/ConfirmDialog';
import { UpdateDiamondInput, DiamondStatus } from '../../src/generated/graphql';
import { Diamond_BasicFragment } from '../../src/graphql/diamonds/diamonds.generated';
import { useConcurrentEditDetection } from '../../hooks/useConcurrentEditDetection';

// Form validation errors
export interface EditDiamondFormErrors {
  name?: string;
  pricePerCarat?: string;
  totalPrice?: string;
}

// Diamond form props
export interface EditDiamondFormProps {
  diamond: Diamond_BasicFragment;
  onSubmit: (data: UpdateDiamondInput) => Promise<void> | void;
  onRefresh?: () => void;
}

// Form ref interface
export interface EditDiamondFormRef {
  submit: () => Promise<void>;
  validate: () => boolean;
  reset: () => void;
  hasChanges: () => boolean;
}

// Validation rules
const validateForm = (
  data: Partial<UpdateDiamondInput>
): EditDiamondFormErrors => {
  const errors: EditDiamondFormErrors = {};

  if (
    data.pricePerCarat !== undefined &&
    data.pricePerCarat !== null &&
    data.pricePerCarat <= 0
  ) {
    errors.pricePerCarat = 'Price per carat must be greater than 0';
  } else if (
    data.pricePerCarat !== undefined &&
    data.pricePerCarat !== null &&
    data.pricePerCarat > 1000000
  ) {
    errors.pricePerCarat = 'Price per carat seems unusually high';
  }

  if (
    data.totalPrice !== undefined &&
    data.totalPrice !== null &&
    data.totalPrice <= 0
  ) {
    errors.totalPrice = 'Total price must be greater than 0';
  }

  return errors;
};

// Main EditDiamondForm component
export const EditDiamondForm = forwardRef<
  EditDiamondFormRef,
  EditDiamondFormProps
>(({ diamond, onSubmit, onRefresh }, ref) => {
  const [formData, setFormData] = useState<Partial<UpdateDiamondInput>>({
    name: diamond.name || '',
    pricePerCarat: diamond.pricePerCarat,
    totalPrice: diamond.totalPrice,
    isPublic: diamond.isPublic,
    status: diamond.status,
  });

  const [errors, setErrors] = useState<EditDiamondFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showUnsavedChangesAlert, setShowUnsavedChangesAlert] = useState(false);
  const [showConflictDialog, setShowConflictDialog] = useState(false);

  // Concurrent edit detection
  const { conflictState, checkForConflicts, resolveConflict, updateLastKnown } =
    useConcurrentEditDetection(diamond);

  // Track original values for change detection
  const originalValues = {
    name: diamond.name || '',
    pricePerCarat: diamond.pricePerCarat,
    totalPrice: diamond.totalPrice,
    isPublic: diamond.isPublic,
    status: diamond.status,
  };

  // Check for concurrent edits when diamond updates
  useEffect(() => {
    if (checkForConflicts(diamond)) {
      setShowConflictDialog(true);
    } else {
      updateLastKnown(diamond);
    }
  }, [diamond.updatedAt, checkForConflicts, updateLastKnown, diamond]);

  // Update form field
  const updateField = useCallback(
    (
      field: keyof UpdateDiamondInput,
      value: string | number | boolean | DiamondStatus
    ) => {
      setFormData(prev => {
        const updated = { ...prev, [field]: value };

        // Auto-calculate total price when pricePerCarat changes
        if (field === 'pricePerCarat') {
          const pricePerCarat = Number(value);
          if (pricePerCarat > 0 && diamond.carat > 0) {
            updated.totalPrice = diamond.carat * pricePerCarat;
          }
        }

        return updated;
      });

      // Clear error when user starts typing
      if (errors[field as keyof EditDiamondFormErrors]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    },
    [errors, diamond.carat]
  );

  // Mark field as touched
  const markTouched = useCallback((field: keyof UpdateDiamondInput) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  // Check if form has changes
  const hasChanges = useCallback((): boolean => {
    return Object.keys(formData).some(key => {
      const fieldKey = key as keyof UpdateDiamondInput;
      return formData[fieldKey] !== originalValues[fieldKey];
    });
  }, [formData, originalValues]);

  // Validate form
  const validateFormData = useCallback((): boolean => {
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    // Mark all fields as touched
    const allFields = Object.keys(formData) as (keyof UpdateDiamondInput)[];
    setTouched(
      allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {})
    );

    if (validateFormData()) {
      try {
        // Only send changed fields
        const changedFields: Partial<UpdateDiamondInput> = {};
        Object.keys(formData).forEach(key => {
          const fieldKey = key as keyof UpdateDiamondInput;
          if (formData[fieldKey] !== originalValues[fieldKey]) {
            changedFields[fieldKey] = formData[fieldKey] as any;
          }
        });

        if (Object.keys(changedFields).length === 0) {
          // No changes to submit
          return;
        }

        await onSubmit(changedFields);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
  }, [formData, onSubmit, validateFormData, originalValues]);

  // Reset form to original values
  const resetForm = useCallback(() => {
    setFormData({
      name: diamond.name || '',
      pricePerCarat: diamond.pricePerCarat,
      totalPrice: diamond.totalPrice,
      isPublic: diamond.isPublic,
      status: diamond.status,
    });
    setErrors({});
    setTouched({});
  }, [diamond]);

  // Handle conflict resolution
  const handleRefreshData = useCallback(() => {
    if (onRefresh) {
      onRefresh();
    }
    resolveConflict();
    setShowConflictDialog(false);
    resetForm(); // Reset form to new data
  }, [onRefresh, resolveConflict, resetForm]);

  const handleIgnoreConflict = useCallback(() => {
    resolveConflict();
    setShowConflictDialog(false);
  }, [resolveConflict]);

  // Expose methods via ref
  useImperativeHandle(
    ref,
    () => ({
      submit: handleSubmit,
      validate: validateFormData,
      reset: resetForm,
      hasChanges,
    }),
    [handleSubmit, validateFormData, resetForm, hasChanges]
  );

  return (
    <YStack padding='$4' gap='$4'>
      {/* Concurrent Edit Warning */}
      {conflictState.hasConflict && (
        <YStack
          gap='$2'
          padding='$3'
          backgroundColor='orange'
          borderRadius='$3'
          borderWidth={1}
          borderColor='orange'
        >
          <XStack alignItems='center' gap='$2'>
            <AlertTriangle size={16} color='orange' />
            <Paragraph fontSize='$4' fontWeight='500' color='orange'>
              Concurrent Edit Detected
            </Paragraph>
          </XStack>
          <Paragraph fontSize='$3' color='orange'>
            This diamond has been modified by another user. Your changes may
            conflict with theirs.
          </Paragraph>
          <XStack gap='$2' marginTop='$2'>
            <Button size='$2' variant='outlined' onPress={handleRefreshData}>
              <RefreshCw size={14} />
              Refresh Data
            </Button>
            <Button size='$2' variant='outlined' onPress={handleIgnoreConflict}>
              Continue Editing
            </Button>
          </XStack>
        </YStack>
      )}

      {/* Read-only Diamond Information */}
      <YStack gap='$3'>
        <H4 fontSize='$5' fontWeight='600'>
          Diamond Information
        </H4>

        <YStack
          gap='$2'
          padding='$3'
          backgroundColor='$gray2'
          borderRadius='$3'
        >
          <XStack justifyContent='space-between'>
            <Paragraph fontSize='$3' color='$gray11'>
              Stock Number:
            </Paragraph>
            <Paragraph fontSize='$3' fontWeight='500'>
              {diamond.stockNumber}
            </Paragraph>
          </XStack>

          <XStack justifyContent='space-between'>
            <Paragraph fontSize='$3' color='$gray11'>
              Carat:
            </Paragraph>
            <Paragraph fontSize='$3' fontWeight='500'>
              {diamond.carat} ct
            </Paragraph>
          </XStack>

          <XStack justifyContent='space-between'>
            <Paragraph fontSize='$3' color='$gray11'>
              Shape:
            </Paragraph>
            <Paragraph fontSize='$3' fontWeight='500'>
              {diamond.shape}
            </Paragraph>
          </XStack>

          <XStack justifyContent='space-between'>
            <Paragraph fontSize='$3' color='$gray11'>
              Clarity:
            </Paragraph>
            <Paragraph fontSize='$3' fontWeight='500'>
              {diamond.clarity}
            </Paragraph>
          </XStack>

          <XStack justifyContent='space-between'>
            <Paragraph fontSize='$3' color='$gray11'>
              Color:
            </Paragraph>
            <Paragraph fontSize='$3' fontWeight='500'>
              {diamond.color}
            </Paragraph>
          </XStack>

          <XStack justifyContent='space-between'>
            <Paragraph fontSize='$3' color='$gray11'>
              Cut:
            </Paragraph>
            <Paragraph fontSize='$3' fontWeight='500'>
              {diamond.cut}
            </Paragraph>
          </XStack>

          {diamond.certificate && (
            <>
              <XStack justifyContent='space-between'>
                <Paragraph fontSize='$3' color='$gray11'>
                  Certificate:
                </Paragraph>
                <Paragraph fontSize='$3' fontWeight='500'>
                  {diamond.certificate}
                </Paragraph>
              </XStack>

              {diamond.certificateNumber && (
                <XStack justifyContent='space-between'>
                  <Paragraph fontSize='$3' color='$gray11'>
                    Certificate #:
                  </Paragraph>
                  <Paragraph fontSize='$3' fontWeight='500'>
                    {diamond.certificateNumber}
                  </Paragraph>
                </XStack>
              )}
            </>
          )}
        </YStack>

        <Paragraph fontSize='$2' color='$gray11'>
          Note: Core specifications (carat, shape, clarity, color, cut,
          certificate) cannot be modified after creation.
        </Paragraph>
      </YStack>

      {/* Editable Fields */}
      <YStack gap='$3'>
        <H4 fontSize='$5' fontWeight='600'>
          Editable Information
        </H4>

        <TextInput
          label='Diamond Name (Optional)'
          value={formData.name || ''}
          onChangeText={(value: string) => updateField('name', value)}
          onBlur={() => markTouched('name')}
          placeholder='Enter diamond name'
          hint='A descriptive name for this diamond'
        />
      </YStack>

      {/* Pricing */}
      <YStack gap='$3'>
        <H4 fontSize='$5' fontWeight='600'>
          Pricing
        </H4>

        <PriceInput
          label='Price per Carat ($)'
          value={formData.pricePerCarat || 0}
          onValueChange={(value: number) => updateField('pricePerCarat', value)}
          onBlur={() => markTouched('pricePerCarat')}
          error={
            touched.pricePerCarat && errors.pricePerCarat
              ? errors.pricePerCarat
              : ''
          }
          required
        />

        {formData.totalPrice && formData.totalPrice > 0 && (
          <YStack gap='$2'>
            <Paragraph fontSize='$4' fontWeight='500'>
              Total Price
            </Paragraph>
            <Paragraph fontSize='$6' fontWeight='600'>
              ${formData.totalPrice.toLocaleString()}
            </Paragraph>
            <Paragraph fontSize='$2' color='$gray11'>
              Calculated as {diamond.carat} ct × $
              {formData.pricePerCarat?.toLocaleString()}/ct
            </Paragraph>
          </YStack>
        )}
      </YStack>

      {/* Visibility Settings */}
      <YStack gap='$3'>
        <H4 fontSize='$5' fontWeight='600'>
          Visibility
        </H4>

        <XStack
          alignItems='center'
          justifyContent='space-between'
          paddingVertical='$2'
        >
          <YStack flex={1}>
            <Paragraph fontSize='$4' fontWeight='500'>
              Make Public
            </Paragraph>
            <Paragraph fontSize='$3' color='$gray11'>
              Allow other users to see this diamond in public listings
            </Paragraph>
          </YStack>

          <Switch
            checked={formData.isPublic || false}
            onCheckedChange={(checked: boolean) =>
              updateField('isPublic', checked)
            }
            size='$3'
          />
        </XStack>
      </YStack>

      {/* Change Summary */}
      {hasChanges() && (
        <YStack
          gap='$2'
          padding='$3'
          backgroundColor='blue'
          borderRadius='$3'
          borderWidth={1}
          borderColor='blue'
        >
          <Paragraph fontSize='$4' fontWeight='500' color='blue'>
            Pending Changes
          </Paragraph>
          <YStack gap='$1'>
            {Object.keys(formData).map(key => {
              const fieldKey = key as keyof UpdateDiamondInput;
              if (formData[fieldKey] !== originalValues[fieldKey]) {
                return (
                  <Paragraph key={key} fontSize='$3' color='blue'>
                    • {key}: {String(originalValues[fieldKey])} →{' '}
                    {String(formData[fieldKey])}
                  </Paragraph>
                );
              }
              return null;
            })}
          </YStack>
        </YStack>
      )}

      {/* Unsaved Changes Alert */}
      <ConfirmDialog
        title='Unsaved Changes'
        message='You have unsaved changes. Are you sure you want to leave without saving?'
        confirmText='Discard Changes'
        cancelText='Cancel'
        confirmStyle='destructive'
        visible={showUnsavedChangesAlert}
        onConfirm={resetForm}
        onCancel={() => setShowUnsavedChangesAlert(false)}
      />

      {/* Concurrent Edit Conflict Dialog */}
      <ConfirmDialog
        title='Concurrent Edit Detected'
        message='Another user has modified this diamond while you were editing. Do you want to refresh the data and lose your changes, or continue with your edits?'
        confirmText='Refresh Data'
        cancelText='Continue Editing'
        confirmStyle='destructive'
        visible={showConflictDialog}
        onConfirm={handleRefreshData}
        onCancel={handleIgnoreConflict}
      />
    </YStack>
  );
});

EditDiamondForm.displayName = 'EditDiamondForm';
