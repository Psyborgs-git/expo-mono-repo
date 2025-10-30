import React from 'react';
import { Input } from '../atoms/Input';

export const NumberInput = (props: any) => (
  <Input keyboardType='numeric' {...props} />
);

export default NumberInput;
