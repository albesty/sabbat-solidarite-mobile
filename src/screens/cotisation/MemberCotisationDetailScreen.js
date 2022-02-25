import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TextInput } from 'react-native';
import AppSurface from '../../components/common/AppSurface';
import AppText from '../../components/common/AppText';
import useAssociation from '../../hooks/useAssociation';
import { colors } from '../../utils/styles';
import useSelectedAssociation from '../../hooks/useSelectedAssociation';
import dayjs from 'dayjs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { months } from '../../utils/months';
import MonthItem from '../../components/engagement/MonthItem';

export default function MemberCotisationDetailScreen({ route }) {
  const selectedMember = route.params;
  const { formatDate, formatFonds } = useAssociation();
  const { getMemberCotisationsInfo } = useSelectedAssociation();
  let [selectedYear, setSelectedYear] = useState(String(dayjs().year()));

  const handleYearChangePress = (value) => {
    const current = Number(selectedYear);

    if (value === 'next') {
      const changed = current + 1;
      setSelectedYear(String(changed));
    } else {
      const changed = current - 1;
      setSelectedYear(String(changed));
    }
  };

  const getYearCotisations = () => {
    let totalNumber = 0;
    let totalAmount = 0;
    const allMembCotisations = getMemberCotisationsInfo(selectedMember.member.id).memberCotisations;
    const currentYear = Number(selectedYear);
    const currentYearCotisations = allMembCotisations.filter((cotis) => {
      const payedYear = dayjs(cotis.member_cotisation.paymentDate).year();
      if (payedYear === currentYear) return true;
    });
    if (currentYearCotisations.length) {
      totalNumber = currentYearCotisations.length;
      currentYearCotisations.forEach((cotisation) => {
        totalAmount += cotisation.member_cotisation.montant;
      });
    }

    return { currentYearCotisations, totalNumber, totalAmount };
  };

  const getMonthCotisations = (month) => {
    let monthTotalNumber = 0;
    let monthTotalAmount = 0;
    const selectedYearCotis = getYearCotisations().currentYearCotisations;
    const monthCotisations = selectedYearCotis.filter((cotis) => {
      const payedMonth = dayjs(cotis.member_cotisation.paymentDate).month();
      if (month.number === payedMonth) return true;
    });
    if (monthCotisations.length) {
      monthTotalNumber = monthCotisations.length;
      monthCotisations.forEach((cotis) => {
        monthTotalAmount += cotis.member_cotisation.montant;
      });
    }
    return { monthCotisations, monthTotalNumber, monthTotalAmount };
  };

  return (
    <>
      <View style={styles.montantContainer}>
        <AppSurface
          infoStyle={styles.infoStyle}
          info="Toutes les cotisations"
          style={styles.header}
          surfaceStyle={styles.montant}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <AppText>Total</AppText>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: '18%',
              }}
            >
              <AppText style={styles.montantText}>
                ({getMemberCotisationsInfo(selectedMember.member.id)?.nombreCotisations}){'  '}
                {formatFonds(
                  getMemberCotisationsInfo(selectedMember.member.id)?.totalCotisationsMontant
                )}
              </AppText>
            </View>
          </View>

          <View style={styles.year}>
            <AppText>Année</AppText>
            <View style={styles.changer}>
              <TouchableOpacity
                onPress={() => handleYearChangePress('prev')}
                style={styles.buttons}
              >
                <MaterialCommunityIcons name="chevron-left" color={colors.black} size={30} />
              </TouchableOpacity>
              <View>
                <TextInput
                  onChangeText={(val) => setSelectedYear(val)}
                  value={selectedYear}
                  style={styles.yearInput}
                />
              </View>
              <TouchableOpacity
                onPress={() => handleYearChangePress('next')}
                style={styles.buttons}
              >
                <MaterialCommunityIcons size={30} color={colors.black} name="chevron-right" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.yearContent}>
            <AppText style={styles.yearContentText}>{`(${
              getYearCotisations().totalNumber
            })`}</AppText>
            <AppText>{'  '}</AppText>
            <AppText style={styles.yearContentText}>
              {formatFonds(getYearCotisations().totalAmount)}
            </AppText>
          </View>
        </AppSurface>
      </View>
      <ScrollView contentContainerStyle={styles.contentStyles}>
        {months.map((item) => (
          <MonthItem
            monthCotisations={getMonthCotisations(item).monthCotisations}
            monthTotal={getMonthCotisations(item).monthTotalNumber}
            monthAmount={getMonthCotisations(item).monthTotalAmount}
            key={item.name}
            month={item.name}
          />
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  buttons: {
    paddingHorizontal: 10,
  },
  changer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '15%',
  },
  contentStyles: {
    paddingVertical: 20,
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
    alignItems: 'stretch',
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
  year: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    height: 50,
  },
  yearContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
  },
  yearContentContainerStyle: {
    alignSelf: 'center',
  },
  yearContentText: {
    fontSize: 15,
  },
  yearInput: {
    padding: 5,
    paddingHorizontal: 10,
    fontSize: 15,
    fontWeight: 'bold',
    backgroundColor: colors.bleuFbi,
    color: colors.white,
  },
  yearText: {
    marginHorizontal: 5,
  },
});
