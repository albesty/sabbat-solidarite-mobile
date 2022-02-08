import { StyleSheet, View, FlatList, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { TransactionContext } from '../../contexts/TransactionContext';
import AppText from '../../components/common/AppText';
import { getAllTransactions } from '../../api/services/transactionServices';
import { transactionActions } from '../../reducers/transactionReducer';
import AppActivityIndicator from '../../components/common/AppActivityIndicator';
import { AuthContext } from '../../contexts/AuthContext';
import AppSurface from '../../components/common/AppSurface';
import useAssociation from '../../hooks/useAssociation';
import { colors } from '../../utils/styles';
import AppButton from '../../components/common/AppButton';
import AppSeparator from '../../components/common/AppSeparator';

export default function TransactionScreen() {
  const { formatFonds, formatDate, dataSorter } = useAssociation();
  const { state } = useContext(AuthContext);
  const { transactionState, dispatchTransaction } = useContext(TransactionContext);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [stateLabel, setStateLabel] = useState('all');

  const getTransactions = useCallback(async () => {
    setLoading(true);
    const response = await getAllTransactions({ userId: state.user.id });
    if (!response.ok) {
      alert('Nous avons rencontré une erreur lors du rechargement de vos transactions.');
      setLoading(false);
      return;
    }
    dispatchTransaction({ type: transactionActions.all_user_transaction, list: response.data });
    const data = response.data;
    setTransactions(dataSorter(data));
    setLoading(false);
  }, []);

  const getReseauFlag = (reseau) => {
    let flag = '';
    if (reseau === 'orange') flag = require('../../../assets/omoney.png');
    if (reseau === 'mtn') flag = require('../../../assets/mobileMoney.jpg');
    if (reseau === 'moov') flag = require('../../../assets/moovMoney.jpg');
    return flag;
  };

  const handleChangeState = (label) => {
    const allData = transactionState.transactionList;

    if (label === 'all') {
      setStateLabel('all');
      setTransactions(allData);
    }
    if (label === 'recharge') {
      setStateLabel('recharge');
      const currentData = allData.filter(
        (transac) => transac.typeTransac.toLowerCase() === 'rechargement'
      );
      setTransactions(currentData);
    }
    if (label === 'retrait') {
      setStateLabel('retrait');
      const currentData = allData.filter((item) => item.typeTransac.toLowerCase() === 'retrait');
      setTransactions(currentData);
    }
  };
  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <>
      <View style={styles.linksContainer}>
        <AppButton
          onPress={() => handleChangeState('all')}
          style={stateLabel === 'all' ? [styles.links, styles.isActive] : styles.links}
          labelStyle={styles.titleStyle}
          title="Tous"
          mode="outlined"
        />
        <AppButton
          onPress={() => handleChangeState('recharge')}
          labelStyle={styles.titleStyle}
          style={stateLabel === 'recharge' ? [styles.links, styles.isActive] : styles.links}
          title="Rechargements"
          mode="outlined"
        />
        <AppButton
          onPress={() => handleChangeState('retrait')}
          labelStyle={styles.titleStyle}
          style={stateLabel === 'retrait' ? [styles.links, styles.isActive] : styles.links}
          title="Retraits"
          mode="outlined"
        />
      </View>
      <AppSeparator />
      <FlatList
        data={transactions}
        keyExtractor={(transac) => transac.number.toString()}
        renderItem={({ item }) => (
          <AppSurface style={styles.transacItem}>
            <View style={styles.reseau}>
              <View style={styles.statut}>
                <MaterialCommunityIcons
                  size={30}
                  name="check-circle"
                  color={item.statut === 'succeeded' ? colors.vert : colors.rougeBordeau}
                />
                <AppText>réussi</AppText>
              </View>
              {item.reseau && (
                <View style={styles.flagContainer}>
                  <Image style={styles.flag} source={getReseauFlag(item.reseau)} />
                  <AppText>{item.numero}</AppText>
                </View>
              )}
            </View>
            <View style={styles.fonds}>
              <AppText style={styles.fondsText}>{item.typeTransac}</AppText>
              <AppText style={styles.fondsText}>{formatFonds(item.montant)}</AppText>
            </View>
            <View>
              <AppText>{formatDate(item.createdAt)}</AppText>
            </View>
          </AppSurface>
        )}
      />
      {loading && <AppActivityIndicator />}
    </>
  );
}

const styles = StyleSheet.create({
  fonds: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    justifyContent: 'space-around',
  },
  statut: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  transacItem: {
    marginVertical: 10,
    marginHorizontal: 10,
    height: 'auto',
  },
  fondsText: {
    marginLeft: 30,
    fontWeight: 'bold',
  },
  reseau: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  titleStyle: {
    fontSize: 10,
    paddingVertical: 5,
  },
  links: {
    width: '30%',
    minWidth: '30%',
  },
  flag: {
    height: 40,
    width: 40,
  },
  isActive: {
    backgroundColor: colors.leger,
  },
  flagContainer: {
    marginLeft: '30%',
    alignItems: 'flex-end',
  },
});
