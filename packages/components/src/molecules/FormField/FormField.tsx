import React from "react";
import { YStack, Text } from "tamagui";
import { Input, InputProps } from "../../atoms/Input/Input";

export interface FormFieldProps extends Omit<InputProps, "label"> {
	label: string;
	error?: string;
	helperText?: string;
	required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
	label,
	error,
	helperText,
	required = false,
	...inputProps
}) => {
	return (
		<YStack space="$2">
			<Text
				fontSize="$3"
				fontWeight="600"
				color="$color"
			>
				{label}
				{required && <Text color="$error"> *</Text>}
			</Text>

			<Input
				{...inputProps}
				status={error ? "error" : inputProps.status}
			/>

			{(error || helperText) && (
				<Text
					fontSize="$2"
					color={error ? "$error" : "$colorPress"}
				>
					{error || helperText}
				</Text>
			)}
		</YStack>
	);
};

FormField.displayName = "FormField";
