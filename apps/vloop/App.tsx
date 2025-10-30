import React from "react";
import { TamaguiProvider, View, Text } from "tamagui";
import tamaguiConfig from "./tamagui.config";
import { PrimaryButton } from "@bdt/components";
import { StatusBar } from "expo-status-bar";
import "./tamagui-web.css";

export default function App() {
	return (
		<TamaguiProvider config={tamaguiConfig}>
			<View
				flex={1}
				alignItems="center"
				justifyContent="center"
				backgroundColor="$background"
			>
				<Text>VLoop App</Text>
				<PrimaryButton label="Launch" />
				<StatusBar style="auto" />
			</View>
		</TamaguiProvider>
	);
}
