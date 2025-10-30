import React, { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import {
  View,
  Text,
  YStack,
  XStack,
  Button,
  Input,
  Separator,
  Spinner,
  H1,
  H4,
  Theme,
} from 'tamagui';
import { useAuth } from '../../contexts/AuthContext';

type LoginMethod = 'email' | 'mobile';

export default function LoginScreen() {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [countryCode, setCountryCode] = useState('1');
  const [isLoading, setIsLoading] = useState(false);

  const { requestEmailOTP, requestMobileOTP, error } = useAuth();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile: string): boolean => {
    const mobileRegex = /^\d{10,15}$/;
    return mobileRegex.test(mobile);
  };

  const handleRequestOTP = async () => {
    try {
      setIsLoading(true);

      if (loginMethod === 'email') {
        if (!email.trim()) {
          Alert.alert('Error', 'Please enter your email address');
          return;
        }
        if (!validateEmail(email)) {
          Alert.alert('Error', 'Please enter a valid email address');
          return;
        }

        const response = await requestEmailOTP(email);
        router.push({
          pathname: '/(auth)/verify-otp',
          params: {
            method: 'email',
            contact: email,
            otpId: response.otpId,
            message: response.message,
          },
        });
      } else {
        if (!mobile.trim()) {
          Alert.alert('Error', 'Please enter your mobile number');
          return;
        }
        if (!validateMobile(mobile)) {
          Alert.alert(
            'Error',
            'Please enter a valid mobile number (10-15 digits)'
          );
          return;
        }

        const response = await requestMobileOTP(mobile, countryCode);
        router.push({
          pathname: '/(auth)/verify-otp',
          params: {
            method: 'mobile',
            contact: mobile,
            countryCode,
            otpId: response.otpId,
            message: response.message,
          },
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to send OTP';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
          <YStack space='$3' alignItems='center' marginBottom='$4'>
            <H1
              fontSize='$10'
              fontWeight='800'
              color='$blue10'
              textAlign='center'
            >
              Carat Central
            </H1>
            <H4
              fontSize='$5'
              color='$gray11'
              fontWeight='500'
              textAlign='center'
              lineHeight='$2'
            >
              Sign in to access your diamond marketplace
            </H4>
          </YStack>

          {/* Login Form Card */}
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
            {/* Method Toggle */}
            <XStack
              space='$2'
              backgroundColor='$gray3'
              borderRadius='$4'
              padding='$1'
            >
              <Button
                size='$4'
                flex={1}
                backgroundColor={
                  loginMethod === 'email' ? '$blue10' : '$backgroundStrong'
                }
                color={loginMethod === 'email' ? 'white' : '$gray11'}
                hoverStyle={{
                  backgroundColor:
                    loginMethod === 'email' ? '$blue9' : '$gray4',
                }}
                pressStyle={{
                  backgroundColor:
                    loginMethod === 'email' ? '$blue11' : '$gray5',
                }}
                onPress={() => setLoginMethod('email')}
                borderRadius='$3'
                fontWeight='600'
              >
                Email
              </Button>
              <Button
                size='$4'
                flex={1}
                backgroundColor={
                  loginMethod === 'mobile' ? '$blue10' : '$backgroundStrong'
                }
                color={loginMethod === 'mobile' ? 'white' : '$gray11'}
                hoverStyle={{
                  backgroundColor:
                    loginMethod === 'mobile' ? '$blue9' : '$gray4',
                }}
                pressStyle={{
                  backgroundColor:
                    loginMethod === 'mobile' ? '$blue11' : '$gray5',
                }}
                onPress={() => setLoginMethod('mobile')}
                borderRadius='$3'
                fontWeight='600'
              >
                Mobile
              </Button>
            </XStack>

            <Separator />

            {/* Input Fields */}
            {loginMethod === 'email' ? (
              <YStack space='$3'>
                <Text fontSize='$4' fontWeight='600' color='$gray12'>
                  Email Address
                </Text>
                <Input
                  placeholder='Enter your email'
                  value={email}
                  onChangeText={setEmail}
                  keyboardType='email-address'
                  autoCapitalize='none'
                  autoComplete='email'
                  size='$5'
                  borderRadius='$4'
                  borderWidth={2}
                  borderColor='$gray5'
                  focusStyle={{
                    borderColor: '$blue10',
                    backgroundColor: '$blue5',
                  }}
                  backgroundColor='$background'
                  fontSize='$4'
                  paddingHorizontal='$4'
                />
              </YStack>
            ) : (
              <YStack space='$3'>
                <Text fontSize='$4' fontWeight='600' color='$gray12'>
                  Mobile Number
                </Text>
                <XStack space='$3'>
                  <Input
                    placeholder='+1'
                    value={countryCode}
                    onChangeText={setCountryCode}
                    keyboardType='phone-pad'
                    width='$7'
                    size='$5'
                    borderRadius='$4'
                    borderWidth={2}
                    borderColor='$gray5'
                    focusStyle={{
                      borderColor: '$blue10',
                      backgroundColor: '$blue5',
                    }}
                    backgroundColor='$background'
                    fontSize='$4'
                    textAlign='center'
                  />
                  <Input
                    placeholder='Enter mobile number'
                    value={mobile}
                    onChangeText={setMobile}
                    keyboardType='phone-pad'
                    autoComplete='tel'
                    flex={1}
                    size='$5'
                    borderRadius='$4'
                    borderWidth={2}
                    borderColor='$gray5'
                    focusStyle={{
                      borderColor: '$blue10',
                      backgroundColor: '$blue5',
                    }}
                    backgroundColor='$background'
                    fontSize='$4'
                    paddingHorizontal='$4'
                  />
                </XStack>
              </YStack>
            )}

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

            {/* Submit Button */}
            <Button
              size='$5'
              onPress={handleRequestOTP}
              disabled={isLoading}
              backgroundColor='$blue10'
              color='white'
              borderRadius='$4'
              fontWeight='700'
              fontSize='$5'
              hoverStyle={{ backgroundColor: '$blue9' }}
              pressStyle={{ backgroundColor: '$blue11' }}
              marginTop='$2'
            >
              {isLoading ? (
                <XStack space='$3' alignItems='center'>
                  <Spinner size='small' color='white' />
                  <Text color='white' fontWeight='700'>
                    Sending OTP...
                  </Text>
                </XStack>
              ) : (
                'Continue with OTP'
              )}
            </Button>
          </YStack>

          {/* Footer */}
          <YStack space='$2' alignItems='center' marginTop='$4'>
            <Text
              fontSize='$2'
              color='$gray10'
              textAlign='center'
              lineHeight='$1'
            >
              By continuing, you agree to our
            </Text>
            <XStack space='$2' alignItems='center'>
              <Text fontSize='$2' color='$blue10' fontWeight='600'>
                Terms of Service
              </Text>
              <Text fontSize='$2' color='$gray10'>
                and
              </Text>
              <Text fontSize='$2' color='$blue10' fontWeight='600'>
                Privacy Policy
              </Text>
            </XStack>
          </YStack>
        </YStack>
      </View>
    </Theme>
  );
}
