import { StyleSheet, Alert, View } from 'react-native';
import React, { useContext, useState } from 'react';
import * as Yup from 'yup';
import { AppForm, AppFormField, AppSubmitButton } from '../../components/form';
import AppSpacer from '../../components/common/AppSpacer';
import AppText from '../../components/common/AppText';
import { SelectedAssociationContext } from '../../contexts/SelectedAssociationContext';
import AppActivityIndicator from '../../components/common/AppActivityIndicator';
import { payCotisation } from '../../api/services/memberServices';
import { selectedAssoActions } from '../../reducers/selectedAssociationReducer';
import { BottomNavigation } from 'react-native-paper';
import routes from '../../navigation/routes';

const validPayCotis = Yup.object().shape({
  montant: Yup.number().typeError('Montant incorrect.').required('Montant requis'),
});
export default function PayCotisationScreen({ route, navigation }) {
  const selectedCotisation = route.params;
  const { selectedAssoState, dispatchSelectedAsso } = useContext(SelectedAssociationContext);
  const [loading, setLoading] = useState(false);

  const handlePayCotisation = async (data) => {
    const connectedMember = selectedAssoState.connectedMember;
    if (connectedMember.wallet < Number(data.montant) + 100) {
      Alert.alert(
        'Information',
        "Vous n'avez pas suffisamment de fonds pour payer cette cotisation.",
        [
          {
            text: 'recharger',
            onPress: () => navigation.navigate(routes.STARTER),
          },
          { text: 'annuler', onPress: () => null },
        ]
      );
      return;
    }
    setLoading(true);
    const cotisData = {
      memberId: selectedAssoState.connectedMember.member.id,
      cotisationId: selectedCotisation.id,
      montant: data.montant,
    };
    const response = await payCotisation(cotisData);
    if (!response.ok) {
      setLoading(false);
      alert('Impossible de payer la cotisation, veuillez reessayer plutard.');
      return;
    }
    dispatchSelectedAsso({
      type: selectedAssoActions.pay_cotisation,
      memberCotisation: response.data,
    });
    setLoading(false);
    alert('Votre cotisation a été payée avec succès.');
    dispatchSelectedAsso({ type: selectedAssoActions.must_update, updated: true });
    navigation.goBack();
  };
  return (
    <>
      <View style={styles.container}>
        <AppSpacer />
        <AppText>{selectedCotisation.motif}</AppText>
        <AppSpacer />
        <AppForm
          initialValues={{
            montant: selectedCotisation ? String(selectedCotisation.montant) : '',
          }}
          validationSchema={validPayCotis}
          onSubmit={handlePayCotisation}
        >
          <AppFormField keyboardType="numeric" label="Montant à payer" name="montant" />
          <AppSpacer />
          <AppSubmitButton title="Payer" />
        </AppForm>
      </View>
      {loading && <AppActivityIndicator />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    marginHorizontal: 20,
  },
});
