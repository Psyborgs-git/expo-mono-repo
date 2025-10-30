import React from "react";
import {
	styled,
	GetProps,
	Input as TamaguiInput,
	YStack,
	Text,
	XStack,
} from "tamagui";
import type { ColorTokens } from "tamagui";

// Types
export type InputVariant = "default" | "filled" | "flushed";
export type InputSize = "sm" | "md" | "lg";
export type InputStatus = "default" | "error" | "success" | "warning";

export interface InputProps extends GetProps<typeof StyledInput> {
	/**
	 * Visual style variant
	 * @default 'default'
	 */
	variant?: InputVariant;

	/**
	 * Size of the input
	 * @default 'md'
	 */
	inputSize?: InputSize;

	/**
	 * Status/validation state
	 * @default 'default'
	 */
	status?: InputStatus;

	/**
	 * Label text displayed above input
	 */
	label?: string;

	/**
	 * Helper text displayed below input
	 */
	helperText?: string;

	/**
	 * Error message (shows as helper text with error styling)
	 */
	error?: string | boolean;

	/**
	 * Icon to display on the left side
	 */
	iconLeft?: React.ReactNode;

	/**
	 * Icon to display on the right side
	 */
	iconRight?: React.ReactNode;

	/**
	 * Required field indicator
	 */
	required?: boolean;

	/**
	 * Full width input
	 */
	fullWidth?: boolean;
}

// Base styled input
const StyledInput = styled(TamaguiInput, {
	name: "Input",

	// Base styles
	borderRadius: "$4",
	fontFamily: "$body",
	outlineStyle: "none", // Remove default focus outline

	// Transitions
	animation: "quick",

	variants: {
		variant: {
			default: {
				backgroundColor: "$background",
				borderWidth: 2,
				borderColor: "#E0E0E0",
				focusStyle: {
					borderColor: "$primary",
					backgroundColor: "$backgroundFocus",
				},
			},
			filled: {
				backgroundColor: "$backgroundStrong",
				borderWidth: 0,
				focusStyle: {
					backgroundColor: "$backgroundHover",
				},
			},
			flushed: {
				backgroundColor: "transparent",
				borderWidth: 0,
				borderBottomWidth: 2,
				borderBottomColor: "#E0E0E0",
				borderRadius: 0,
				focusStyle: {
					borderBottomColor: "$primary",
				},
			},
		},

		inputSize: {
			sm: {
				height: "$8",
				paddingHorizontal: "$3",
				fontSize: "$3",
			},
			md: {
				height: "$10",
				paddingHorizontal: "$4",
				fontSize: "$4",
			},
			lg: {
				height: "$12",
				paddingHorizontal: "$5",
				fontSize: "$5",
			},
		},

		status: {
			default: {},
			error: {
				borderColor: "$error",
				focusStyle: {
					borderColor: "$error",
				},
			},
			success: {
				borderColor: "$success",
				focusStyle: {
					borderColor: "$success",
				},
			},
			warning: {
				borderColor: "$warning",
				focusStyle: {
					borderColor: "$warning",
				},
			},
		},

		fullWidth: {
			true: {
				width: "100%",
			},
		},
	} as const,

	defaultVariants: {
		variant: "default",
		inputSize: "md",
		status: "default",
	},
});

// Helper text colors based on status
const getHelperColor = (status: InputStatus): ColorTokens | string => {
	switch (status) {
		case "error":
			return "$error";
		case "success":
			return "$success";
		case "warning":
			return "$warning";
		default:
			return "$colorPress";
	}
};

/**
 * Input component
 *
 * A versatile input component with label, helper text, validation states, and icons.
 * Supports multiple variants and sizes.
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   placeholder="Enter your email"
 *   required
 * />
 *
 * <Input
 *   label="Password"
 *   type="password"
 *   error="Password is required"
 *   status="error"
 * />
 *
 * <Input
 *   iconLeft={<SearchIcon />}
 *   placeholder="Search..."
 *   variant="filled"
 * />
 * ```
 */
export const Input = ({
		variant = "default",
		inputSize = "md",
		status = "default",
		label,
		helperText,
		error,
		iconLeft,
		iconRight,
		required = false,
		fullWidth,
		...props
	}: InputProps) => {
		// Use error message as helper text if provided
		const displayHelperText = error || helperText;
		const displayStatus = error ? "error" : status;

		return (
			<YStack
				space="$2"
				width={fullWidth ? "100%" : undefined}
			>
				{/* Label */}
				{label && (
					<XStack
						alignItems="center"
						gap="$1"
					>
						<Text
							fontSize="$4"
							fontWeight="600"
						>
							{label}
						</Text>
						{required && (
							<Text
								fontSize="$4"
								color="$error"
							>
								*
							</Text>
						)}
					</XStack>
				)}

				{/* Input with icons */}
				<XStack
					alignItems="center"
					position="relative"
					width={fullWidth ? "100%" : undefined}
				>
					{iconLeft && (
						<XStack
							position="absolute"
							left="$3"
							zIndex={1}
							pointerEvents="none"
						>
							{iconLeft}
						</XStack>
					)}

					<StyledInput
						variant={variant}
						inputSize={inputSize}
						status={displayStatus}
						fullWidth={fullWidth}
						paddingLeft={iconLeft ? "$10" : undefined}
						paddingRight={iconRight ? "$10" : undefined}
						{...props}
					/>

					{iconRight && (
						<XStack
							position="absolute"
							right="$3"
							zIndex={1}
							pointerEvents="none"
						>
							{iconRight}
						</XStack>
					)}
				</XStack>

				{/* Helper text */}
				{displayHelperText && (
					<Text
						fontSize="$2"
						color={getHelperColor(displayStatus)}
						paddingHorizontal="$1"
					>
						{displayHelperText}
					</Text>
				)}
			</YStack>
		);
	};

Input.displayName = "Input";

export default Input;
