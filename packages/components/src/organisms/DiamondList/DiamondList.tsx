import React from "react";
import { FlatList, type ListRenderItem } from "react-native";
import { YStack } from "tamagui";
import { DiamondCard } from "../../molecules/DiamondCard/DiamondCard";

export interface DiamondListProps {
	diamonds: Array<{
		id: string;
		certificateId?: string | null;
		shape?: string | null;
		carat?: number | null;
		color?: string | null;
		clarity?: string | null;
		cut?: string | null;
		price?: number | null;
		location?: string | null;
	}>;
	onDiamondPress?: (diamond: any) => void;
	isLoading?: boolean;
	numColumns?: number;
	contentContainerStyle?: any;
}

export const DiamondList: React.FC<DiamondListProps> = ({
	diamonds,
	onDiamondPress,
	isLoading = false,
	numColumns = 2,
	contentContainerStyle,
}) => {
	const renderItem: ListRenderItem<(typeof diamonds)[number]> = ({ item }) => (
		<YStack
			flex={1}
			padding="$2"
		>
			<DiamondCard
				id={item.id}
				certificateId={item.certificateId}
				shape={item.shape}
				carat={item.carat}
				color={item.color}
				clarity={item.clarity}
				cut={item.cut}
				price={item.price}
				location={item.location}
				onPress={() => onDiamondPress?.(item)}
				isLoading={isLoading}
			/>
		</YStack>
	);

	if (isLoading) {
		return (
			<YStack
				flex={1}
				padding="$4"
				space="$4"
			>
				{[1, 2, 3, 4].map((i) => (
					<DiamondCard
						key={i}
						id={`skeleton-${i}`}
						isLoading={true}
					/>
				))}
			</YStack>
		);
	}

	return (
		<FlatList
			data={diamonds}
			renderItem={renderItem}
			keyExtractor={(item) => item.id}
			numColumns={numColumns}
			contentContainerStyle={contentContainerStyle}
			showsVerticalScrollIndicator={false}
		/>
	);
};

DiamondList.displayName = "DiamondList";
