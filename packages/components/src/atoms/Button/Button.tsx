import React from "react";
import { styled, GetProps, Stack, Text, Spinner } from "tamagui";
import type { SizeTokens } from "tamagui";

// Types
export type ButtonVariant =
	| "primary"
	| "secondary"
	| "outlined"
	| "ghost"
	| "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends GetProps<typeof StyledButton> {
	/**
	 * Visual style variant of the button
	 * @default 'primary'
	 */
	variant?: ButtonVariant;

	/**
	 * Size of the button
	 * @default 'md'
	 */
	size?: ButtonSize;

	/**
	 * Loading state - shows spinner and disables interaction
	 */
	loading?: boolean;

	/**
	 * Disabled state
	 */
	disabled?: boolean;

	/**
	 * Icon to display on the left side
	 */
	iconLeft?: React.ReactNode;

	/**
	 * Icon to display on the right side
	 */
	iconRight?: React.ReactNode;

	/**
	 * Button children (usually text)
	 */
	children?: React.ReactNode;

	/**
	 * Full width button
	 */
	fullWidth?: boolean;
}

// Base styled button
const StyledButton = styled(Stack, {
	name: "Button",
	tag: "button",

	// Base styles
	flexDirection: "row",
	alignItems: "center",
	justifyContent: "center",
	gap: "$2",
	borderRadius: "$4",
	cursor: "pointer",
	userSelect: "none",

	// Default size
	paddingHorizontal: "$4",
	paddingVertical: "$3",

	// Transitions
	animation: "quick",

	// Pressable behavior
	pressStyle: {
		scale: 0.97,
		opacity: 0.9,
	},

	// Disabled state
	disabledStyle: {
		opacity: 0.5,
		cursor: "not-allowed",
	},

	// Hover state (web)
	hoverStyle: {
		opacity: 0.9,
	},

	variants: {
		variant: {
			primary: {
				backgroundColor: "$primary",
				borderWidth: 0,
				hoverStyle: {
					backgroundColor: "$primaryDark",
				},
			},
			secondary: {
				backgroundColor: "$secondary",
				borderWidth: 0,
				hoverStyle: {
					backgroundColor: "$secondaryDark",
				},
			},
			outlined: {
				backgroundColor: "transparent",
				borderWidth: 2,
				borderColor: "$primary",
				hoverStyle: {
					backgroundColor: "$backgroundHover",
				},
			},
			ghost: {
				backgroundColor: "transparent",
				borderWidth: 0,
				hoverStyle: {
					backgroundColor: "$backgroundHover",
				},
			},
			danger: {
				backgroundColor: "$error",
				borderWidth: 0,
				hoverStyle: {
					backgroundColor: "$errorDark",
				},
			},
		},

		size: {
			sm: {
				paddingHorizontal: "$3",
				paddingVertical: "$2",
			},
			md: {
				paddingHorizontal: "$4",
				paddingVertical: "$3",
			},
			lg: {
				paddingHorizontal: "$5",
				paddingVertical: "$4",
			},
		},

		fullWidth: {
			true: {
				width: "100%",
			},
		},
	} as const,

	defaultVariants: {
		variant: "primary",
		size: "md",
	},
});

// Button text component
const ButtonText = styled(Text, {
	name: "ButtonText",
	fontWeight: "600",

	variants: {
		variant: {
			primary: {
				color: "white",
			},
			secondary: {
				color: "white",
			},
			outlined: {
				color: "$primary",
			},
			ghost: {
				color: "$primary",
			},
			danger: {
				color: "white",
			},
		},

		size: {
			sm: {
				fontSize: "$3",
			},
			md: {
				fontSize: "$4",
			},
			lg: {
				fontSize: "$5",
			},
		},
	} as const,

	defaultVariants: {
		variant: "primary",
		size: "md",
	},
});

/**
 * Button component
 *
 * A versatile button component with multiple variants, sizes, and states.
 * Supports loading state, icons, and full-width layout.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onPress={handlePress}>
 *   Click me
 * </Button>
 *
 * <Button variant="outlined" loading>
 *   Loading...
 * </Button>
 *
 * <Button iconLeft={<Icon />} iconRight={<ArrowRight />}>
 *   Next
 * </Button>
 * ```
 */
export const Button = ({
		variant = "primary",
		size = "md",
		loading = false,
		disabled = false,
		iconLeft,
		iconRight,
		children,
		fullWidth,
		onPress,
		...props
	}: ButtonProps) => {
		const isDisabled = disabled || loading;

		const handlePress = (event: any) => {
			if (isDisabled) return;
			onPress?.(event);
		};

		return (
			<StyledButton
				variant={variant}
				size={size}
				fullWidth={fullWidth}
				disabled={isDisabled}
				onPress={handlePress}
				{...props}
			>
				{loading && (
					<Spinner
						size="small"
						color={
							variant === "outlined" || variant === "ghost"
								? "$primary"
								: "white"
						}
					/>
				)}
				{!loading && iconLeft && iconLeft}
				{children && (
					<ButtonText
						variant={variant}
						size={size}
					>
						{children}
					</ButtonText>
				)}
				{!loading && iconRight && iconRight}
			</StyledButton>
		);
	};

Button.displayName = "Button";

export default Button;
