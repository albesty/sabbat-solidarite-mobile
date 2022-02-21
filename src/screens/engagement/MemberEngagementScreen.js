import { StyleSheet, View } from 'react-native';
import React, { useContext } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import AppText from '../../components/common/AppText';
import AddNewButton from '../../components/common/AddNewButton';
import routes from '../../navigation/routes';
import useEngagement from '../../hooks/useEngagement';
import EngagementItem from '../../components/engagement/EngagementItem';
import AppSeparator from '../../components/common/AppSeparator';
import { colors } from '../../utils/styles';
import AppSurface from '../../components/common/AppSurface';
import useAssociation from '../../hooks/useAssociation';
import { SelectedAssociationContext } from '../../contexts/SelectedAssociationContext';

export default function MemberEngagementScreen({ navigation, route }) {
  const selectedMember = route.params;
  const { selectedAssoState } = useContext(SelectedAssociationContext);
  const { getSelectedMemberEngagements } = useEngagement();
  const { formatFonds } = useAssociation();

  const isAuthorized = selectedMember.id === selectedAssoState.connectedMember.id;
  return (
    <>
      <View style={styles.montantContainer}>
        <AppSurface
          infoStyle={styles.infoStyle}
          info="Tous les engagements"
          style={styles.header}
          surfaceStyle={styles.montant}
        >
          <AppText style={styles.montantText}>
            ({getSelectedMemberEngagements(selectedMember.member.id).totalEngagements}){'  '}
            {formatFonds(getSelectedMemberEngagements(selectedMember.member.id).totalAmount)}
          </AppText>
        </AppSurface>
      </View>
      {getSelectedMemberEngagements(selectedMember.member.id).totalEngagements > 0 && (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={getSelectedMemberEngagements(selectedMember.member.id).memberEngagements}
          keyExtractor={(item) => item.id.toString() + 'memberengage'}
          renderItem={({ item }) => <EngagementItem engagement={item} />}
          ItemSeparatorComponent={AppSeparator}
          contentContainerStyle={styles.contentContainerStyle}
        />
      )}
      {getSelectedMemberEngagements(selectedMember.member.id).totalEngagements === 0 && (
        <View style={styles.emptyInfo}>
          <AppText>Aucun engagement trouvé</AppText>
        </View>
      )}
      {isAuthorized && <AddNewButton onPress={() => navigation.navigate(routes.NEW_ENGAGEMENT)} />}
    </>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingVertical: 20,
    marginHorizontal: 20,
  },
  emptyInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginHorizontal: 0,
  },
  infoStyle: {
    color: colors.white,
  },
  montant: {
    minHeight: 80,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0,
  },
  montantContainer: {
    paddingTop: 10,
    backgroundColor: colors.rougeBordeau,
  },
  montantText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
