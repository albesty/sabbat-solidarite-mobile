import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import AssociationCard from '../../components/association/AssociationCard';
import { useContext, useState } from 'react/cjs/react.development';
import { MemberContext } from '../../contexts/MemberContext';
import { List } from 'react-native-paper';
import useAssociation from '../../hooks/useAssociation';
import useAuth from '../../hooks/useAuth';
import AppButton from '../../components/common/AppButton';
import routes from '../../navigation/routes';
import { colors } from '../../utils/styles';
import AppLabelAndValueSimple from '../../components/common/AppLabelAndValueSimple';
import AppLabelValue from '../../components/common/AppLabelValue';
import AppSpacer from '../../components/common/AppSpacer';
import AppPickAndUploadDocument from '../../components/common/AppPickAndUploadDocument';
import useUploadImage from '../../hooks/useUploadImage';

export default function AssociationDetailScreen({ route, navigation }) {
  const { formatFonds, showLargeImage } = useAssociation();
  const { isAdmin } = useAuth();
  const { getFilePrint } = useUploadImage();
  const selectedAssociation = route.params;
  const { memberState } = useContext(MemberContext);
  const [expandCotisation, setExpandCotisation] = useState(false);
  const [expandGestion, setExpandGestion] = useState(false);
  const [expandContact, setExpandContact] = useState(false);
  const [expandReglement, setExpandReglement] = useState(false);

  return (
    <>
      <AssociationCard
        handleValidPress={() => showLargeImage(selectedAssociation.avatar)}
        showCamera={true}
        adhesionState={memberState.userAssociations
          .find((ass) => ass.id === selectedAssociation.id)
          ?.member?.relation.toLowerCase()}
        coverStyle={styles.cover}
        cardStyle={styles.card}
        association={selectedAssociation}
      />
      <ScrollView contentContainerStyle={styles.contentStyle} showsVerticalScrollIndicator={false}>
        <List.Accordion
          expanded={expandCotisation}
          onPress={() => setExpandCotisation(!expandCotisation)}
          title="Cotisation"
        >
          <AppLabelAndValueSimple
            label="Cotisation mensuelle"
            value={formatFonds(selectedAssociation.cotisationMensuelle)}
          />
          <AppSpacer />
          <AppLabelAndValueSimple
            label="fréquence de la cotisation"
            value={selectedAssociation.frequenceCotisation}
          />
          <AppSpacer />
        </List.Accordion>
        <List.Accordion
          expanded={expandGestion}
          onPress={() => setExpandGestion(!expandGestion)}
          title="Gestion du fonds"
        >
          <AppLabelValue
            label="seuil de sécurité"
            value={`${selectedAssociation.seuilSecurite} %`}
          />
          <AppSpacer />
          <AppLabelValue
            label="Seuil qutotité individuelle"
            value={`${selectedAssociation.individualQuotite} %`}
          />
          <AppSpacer />
          <AppLabelValue label="Taux d'intérêt" value={`${selectedAssociation.interetCredit} %`} />
          <AppSpacer />
          <AppLabelValue label="Taux de pénalité" value={`${selectedAssociation.penality} %`} />
          <AppSpacer />
          <AppLabelAndValueSimple
            label="Nombre de validateurs"
            value={`${selectedAssociation.validationLenght} membre(s)`}
          />
        </List.Accordion>
        <List.Accordion
          expanded={expandContact}
          onPress={() => setExpandContact(!expandContact)}
          title="Contacts"
        >
          <AppLabelAndValueSimple label="Administrateur" value={selectedAssociation.telAdmin} />
        </List.Accordion>

        <List.Accordion
          expanded={expandReglement}
          onPress={() => setExpandReglement(!expandReglement)}
          title="Reglementation"
        >
          <AppButton
            icon="file-pdf"
            labelStyle={styles.reglementLabel}
            style={styles.buttons}
            onPress={() => getFilePrint(selectedAssociation.reglementInterieur)}
            title="Consulter le reglement."
            mode="text"
          />
          {isAdmin() && <AppPickAndUploadDocument association={selectedAssociation} />}
        </List.Accordion>

        {isAdmin() && (
          <AppButton
            style={styles.button}
            onPress={() => navigation.navigate(routes.NEW_ASSOCIATION, selectedAssociation)}
            title="Editer"
            icon="content-save-edit"
          />
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  camera: {
    bottom: 10,
  },
  card: {
    width: '100%',
    alignSelf: 'center',
    margin: 0,
  },
  contentStyle: {
    paddingVertical: 20,
    paddingBottom: 20,
    marginHorizontal: 20,
  },
  button: {
    backgroundColor: colors.rougeBordeau,
    alignSelf: 'flex-end',
    width: '50%',
    marginRight: 20,
    marginVertical: 20,
  },
  editReglement: {
    backgroundColor: colors.bleuFbi,
    alignSelf: 'flex-end',
  },
  buttons: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: colors.white,
    marginTop: 10,
  },
  reglementLabel: {
    color: colors.black,
    paddingVertical: 5,
  },
});
