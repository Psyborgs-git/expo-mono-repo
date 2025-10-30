import React from 'react';
import { Alert as RNAlert } from 'react-native';

export const Alert = {
  alert: (title: string, message?: string, buttons?: any) =>
    RNAlert.alert(title, message, buttons),
};

export default Alert;
