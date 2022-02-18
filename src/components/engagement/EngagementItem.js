import { StyleSheet, View, TouchableOpacity } from 'react-native';
import React, { useContext, useState } from 'react';
import AppText from '../common/AppText';
import useAssociation from '../../hooks/useAssociation';
import { colors } from '../../utils/styles';
import VotingItem from './VotingItem';
import AppSpacer from '../common/AppSpacer';
import { List } from 'react-native-paper';
import AppIconButton from '../common/AppIconButton';
import useAuth from '../../hooks/useAuth';
import routes from '../../navigation/routes';
import { useNavigation } from '@react-navigation/native';
import UserAvatar from '../user/UserAvatar';
import useEngagement from '../../hooks/useEngagement';
import SmallMemberItem from '../member/SmallMemberItem';
import { deleteOne } from '../../api/services/engagementServices';
import AppActivityIndicator from '../common/AppActivityIndicator';
import { SelectedAssociationContext } from '../../contexts/SelectedAssociationContext';
import { selectedAssoActions } from '../../reducers/selectedAssociationReducer';

export default function EngagementItem({ engagement }) {
  const navigation = useNavigation();
  const { dispatchSelectedAsso } = useContext(SelectedAssociationContext);
  const { formatFonds, formatDate } = useAssociation();
  const { isAdmin, isModerator } = useAuth();
  const { getEngagementCreator } = useEngagement();
  const [loading, setLoading] = useState(false);

  const isAuthorize = isAdmin() || isModerator();
  const creator = getEngagementCreator(engagement.Creator.id);

  const handleSelectTranche = (tranche) => {
    if (engagement.accord !== true) return;
    const trancheParams = {
      creator: engagement.Creator,
      tranche: tranche,
    };
    navigation.navigate(routes.TRANCHE_ITEM, trancheParams);
  };

  const handleGetCreator = () => {
    navigation.navigate(routes.MEMBER, { screen: routes.MEMBER_DETAIL, params: creator });
  };
  const handleDeleteEngagement = async () => {
    setLoading(true);
    const response = await deleteOne({ engagementId: engagement.id });
    if (!response.ok) {
      setLoading(false);
      alert('Impossible de supprimer cet engagement.');
      return;
    }
    dispatchSelectedAsso({
      type: selectedAssoActions.delete_one_engagement,
      engagementId: response.engagementId,
    });
    setLoading(false);
    alert('Engagement supprimé avec succès.');
  };

  const handleGoToVotants = () => {
    navigation.navigate(routes.ENGAGEMENT_VOTANTS, engagement);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.statutContainer}>
          <AppText style={styles.statut}>{engagement.statut}</AppText>
          <AppText>{engagement.typeEngagement}</AppText>
        </View>
        <AppText numberOfLines={2} style={styles.libelle}>
          {engagement.libelle}
        </AppText>
        <AppText>{formatFonds(engagement.montant)}</AppText>

        <List.Accordion title="Tranches de payement">
          {engagement.tranches.map((tranche, index) => (
            <TouchableOpacity
              onPress={() => handleSelectTranche(tranche)}
              style={styles.trancheContainer}
              key={tranche.id.toString() + 'tranche'}
            >
              <AppText style={styles.trancheText}>{formatFonds(tranche.montant)}</AppText>
              <AppText style={styles.trancheText}>
                {tranche.montant === tranche.solde ? ' payé le: ' : ' à payer le: '}
              </AppText>
              <AppText style={styles.trancheText}>
                {tranche.montant === tranche.solde
                  ? formatDate(tranche.updatedAt)
                  : formatDate(tranche.echeance)}
              </AppText>
            </TouchableOpacity>
          ))}
        </List.Accordion>
        <AppSpacer />
        <View style={styles.creatorContainer}>
          <AppText style={styles.creatorText}>Par</AppText>
          <SmallMemberItem onPress={handleGetCreator} creator={creator} />
        </View>
        <AppSpacer />
        {!engagement.accord && (
          <VotingItem goToVotants={handleGoToVotants} engagement={engagement} />
        )}
        {engagement.statut.toLowerCase() === 'rejected' && (
          <View style={styles.rejected}>
            <AppText style={styles.rejectedText}>refusé</AppText>
            {isAuthorize && (
              <AppIconButton
                onPress={handleDeleteEngagement}
                icon="delete"
                style={{
                  backgroundColor: colors.rougeBordeau,
                }}
              />
            )}
          </View>
        )}
      </View>
      {loading && <AppActivityIndicator />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rejected: {
    position: 'absolute',
    backgroundColor: colors.white,
    opacity: 0.7,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectedText: {
    color: colors.rougeBordeau,
  },
  statut: {
    color: colors.or,
  },
  statutContainer: {
    alignItems: 'flex-end',
  },
  trancheContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  trancheText: {
    fontSize: 15,
  },
});
