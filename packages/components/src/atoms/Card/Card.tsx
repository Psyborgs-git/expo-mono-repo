import React from "react";
import { styled, GetProps, Card as TamaguiCard } from "tamagui";

export type CardVariant = "default" | "elevated" | "outlined";

export interface CardProps extends GetProps<typeof StyledCard> {
	variant?: CardVariant;
	children?: React.ReactNode;
}

const StyledCard = styled(TamaguiCard, {
	name: "Card",
	borderRadius: "$4",
	padding: "$4",

	variants: {
		variant: {
			default: {
				backgroundColor: "$background",
			},
			elevated: {
				backgroundColor: "$background",
				shadowColor: "$shadowColor",
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.1,
				shadowRadius: 8,
				elevation: 2,
			},
			outlined: {
				backgroundColor: "$background",
				borderWidth: 1,
				borderColor: "#E0E0E0",
			},
		},
	} as const,

	defaultVariants: {
		variant: "default",
	},
});

export const Card = ({ variant = "default", children, ...props }: CardProps) => (
	<StyledCard
		variant={variant}
		{...props}
	>
		{children}
	</StyledCard>
);

Card.displayName = "Card";
