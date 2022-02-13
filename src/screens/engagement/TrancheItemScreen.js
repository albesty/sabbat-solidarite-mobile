import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import * as Yup from 'yup';
import AppText from '../../components/common/AppText';
import { colors } from '../../utils/styles';
import AppSurface from '../../components/common/AppSurface';
import useAssociation from '../../hooks/useAssociation';
import AppButton from '../../components/common/AppButton';
import AppLabelAndValueSimple from '../../components/common/AppLabelAndValueSimple';
import { AppForm, AppFormField, AppSubmitButton } from '../../components/form';
import AppSpacer from '../../components/common/AppSpacer';
import { SelectedAssociationContext } from '../../contexts/SelectedAssociationContext';
import AppActivityIndicator from '../../components/common/AppActivityIndicator';
import { payTranche } from '../../api/services/engagementServices';
import { selectedAssoActions } from '../../reducers/selectedAssociationReducer';
import routes from '../../navigation/routes';

const validMontant = Yup.object().shape({
  montant: Yup.number().typeError('Montant incorrect').required('Indiquez le montant à payer'),
});

export default function TrancheItemScreen({ route, navigation }) {
  const selectedParams = route.params;
  const { selectedAssoState, dispatchSelectedAsso } = useContext(SelectedAssociationContext);
  const { formatFonds, formatDate } = useAssociation();
  const [paying, setPaying] = useState(false);
  const [selectedTranche, setSelectedTranche] = useState(
    selectedParams ? selectedParams.tranche : {}
  );
  const [loading, setLoading] = useState(false);
  const [creatorMember, setCreatorMember] = useState(selectedParams ? selectedParams.creator : {});
  //   const creatorMember = getSelectedEngagementMember(selectedTranche.engagementId);
  const canBePayed =
    selectedTranche.montant !== selectedTranche.solde &&
    paying === false &&
    selectedAssoState.connectedMember.id === creatorMember.userId;

  const getSelectedTranche = () => {
    const selectedEngagement = selectedAssoState.associationEngagements.find(
      (engage) => engage.id === selectedParams.tranche.engagementId
    );
    const engagemenTranches = selectedEngagement.tranches;
    const currentTranche = engagemenTranches.find(
      (tranch) => tranch.id === selectedParams.tranche.id
    );
    setSelectedTranche(currentTranche);
  };

  const handlePayTranche = async (montantData, { resetForm }) => {
    const memberWallet = selectedAssoState.connectedMember.wallet;
    if (memberWallet < Number(montantData.montant)) {
      Alert.alert('Info', 'Fonds insufisants dans votre portefeuille.', [
        {
          text: 'Recharger',
          onPress: () => navigation.navigate(routes.STARTER),
        },
        {
          text: 'Plutard',
          onPress: () => null,
        },
      ]);
      return;
    }
    setLoading(true);
    const data = {
      id: selectedTranche.id,
      engagementId: selectedTranche.engagementId,
      userId: creatorMember.userId,
      montant: montantData.montant,
    };
    const response = await payTranche(data);
    if (!response.ok) {
      setLoading(false);
      alert('Erreur: Nous avons rencontré un problème lors du payement.');
      return;
    }
    dispatchSelectedAsso({ type: selectedAssoActions.pay_tranche, engagement: response.data });
    getSelectedTranche();
    setLoading(false);
    resetForm();
    setPaying(false);
  };

  useEffect(() => {
    getSelectedTranche();
  }, []);

  return (
    <>
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        <View style={styles.libelleContainer}>
          <AppText style={styles.libelle}>{selectedTranche.libelle}</AppText>
        </View>
        <View style={styles.montantContainer}>
          <AppSurface info="A payer" surfaceStyle={styles.surfaceStyle}>
            <AppText style={styles.montantText}>{formatFonds(selectedTranche.montant)}</AppText>
          </AppSurface>
          <AppSurface info="Déjà payé" surfaceStyle={styles.surfaceStyle}>
            <AppText style={styles.montantText}>{formatFonds(selectedTranche.solde)}</AppText>
          </AppSurface>
        </View>
        <View style={styles.buttons}>
          {selectedTranche.montant !== selectedTranche.solde && (
            <AppLabelAndValueSimple
              label="A payer avant le:"
              value={formatDate(selectedTranche.echeance)}
            />
          )}
          {selectedTranche.montant === selectedTranche.solde && (
            <AppLabelAndValueSimple
              label="Payé le:"
              value={formatDate(selectedTranche.updatedAt)}
            />
          )}
        </View>
        {canBePayed && <AppButton onPress={() => setPaying(true)} title="Payer cette tranche" />}
        {paying && (
          <View style={styles.payForm}>
            <AppForm
              initialValues={{
                montant: selectedTranche.montant ? String(selectedTranche.montant) : '',
              }}
              validationSchema={validMontant}
              onSubmit={handlePayTranche}
            >
              <AppFormField label="Montant" keyboardType="numeric" name="montant" />
              <AppSpacer />
              <AppSubmitButton title="Payer" />
            </AppForm>
          </View>
        )}
      </ScrollView>
      {loading && <AppActivityIndicator />}
    </>
  );
}

const styles = StyleSheet.create({
  buttons: {
    alignSelf: 'flex-start',
    marginBottom: 30,
    marginHorizontal: 10,
  },
  contentContainerStyle: {
    alignItems: 'center',
    paddingVertical: 20,
    marginHorizontal: 10,
  },
  libelle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  libelleContainer: {
    marginVertical: 10,
    backgroundColor: colors.leger,
    height: 80,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  montantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  montantText: {
    fontWeight: 'bold',
  },
  payForm: {
    width: '100%',
  },
  surfaceStyle: {
    width: 150,
    height: 80,
    justifyContent: 'center',
  },
});
