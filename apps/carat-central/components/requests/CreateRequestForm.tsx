import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  Button,
  Input,
  TextArea,
  Switch,
  Label,
  Select,
  Adapt,
  Sheet,
  ScrollView,
} from 'tamagui';
import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import { Alert } from 'react-native';
import { useCreateRequest } from '../../hooks/useCreateRequest';
import { CreateRequestInput } from '../../src/generated/graphql';

interface CreateRequestFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const DIAMOND_SHAPES = [
  { value: 'ROUND', label: 'Round' },
  { value: 'PRINCESS', label: 'Princess' },
  { value: 'CUSHION', label: 'Cushion' },
  { value: 'EMERALD', label: 'Emerald' },
  { value: 'OVAL', label: 'Oval' },
];

const CLARITY_GRADES = [
  { value: 'FL', label: 'FL (Flawless)' },
  { value: 'IF', label: 'IF (Internally Flawless)' },
  { value: 'VVS1', label: 'VVS1' },
  { value: 'VVS2', label: 'VVS2' },
  { value: 'VS1', label: 'VS1' },
  { value: 'VS2', label: 'VS2' },
  { value: 'SI1', label: 'SI1' },
  { value: 'SI2', label: 'SI2' },
  { value: 'I1', label: 'I1' },
];

const COLOR_GRADES = [
  { value: 'D', label: 'D (Colorless)' },
  { value: 'E', label: 'E' },
  { value: 'F', label: 'F' },
  { value: 'G', label: 'G' },
  { value: 'H', label: 'H' },
  { value: 'I', label: 'I' },
  { value: 'J', label: 'J' },
  { value: 'K', label: 'K' },
];

const CUT_GRADES = [
  { value: 'IDEAL', label: 'Ideal' },
  { value: 'EXCELLENT', label: 'Excellent' },
  { value: 'VERY_GOOD', label: 'Very Good' },
  { value: 'GOOD', label: 'Good' },
  { value: 'FAIR', label: 'Fair' },
  { value: 'POOR', label: 'Poor' },
];

