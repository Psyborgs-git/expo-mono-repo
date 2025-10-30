import React from "react";
import { ScrollView } from "react-native";
import { YStack, XStack, Text, Separator } from "tamagui";
import { FormField } from "../../molecules/FormField/FormField";
import { Button } from "../../atoms/Button/Button";

export interface FilterOption {
	label: string;
	value: string;
}

export interface FilterField {
	key: string;
	label: string;
	type: "text" | "select" | "range";
	options?: FilterOption[];
	min?: number;
	max?: number;
}

export interface FilterPanelProps {
	fields: FilterField[];
	values: Record<string, any>;
	onValueChange: (key: string, value: any) => void;
	onApply: () => void;
	onReset: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
	fields,
	values,
	onValueChange,
	onApply,
	onReset,
}) => {
	const renderField = (field: FilterField) => {
		switch (field.type) {
			case "text":
				return (
					<FormField
						key={field.key}
						label={field.label}
						value={values[field.key] || ""}
						onChangeText={(text) => onValueChange(field.key, text)}
						placeholder={`Enter ${field.label.toLowerCase()}`}
					/>
				);

			case "range":
				return (
					<YStack
						key={field.key}
						space="$2"
					>
						<Text
							fontSize="$3"
							fontWeight="600"
							color="$color"
						>
							{field.label}
						</Text>
						<XStack space="$2">
							<FormField
								label="Min"
								value={values[`${field.key}_min`] || ""}
								onChangeText={(text) => onValueChange(`${field.key}_min`, text)}
								placeholder={field.min?.toString()}
								keyboardType="numeric"
							/>
							<FormField
								label="Max"
								value={values[`${field.key}_max`] || ""}
								onChangeText={(text) => onValueChange(`${field.key}_max`, text)}
								placeholder={field.max?.toString()}
								keyboardType="numeric"
							/>
						</XStack>
					</YStack>
				);

			default:
				return null;
		}
	};

	return (
		<YStack
			flex={1}
			backgroundColor="$background"
		>
			<ScrollView showsVerticalScrollIndicator={false}>
				<YStack
					padding="$4"
					space="$4"
				>
					<Text
						fontSize="$6"
						fontWeight="700"
						color="$color"
					>
						Filters
					</Text>

					<Separator />

					{fields.map(renderField)}

					<XStack
						space="$3"
						marginTop="$4"
					>
						<Button
							variant="outlined"
							onPress={onReset}
							flex={1}
						>
							Reset
						</Button>
						<Button
							variant="primary"
							onPress={onApply}
							flex={1}
						>
							Apply
						</Button>
					</XStack>
				</YStack>
			</ScrollView>
		</YStack>
	);
};

FilterPanel.displayName = "FilterPanel";
