import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import useEngagement from '../../hooks/useEngagement';
import EngagementItem from '../../components/engagement/EngagementItem';
import AppSeparator from '../../components/common/AppSeparator';
import useAssociation from '../../hooks/useAssociation';
import AppMessage from '../../components/common/AppMessage';

export default function EngagementVoteListScreen() {
  const { getSelectedAssoEngagementInfos } = useEngagement();
  const { dataSorter } = useAssociation();

  return (
    <>
      {getSelectedAssoEngagementInfos().notValidEngagements.length > 0 && (
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerStyle}
          data={dataSorter(getSelectedAssoEngagementInfos().notValidEngagements)}
          keyExtractor={(item) => item.id.toString() + 'voting'}
          renderItem={({ item }) => <EngagementItem engagement={item} />}
          ItemSeparatorComponent={AppSeparator}
        />
      )}
      {getSelectedAssoEngagementInfos().notValidEngagements.length === 0 && (
        <AppMessage message="Aucun engagement trouvé" />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    marginHorizontal: 10,
    paddingVertical: 20,
  },
});
