import React, { useState } from 'react';
import * as Yup from 'yup';

import { AppForm, AppFormField, AppSubmitButton } from '../../components/form';
import AppSpacer from '../../components/common/AppSpacer';
import AuthBackground from '../../components/authentication/AuthBackground';
import { TextInput } from 'react-native-paper';
import { register } from '../../api/services/authServices';
import useAuth from '../../hooks/useAuth';
import routes from '../../navigation/routes';
import AppActivityIndicator from '../../components/common/AppActivityIndicator';
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

export default function RegisterScreen({ navigation }) {
  const { getUserLoggedIn } = useAuth();
  const [securePassword, setSecurePassword] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (user, { resetForm }) => {
    setLoading(true);
    setError(null);
    const userData = {
      email: user.email,
      password: user.password,
    };

    const response = await register(userData);
    if (!response.ok) {
      setLoading(false);
      setError(
        response.data.message ? response.data.message : 'Désolé, nous avons rencontré un problème.'
      );
      return;
    }
    const connexionError = await getUserLoggedIn(userData);
    setLoading(false);
    if (connexionError) navigation.navigate(routes.LOGIN);
    else navigation.navigate('Starter', { screen: routes.STARTER });
  };

  return (
    <>
      <AuthBackground error={error}>
        <AppForm
          initialValues={{
            email: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={validUser}
          onSubmit={handleRegister}
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
            right={<TextInput.Icon name="eye" onPress={() => setSecurePassword(!securePassword)} />}
            secureTextEntry={securePassword}
            icon="lock"
            label="password"
            name="password"
            textContentType="password"
          />
          <AppSpacer />
          <AppFormField
            secureTextEntry={true}
            icon="lock"
            label="confirmer password"
            name="confirmPassword"
            textContentType="password"
          />
          <AppSpacer />
          <AppSubmitButton title="Valider" />
        </AppForm>
      </AuthBackground>
      {loading && <AppActivityIndicator />}
    </>
  );
}
