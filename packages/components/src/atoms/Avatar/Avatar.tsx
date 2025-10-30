import React from "react";
import { styled, GetProps, Avatar as TamaguiAvatar, Text } from "tamagui";
import type { SizeTokens } from "tamagui";

export type AvatarSize = "sm" | "md" | "lg" | "xl";

export interface AvatarProps extends GetProps<typeof StyledAvatar> {
	size?: AvatarSize;
	src?: string;
	alt?: string;
	fallback?: string;
}

const sizeMap: Record<AvatarSize, SizeTokens> = {
	sm: "$6",
	md: "$8",
	lg: "$10",
	xl: "$12",
};

const StyledAvatar = styled(TamaguiAvatar, {
	name: "Avatar",
	circular: true,

	variants: {
		size: {
			sm: {
				width: "$6",
				height: "$6",
			},
			md: {
				width: "$8",
				height: "$8",
			},
			lg: {
				width: "$10",
				height: "$10",
			},
			xl: {
				width: "$12",
				height: "$12",
			},
		},
	} as const,

	defaultVariants: {
		size: "md",
	},
});

export const Avatar: React.FC<AvatarProps> = ({
	size = "md",
	src,
	alt,
	fallback,
	...props
}) => {
	const getInitials = (name: string = "") => {
		const parts = name.trim().split(" ");
		if (parts.length >= 2) {
			return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
		}
		return name.substring(0, 2).toUpperCase();
	};

	return (
		<StyledAvatar
			size={size}
			{...props}
		>
			{src && <TamaguiAvatar.Image src={src} />}
			<TamaguiAvatar.Fallback backgroundColor="$primary">
				<Text
					color="white"
					fontSize={size === "sm" ? "$2" : size === "md" ? "$3" : "$4"}
					fontWeight="600"
				>
					{fallback
						? getInitials(fallback)
						: alt?.substring(0, 2).toUpperCase() || "??"}
				</Text>
			</TamaguiAvatar.Fallback>
		</StyledAvatar>
	);
};

Avatar.displayName = "Avatar";
