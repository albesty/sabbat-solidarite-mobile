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

export default function CaisseScreen({ route, navigation }) {
  const selectedAssociation = route.params;
  const { selectedAssoState } = useContext(SelectedAssociationContext);
  const [showFunds, setShowFunds] = useState(false);
  const { formatFonds } = useAssociation();
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

  const getAllInvests = () => {
    return 1000000;
  };
  const getAllGains = () => {
    return 1000000;
  };
  const getAllDepenses = () => {
    return 1000000;
  };
  const getAllQuotite = () => {
    return 1000000;
  };

  const getAssociationMembers = useCallback(async () => {
    setLoading(true);
    await getselectedAssoMembers(selectedAssociation.id);
    await getSelectedAssoAllCotisations(selectedAssociation.id);
    await getSelectedAssoMembersCotisations(selectedAssociation.id);
    await getSelectedAssoMembersEngagements(selectedAssociation.id);
    setLoading(false);
  });

  const handleGoToMemberDetail = () => {
    navigation.navigate(routes.MEMBER, {
      screen: routes.MEMBER_DETAIL,
      params: selectedAssoState.connectedMember,
    });
  };

  useEffect(() => {
    getAssociationMembers();
  }, []);

  return (
    <>
      <ScrollView>
        <AssociationCard
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
    backgroundColor: colors.bleuFbi,
    width: 150,
    height: 50,
    borderRadius: 0,
  },
  buttons: {
    width: '90%',
    alignSelf: 'center',
  },
  allValue: {
    fontSize: 15,
    alignItems: 'flex-end',
    marginLeft: 30,
  },
  allLabel: {
    fontSize: 15,
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
  selfMemberButton: {
    marginVertical: 10,
    alignSelf: 'center',
  },
  fonds: {
    fontWeight: 'bold',
  },
  memberCompteLabel: {
    paddingHorizontal: 40,
  },
});
