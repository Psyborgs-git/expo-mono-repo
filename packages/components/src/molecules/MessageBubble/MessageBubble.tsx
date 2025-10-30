import React from "react";
import { XStack, YStack, Text } from "tamagui";
import { Avatar } from "../../atoms/Avatar/Avatar";

export type MessageBubbleVariant = "sent" | "received";

export interface MessageBubbleProps {
	message: string;
	timestamp: string;
	variant?: MessageBubbleVariant;
	senderName?: string;
	senderAvatar?: string;
	isRead?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
	message,
	timestamp,
	variant = "received",
	senderName,
	senderAvatar,
	isRead = false,
}) => {
	const isSent = variant === "sent";

	return (
		<XStack
			width="100%"
			justifyContent={isSent ? "flex-end" : "flex-start"}
			paddingHorizontal="$4"
			paddingVertical="$2"
		>
			<XStack
				space="$2"
				maxWidth="75%"
				flexDirection={isSent ? "row-reverse" : "row"}
			>
				{!isSent && senderAvatar && (
					<Avatar
						size="sm"
						src={senderAvatar}
						fallback={senderName}
					/>
				)}

				<YStack
					backgroundColor={isSent ? "$primary" : "$backgroundStrong"}
					borderRadius="$4"
					padding="$3"
					space="$1"
					maxWidth="100%"
				>
					{!isSent && senderName && (
						<Text
							fontSize="$2"
							fontWeight="600"
							color="$color"
							marginBottom="$1"
						>
							{senderName}
						</Text>
					)}

					<Text
						fontSize="$3"
						color={isSent ? "white" : "$color"}
						lineHeight="$1"
					>
						{message}
					</Text>

					<XStack
						space="$2"
						alignItems="center"
						alignSelf="flex-end"
					>
						<Text
							fontSize="$1"
							color={isSent ? "rgba(255,255,255,0.7)" : "$colorPress"}
						>
							{new Date(timestamp).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</Text>
						{isSent && (
							<Text
								fontSize="$1"
								color={isRead ? "$success" : "rgba(255,255,255,0.7)"}
							>
								{isRead ? "✓✓" : "✓"}
							</Text>
						)}
					</XStack>
				</YStack>
			</XStack>
		</XStack>
	);
};

MessageBubble.displayName = "MessageBubble";
