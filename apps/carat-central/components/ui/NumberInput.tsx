import React from 'react';
import { Input } from '@bdt/components';

export const NumberInput = (props: any) => (
  <Input keyboardType='numeric' {...props} />
);

export default NumberInput;
