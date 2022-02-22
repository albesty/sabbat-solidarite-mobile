import { StyleSheet, TouchableWithoutFeedback, View, Image } from 'react-native';
import React, { useState } from 'react';
import { colors } from '../../utils/styles';
import AppAnimation from '../common/AppAnimation';

export default function UserAvatar({ onPress, avatarStyle, user, loadingContainer }) {
  const [loading, setLoading] = useState(false);

  const isUserAvatar = user && user.avatar;
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={{ paddingHorizontal: 10, borderColor: colors.leger }}>
        <Image
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          source={isUserAvatar ? { uri: user.avatar } : require('../../../assets/silhouette.png')}
          style={[styles.avatar, avatarStyle]}
        />
        {loading && (
          <View style={[styles.loading, loadingContainer]}>
            <AppAnimation />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.white,
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  loading: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    opacity: 0.8,
    position: 'absolute',
    alignSelf: 'center',
  },
});
