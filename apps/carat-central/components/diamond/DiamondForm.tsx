import React, {
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { YStack, XStack, Paragraph, H4, Switch } from 'tamagui';

import TextInput from '../ui/TextInput';
import Select from '../ui/Select';
import CaratInput from '../ui/CaratInput';
import PriceInput from '../ui/PriceInput';
import {
  CreateDiamondInput,
  ClarityGrade,
  ColorGrade,
  CutGrade,
  DiamondShape,
} from '../../src/generated/graphql';

// Form validation errors
export interface DiamondFormErrors {
  name?: string;
  stockNumber?: string;
  carat?: string;
  clarity?: string;
  color?: string;
  cut?: string;
  shape?: string;
  pricePerCarat?: string;
  totalPrice?: string;
  certificate?: string;
  certificateNumber?: string;
}

// Diamond form props
export interface DiamondFormProps {
  initialData?: Partial<CreateDiamondInput>;
  onSubmit: (data: CreateDiamondInput) => Promise<void> | void;
  loading?: boolean;
  mode: 'create' | 'edit';
}

// Form ref interface
export interface DiamondFormRef {
  submit: () => Promise<void>;
  validate: () => boolean;
  reset: () => void;
}

// Validation rules
const validateForm = (data: Partial<CreateDiamondInput>): DiamondFormErrors => {
  const errors: DiamondFormErrors = {};

  if (!data.stockNumber?.trim()) {
    errors.stockNumber = 'Stock number is required';
  } else if (data.stockNumber.length < 3) {
    errors.stockNumber = 'Stock number must be at least 3 characters';
  }

  if (!data.carat || data.carat <= 0) {
    errors.carat = 'Carat must be greater than 0';
  } else if (data.carat > 50) {
    errors.carat = 'Carat seems unusually high (max 50)';
  }

  if (!data.clarity) {
    errors.clarity = 'Clarity is required';
  }

  if (!data.color) {
    errors.color = 'Color is required';
  }

  if (!data.cut) {
    errors.cut = 'Cut is required';
  }

  if (!data.shape) {
    errors.shape = 'Shape is required';
  }

  if (!data.pricePerCarat || data.pricePerCarat <= 0) {
    errors.pricePerCarat = 'Price per carat must be greater than 0';
  } else if (data.pricePerCarat > 1000000) {
    errors.pricePerCarat = 'Price per carat seems unusually high';
  }

  if (data.certificate && !data.certificateNumber?.trim()) {
    errors.certificateNumber =
      'Certificate number is required when certificate is specified';
  }

  return errors;
};

// Generate stock number
const generateStockNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `DM${timestamp}${random}`;
};

// Select options
const clarityOptions = [
  { value: 'FL', label: 'FL (Flawless)' },
  { value: 'IF', label: 'IF (Internally Flawless)' },
  { value: 'VVS1', label: 'VVS1 (Very Very Slightly Included 1)' },
  { value: 'VVS2', label: 'VVS2 (Very Very Slightly Included 2)' },
  { value: 'VS1', label: 'VS1 (Very Slightly Included 1)' },
  { value: 'VS2', label: 'VS2 (Very Slightly Included 2)' },
  { value: 'SI1', label: 'SI1 (Slightly Included 1)' },
  { value: 'SI2', label: 'SI2 (Slightly Included 2)' },
  { value: 'I1', label: 'I1 (Included 1)' },
];

const colorOptions = [
  { value: 'D', label: 'D (Colorless)' },
  { value: 'E', label: 'E (Colorless)' },
  { value: 'F', label: 'F (Colorless)' },
  { value: 'G', label: 'G (Near Colorless)' },
  { value: 'H', label: 'H (Near Colorless)' },
  { value: 'I', label: 'I (Near Colorless)' },
  { value: 'J', label: 'J (Near Colorless)' },
  { value: 'K', label: 'K (Faint Yellow)' },
];

