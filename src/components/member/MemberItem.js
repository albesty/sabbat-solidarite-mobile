import { StyleSheet, View } from 'react-native';
import React from 'react';
import UserAvatar from '../user/UserAvatar';
import AppText from '../common/AppText';
import AppSurface from '../common/AppSurface';
import AppSpacer from '../common/AppSpacer';
import useAssociation from '../../hooks/useAssociation';
import useAuth from '../../hooks/useAuth';

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
  const { getMemberStatut } = useAuth();

  return (
    <AppSurface
      style={{
        marginBottom: 20,
      }}
      onPress={onPress}
    >
      <AppText style={[styles.moreInfo, moreInfoStyle]}>{moreInfo}</AppText>

      <View style={[styles.container, style]}>
        <UserAvatar avatarStyle={styles.avatar} user={member} />
        <View>
          <AppText style={styles.info}>{member.username ? member.username : member.email}</AppText>
          <AppText style={styles.statut}>
            {member.member.statut === 'new' ? 'Nouveau' : getMemberStatut(member.member.statut)}
          </AppText>
        </View>
      </View>
      {showTotal && (
        <View style={styles.total}>
          <AppSpacer />
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
