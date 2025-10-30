import React from "react";
import { styled, GetProps, XStack, Text } from "tamagui";

export type BadgeVariant =
	| "default"
	| "primary"
	| "success"
	| "warning"
	| "error"
	| "info";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends GetProps<typeof StyledBadge> {
	variant?: BadgeVariant;
	size?: BadgeSize;
	children?: React.ReactNode;
}

const StyledBadge = styled(XStack, {
	name: "Badge",
	alignItems: "center",
	justifyContent: "center",
	borderRadius: "$2",

	variants: {
		variant: {
			default: {
				backgroundColor: "$backgroundStrong",
			},
			primary: {
				backgroundColor: "$primary",
			},
			success: {
				backgroundColor: "$success",
			},
			warning: {
				backgroundColor: "$warning",
			},
			error: {
				backgroundColor: "$error",
			},
			info: {
				backgroundColor: "$info",
			},
		},

		size: {
			sm: {
				paddingHorizontal: "$2",
				paddingVertical: "$1",
			},
			md: {
				paddingHorizontal: "$3",
				paddingVertical: "$1.5",
			},
			lg: {
				paddingHorizontal: "$4",
				paddingVertical: "$2",
			},
		},
	} as const,

	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

const BadgeText = styled(Text, {
	name: "BadgeText",
	fontWeight: "600",

	variants: {
		variant: {
			default: {
				color: "$color",
			},
			primary: {
				color: "white",
			},
			success: {
				color: "white",
			},
			warning: {
				color: "white",
			},
			error: {
				color: "white",
			},
			info: {
				color: "white",
			},
		},

		size: {
			sm: {
				fontSize: "$2",
			},
			md: {
				fontSize: "$3",
			},
			lg: {
				fontSize: "$4",
			},
		},
	} as const,

	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

export const Badge = ({	variant = "default", size = "md", children, ...props }: BadgeProps) => (
	<StyledBadge
		variant={variant}
		size={size}
		{...props}
	>
		<BadgeText
			variant={variant}
			size={size}
		>
			{children}
		</BadgeText>
	</StyledBadge>
);

Badge.displayName = "Badge";
