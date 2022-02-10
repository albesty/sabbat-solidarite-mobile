import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import UserAvatar from '../user/UserAvatar';
import AppText from '../common/AppText';
import AppSurface from '../common/AppSurface';
import AppLabelValue from '../common/AppLabelValue';
import AppSpacer from '../common/AppSpacer';
import useAssociation from '../../hooks/useAssociation';

export default function MemberItem({
  member,
  onPress,
  showTotal,
  montant,
  total,
  moreInfo = '',
  style,
  moreInfoStyle,
}) {
  const { formatFonds } = useAssociation();

  return (
    <AppSurface
      style={{
        marginBottom: 20,
      }}
      onPress={onPress}
    >
      <AppText style={[styles.moreInfo, moreInfoStyle]}>{moreInfo}</AppText>

      <View style={[styles.container, style]}>
        <UserAvatar avatarStyle={styles.avatar} avatar={member.avatar} />
        <View>
          <AppText style={styles.info}>{member.username ? member.username : member.email}</AppText>
          <AppText style={styles.statut}>{member.member.statut}</AppText>
        </View>
      </View>
      <AppSpacer />
      {showTotal && (
        <View style={styles.total}>
          <AppText style={styles.totalText}>({total}) </AppText>
          <AppText style={styles.totalText}>{formatFonds(montant)}</AppText>
        </View>
      )}
    </AppSurface>
  );
}

const styles = StyleSheet.create({
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  info: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  moreInfo: {
    alignSelf: 'flex-end',
  },
  statut: {
    fontSize: 15,
  },
  total: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalText: {
    fontWeight: 'bold',
  },
});
