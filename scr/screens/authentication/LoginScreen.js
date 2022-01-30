import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';
import * as Yup from 'yup';
import AuthBackground from '../../components/authentication/AuthBackground';
import AppSpacer from '../../components/common/AppSpacer';
import { AppForm, AppFormField, AppSubmitButton } from '../../components/form';

const validUser = Yup.object().shape({
  email: Yup.string()
    .email('Adresse mail invalide.')
    .required('Adresse mail requise.')
    .label('Email'),
  password: Yup.string()
    .min(6, 'Le mot de passe doit être de 6 caractères minimum.')
    .required('Mot de passe requis.'),
});

export default function LoginScreen() {
  const [entrySecured, setEntrySecured] = useState(true);

  const handleLogin = (user) => {
    console.log(user);
  };

  const toggleEntrySecurity = () => {
    setEntrySecured(!entrySecured);
  };
  return (
    <AuthBackground>
      <AppForm
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={validUser}
        onSubmit={handleLogin}
      >
        <AppFormField
          textContentType="emailAddress"
          keyboardType="email-address"
          icon="email"
          label="email"
          name="email"
        />
        <AppSpacer />
        <AppFormField
          textContentType="password"
          secureTextEntry={entrySecured}
          right={<TextInput.Icon name="eye" onPress={toggleEntrySecurity} />}
          icon="lock"
          label="password"
          name="password"
        />
        <AppSpacer />
        <AppSubmitButton title="Valider" />
      </AppForm>
    </AuthBackground>
  );
}