export function CreateRequestForm({ onSuccess, onCancel }: CreateRequestFormProps) {
  const [formData, setFormData] = useState<Partial<CreateRequestInput>>({
    title: '',
    description: '',
    isPublic: false,
    minCarat: undefined,
    maxCarat: undefined,
    minBudget: undefined,
    maxBudget: undefined,
    currency: 'USD',
    shapes: [],
    clarityGrades: [],
    colorGrades: [],
    cutGrades: [],
    certificates: [],
    tags: [],
    expiresAt: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { createRequest, loading } = useCreateRequest();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.minCarat && formData.maxCarat && formData.minCarat > formData.maxCarat) {
      newErrors.caratRange = 'Minimum carat cannot be greater than maximum carat';
    }

    if (formData.minBudget && formData.maxBudget && formData.minBudget > formData.maxBudget) {
      newErrors.budgetRange = 'Minimum budget cannot be greater than maximum budget';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await createRequest({
        variables: {
          input: {
            title: formData.title!,
            description: formData.description || undefined,
            isPublic: formData.isPublic || false,
            minCarat: formData.minCarat || undefined,
            maxCarat: formData.maxCarat || undefined,
            minBudget: formData.minBudget || undefined,
            maxBudget: formData.maxBudget || undefined,
            currency: formData.currency || 'USD',
            shapes: formData.shapes || [],
            clarityGrades: formData.clarityGrades || [],
            colorGrades: formData.colorGrades || [],
            cutGrades: formData.cutGrades || [],
            certificates: formData.certificates || [],
            tags: formData.tags || [],
            expiresAt: formData.expiresAt || undefined,
          },
        },
      });

      Alert.alert('Success', 'Request created successfully');
      onSuccess?.();
    } catch (error) {
      console.error('Error creating request:', error);
      Alert.alert('Error', 'Failed to create request. Please try again.');
    }
  };

  const updateFormData = (field: keyof CreateRequestInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleArrayValue = (field: keyof CreateRequestInput, value: string) => {
    const currentArray = (formData[field] as string[]) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFormData(field, newArray);
  };

  const formatExpirationDate = (date: Date): string => {
    return date.toISOString();
  };

  const getExpirationOptions = () => {
    const now = new Date();
    return [
      { value: formatExpirationDate(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)), label: '1 Week' },
      { value: formatExpirationDate(new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)), label: '1 Month' },
      { value: formatExpirationDate(new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)), label: '3 Months' },
      { value: formatExpirationDate(new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000)), label: '6 Months' },
    ];
  };

  return (
    <ScrollView flex={1} padding="$4">
      <YStack space="$4">
        {/* Title */}
        <YStack space="$2">
          <Label htmlFor="title">Request Title *</Label>
          <Input
            id="title"
            placeholder="e.g., Looking for 1-2ct Round Diamond"
            value={formData.title}
            onChangeText={(text) => updateFormData('title', text)}
            borderColor={errors.title ? '$red10' : '$borderColor'}
          />
          {errors.title && <Text color="$red10" fontSize="$2">{errors.title}</Text>}
        </YStack>

        {/* Description */}
        <YStack space="$2">
          <Label htmlFor="description">Description</Label>
          <TextArea
            id="description"
            placeholder="Describe your specific requirements..."
            value={formData.description}
            onChangeText={(text) => updateFormData('description', text)}
            minHeight={80}
          />
        </YStack>

        {/* Carat Range */}
        <YStack space="$2">
          <Label>Carat Range</Label>
          <XStack space="$2" alignItems="center">
            <Input
              flex={1}
              placeholder="Min carat"
              value={formData.minCarat?.toString() || ''}
              onChangeText={(text) => updateFormData('minCarat', text ? parseFloat(text) : undefined)}
              keyboardType="decimal-pad"
            />
            <Text>to</Text>
            <Input
              flex={1}
              placeholder="Max carat"
              value={formData.maxCarat?.toString() || ''}
              onChangeText={(text) => updateFormData('maxCarat', text ? parseFloat(text) : undefined)}
              keyboardType="decimal-pad"
            />
          </XStack>
          {errors.caratRange && <Text color="$red10" fontSize="$2">{errors.caratRange}</Text>}
        </YStack>

        {/* Budget Range */}
        <YStack space="$2">
          <Label>Budget Range ({formData.currency})</Label>
          <XStack space="$2" alignItems="center">
            <Input
              flex={1}
              placeholder="Min budget"
              value={formData.minBudget?.toString() || ''}
              onChangeText={(text) => updateFormData('minBudget', text ? parseFloat(text) : undefined)}
              keyboardType="decimal-pad"
            />
            <Text>to</Text>
            <Input
              flex={1}
              placeholder="Max budget"
              value={formData.maxBudget?.toString() || ''}
              onChangeText={(text) => updateFormData('maxBudget', text ? parseFloat(text) : undefined)}
              keyboardType="decimal-pad"
            />
          </XStack>
          {errors.budgetRange && <Text color="$red10" fontSize="$2">{errors.budgetRange}</Text>}
        </YStack>

        {/* Diamond Shapes */}
        <YStack space="$2">
          <Label>Preferred Shapes</Label>
          <XStack flexWrap="wrap" gap="$2">
            {DIAMOND_SHAPES.map((shape) => (
              <Button
                key={shape.value}
                size="$3"
                variant={formData.shapes?.includes(shape.value) ? 'outlined' : 'ghost'}
                backgroundColor={formData.shapes?.includes(shape.value) ? '$blue2' : 'transparent'}
                borderColor={formData.shapes?.includes(shape.value) ? '$blue8' : '$borderColor'}
                onPress={() => toggleArrayValue('shapes', shape.value)}
              >
                {shape.label}
              </Button>
            ))}
          </XStack>
        </YStack>

        {/* Clarity Grades */}
        <YStack space="$2">
          <Label>Acceptable Clarity Grades</Label>
          <XStack flexWrap="wrap" gap="$2">
            {CLARITY_GRADES.map((clarity) => (
              <Button
                key={clarity.value}
                size="$3"
                variant={formData.clarityGrades?.includes(clarity.value) ? 'outlined' : 'ghost'}
                backgroundColor={formData.clarityGrades?.includes(clarity.value) ? '$blue2' : 'transparent'}
                borderColor={formData.clarityGrades?.includes(clarity.value) ? '$blue8' : '$borderColor'}
                onPress={() => toggleArrayValue('clarityGrades', clarity.value)}
              >
                {clarity.label}
              </Button>
            ))}
          </XStack>
        </YStack>

        {/* Color Grades */}
        <YStack space="$2">
          <Label>Acceptable Color Grades</Label>
          <XStack flexWrap="wrap" gap="$2">
            {COLOR_GRADES.map((color) => (
              <Button
                key={color.value}
                size="$3"
                variant={formData.colorGrades?.includes(color.value) ? 'outlined' : 'ghost'}
                backgroundColor={formData.colorGrades?.includes(color.value) ? '$blue2' : 'transparent'}
                borderColor={formData.colorGrades?.includes(color.value) ? '$blue8' : '$borderColor'}
                onPress={() => toggleArrayValue('colorGrades', color.value)}
              >
                {color.label}
              </Button>
            ))}
          </XStack>
        </YStack>

        {/* Cut Grades */}
        <YStack space="$2">
          <Label>Acceptable Cut Grades</Label>
          <XStack flexWrap="wrap" gap="$2">
            {CUT_GRADES.map((cut) => (
              <Button
                key={cut.value}
                size="$3"
                variant={formData.cutGrades?.includes(cut.value) ? 'outlined' : 'ghost'}
                backgroundColor={formData.cutGrades?.includes(cut.value) ? '$blue2' : 'transparent'}
                borderColor={formData.cutGrades?.includes(cut.value) ? '$blue8' : '$borderColor'}
                onPress={() => toggleArrayValue('cutGrades', cut.value)}
              >
                {cut.label}
              </Button>
            ))}
          </XStack>
        </YStack>

        {/* Expiration Date */}
        <YStack space="$2">
          <Label>Request Expiration</Label>
          <Select
            value={formData.expiresAt}
            onValueChange={(value) => updateFormData('expiresAt', value)}
          >
            <Select.Trigger width="100%" iconAfter={ChevronDown}>
              <Select.Value placeholder="Select expiration period" />
            </Select.Trigger>

            <Adapt when="sm" platform="touch">
              <Sheet modal dismissOnSnapToBottom>
                <Sheet.Frame>
                  <Sheet.ScrollView>
                    <Adapt.Contents />
                  </Sheet.ScrollView>
                </Sheet.Frame>
                <Sheet.Overlay />
              </Sheet>
            </Adapt>

            <Select.Content zIndex={200000}>
              <Select.ScrollUpButton
                alignItems="center"
                justifyContent="center"
                position="relative"
                width="100%"
                height="$3"
              >
                <ChevronUp size={20} />
              </Select.ScrollUpButton>

              <Select.Viewport minHeight={200}>
                <Select.Group>
                  <Select.Label>Expiration Period</Select.Label>
                  {getExpirationOptions().map((option, i) => (
                    <Select.Item index={i} key={option.value} value={option.value}>
                      <Select.ItemText>{option.label}</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <Check size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Viewport>

              <Select.ScrollDownButton
                alignItems="center"
                justifyContent="center"
                position="relative"
                width="100%"
                height="$3"
              >
                <ChevronDown size={20} />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select>
        </YStack>

        {/* Public/Private Toggle */}
        <XStack space="$3" alignItems="center">
          <Switch
            id="isPublic"
            checked={formData.isPublic}
            onCheckedChange={(checked) => updateFormData('isPublic', checked)}
          />
          <Label htmlFor="isPublic" flex={1}>
            Make this request public (visible to all sellers)
          </Label>
        </XStack>

        {/* Action Buttons */}
        <XStack space="$3" marginTop="$4">
          <Button
            flex={1}
            variant="outlined"
            onPress={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            flex={1}
            backgroundColor="$blue9"
            color="white"
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Request'}
          </Button>
        </XStack>
      </YStack>
    </ScrollView>
  );
}