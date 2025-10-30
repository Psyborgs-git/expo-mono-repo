import { useEffect, useRef } from 'react'
import { XStack, YStack, Circle } from 'tamagui'
import { Animated, Easing } from 'react-native'

export type TypingIndicatorProps = {
  size?: 'sm' | 'md' | 'lg'
}

const DotAnimation = ({ delay = 0 }: { delay?: number }) => {
  const opacity = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    )
    animation.start()
    return () => animation.stop()
  }, [delay, opacity])

  return (
    <Animated.View style={{ opacity }}>
      <Circle size="$1" backgroundColor="$textWeak" />
    </Animated.View>
  )
}

export const TypingIndicator = ({ size = 'md' }: TypingIndicatorProps) => {
  const padding = size === 'sm' ? '$2' : size === 'lg' ? '$4' : '$3'
  
  return (
    <YStack
      padding={padding}
      paddingHorizontal={size === 'sm' ? '$3' : '$4'}
      backgroundColor="$backgroundHover"
      borderRadius="$4"
      borderTopLeftRadius="$1"
      alignSelf="flex-start"
    >
      <XStack gap="$1" alignItems="center">
        <DotAnimation delay={0} />
        <DotAnimation delay={200} />
        <DotAnimation delay={400} />
      </XStack>
    </YStack>
  )
}
