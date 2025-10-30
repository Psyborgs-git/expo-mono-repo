import React, { useRef, useEffect } from "react";
import { FlatList, type ListRenderItem } from "react-native";
import { YStack } from "tamagui";
import { MessageBubble } from "../../molecules/MessageBubble/MessageBubble";

export interface ChatMessage {
	id: string;
	content: string;
	createdAt: string;
	senderId: string;
	senderName?: string;
	senderAvatar?: string;
	isRead?: boolean;
}

export interface ChatThreadProps {
	messages: ChatMessage[];
	currentUserId: string;
	onLoadMore?: () => void;
	isLoading?: boolean;
}

export const ChatThread: React.FC<ChatThreadProps> = ({
	messages,
	currentUserId,
	onLoadMore,
	isLoading = false,
}) => {
	const flatListRef = useRef<FlatList>(null);

	useEffect(() => {
		// Scroll to bottom when new messages arrive
		if (messages.length > 0) {
			setTimeout(() => {
				flatListRef.current?.scrollToEnd({ animated: true });
			}, 100);
		}
	}, [messages.length]);

	const renderItem: ListRenderItem<ChatMessage> = ({ item }) => {
		const isSent = item.senderId === currentUserId;

		return (
			<MessageBubble
				message={item.content}
				timestamp={item.createdAt}
				variant={isSent ? "sent" : "received"}
				senderName={!isSent ? item.senderName : undefined}
				senderAvatar={!isSent ? item.senderAvatar : undefined}
				isRead={item.isRead}
			/>
		);
	};

	return (
		<YStack flex={1}>
			<FlatList
				ref={flatListRef}
				data={messages}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				showsVerticalScrollIndicator={false}
				onEndReached={onLoadMore}
				onEndReachedThreshold={0.5}
				inverted={false}
			/>
		</YStack>
	);
};

ChatThread.displayName = "ChatThread";