const cutOptions = [
  { value: 'IDEAL', label: 'Ideal' },
  { value: 'EXCELLENT', label: 'Excellent' },
  { value: 'VERY_GOOD', label: 'Very Good' },
  { value: 'GOOD', label: 'Good' },
  { value: 'FAIR', label: 'Fair' },
  { value: 'POOR', label: 'Poor' },
];

const shapeOptions = [
  { value: 'ROUND', label: 'Round' },
  { value: 'PRINCESS', label: 'Princess' },
  { value: 'EMERALD', label: 'Emerald' },
  { value: 'CUSHION', label: 'Cushion' },
  { value: 'OVAL', label: 'Oval' },
];

const certificateOptions = [
  { value: '', label: 'No Certificate' },
  { value: 'GIA', label: 'GIA' },
  { value: 'AGS', label: 'AGS' },
  { value: 'EGL', label: 'EGL' },
  { value: 'GCAL', label: 'GCAL' },
  { value: 'Other', label: 'Other' },
];

// Main DiamondForm component
export const DiamondForm = forwardRef<DiamondFormRef, DiamondFormProps>(
  ({ initialData = {}, onSubmit, mode }, ref) => {
    const [formData, setFormData] = useState<Partial<CreateDiamondInput>>({
      name: '',
      stockNumber: mode === 'create' ? generateStockNumber() : '',
      carat: 1.0,
      clarity: 'VS1' as ClarityGrade,
      color: 'G' as ColorGrade,
      cut: 'EXCELLENT' as CutGrade,
      shape: 'ROUND' as DiamondShape,
      pricePerCarat: 5000,
      totalPrice: 5000,
      certificate: '',
      certificateNumber: '',
      isPublic: false,
      ...initialData,
    });

    const [errors, setErrors] = useState<DiamondFormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Update form field
    const updateField = useCallback(
      (field: keyof CreateDiamondInput, value: string | number | boolean) => {
        setFormData(prev => {
          const updated = { ...prev, [field]: value };

          // Auto-calculate total price when carat or pricePerCarat changes
          if (field === 'carat' || field === 'pricePerCarat') {
            const carat =
              field === 'carat' ? Number(value) : Number(updated.carat) || 0;
            const pricePerCarat =
              field === 'pricePerCarat'
                ? Number(value)
                : Number(updated.pricePerCarat) || 0;
            updated.totalPrice = carat * pricePerCarat;
          }

          return updated;
        });

        // Clear error when user starts typing
        if (errors[field as keyof DiamondFormErrors]) {
          setErrors(prev => ({ ...prev, [field]: undefined }));
        }
      },
      [errors]
    );

    // Mark field as touched
    const markTouched = useCallback((field: keyof CreateDiamondInput) => {
      setTouched(prev => ({ ...prev, [field]: true }));
    }, []);

    // Validate form
    const validateFormData = useCallback((): boolean => {
      const validationErrors = validateForm(formData);
      setErrors(validationErrors);
      return Object.keys(validationErrors).length === 0;
    }, [formData]);

    // Handle form submission
    const handleSubmit = useCallback(async () => {
      // Mark all fields as touched
      const allFields = Object.keys(formData) as (keyof CreateDiamondInput)[];
      setTouched(
        allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {})
      );

      if (validateFormData()) {
        try {
          await onSubmit(formData as CreateDiamondInput);
        } catch (error) {
          console.error('Form submission error:', error);
        }
      }
    }, [formData, onSubmit, validateFormData]);

    // Reset form
    const resetForm = useCallback(() => {
      setFormData({
        name: '',
        stockNumber: mode === 'create' ? generateStockNumber() : '',
        carat: 1.0,
        clarity: 'VS1' as ClarityGrade,
        color: 'G' as ColorGrade,
        cut: 'EXCELLENT' as CutGrade,
        shape: 'ROUND' as DiamondShape,
        pricePerCarat: 5000,
        totalPrice: 5000,
        certificate: '',
        certificateNumber: '',
        isPublic: false,
      });
      setErrors({});
      setTouched({});
    }, [mode]);

    // Expose methods via ref
    useImperativeHandle(
      ref,
      () => ({
        submit: handleSubmit,
        validate: validateFormData,
        reset: resetForm,
      }),
      [handleSubmit, validateFormData, resetForm]
    );

    return (
      <YStack padding='$4' gap='$4'>
        {/* Basic Information */}
        <YStack gap='$3'>
          <H4 fontSize='$5' fontWeight='600'>
            Basic Information
          </H4>

          <TextInput
            label='Stock Number'
            value={formData.stockNumber || ''}
            onChangeText={(value: string) => updateField('stockNumber', value)}
            onBlur={() => markTouched('stockNumber')}
            placeholder='Enter stock number'
            autoCapitalize='characters'
            error={
              touched.stockNumber && errors.stockNumber
                ? errors.stockNumber
                : ''
            }
            required
          />

          <TextInput
            label='Diamond Name (Optional)'
            value={formData.name || ''}
            onChangeText={(value: string) => updateField('name', value)}
            placeholder='Enter diamond name'
            hint='A descriptive name for this diamond'
          />
        </YStack>

        {/* Diamond Specifications */}
        <YStack gap='$3'>
          <H4 fontSize='$5' fontWeight='600'>
            Specifications
          </H4>

          <XStack gap='$3'>
            <YStack flex={1}>
              <CaratInput
                label='Carat'
                value={formData.carat || 0}
                onValueChange={(value: number) => updateField('carat', value)}
                onBlur={() => markTouched('carat')}
                error={touched.carat && errors.carat ? errors.carat : ''}
                required
              />
            </YStack>

            <YStack flex={1}>
              <Select
                label='Shape'
                options={shapeOptions}
                value={formData.shape || ''}
                onValueChange={(value: string) =>
                  updateField('shape', value as DiamondShape)
                }
                error={touched.shape && errors.shape ? errors.shape : ''}
                required
              />
            </YStack>
          </XStack>

          <XStack gap='$3'>
            <YStack flex={1}>
              <Select
                label='Clarity'
                options={clarityOptions}
                value={formData.clarity || ''}
                onValueChange={(value: string) =>
                  updateField('clarity', value as ClarityGrade)
                }
                error={touched.clarity && errors.clarity ? errors.clarity : ''}
                required
              />
            </YStack>

            <YStack flex={1}>
              <Select
                label='Color'
                options={colorOptions}
                value={formData.color || ''}
                onValueChange={(value: string) =>
                  updateField('color', value as ColorGrade)
                }
                error={touched.color && errors.color ? errors.color : ''}
                required
              />
            </YStack>
          </XStack>

          <Select
            label='Cut'
            options={cutOptions}
            value={formData.cut || ''}
            onValueChange={(value: string) =>
              updateField('cut', value as CutGrade)
            }
            error={touched.cut && errors.cut ? errors.cut : ''}
            required
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
            onValueChange={(value: number) =>
              updateField('pricePerCarat', value)
            }
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
            </YStack>
          )}
        </YStack>

        {/* Certificate Information */}
        <YStack gap='$3'>
          <H4 fontSize='$5' fontWeight='600'>
            Certificate (Optional)
          </H4>

          <Select
            label='Certificate Type'
            options={certificateOptions}
            value={formData.certificate || ''}
            onValueChange={(value: string) => updateField('certificate', value)}
            placeholder='Select certificate type'
          />

          {formData.certificate && (
            <TextInput
              label='Certificate Number'
              value={formData.certificateNumber || ''}
              onChangeText={(value: string) =>
                updateField('certificateNumber', value)
              }
              onBlur={() => markTouched('certificateNumber')}
              placeholder='Enter certificate number'
              error={
                touched.certificateNumber && errors.certificateNumber
                  ? errors.certificateNumber
                  : ''
              }
              required
            />
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
              <Paragraph fontSize='$3'>
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
      </YStack>
    );
  }
);

DiamondForm.displayName = 'DiamondForm';
