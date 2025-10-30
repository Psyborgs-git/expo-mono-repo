import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withRepeat,
	withTiming,
	interpolate,
} from "react-native-reanimated";

export interface SkeletonProps {
	width?: number | string;
	height?: number | string;
	borderRadius?: number;
	style?: any;
}

export const Skeleton: React.FC<SkeletonProps> = ({
	width = 100,
	height = 20,
	borderRadius = 4,
	style,
}) => {
	const opacity = useSharedValue(0.3);

	useEffect(() => {
		opacity.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
	}, []);

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
	}));

	return (
		<View style={[{ width, height, borderRadius }, style]}>
			<Animated.View
				style={[
					StyleSheet.absoluteFill,
					{
						backgroundColor: "#E0E0E0",
						borderRadius,
					},
					animatedStyle,
				]}
			/>
		</View>
	);
};

Skeleton.displayName = "Skeleton";
