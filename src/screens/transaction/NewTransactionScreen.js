import React, { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Image, ScrollView } from 'react-native';
import { List } from 'react-native-paper';
import * as Yup from 'yup';
import { AppForm, AppFormField, AppSubmitButton } from '../../components/form';
import { AuthContext } from '../../contexts/AuthContext';
import routes from '../../navigation/routes';
import { addNewTransaction } from '../../api/services/transactionServices';
import { TransactionContext } from '../../contexts/TransactionContext';
import { transactionActions } from '../../reducers/transactionReducer';
import AppSpacer from '../../components/common/AppSpacer';
import AppText from '../../components/common/AppText';
import RadioButtonWithLabel from '../../components/common/RadioButtonWithLabel';
import { actions } from '../../reducers/authReducer';
import AppActivityIndicator from '../../components/common/AppActivityIndicator';
import useAssociation from '../../hooks/useAssociation';
import useAuth from '../../hooks/useAuth';
import AppInput from '../../components/common/AppInput';
import AppMessage from '../../components/common/AppMessage';
const validTransaction = Yup.object().shape({
  montant: Yup.number()
    .typeError('Montant invalide')
    .min(100, 'Le montant doit etre de 100 xof minimum.')
    .required('Veuillez indiquer le montant.'),
});
export default function NewTransactionScreen({ route, navigation }) {
  const currentTransaction = route.params;
  const user = route.params.user;
  const { dispatch } = useContext(AuthContext);
  const { dataSorter } = useAssociation();
  const { transactionState, dispatchTransaction } = useContext(TransactionContext);
  const { getTransactions, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mobileTransaction, setMobileTransaction] = useState(false);
  const [onCreditCardSelect, setOnCreditCardSelect] = useState(false);
  const [inputInfo, setInputInfo] = useState(null);
  const [reseau, setReseau] = useState('');
  const [favoriteNumbers, setFavoriteNumbers] = useState([]);
  let [numero, setNumero] = useState('');

  const handleAddTransaction = async (transaction, { resetForm }) => {
    if (!reseau || reseau.length === 0) {
      alert('Vous devez choisir un numero mobile money orange-ci ou mtn-ci ou moov-ci.');
      return;
    }
    if (numero.length !== 10) {
      alert('Le numero saisi est incorrect.');
      return;
    }
    setLoading(true);
    const type = currentTransaction.transactionName;
    const data = {
      creatorId: user.id,
      type,
      libelle: type === 'rechargement' ? 'Rechargement de portefeuille' : 'Retrait de fonds',
      numero: numero,
      montant: Number(transaction.montant),
      reseau: reseau,
    };

    const response = await addNewTransaction(data);
    if (!response.ok) {
      alert('Erreur lors de la validation de la transaction.');
      setLoading(false);
      return;
    }
    setLoading(false);
    dispatch({ type: actions.update_state, updateState: true });
    dispatchTransaction({ type: transactionActions.add_transaction, transaction: response.data });
    alert('Votre transaction a été effectuée avec succès.');
    resetForm();
    setNumero('');
    setMobileTransaction(false);
    setOnCreditCardSelect(false);
    navigation.navigate(routes.USER_COMPTE);
  };

  const handleCheckNumero = (numero) => {
    if (numero.length > 1) {
      if (numero[1] === '7') {
        setInputInfo(require('../../../assets/omoney.png'));
        setReseau('orange');
      }
      if (numero[1] === '5') {
        setInputInfo(require('../../../assets/mobileMoney.jpg'));
        setReseau('mtn');
      } else if (numero[1] === '1') {
        setInputInfo(require('../../../assets/moovMoney.jpg'));
        setReseau('moov');
      }
    } else setInputInfo(null);
  };

  const handleShowMobileInput = () => {
    setOnCreditCardSelect(false);
    setMobileTransaction(!mobileTransaction);
    setInputInfo(null);
  };

  const getUpdatedTransactions = useCallback(async () => {
    let numbers = [];
    if (transactionState.transactionList.length > 0) {
      numbers = dataSorter(transactionState.transactionList).map((item) => item.numero);
    } else {
      const { errorState, data } = await getTransactions();
      if (!errorState) {
        numbers = dataSorter(data).map((item) => item.numero);
      }
    }
    if (numbers.length > 0) {
      const numberCount = Array.from(new Set(numbers)).map(
        (val) => numbers.filter((v) => v === val).length
      );
      const numberSet = Array.from(new Set(numbers));
      const numbersData = [];

      for (let i = 0; i < numberSet.length; i++) {
        numbersData.push({
          number: numberSet[i],
          count: numberCount[i],
        });
      }
      const sortedNumbers = numbersData.sort((a, b) => {
        if (a.count > b.count) return -1;
        if (a.count < b.count) return 1;
        return 0;
      });
      setFavoriteNumbers(sortedNumbers);
    }
  }, []);

  useEffect(() => {
    getUpdatedTransactions();
  }, []);

  return (
    <>
      {isAdmin() && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
          <RadioButtonWithLabel
            onSelectButton={mobileTransaction}
            label="Mobile money"
            onPress={handleShowMobileInput}
          >
            <Image style={styles.moneyFlag} source={require('../../../assets/omoney.png')} />
            <Image style={styles.moneyFlag} source={require('../../../assets/mobileMoney.jpg')} />
            <Image style={styles.moneyFlag} source={require('../../../assets/moovMoney.jpg')} />
          </RadioButtonWithLabel>
          {mobileTransaction && (
            <View style={styles.formContainer}>
              <AppForm
                initialValues={{
                  montant: '',
                }}
                validationSchema={validTransaction}
                onSubmit={handleAddTransaction}
              >
                <AppInput
                  keyboardType="numeric"
                  style={styles.formFiel}
                  value={numero}
                  onChangeText={(val) => {
                    setNumero(val);
                    handleCheckNumero(val);
                  }}
                  label="numero"
                  placeholder="Ex: 0708525827"
                  maxLength={14}
                />
                {inputInfo && <Image style={styles.inputNumero} source={inputInfo} />}
                <AppSpacer />
                <AppFormField
                  style={styles.formFiel}
                  keyboardType="numeric"
                  name="montant"
                  label="Montant"
                  placeholder="0.0"
                />
                <AppSpacer />
                <AppSpacer />
                <AppSubmitButton style={styles.formFiel} title="Valider" />
              </AppForm>
            </View>
          )}
          <AppSpacer />
          <RadioButtonWithLabel
            label="Carte de crédit"
            onPress={() => {
              setMobileTransaction(false);
              setOnCreditCardSelect(!onCreditCardSelect);
            }}
            onSelectButton={onCreditCardSelect}
          >
            {onCreditCardSelect && (
              <View style={styles.creditContainer}>
                <AppText>Module encours de developpement.</AppText>
              </View>
            )}
          </RadioButtonWithLabel>
          {favoriteNumbers.length > 0 && (
            <ScrollView>
              <List.Accordion
                left={(props) => <List.Icon {...props} icon="card-account-phone" />}
                title="Numeros favoris"
              >
                {favoriteNumbers.map((item, index) => (
                  <List.Item
                    key={item.number + index}
                    title={item.number}
                    onPress={() => {
                      setNumero(item.number);
                      handleCheckNumero(item.number);
                    }}
                  />
                ))}
              </List.Accordion>
            </ScrollView>
          )}
        </ScrollView>
      )}
      {!isAdmin() && (
        <AppMessage message="Ce module est encours de developpement. Il sera disponible dans quelques jours. Merci de votre patience." />
      )}

      {loading && <AppActivityIndicator />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    marginHorizontal: 30,
  },
  moneyFlag: {
    height: 30,
    width: 30,
  },

  moneyContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  favHeader: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  favItem: {
    marginVertical: 5,
  },
  favoriteContainer: {
    paddingBottom: 20,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  formContainer: {
    marginVertical: 20,
  },
  creditContainer: {
    width: '90%',
  },
  inputNumero: { height: 40, width: 40, position: 'absolute', right: 10, top: 10 },
});
