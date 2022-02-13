import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useContext } from 'react';
import UserAvatar from '../../components/user/UserAvatar';
import AppText from '../../components/common/AppText';
import AppSurface from '../../components/common/AppSurface';
import AppLabelValue from '../../components/common/AppLabelValue';
import { List } from 'react-native-paper';
import AppButton from '../../components/common/AppButton';
import AppSpacer from '../../components/common/AppSpacer';
import useAssociation from '../../hooks/useAssociation';
import useCotisation from '../../hooks/useCotisation';
import useSelectedAssociation from '../../hooks/useSelectedAssociation';
import { colors } from '../../utils/styles';
import useAuth from '../../hooks/useAuth';
import { SelectedAssociationContext } from '../../contexts/SelectedAssociationContext';
import { responseToAdhesionMessage } from '../../api/services/memberServices';
import { useState } from 'react/cjs/react.development';
import useEngagement from '../../hooks/useEngagement';
import AppActivityIndicator from '../../components/common/AppActivityIndicator';
import { selectedAssoActions } from '../../reducers/selectedAssociationReducer';

export default function MemberDetailScreen({ route }) {
  const selectedMember = route.params;
  const { selectedAssoState } = useContext(SelectedAssociationContext);
  const { formatFonds } = useAssociation();
  const { isAdmin, isModerator } = useAuth();
  const { getMemberCotisationsInfo } = useSelectedAssociation();
  const { getSelectedMemberEngagements } = useEngagement();
  const isAdministrateur = isAdmin() || isModerator();
  const isNotYetMember = selectedMember.member.relation.toLowerCase() !== 'member';
  const [loading, setLoading] = useState(false);

  const adhesionResponse = async (resp) => {
    setLoading(true);
    const data = {
      associationId: selectedAssoState.selectedAssociation.id,
      userId: selectedMember.id,
      adminResponse: resp.adminResponse,
      info: resp.info,
    };
    const response = await responseToAdhesionMessage(data);
    if (!response.ok) {
      setLoading(false);
      alert('La requête a échoué. Veuillez reessayer plutard.');
      return;
    }
    dispatchSelectedAsso({ type: selectedAssoActions.respond_to_adhesion, member: response.data });
    setLoading(false);
    alert('Requête effectuée avec succès.');
  };

  const handleLeaveAssociation = () => {};

  return (
    <>
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        <View style={styles.avatarContainer}>
          <UserAvatar avatarStyle={styles.avatar} user={selectedMember} />
          <AppText>
            {selectedMember.username ? selectedMember.username : selectedMember.email}
          </AppText>
        </View>
        <AppSpacer />
        <AppSpacer />
        <AppSurface surfaceStyle={styles.surface} info="Fonds">
          <AppText>{formatFonds(selectedMember.member.fonds)}</AppText>
        </AppSurface>
        <AppSpacer />
        <AppSpacer />
        <List.Accordion title="Infos personnelles">
          <AppSpacer />
          <AppLabelValue label="Nom" value={selectedMember.nom} />
          <AppLabelValue label="Prenom" value={selectedMember.prenom} />
          <AppLabelValue label="Contact" value={selectedMember.phone} />
          <AppLabelValue label="Adresse" value={selectedMember.adresse} />
          <AppLabelValue label="Profession" value={selectedMember.profession} />
          <AppLabelValue label="Emploi" value={selectedMember.emploi} />
          <AppSpacer />
        </List.Accordion>
        <AppSpacer />
        <AppSpacer />
        <AppButton
          mode="outlined"
          title={`Cotisations (${
            getMemberCotisationsInfo(selectedMember.member.id).nombreCotisations
          }) ${formatFonds(
            getMemberCotisationsInfo(selectedMember.member.id).totalCotisationsMontant
          )}`}
        />
        <AppSpacer />
        <AppButton
          mode="outlined"
          title={`Engagements (${
            getSelectedMemberEngagements(selectedMember.member.id).totalEngagements
          }) ${formatFonds(getSelectedMemberEngagements(selectedMember.member.id).totalAmount)}`}
        />
        <AppSpacer />
        {isAdministrateur && isNotYetMember && (
          <View>
            <AppButton
              onPress={() => adhesionResponse({ adminResponse: 'member', info: 'new' })}
              style={styles.accept}
              title="Accepter"
            />
            <AppSpacer />
            <AppButton
              onPress={() => adhesionResponse({ adminResponse: 'rejected', info: 'new' })}
              style={styles.refuse}
              title="Refuser"
            />
          </View>
        )}
        <AppSpacer />
        {selectedAssoState.connectedMember.id === selectedMember.id && (
          <AppButton
            onPress={handleLeaveAssociation}
            style={styles.leave}
            title="Quitter cette association"
          />
        )}
      </ScrollView>
      {loading && <AppActivityIndicator />}
    </>
  );
}

const styles = StyleSheet.create({
  accept: {
    backgroundColor: colors.vert,
  },
  avatar: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainerStyle: {
    marginHorizontal: 20,
    paddingVertical: 20,
  },
  leave: {
    fontSize: 15,
    backgroundColor: colors.rougeBordeau,
  },
  refuse: {
    backgroundColor: colors.rougeBordeau,
  },
  surface: {
    paddingVertical: 40,
  },
});
