import React from "react";
import { Pressable } from "react-native";
import { YStack, XStack, Text } from "tamagui";
import { Card } from "../../atoms/Card/Card";
import { Badge } from "../../atoms/Badge/Badge";
import { Skeleton } from "../../atoms/Skeleton/Skeleton";

export interface DiamondCardProps {
	id: string;
	certificateId?: string | null;
	shape?: string | null;
	carat?: number | null;
	color?: string | null;
	clarity?: string | null;
	cut?: string | null;
	price?: number | null;
	location?: string | null;
	onPress?: () => void;
	isLoading?: boolean;
}

export const DiamondCard: React.FC<DiamondCardProps> = ({
	id,
	certificateId,
	shape,
	carat,
	color,
	clarity,
	cut,
	price,
	location,
	onPress,
	isLoading = false,
}) => {
	if (isLoading) {
		return (
			<Card
				variant="outlined"
				padding="$4"
			>
				<YStack space="$3">
					<Skeleton
						width="100%"
						height={20}
					/>
					<Skeleton
						width="60%"
						height={16}
					/>
					<Skeleton
						width="80%"
						height={16}
					/>
				</YStack>
			</Card>
		);
	}

	return (
		<Pressable onPress={onPress}>
			<Card
				variant="elevated"
				padding="$4"
				pressStyle={{ scale: 0.98 }}
				hoverStyle={{ scale: 1.02 }}
				animation="quick"
			>
				<YStack space="$3">
					{/* Header */}
					<XStack
						justifyContent="space-between"
						alignItems="center"
					>
						<Text
							fontSize="$5"
							fontWeight="700"
							color="$color"
						>
							{shape || "Unknown"}
						</Text>
						{location && (
							<Badge
								variant="info"
								size="sm"
							>
								{location}
							</Badge>
						)}
					</XStack>

					{/* Certificate */}
					{certificateId && (
						<Text
							fontSize="$2"
							color="$colorPress"
						>
							Cert: {certificateId}
						</Text>
					)}

					{/* Specs */}
					<XStack
						space="$2"
						flexWrap="wrap"
					>
						{carat && (
							<Badge
								variant="default"
								size="sm"
							>
								{carat}ct
							</Badge>
						)}
						{color && (
							<Badge
								variant="default"
								size="sm"
							>
								{color}
							</Badge>
						)}
						{clarity && (
							<Badge
								variant="default"
								size="sm"
							>
								{clarity}
							</Badge>
						)}
						{cut && (
							<Badge
								variant="default"
								size="sm"
							>
								{cut}
							</Badge>
						)}
					</XStack>

					{/* Price */}
					{price && (
						<XStack
							justifyContent="space-between"
							alignItems="center"
							marginTop="$2"
						>
							<Text
								fontSize="$6"
								fontWeight="800"
								color="$primary"
							>
								${price.toLocaleString()}
							</Text>
						</XStack>
					)}
				</YStack>
			</Card>
		</Pressable>
	);
};

DiamondCard.displayName = "DiamondCard";
