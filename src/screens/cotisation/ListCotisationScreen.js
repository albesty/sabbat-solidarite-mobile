import React, { useContext } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import AddNewButton from '../../components/common/AddNewButton';
import routes from '../../navigation/routes';
import { SelectedAssociationContext } from '../../contexts/SelectedAssociationContext';
import AppText from '../../components/common/AppText';
import useAssociation from '../../hooks/useAssociation';
import AppSeparator from '../../components/common/AppSeparator';
import AppButton from '../../components/common/AppButton';
import AppSpacer from '../../components/common/AppSpacer';
import useAuth from '../../hooks/useAuth';
import { colors } from '../../utils/styles';
import useCotisation from '../../hooks/useCotisation';
import AppMessage from '../../components/common/AppMessage';

export default function ListCotisationScreen({ navigation }) {
  const { formatDate, formatFonds, dataSorter } = useAssociation();
  const { isCotisationPayed, getSelectedCotisationPayementInfos } = useCotisation();
  const { isAdmin, isModerator } = useAuth();
  const isAuthorized = isAdmin() || isModerator();
  const { selectedAssoState } = useContext(SelectedAssociationContext);

  const handlePayCotisation = (cotisation) => {
    navigation.navigate(routes.PAY_COTISATION, cotisation);
  };

  const handleSelectCotisation = (cotisation) => {
    navigation.navigate(routes.COTISATION_PAYEMENT, cotisation);
  };

  return (
    <>
      {selectedAssoState.allCotisations.length > 0 && (
        <FlatList
          contentContainerStyle={styles.contentContainerStyle}
          showsVerticalScrollIndicator={false}
          data={dataSorter(selectedAssoState.allCotisations)}
          keyExtractor={(item) => item.id + 'list_cotisations'}
          renderItem={({ item }) => (
            <View style={styles.container}>
              <View style={styles.headerContainer}>
                <View style={styles.payement}>
                  <AppText style={styles.payementLabel}>Payements</AppText>
                  <AppText
                    onPress={() => handleSelectCotisation(item)}
                    style={styles.montantPayement}
                  >
                    {`(${getSelectedCotisationPayementInfos(item.id).nombrePayement})`} {` `}
                    {formatFonds(getSelectedCotisationPayementInfos(item.id).montantPayement)}
                  </AppText>
                </View>
                <AppText style={styles.type}>{item.typeCotisation}</AppText>
              </View>
              <AppText
                numberOfLines={2}
                style={[
                  styles.motif,
                  { fontWeight: isCotisationPayed(item.id) ? 'normal' : 'bold' },
                ]}
              >
                {item.motif}
              </AppText>
              <AppText
                style={[
                  styles.montant,
                  { fontWeight: isCotisationPayed(item.id) ? 'normal' : 'bold' },
                ]}
              >
                {formatFonds(item.montant)}
              </AppText>
              <View style={styles.limite}>
                <AppText style={{ fontWeight: isCotisationPayed(item.id) ? 'normal' : 'bold' }}>
                  Date limite
                </AppText>
                <AppText style={{ fontWeight: isCotisationPayed(item.id) ? 'normal' : 'bold' }}>
                  {formatDate(item.dateFin)}
                </AppText>
              </View>
              <AppSpacer />
              <View>
                {!isCotisationPayed(item.id) && (
                  <AppButton
                    labelStyle={{
                      paddingVertical: 5,
                    }}
                    style={styles.button}
                    title="Payer"
                    onPress={() => handlePayCotisation(item)}
                  />
                )}
                {isCotisationPayed(item.id) && <AppText style={styles.payed}>Déjà payé</AppText>}
              </View>
            </View>
          )}
          ItemSeparatorComponent={AppSeparator}
        />
      )}
      {selectedAssoState.allCotisations.length === 0 && (
        <AppMessage message="Aucune cotisation trouvée." />
      )}
      {isAuthorized && <AddNewButton onPress={() => navigation.navigate(routes.NEW_COTISATION)} />}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '70%',
    alignSelf: 'center',
  },
  container: {
    margin: 10,
    paddingBottom: 10,
  },
  contentContainerStyle: {
    paddingVertical: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  limite: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  montant: {
    marginVertical: 10,
  },
  montantPayement: {
    fontWeight: 'bold',
    color: colors.bleuFbi,
  },
  motif: {
    marginVertical: 10,
  },
  payed: {
    color: colors.vert,
    alignSelf: 'flex-end',
  },
  payement: {
    alignItems: 'flex-start',
  },
  payementLabel: {
    fontSize: 15,
    color: colors.leger,
  },

  type: {
    alignSelf: 'flex-end',
    color: colors.or,
  },
});
