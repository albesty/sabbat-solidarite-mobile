import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { List, TextInput } from 'react-native-paper';
import * as Yup from 'yup';
import AppSpacer from '../../components/common/AppSpacer';
import { AppForm, AppFormField, AppSubmitButton } from '../../components/form';
import { changePassword } from '../../api/services/authServices';
import routes from '../../navigation/routes';
import AppActivityIndicator from '../../components/common/AppActivityIndicator';

const valideChangePass = Yup.object().shape({
  oldPass: Yup.string()
    .min(6, 'Saisissez au moins 6 caractères.')
    .required('Saisissez votre ancien passe'),
  newPass: Yup.string()
    .min(6, 'Saisissez au moins 6 caractères.')
    .required('Entrez un nouveau passe.'),
  confirmNewPass: Yup.string()
    .when('newPass', {
      is: (val) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf([Yup.ref('newPass')], 'Les nouveaux passes ne correspondent pas.'),
    })
    .required('Veuillez confirmer le mot de passe.'),
});

const valideEmail = Yup.object().shape({
  email: Yup.string().email('Adresse mail invalide').required('Adresse email requise.'),
});
export default function ConnexionParamScreen({ navigation, route }) {
  const selectedUser = route.params;
  const [secureOldPass, setSecureOldPass] = useState(true);
  const [secureNewPass, setSecureNewPass] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleChangeParam = async (data, { resetForm }) => {
    setLoading(true);
    let userData = {};
    if (data.email) {
      userData = {
        userId: selectedUser.id,
        email: data.email,
      };
    } else {
      userData = {
        userId: selectedUser.id,
        oldPass: data.oldPass,
        newPass: data.newPass,
      };
    }
    const response = await changePassword(userData);
    if (!response.data) {
      setLoading(false);
      alert('Impossible de changer le mot de passe, veuillez reessayer plutard.');
      return;
    }
    resetForm();
    setLoading(false);
    alert('Vos paramètres ont été modifiés avec succès.');
    navigation.navigate(routes.WELCOME);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <List.Accordion title="Changer le mot de passe">
          <AppForm
            initialValues={{
              oldPass: '',
              newPass: '',
              confirmNewPass: '',
            }}
            validationSchema={valideChangePass}
            onSubmit={handleChangeParam}
          >
            <View
              style={{
                marginHorizontal: 20,
              }}
            >
              <AppFormField
                secureTextEntry={secureOldPass}
                right={
                  <TextInput.Icon name="eye" onPress={() => setSecureOldPass(!secureOldPass)} />
                }
                icon="lock"
                name="oldPass"
                label="Ancien password"
              />
              <AppSpacer />
              <AppFormField
                secureTextEntry={secureNewPass}
                right={
                  <TextInput.Icon name="eye" onPress={() => setSecureNewPass(!secureNewPass)} />
                }
                icon="lock"
                name="newPass"
                label="Nouveau password"
              />
              <AppSpacer />
              <AppFormField
                secureTextEntry={true}
                icon="lock"
                name="confirmNewPass"
                label="Confirmer nouveau pass"
              />
              <AppSpacer />
              <AppSubmitButton title="Valider" />
            </View>
          </AppForm>
        </List.Accordion>
        <AppSpacer />
        <List.Accordion title="Changer l'adresse mail">
          <AppForm
            initialValues={{
              email: '',
            }}
            validationSchema={valideEmail}
            onSubmit={handleChangeParam}
          >
            <View style={styles.container}>
              <AppFormField name="email" label="Nouvelle adresse email" />
              <AppSpacer />
              <AppSubmitButton title="Valider" />
            </View>
          </AppForm>
        </List.Accordion>
      </ScrollView>
      {loading && <AppActivityIndicator />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    marginHorizontal: 10,
  },
});
