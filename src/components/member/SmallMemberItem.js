import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors } from '../../utils/styles';
import UserAvatar from '../user/UserAvatar';
import AppText from '../common/AppText';

export default function SmallMemberItem({ creator, style, onPress, children }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.creator, style]}>
      <View style={styles.avatar}>
        <UserAvatar user={creator} />
        <View>
          <AppText style={styles.creatorText}>
            {creator.username ? creator.username : creator.email}
          </AppText>
          <AppText style={styles.creatorText}>{creator.member.statut}</AppText>
        </View>
      </View>
      <View>{children}</View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  avatar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 20,
  },
  creatorText: {
    fontSize: 15,
    color: colors.grey,
  },
});
