import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import * as Yup from 'yup';
import AuthBackground from '../../components/authentication/AuthBackground';
import AppSpacer from '../../components/common/AppSpacer';
import { AppForm, AppFormField, AppSubmitButton } from '../../components/form';
import useAuth from '../../hooks/useAuth';
import AppActivityIndicator from '../../components/common/AppActivityIndicator';
import AppText from '../../components/common/AppText';
import routes from '../../navigation/routes';
import { colors } from '../../utils/styles';

const validUser = Yup.object().shape({
  email: Yup.string().required('Adresse mail requise.').label('Email'),
  password: Yup.string()
    .min(6, 'Le mot de passe doit être de 6 caractères minimum.')
    .required('Mot de passe requis.'),
});

export default function LoginScreen({ navigation }) {
  const { getUserLoggedIn, isValidEmail } = useAuth();
  const [entrySecured, setEntrySecured] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (user, { resetForm }) => {
    setLoading(true);
    setError(null);
    let data;
    if (isValidEmail(user.email)) {
      data = {
        email: user.email,
        password: user.password,
      };
    } else {
      data = {
        username: user.email,
        password: user.password,
      };
    }
    const connexionError = await getUserLoggedIn(data);
    if (connexionError) {
      setError(connexionError);
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(false);
    resetForm();
    navigation.navigate('Starter');
  };

  const toggleEntrySecurity = () => {
    setEntrySecured(!entrySecured);
  };

  return (
    <>
      <AuthBackground error={error}>
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
            label="email / pseudo "
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
        <View style={styles.missingContainer}>
          <AppText>Oublié? </AppText>
          <AppText
            style={styles.contactText}
            onPress={() => navigation.navigate('Starter', { screen: routes.CONTACT })}
          >
            Contactez nous.
          </AppText>
        </View>
      </AuthBackground>
      {loading && <AppActivityIndicator />}
    </>
  );
}

const styles = StyleSheet.create({
  contactText: {
    color: colors.bleuFbi,
  },
  missingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
});
