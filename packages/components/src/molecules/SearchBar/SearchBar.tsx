import React from "react";
import { XStack } from "tamagui";
import { Search } from "@tamagui/lucide-icons";
import { Input, InputProps } from "tamagui";

export interface SearchBarProps extends InputProps {
	onSearch?: (query: string) => void;
	onClear?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
	onSearch,
	onClear,
	value,
	onChangeText,
	placeholder = "Search...",
	...props
}) => {
	const handleChange = (text: string) => {
		onChangeText?.(text);
		onSearch?.(text);
	};

	const handleClear = () => {
		onChangeText?.("");
		onClear?.();
	};

	return (
		<XStack flex={1} gap="$2" alignItems="center">
			<Search size={20} color="$textWeak" />
			<Input
				flex={1}
				placeholder={placeholder}
				value={value}
				onChangeText={handleChange}
				{...props}
			/>
		</XStack>
	);
};

SearchBar.displayName = "SearchBar";
