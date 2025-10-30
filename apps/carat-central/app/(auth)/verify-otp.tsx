import React, { useState, useEffect, useRef } from 'react';
import { Alert, TextInput, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  View,
  Text,
  YStack,
  XStack,
  Button,
  Input,
  Spinner,
  H2,
  H5,
  Theme,
} from 'tamagui';
import { useAuth } from '../../contexts/AuthContext';

export default function VerifyOTPScreen() {
  const params = useLocalSearchParams<{
    method: 'email' | 'mobile';
    contact: string;
    countryCode?: string;
    otpId: string;
    message: string;
  }>();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  const {
    verifyEmailOTP,
    verifyMobileOTP,
    requestEmailOTP,
    requestMobileOTP,
    error,
  } = useAuth();

  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    // Auto-focus first input
    setTimeout(() => inputRefs.current[0]?.focus(), 100);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      // Handle paste
      const pastedOtp = value.slice(0, 6).split('');
      const newOtp = [...otp];
      pastedOtp.forEach((digit, i) => {
        if (i < 6) {
          newOtp[i] = digit;
        }
      });
      setOtp(newOtp);

      // Focus on the last filled input or the next empty one
      const nextIndex = Math.min(pastedOtp.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit OTP');
      return;
    }

    try {
      setIsLoading(true);

      if (params.method === 'email') {
        await verifyEmailOTP(params.contact, otpCode);
      } else {
        await verifyMobileOTP(params.contact, otpCode, params.countryCode);
      }

      // Navigate to organization selection or main app
      router.replace('/(auth)/organization-select');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid OTP';
      Alert.alert('Error', errorMessage);
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setIsLoading(true);
      setCanResend(false);
      setTimeLeft(300);
      setOtp(['', '', '', '', '', '']);

      if (params.method === 'email') {
        await requestEmailOTP(params.contact);
      } else {
        await requestMobileOTP(params.contact, params.countryCode);
      }

      Alert.alert('Success', 'A new OTP has been sent');
      inputRefs.current[0]?.focus();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to resend OTP';
      Alert.alert('Error', errorMessage);
      setCanResend(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <Theme name='light'>
      <View flex={1} backgroundColor='$background'>
        <YStack
          flex={1}
          justifyContent='center'
          paddingHorizontal='$6'
          paddingVertical='$8'
          space='$6'
        >
          {/* Header */}
          <YStack space='$3' alignItems='center' marginBottom='$2'>
            <H2
              fontSize='$9'
              fontWeight='800'
              color='$blue10'
              textAlign='center'
            >
              Verify Code
            </H2>
            <H5
              fontSize='$4'
              color='$gray11'
              fontWeight='500'
              textAlign='center'
              lineHeight='$2'
            >
              We've sent a 6-digit code to
            </H5>
            <Text
              fontSize='$5'
              fontWeight='700'
              color='$gray12'
              textAlign='center'
            >
              {params.method === 'email'
                ? params.contact
                : `+${params.countryCode} ${params.contact}`}
            </Text>
          </YStack>

          {/* OTP Card */}
          <YStack
            backgroundColor='$backgroundStrong'
            borderRadius='$6'
            padding='$6'
            space='$5'
            borderWidth={1}
            borderColor='$gray5'
            shadowColor='$shadowColor'
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.1}
            shadowRadius={8}
            elevation={2}
          >
            {/* OTP Input */}
            <YStack space='$4' alignItems='center'>
              <XStack space='$3' justifyContent='center'>
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={ref => (inputRefs.current[index] = ref)}
                    value={digit}
                    onChangeText={value => handleOtpChange(value, index)}
                    onKeyPress={({ nativeEvent }) =>
                      handleKeyPress(nativeEvent.key, index)
                    }
                    keyboardType='number-pad'
                    maxLength={6} // Allow paste
                    textAlign='center'
                    fontSize='$8'
                    fontWeight='800'
                    width={Platform.OS === 'web' ? '$5' : '$4.5'}
                    height={Platform.OS === 'web' ? '$5' : '$4.5'}
                    borderWidth={2}
                    borderColor={digit ? '$blue10' : '$gray6'}
                    backgroundColor={digit ? '$blue5' : '$background'}
                    color='$blue10'
                    borderRadius='$4'
                    focusStyle={{
                      borderColor: '$blue10',
                      borderWidth: 3,
                      backgroundColor: '$blue5',
                    }}
                  />
                ))}
              </XStack>

              {/* Timer */}
              <XStack
                space='$2'
                alignItems='center'
                paddingHorizontal='$4'
                paddingVertical='$2'
                borderRadius='$3'
                backgroundColor={timeLeft > 0 ? '$green5' : '$red5'}
              >
                <View
                  width='$0.5'
                  height='$0.5'
                  borderRadius='$10'
                  backgroundColor={timeLeft > 0 ? '$green10' : '$red10'}
                />
                <Text
                  fontSize='$3'
                  fontWeight='600'
                  color={timeLeft > 0 ? '$green11' : '$red11'}
                >
                  {timeLeft > 0
                    ? `Expires in ${formatTime(timeLeft)}`
                    : 'Code expired'}
                </Text>
              </XStack>
            </YStack>

            {/* Error Message */}
            {error && (
              <YStack
                backgroundColor='$red5'
                padding='$3'
                borderRadius='$3'
                borderWidth={1}
                borderColor='$red9'
              >
                <Text fontSize='$3' color='$red11' fontWeight='500'>
                  {error}
                </Text>
              </YStack>
            )}

            {/* Verify Button */}
            <Button
              size='$5'
              onPress={handleVerifyOTP}
              disabled={isLoading || !isOtpComplete}
              backgroundColor='$blue10'
              color='white'
              borderRadius='$4'
              fontWeight='700'
              fontSize='$5'
              hoverStyle={{ backgroundColor: '$blue9' }}
              pressStyle={{ backgroundColor: '$blue11' }}
              opacity={!isOtpComplete && !isLoading ? 0.5 : 1}
            >
              {isLoading ? (
                <XStack space='$3' alignItems='center'>
                  <Spinner size='small' color='white' />
                  <Text color='white' fontWeight='700'>
                    Verifying...
                  </Text>
                </XStack>
              ) : (
                'Verify & Continue'
              )}
            </Button>

            {/* Resend Section */}
            <YStack space='$3' alignItems='center' paddingTop='$2'>
              <Text fontSize='$3' color='$gray11' fontWeight='500'>
                Didn't receive the code?
              </Text>
              <Button
                size='$4'
                onPress={handleResendOTP}
                disabled={!canResend || isLoading}
                backgroundColor={canResend ? '$blue5' : '$gray3'}
                color={canResend ? '$blue10' : '$gray10'}
                borderRadius='$3'
                fontWeight='600'
                borderWidth={1}
                borderColor={canResend ? '$blue9' : '$gray6'}
                hoverStyle={{
                  backgroundColor: canResend ? '$blue10' : '$gray4',
                }}
                pressStyle={{
                  backgroundColor: canResend ? '$blue11' : '$gray5',
                }}
              >
                {canResend ? 'Resend OTP' : 'Please wait...'}
              </Button>
            </YStack>
          </YStack>

          {/* Back Button */}
          <Button
            size='$4'
            onPress={handleGoBack}
            disabled={isLoading}
            backgroundColor='$gray3'
            color='$gray12'
            borderRadius='$4'
            fontWeight='600'
            borderWidth={1}
            borderColor='$gray6'
            hoverStyle={{ backgroundColor: '$gray4' }}
            pressStyle={{ backgroundColor: '$gray5' }}
          >
            Change {params.method === 'email' ? 'Email' : 'Mobile Number'}
          </Button>
        </YStack>
      </View>
    </Theme>
  );
}
