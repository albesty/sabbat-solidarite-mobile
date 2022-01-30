import React, { useState } from 'react';
import * as Yup from 'yup';

import { AppForm, AppFormField, AppSubmitButton } from '../../components/form';
import AppSpacer from '../../components/common/AppSpacer';
import AuthBackground from '../../components/authentication/AuthBackground';
import { TextInput } from 'react-native-paper';

const validUser = Yup.object().shape({
  email: Yup.string().email('Email invalid.').required('Adresse mail requise.'),
  password: Yup.string()
    .min(6, 'Le mot de passe doit être de 6 caractères minimum.')
    .required('Mot de passe requis'),
  confirmPassword: Yup.string()
    .when('password', {
      is: (val) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf([Yup.ref('password')], 'Les mots de passe  ne correspondent pas.'),
    })
    .required('Veuillez confirmer le mot de passe.'),
});

export default function RegisterScreen() {
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirmPass, setSecureConfirmPass] = useState(true);

  const handleRegister = (user) => {
    console.log(user);
  };

  return (
    <AuthBackground style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <AppForm
        initialValues={{
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={validUser}
        onSubmit={handleRegister}
      >
        <AppFormField icon="email" label="email" name="email" />
        <AppSpacer />
        <AppFormField
          right={<TextInput.Icon name="eye" onPress={() => setSecurePassword(!securePassword)} />}
          secureTextEntry={securePassword}
          icon="lock"
          label="password"
          name="password"
        />
        <AppSpacer />
        <AppFormField
          right={
            <TextInput.Icon name="eye" onPress={() => setSecureConfirmPass(!secureConfirmPass)} />
          }
          secureTextEntry={secureConfirmPass}
          icon="lock"
          label="confirmer password"
          name="confirmPassword"
        />
        <AppSpacer />
        <AppSubmitButton title="Valider" />
      </AppForm>
    </AuthBackground>
  );
}
