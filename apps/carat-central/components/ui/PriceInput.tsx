import React from 'react';
import { Input } from '@bdt/components';

export const PriceInput = (props: any) => (
  <Input keyboardType='numeric' {...props} />
);

export default PriceInput;
