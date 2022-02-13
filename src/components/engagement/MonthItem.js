import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppText from '../common/AppText';
import useAssociation from '../../hooks/useAssociation';
import { colors } from '../../utils/styles';
import AppLabelAndValueSimple from '../common/AppLabelAndValueSimple';
import AppLabelValue from '../common/AppLabelValue';
import AppSeparator from '../common/AppSeparator';
import AppSpacer from '../common/AppSpacer';

export default function MonthItem({ month, monthTotal, monthAmount, monthCotisations }) {
  const [isActive, setIsActive] = useState(false);
  const { formatFonds, formatDate } = useAssociation();
  return (
    <>
      <TouchableOpacity style={styles.container} onPress={() => setIsActive(!isActive)}>
        <AppText style={isActive ? [styles.monthText, styles.activeStyle] : [styles.monthText]}>
          {month}
        </AppText>
        <View style={styles.montant}>
          <AppText
            style={isActive ? [styles.monthText, styles.activeStyle] : styles.monthText}
          >{`(${monthTotal})`}</AppText>
          <AppText>{'  '} </AppText>
          <AppText style={isActive ? [styles.monthText, styles.activeStyle] : styles.monthText}>
            {formatFonds(monthAmount)}
          </AppText>
        </View>
        <MaterialCommunityIcons
          style={isActive ? [styles.monthText, styles.activeStyle] : styles.monthText}
          name={isActive ? 'chevron-up' : 'chevron-down'}
          size={25}
        />
      </TouchableOpacity>
      {isActive && (
        <View style={styles.activeContent}>
          {monthCotisations.map((item) => (
            <View style={styles.monthItem} key={item.id.toString()}>
              <AppText style={styles.motif} numberOfLines={2}>
                {item.motif}
              </AppText>
              <AppLabelValue
                labelStyle={styles.labelStyle}
                label="Montant demandé"
                value={formatFonds(item.montant)}
              />
              <AppLabelValue
                labelStyle={styles.labelStyle}
                label="Montant payé"
                value={formatFonds(item.member_cotisation.montant)}
              />
              <AppLabelValue
                labelStyle={styles.labelStyle}
                label="Date payement"
                value={formatDate(item.member_cotisation.paymentDate)}
              />
              <AppSpacer />
              <AppSeparator />
            </View>
          ))}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  activeContent: {
    backgroundColor: colors.white,
    paddingHorizontal: 10,
  },
  activeStyle: {
    color: colors.bleuFbi,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  labelStyle: {
    fontWeight: 'normal',
  },
  montant: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthItem: {
    marginVertical: 10,
  },
  monthText: {
    fontSize: 17,
    color: colors.black,
  },
  motif: {
    fontWeight: 'bold',
  },
});
