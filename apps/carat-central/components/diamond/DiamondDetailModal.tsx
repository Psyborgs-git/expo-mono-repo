import React, { useState, useEffect } from 'react';
import { Modal } from 'react-native';
import { styled } from 'tamagui';
import { YStack, XStack, H3, H4, Paragraph, Button, ScrollView } from 'tamagui';
import { DiamondCard } from '../molecules/DiamondCard';
// Local DiamondType can be imported from generated types when available
import { useFindSimilarDiamondsLazyQuery } from '../../src/graphql/diamonds/diamonds.generated';
import type { Diamond_BasicFragment } from '../../src/graphql/diamonds/diamonds.generated';
import type { DiamondSearchResult } from '../../src/generated/graphql';

// Modal container
export const ModalContainer = styled(YStack, {
  name: 'ModalContainer',
  flex: 1,
  backgroundColor: '$background',
});

// Modal header
export const ModalHeader = styled(XStack, {
  name: 'ModalHeader',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: '$4',
  paddingVertical: '$3',
  borderBottomWidth: 1,
  borderBottomColor: '$gray5',
});

// Modal content
export const ModalContent = styled(ScrollView, {
  name: 'ModalContent',
  flex: 1,
  padding: '$4',
});

// Diamond image placeholder
export const DiamondImageContainer = styled(YStack, {
  name: 'DiamondImageContainer',
  backgroundColor: '$gray2',
  borderRadius: '$4',
  height: 200,
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '$4',
});

// Image gallery container
export const ImageGallery = styled(XStack, {
  name: 'ImageGallery',
  gap: '$2',
  marginBottom: '$4',
});

export const ImageThumbnail = styled(YStack, {
  name: 'ImageThumbnail',
  backgroundColor: '$gray3',
  borderRadius: '$2',
  width: 60,
  height: 60,
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 2,
  borderColor: '$gray3',

  variants: {
    active: {
      true: {
        borderColor: '#3b82f6',
      },
    },
  },

  pressStyle: {
    backgroundColor: '$gray4',
  },
});

// Similar diamonds section
export const SimilarDiamondsSection = styled(YStack, {
  name: 'SimilarDiamondsSection',
  gap: '$3',
  marginTop: '$4',
  paddingTop: '$4',
  borderTopWidth: 1,
  borderTopColor: '$gray3',
});

export const SimilarDiamondsList = styled(ScrollView, {
  name: 'SimilarDiamondsList',
  horizontal: true,
  showsHorizontalScrollIndicator: false,
});

// Specs grid
export const SpecsGrid = styled(YStack, {
  name: 'SpecsGrid',
  gap: '$3',
  marginBottom: '$4',
});

export const SpecRow = styled(XStack, {
  name: 'SpecRow',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: '$2',
  borderBottomWidth: 1,
  borderBottomColor: '$gray3',
});

// Action buttons
export const ActionButtons = styled(XStack, {
  name: 'ActionButtons',
  gap: '$3',
  paddingHorizontal: '$4',
  paddingVertical: '$3',
  borderTopWidth: 1,
  borderTopColor: '$gray5',
});

export interface DiamondDetailModalProps {
  diamond: Diamond_BasicFragment | null;
  visible: boolean;
  onClose: () => void;
  onContactSeller?: (diamond: Diamond_BasicFragment) => void;
  onAddToFavorites?: (diamond: Diamond_BasicFragment) => void;
  onSimilarDiamondPress?: (diamond: DiamondType) => void;
}

