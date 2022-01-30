import React from 'react';
import { TextInput } from 'react-native-paper';
import { useFormikContext } from 'formik';
import ErrorMessage from './ErrorMessage';

export default function AppFormField({ name, icon, fieldRef, ...other }) {
  const { setFieldTouched, errors, touched, setFieldValue, values } = useFormikContext();
  return (
    <>
      <TextInput
        autoCapitalize="none"
        left={icon ? <TextInput.Icon name={icon} /> : null}
        onChangeText={(text) => setFieldValue(name, text)}
        onBlur={() => setFieldTouched(name)}
        value={values[name]}
        {...other}
      />
      <ErrorMessage visible={touched[name]} error={errors[name]} />
    </>
  );
}
