import { useState, useEffect } from 'react';
import { YStack, XStack, Text, Button } from 'tamagui';
import { Stack, useRouter } from 'expo-router';
import { Video, VideoOff, Mic, MicOff, PhoneOff } from '@tamagui/lucide-icons';
import { getVideoProvider, VideoProvider } from '../../src/lib/videoProvider';

export default function VideoCallScreen() {
  const [provider, setProvider] = useState<VideoProvider | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [remoteStream, setRemoteStream] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    initializeCall();

    return () => {
      // Cleanup on unmount
      if (provider && isConnected) {
        provider.leave();
      }
    };
  }, []);

  const initializeCall = async () => {
    try {
      const videoProvider = getVideoProvider();
      setProvider(videoProvider);

      // Initialize provider
      await videoProvider.init({
        userId: 'current-user',
      });

      // Set up event listeners
      videoProvider.on('joined', (data) => {
        console.log('Joined room:', data);
        setIsConnected(true);
      });

      videoProvider.on('stream', (data) => {
        console.log('Remote stream received:', data);
        setRemoteStream(data);
      });

      videoProvider.on('left', () => {
        console.log('Left room');
        setIsConnected(false);
        router.back();
      });

      videoProvider.on('error', (error) => {
        console.error('Video call error:', error);
      });

      // Join the call
      await videoProvider.join('demo-room-123');
    } catch (error) {
      console.error('Failed to initialize call:', error);
    }
  };

  const handleEndCall = async () => {
    if (provider) {
      await provider.leave();
    }
    router.back();
  };

  const toggleVideo = () => {
    setIsVideoEnabled((prev) => !prev);
    // In a real implementation, this would toggle the local video track
    console.log('Video toggled:', !isVideoEnabled);
  };

  const toggleAudio = () => {
    setIsAudioEnabled((prev) => !prev);
    // In a real implementation, this would toggle the local audio track
    console.log('Audio toggled:', !isAudioEnabled);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Video Call',
          headerShown: false,
          presentation: 'fullScreenModal',
        }}
      />

      <YStack flex={1} backgroundColor="$gray12">
        {/* Remote Video Placeholder */}
        <YStack flex={1} backgroundColor="$gray11" alignItems="center" justifyContent="center">
          {isConnected && remoteStream ? (
            <Text color="white" fontSize="$6">
              Remote Stream Active
            </Text>
          ) : (
            <YStack alignItems="center" space="$2">
              <Text color="white" fontSize="$6">
                {isConnected ? 'Waiting for remote user...' : 'Connecting...'}
              </Text>
              {isConnected && (
                <Text color="$gray10" fontSize="$3">
                  Mock video call - remote stream will appear in ~2s
                </Text>
              )}
            </YStack>
          )}
        </YStack>

        {/* Local Video Preview */}
        <YStack
          position="absolute"
          top={60}
          right={20}
          width={120}
          height={160}
          backgroundColor="$gray9"
          borderRadius="$4"
          alignItems="center"
          justifyContent="center"
          borderWidth={2}
          borderColor="white"
        >
          <Text color="white" fontSize="$3" textAlign="center">
            {isVideoEnabled ? 'Your Video' : 'Video Off'}
          </Text>
        </YStack>

        {/* Call Controls */}
        <YStack
          position="absolute"
          bottom={40}
          left={0}
          right={0}
          alignItems="center"
        >
          <XStack space="$4" alignItems="center">
            {/* Toggle Video */}
            <Button
              circular
              size="$6"
              icon={isVideoEnabled ? <Video size={28} color="white" /> : <VideoOff size={28} color="white" />}
              onPress={toggleVideo}
              backgroundColor={isVideoEnabled ? '$gray8' : '$red10'}
              pressStyle={{ scale: 0.95 }}
            />

            {/* End Call */}
            <Button
              circular
              size="$7"
              icon={<PhoneOff size={32} color="white" />}
              onPress={handleEndCall}
              backgroundColor="$red10"
              pressStyle={{ scale: 0.95 }}
            />

            {/* Toggle Audio */}
            <Button
              circular
              size="$6"
              icon={isAudioEnabled ? <Mic size={28} color="white" /> : <MicOff size={28} color="white" />}
              onPress={toggleAudio}
              backgroundColor={isAudioEnabled ? '$gray8' : '$red10'}
              pressStyle={{ scale: 0.95 }}
            />
          </XStack>

          {/* Status Text */}
          <Text color="white" fontSize="$3" marginTop="$4">
            {isConnected ? 'Connected' : 'Connecting...'}
          </Text>
        </YStack>
      </YStack>
    </>
  );
}
