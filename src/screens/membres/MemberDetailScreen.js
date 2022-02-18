import { StyleSheet, View, ScrollView } from 'react-native';
import React, { useContext } from 'react';
import UserAvatar from '../../components/user/UserAvatar';
import AppText from '../../components/common/AppText';
import AppSurface from '../../components/common/AppSurface';
import AppLabelValue from '../../components/common/AppLabelValue';
import { List } from 'react-native-paper';
import AppButton from '../../components/common/AppButton';
import AppSpacer from '../../components/common/AppSpacer';
import useAssociation from '../../hooks/useAssociation';
import useSelectedAssociation from '../../hooks/useSelectedAssociation';
import { colors } from '../../utils/styles';
import useAuth from '../../hooks/useAuth';
import { SelectedAssociationContext } from '../../contexts/SelectedAssociationContext';
import { responseToAdhesionMessage } from '../../api/services/memberServices';
import { useState } from 'react/cjs/react.development';
import useEngagement from '../../hooks/useEngagement';
import AppActivityIndicator from '../../components/common/AppActivityIndicator';
import { selectedAssoActions } from '../../reducers/selectedAssociationReducer';
import routes from '../../navigation/routes';
import useMember from '../../hooks/useMember';

export default function MemberDetailScreen({ route, navigation }) {
  const selectedMember = route.params;
  const { selectedAssoState, dispatchSelectedAsso } = useContext(SelectedAssociationContext);
  const { formatFonds } = useAssociation();
  const { isAdmin, isModerator } = useAuth();
  const { getMemberCotisationsInfo } = useSelectedAssociation();
  const { getSelectedMemberEngagements } = useEngagement();
  const { sendLeavingMessage } = useMember();
  const isAdministrateur = isAdmin() || isModerator();
  const isNotYetMember = selectedMember.member.relation.toLowerCase() === 'ondemand';
  const [loading, setLoading] = useState(false);

  const canQuitte =
    selectedAssoState.connectedMember.id === selectedMember.id &&
    selectedMember.member.relation.toLowerCase() === 'member';

  const authorizeQuit =
    selectedMember.member.relation.toLowerCase() === 'onleave' && isAdministrateur;

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

  const handleLeaveAssociation = () => {
    setLoading(true);
    sendLeavingMessage(selectedMember);
    setLoading(false);
  };

  const handleShowImage = () => {
    if (!selectedMember.avatar) {
      return;
    }
    const params = { url: selectedMember.avatar };
    navigation.navigate(routes.SHOW_IMAGE, params);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        <View style={styles.avatarContainer}>
          <UserAvatar onPress={handleShowImage} avatarStyle={styles.avatar} user={selectedMember} />
          <AppText>
            {selectedMember.username ? selectedMember.username : selectedMember.email}
          </AppText>
        </View>
        <AppSpacer />
        <AppSpacer />
        <AppSurface surfaceStyle={styles.surface} info="Fonds">
          <AppText style={styles.reelFunds}>{formatFonds(selectedMember.member.fonds)}</AppText>
          <AppText style={styles.whiteFunds}>
            {formatFonds(getMemberCotisationsInfo(selectedMember.member.id).whiteFunds)}
          </AppText>
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
          style={styles.actionButtons}
          mode="outlined"
          title={`Cotisations (${
            getMemberCotisationsInfo(selectedMember.member.id).nombreCotisations
          }) ${formatFonds(
            getMemberCotisationsInfo(selectedMember.member.id).totalCotisationsMontant
          )}`}
        />
        <AppSpacer />
        <AppButton
          style={styles.actionButtons}
          mode="outlined"
          title={`Engagements (${
            getSelectedMemberEngagements(selectedMember.member.id).totalEngagements
          }) ${formatFonds(getSelectedMemberEngagements(selectedMember.member.id).totalAmount)}`}
        />
        {isAdministrateur && isNotYetMember && (
          <View>
            <AppSpacer />
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
        {canQuitte && (
          <AppButton
            onPress={handleLeaveAssociation}
            style={styles.leave}
            title="Quitter cette association"
          />
        )}
        {authorizeQuit && (
          <View style={styles.quitContainer}>
            <AppText>
              {selectedMember.username ? selectedMember.username : selectedMember.email} veut
              quitter l'association.
            </AppText>
            <View style={styles.quitter}>
              <AppText
                onPress={() => adhesionResponse({ adminResponse: 'accepted', info: 'old' })}
                style={styles.accepter}
              >
                Accepter
              </AppText>
              <AppText
                onPress={() => adhesionResponse({ adminResponse: 'rejected', info: 'old' })}
                style={styles.refuser}
              >
                Refuser
              </AppText>
            </View>
          </View>
        )}
      </ScrollView>
      {loading && <AppActivityIndicator />}
    </>
  );
}

const styles = StyleSheet.create({
  accepter: {
    color: colors.vert,
  },
  actionButtons: {
    backgroundColor: colors.white,
  },
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
  quitter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  quitContainer: {
    backgroundColor: colors.leger,
    padding: 5,
  },
  reelFunds: {
    fontWeight: 'bold',
  },
  refuse: {
    backgroundColor: colors.rougeBordeau,
  },
  refuser: {
    color: colors.rougeBordeau,
  },
  surface: {
    paddingVertical: 40,
  },
  whiteFunds: {
    justifyContent: 'space-around',
    fontSize: 15,
    color: colors.leger,
    textDecorationLine: 'line-through',
  },
});
