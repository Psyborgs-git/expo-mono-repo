import { Stack } from 'expo-router';

export default function OrganizationLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f8f9fa',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="settings"
        options={{
          title: 'Organization Settings',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="members"
        options={{
          title: 'Members',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="invite"
        options={{
          title: 'Invite Member',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="roles"
        options={{
          title: 'Roles & Permissions',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          headerBackTitle: 'Back',
        }}
      />
    </Stack>
  );
}