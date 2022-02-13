import { StyleSheet, FlatList } from 'react-native';
import React from 'react';
import useEngagement from '../../hooks/useEngagement';
import EngagementItem from '../../components/engagement/EngagementItem';
import AppSeparator from '../../components/common/AppSeparator';
import useAssociation from '../../hooks/useAssociation';

export default function EngagementVoteListScreen() {
  const { getSelectedAssoEngagementInfos } = useEngagement();
  const { dataSorter } = useAssociation();

  return (
    <>
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={dataSorter(getSelectedAssoEngagementInfos().notValidEngagements)}
        keyExtractor={(item) => item.id.toString() + 'voting'}
        renderItem={({ item }) => <EngagementItem engagement={item} />}
        ItemSeparatorComponent={AppSeparator}
      />
    </>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    marginHorizontal: 10,
    paddingVertical: 20,
  },
});
