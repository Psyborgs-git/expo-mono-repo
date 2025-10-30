import React from 'react';
import { View, YStack, H2, Paragraph, Button } from 'tamagui';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <View
      flex={1}
      backgroundColor='$background'
      alignItems='center'
      justifyContent='center'
    >
      <YStack space='$4' alignItems='center' paddingHorizontal='$4'>
        <H2 color='$color'>Welcome to Carat Central</H2>
        <Paragraph fontSize='$4' textAlign='center' color='$colorPress'>
          Your premier destination for diamond trading
        </Paragraph>
        <Button
          size='$4'
          theme='blue'
          onPress={() => router.push('/get-started')}
        >
          Get Started
        </Button>
      </YStack>
      <StatusBar style='auto' />
    </View>
  );
}
