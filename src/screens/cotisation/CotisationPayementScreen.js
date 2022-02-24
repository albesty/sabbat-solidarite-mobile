import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useContext } from 'react';
import AppText from '../../components/common/AppText';
import { colors } from '../../utils/styles';
import AppSurface from '../../components/common/AppSurface';
import useCotisation from '../../hooks/useCotisation';
import useAssociation from '../../hooks/useAssociation';
import AppSpacer from '../../components/common/AppSpacer';
import { SelectedAssociationContext } from '../../contexts/SelectedAssociationContext';
import SmallMemberItem from '../../components/member/SmallMemberItem';
import AppSeparator from '../../components/common/AppSeparator';

export default function CotisationPayementScreen({ route }) {
  const selectedCotisation = route.params;
  const { selectedAssoState } = useContext(SelectedAssociationContext);

  const { formatFonds } = useAssociation();
  const { getSelectedCotisationPayementInfos } = useCotisation();
  return (
    <ScrollView>
      <View style={styles.libelleContainer}>
        <AppText style={styles.libelle}>{selectedCotisation.motif}</AppText>
      </View>
      <AppSurface style={styles.surface} info="Total">
        <View style={styles.surfaceContent}>
          <AppText style={styles.montant}>{`(${
            getSelectedCotisationPayementInfos(selectedCotisation.id).nombrePayement
          })`}</AppText>
          <AppText>{`  `}</AppText>
          <AppText style={styles.montant}>
            {formatFonds(getSelectedCotisationPayementInfos(selectedCotisation.id).montantPayement)}
          </AppText>
        </View>
      </AppSurface>

      <AppText style={styles.info}>Cotisé par</AppText>
      <AppSeparator />
      <AppSpacer />
      <ScrollView>
        {getSelectedCotisationPayementInfos(selectedCotisation.id).allPayedCotisations.map(
          (item, index) => (
            <SmallMemberItem
              style={styles.member}
              key={item.toString() + index}
              creator={selectedAssoState.associationMembers.find(
                (memb) => memb.member.id === item.member_cotisation.memberId
              )}
            >
              <AppText>{formatFonds(item.member_cotisation.montant)}</AppText>
            </SmallMemberItem>
          )
        )}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  info: {
    marginLeft: 10,
  },
  libelle: {
    fontWeight: 'bold',
  },
  libelleContainer: {
    marginBottom: 20,
    backgroundColor: colors.leger,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  member: {
    marginVertical: 15,
  },
  montant: {
    fontWeight: 'bold',
  },
  surface: {
    alignItems: 'stretch',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  surfaceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
});
