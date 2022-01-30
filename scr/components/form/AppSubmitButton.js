import { View, Text } from 'react-native';
import React from 'react';
import AppButton from '../../components/common/AppButton';
import { useFormikContext } from 'formik';

export default function AppSubmitButton({ icon, title }) {
  const { handleSubmit } = useFormikContext();

  return <AppButton icon={icon} title={title} onPress={handleSubmit} />;
}
