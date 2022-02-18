import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import AssociationCard from '../../components/association/AssociationCard';
import AppSurface from '../../components/common/AppSurface';
import AppText from '../../components/common/AppText';
import useAssociation from '../../hooks/useAssociation';
import AppSpacer from '../../components/common/AppSpacer';
import AppSeparator from '../../components/common/AppSeparator';
import AppIconButton from '../../components/common/AppIconButton';
import AppLabelValue from '../../components/common/AppLabelValue';
import { colors } from '../../utils/styles';
import AppButton from '../../components/common/AppButton';
import routes from '../../navigation/routes';
import useSelectedAssociation from '../../hooks/useSelectedAssociation';
import AppActivityIndicator from '../../components/common/AppActivityIndicator';
import { SelectedAssociationContext } from '../../contexts/SelectedAssociationContext';
import { getConnectedMemberRoles } from '../../api/services/selectedAssociationServices';
import { selectedAssoActions } from '../../reducers/selectedAssociationReducer';

export default function CaisseScreen({ route, navigation }) {
  const selectedAssociation = route.params;
  const { selectedAssoState, dispatchSelectedAsso } = useContext(SelectedAssociationContext);
  const [showFunds, setShowFunds] = useState(false);
  const { formatFonds, showLargeImage } = useAssociation();
  const {
    getSelectedAssoMembersCotisations,
    getselectedAssoMembers,
    getSelectedAssoAllCotisations,
    getSelectedMembersAllCotisations,
    getSelectedAssoCurrentMembers,
    getSelectedAssoMembersEngagements,
    getSelectedAssoEngagementsTotals,
    getSelectedAssociationFundInfos,
  } = useSelectedAssociation();
  const [loading, setLoading] = useState(false);

  const getAssociationMembers = useCallback(async () => {
    setLoading(true);
    await getselectedAssoMembers(selectedAssociation.id);
    await getSelectedAssoAllCotisations(selectedAssociation.id);
    await getSelectedAssoMembersCotisations(selectedAssociation.id);
    await getSelectedAssoMembersEngagements(selectedAssociation.id);
    if (selectedAssoState.connectedMember.member) {
      const response = await getConnectedMemberRoles({
        memberId: selectedAssoState.connectedMember.member.id,
      });
      dispatchSelectedAsso({
        type: selectedAssoActions.connected_member_roles,
        roles: response.data,
      });
    }
    setLoading(false);
  });

  const handleGoToMemberDetail = () => {
    navigation.navigate(routes.MEMBER, {
      screen: routes.MEMBER_DETAIL,
      params: selectedAssoState.connectedMember,
    });
  };

  const handleReadReglement = () => {
    alert(
      "Aucun reglement trouvé, veuillez rediger votre reglement puis l'envoyer à Sabbat-Solidarité pour la mise à jour."
    );
  };

  useEffect(() => {
    getAssociationMembers();
  }, []);

  return (
    <>
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        <AssociationCard
          handleValidPress={() => showLargeImage(selectedAssociation.avatar)}
          cardStyle={{
            width: '100%',
            margin: 0,
          }}
          showActions={false}
          association={selectedAssociation}
        />
        <AppSpacer />
        <AppSpacer />

        <AppSurface onPress={() => null} info="La caisse" style={styles.soldeContainer}>
          <AppSpacer />
          <AppText style={styles.fonds}>{formatFonds(selectedAssociation.solde)}</AppText>
          <AppSpacer />
          <AppSeparator style={styles.separator} />
          <AppIconButton
            onPress={() => setShowFunds(!showFunds)}
            size={35}
            style={styles.button}
            icon={showFunds ? 'chevron-up' : 'chevron-down'}
            color={colors.white}
          />
          <AppSpacer />
          {showFunds && (
            <View style={styles.allFunds}>
              <AppLabelValue
                labelStyle={styles.allLabel}
                valueStyle={styles.allValue}
                label="Cotisations"
                value={formatFonds(getSelectedMembersAllCotisations().allMembersMontantCotisations)}
              />
              <AppLabelValue
                valueStyle={[styles.allValue, styles.invest]}
                labelStyle={[styles.allLabel, styles.invest]}
                label="Investissements"
                value={formatFonds(getSelectedAssociationFundInfos().investAmount)}
              />
              <AppLabelValue
                valueStyle={[styles.allValue, styles.gain]}
                labelStyle={[styles.allLabel, styles.gain]}
                label="Gains"
                value={formatFonds(getSelectedAssociationFundInfos().gainAmount)}
              />
              <AppLabelValue
                valueStyle={[styles.allValue, styles.depense]}
                labelStyle={[styles.allLabel, styles.depense]}
                label="Depenses"
                value={formatFonds(getSelectedAssociationFundInfos().depenseAmount)}
              />
              <AppLabelValue
                valueStyle={[styles.allValue, styles.quotite]}
                labelStyle={(styles.allLabel, styles.quotite)}
                label="Quotité"
                value={formatFonds(getSelectedAssociationFundInfos().quotiteAmount)}
              />
              <AppSpacer />
              <AppButton
                onPress={handleGoToMemberDetail}
                style={styles.selfMemberButton}
                mode="outlined"
                title="Compte membre"
                labelStyle={styles.memberCompteLabel}
              />
            </View>
          )}
        </AppSurface>

        <AppButton
          onPress={() => navigation.navigate(routes.MEMBER, { screen: routes.LIST_MEMBER })}
          style={styles.buttons}
          mode="outlined"
          title={`Membres (${getSelectedAssoCurrentMembers().actifMembers.length})`}
        />
        <AppSpacer />
        <AppButton
          onPress={() => navigation.navigate(routes.COTISATION, { screen: routes.ETAT_COTISATION })}
          style={styles.buttons}
          mode="outlined"
          title={`Cotisations (${
            getSelectedMembersAllCotisations().allMembersTotalCotisations
          }) ${formatFonds(getSelectedMembersAllCotisations().allMembersMontantCotisations)}`}
        />
        <AppSpacer />
        <AppButton
          onPress={() => navigation.navigate(routes.ENGAGEMENT)}
          style={styles.buttons}
          mode="outlined"
          title={`Engagements (${getSelectedAssoEngagementsTotals().nombreTotal}) ${formatFonds(
            getSelectedAssoEngagementsTotals().totalMontant
          )}`}
        />
        <AppSpacer />
        <AppButton
          onPress={() => navigation.navigate(routes.NEW_MEMBER)}
          style={styles.buttons}
          title={`Nouveaux membres (${getSelectedAssoCurrentMembers().inactifMembers.length})`}
          mode="outlined"
        />
        <AppSpacer />
        <AppButton
          icon="file-pdf"
          labelStyle={styles.reglementLabel}
          style={styles.buttons}
          onPress={handleReadReglement}
          title="Consulter le reglement."
          mode="text"
        />
      </ScrollView>
      {loading && <AppActivityIndicator />}
    </>
  );
}

const styles = StyleSheet.create({
  soldeContainer: {
    marginVertical: 20,
    marginHorizontal: 10,
  },
  separator: {
    width: '38%',
  },
  button: {
    backgroundColor: colors.rougeBordeau,
    width: 150,
    height: 50,
    borderRadius: 0,
  },
  buttons: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: colors.white,
  },
  allValue: {
    fontSize: 15,
    alignItems: 'flex-end',
    marginLeft: 30,
  },
  allLabel: {
    fontSize: 15,
  },
  contentContainerStyle: {
    paddingBottom: 30,
  },
  invest: {
    color: 'orange',
  },
  gain: {
    color: colors.vert,
  },
  depense: {
    color: colors.rougeBordeau,
  },
  quotite: {
    color: colors.grey,
  },
  reglementLabel: {
    color: colors.black,
  },
  selfMemberButton: {
    marginVertical: 10,
    alignSelf: 'center',
    backgroundColor: colors.white,
  },
  fonds: {
    fontWeight: 'bold',
  },
  memberCompteLabel: {
    paddingHorizontal: 40,
  },
});
