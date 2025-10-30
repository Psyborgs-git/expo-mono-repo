import React from 'react';
import { Input } from '../atoms/Input';

export const PriceInput = (props: any) => (
  <Input keyboardType='numeric' {...props} />
);

export default PriceInput;