// Format price with currency
const formatPrice = (price: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Format carat weight
const formatCarat = (carat: number) => {
  return `${carat.toFixed(2)} ct`;
};

// Convert search result to diamond type
const convertSearchResult = (result: DiamondSearchResult): DiamondType => ({
  id: result.id,
  name: result.name,
  carat: result.carat,
  clarity: result.clarity,
  color: result.color,
  cut: result.cut,
  shape: result.shape,
  pricePerCarat: result.pricePerCarat,
  totalPrice: result.totalPrice,
  status: 'AVAILABLE' as const,
  stockNumber: result.stockNumber,
  isPublic: true,
});

export const DiamondDetailModal: React.FC<DiamondDetailModalProps> = ({
  diamond,
  visible,
  onClose,
  onContactSeller,
  onAddToFavorites,
  onSimilarDiamondPress,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [similarDiamonds, setSimilarDiamonds] = useState<DiamondType[]>([]);

  const [findSimilarDiamonds, { loading: similarLoading }] =
    useFindSimilarDiamondsLazyQuery();

  // Load similar diamonds when modal opens
  useEffect(() => {
    if (visible && diamond) {
      findSimilarDiamonds({
        variables: {
          diamondId: diamond.id,
          limit: 10,
        },
      })
        .then(({ data }: any) => {
          if (data?.findSimilarDiamonds) {
            setSimilarDiamonds(
              data.findSimilarDiamonds.map(convertSearchResult)
            );
          }
        })
        .catch((err: any) => {
          console.error('Error loading similar diamonds:', err);
        });
    }
  }, [visible, diamond, findSimilarDiamonds]);

  if (!diamond) return null;

  const handleContactSeller = () => {
    onContactSeller?.(diamond);
  };

  const handleAddToFavorites = () => {
    onAddToFavorites?.(diamond);
  };

  const handleSimilarDiamondPress = (similarDiamond: DiamondType) => {
    onSimilarDiamondPress?.(similarDiamond);
  };

  // Mock image gallery (in real app, would come from diamond data)
  const images = [
    { id: '1', emoji: '💎' },
    { id: '2', emoji: '✨' },
    { id: '3', emoji: '🔷' },
  ];

  return (
    <Modal
      visible={visible}
      animationType='slide'
      presentationStyle='pageSheet'
      onRequestClose={onClose}
    >
      <ModalContainer>
        <ModalHeader>
          <H3>{diamond.name || `${diamond.shape} Diamond`}</H3>
          <Button size='$3' circular onPress={onClose}>
            ✕
          </Button>
        </ModalHeader>

        <ModalContent showsVerticalScrollIndicator={false}>
          {/* Diamond Image Gallery */}
          <DiamondImageContainer>
            <Paragraph fontSize='$10'>
              {images[selectedImageIndex]?.emoji || '💎'}
            </Paragraph>
          </DiamondImageContainer>

          {/* Image Thumbnails */}
          <ImageGallery>
            {images.map((image, index) => (
              <ImageThumbnail
                key={image.id}
                {...(index === selectedImageIndex ? { active: true } : {})}
                onPress={() => setSelectedImageIndex(index)}
              >
                <Paragraph fontSize='$4'>{image.emoji}</Paragraph>
              </ImageThumbnail>
            ))}
          </ImageGallery>

          {/* Price */}
          <YStack alignItems='center' marginBottom='$4'>
            <H3 fontSize='$8' fontWeight='bold'>
              {formatPrice(diamond.totalPrice)}
            </H3>
            <Paragraph fontSize='$3' opacity={0.7}>
              {formatPrice(diamond.pricePerCarat)}/ct
            </Paragraph>
            {diamond.status === 'AVAILABLE' && (
              <Paragraph
                fontSize='$3'
                fontWeight='600'
                marginTop='$1'
                style={{ color: '#22c55e' }}
              >
                Available
              </Paragraph>
            )}
          </YStack>

          {/* Specifications */}
          <SpecsGrid>
            <SpecRow>
              <Paragraph fontWeight='600'>Carat Weight</Paragraph>
              <Paragraph>{formatCarat(diamond.carat)}</Paragraph>
            </SpecRow>
            <SpecRow>
              <Paragraph fontWeight='600'>Clarity</Paragraph>
              <Paragraph>{diamond.clarity}</Paragraph>
            </SpecRow>
            <SpecRow>
              <Paragraph fontWeight='600'>Color</Paragraph>
              <Paragraph>{diamond.color}</Paragraph>
            </SpecRow>
            <SpecRow>
              <Paragraph fontWeight='600'>Cut</Paragraph>
              <Paragraph>{diamond.cut}</Paragraph>
            </SpecRow>
            <SpecRow>
              <Paragraph fontWeight='600'>Shape</Paragraph>
              <Paragraph>{diamond.shape}</Paragraph>
            </SpecRow>
            {diamond.stockNumber && (
              <SpecRow>
                <Paragraph fontWeight='600'>Stock Number</Paragraph>
                <Paragraph>{diamond.stockNumber}</Paragraph>
              </SpecRow>
            )}
            {diamond.certificate && (
              <SpecRow>
                <Paragraph fontWeight='600'>Certificate</Paragraph>
                <Paragraph>{diamond.certificate}</Paragraph>
              </SpecRow>
            )}
          </SpecsGrid>

          {/* Similar Diamonds */}
          {similarDiamonds.length > 0 && (
            <SimilarDiamondsSection>
              <H4 fontSize='$5' marginBottom='$2'>
                Similar Diamonds
              </H4>
              <SimilarDiamondsList>
                <XStack gap='$3' paddingRight='$4'>
                  {similarDiamonds.map(similarDiamond => (
                    <YStack key={similarDiamond.id} width={160}>
                      <DiamondCard
                        diamond={similarDiamond}
                        variant='compact'
                        onPress={() =>
                          handleSimilarDiamondPress(similarDiamond)
                        }
                        showActions={false}
                        showStatus={false}
                      />
                    </YStack>
                  ))}
                </XStack>
              </SimilarDiamondsList>
            </SimilarDiamondsSection>
          )}

          {similarLoading && (
            <YStack alignItems='center' paddingVertical='$4'>
              <Paragraph fontSize='$3' opacity={0.7}>
                Loading similar diamonds...
              </Paragraph>
            </YStack>
          )}
        </ModalContent>

        <ActionButtons>
          <Button flex={1} variant='outlined' onPress={handleAddToFavorites}>
            ♥ Add to Favorites
          </Button>
          <Button flex={1} onPress={handleContactSeller}>
            💬 Contact Seller
          </Button>
        </ActionButtons>
      </ModalContainer>
    </Modal>
  );
};
