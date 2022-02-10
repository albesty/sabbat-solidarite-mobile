import { StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import AssociationCard from '../../components/association/AssociationCard';
import { useContext, useState } from 'react/cjs/react.development';
import { MemberContext } from '../../contexts/MemberContext';
import useMember from '../../hooks/useMember';
import { List } from 'react-native-paper';
import useAssociation from '../../hooks/useAssociation';
import useAuth from '../../hooks/useAuth';
import AppButton from '../../components/common/AppButton';
import routes from '../../navigation/routes';
import { colors } from '../../utils/styles';

export default function AssociationDetailScreen({ route, navigation }) {
  const { getAssociationMemberState } = useMember();
  const { formatFonds } = useAssociation();
  const { isAdmin } = useAuth();
  const selectedAssociation = route.params;
  const { memberState } = useContext(MemberContext);
  const [expandCotisation, setExpandCotisation] = useState(false);
  const [expandGestion, setExpandGestion] = useState(false);
  const [expandContact, setExpandContact] = useState(false);
  const [expandReglement, setExpandReglement] = useState(false);

  return (
    <>
      <AssociationCard
        adhesionState={getAssociationMemberState(
          memberState.userAssociations,
          selectedAssociation.id
        )}
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
          <List.Item
            title={`cotisation mensuelle => ${formatFonds(
              selectedAssociation.cotisationMensuelle
            )}`}
          />
          <List.Item title={`Frequence cotisation => ${selectedAssociation.frequenceCotisation}`} />
        </List.Accordion>
        <List.Accordion
          expanded={expandGestion}
          onPress={() => setExpandGestion(!expandGestion)}
          title="Gestion du fonds"
        >
          <List.Item title={`Seuil de sécurité => ${selectedAssociation.seuilSecurite} %`} />
          <List.Item
            title={`Qutotité individuelle => ${selectedAssociation.individualQuotite} %`}
          />
          <List.Item title={`Taux d'intérêt => ${selectedAssociation.interetCredit} %`} />
          <List.Item title={`Taux de pénalité => ${selectedAssociation.penality} %`} />
          <List.Item
            title={`Nombre de validateurs => ${selectedAssociation.validationLenght} membres`}
          />
        </List.Accordion>
        <List.Accordion
          expanded={expandContact}
          onPress={() => setExpandContact(!expandContact)}
          title="Contacts"
        >
          <List.Item title={`Administrateur => ${selectedAssociation.telAdmin}`} />
        </List.Accordion>
        {!selectedAssociation.reglementInterieur && (
          <List.Accordion
            expanded={expandReglement}
            onPress={() => setExpandReglement(!expandReglement)}
            title="Reglementation"
          >
            <List.Item title={`Reglement interieur => Encours de redaction`} />
          </List.Accordion>
        )}
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
  card: {
    width: '100%',
    alignSelf: 'center',
    margin: 0,
  },
  cover: {
    height: 130,
  },
  contentStyle: {
    paddingVertical: 20,
    paddingBottom: 20,
  },
  button: {
    backgroundColor: colors.rougeBordeau,
    alignSelf: 'flex-end',
    width: '50%',
    marginRight: 20,
    marginVertical: 20,
  },
});
