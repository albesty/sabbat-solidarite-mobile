import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import React, { useContext, useState } from 'react';
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
const validTransaction = Yup.object().shape({
  numero: Yup.string()
    .typeError('Numero incorrect')
    .min(10, 'Numero incorrect')
    .max(10, 'Numero incorrect')
    .required('Veuillez indiquer votre numero de transaction.'),
  montant: Yup.number()
    .typeError('Montant invalide')
    .min(100, 'Le montant doit etre de 100 xof minimum.'),
});
export default function NewTransactionScreen({ route, navigation }) {
  const currentTransaction = route.params;
  const { state, dispatch } = useContext(AuthContext);
  const { dispatchTransaction } = useContext(TransactionContext);
  const [mobileTransaction, setMobileTransaction] = useState(false);
  const [onCreditCardSelect, setOnCreditCardSelect] = useState(false);
  const [inputInfo, setInputInfo] = useState(null);
  const [reseau, setReseau] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddTransaction = async (transaction, { resetForm }) => {
    if (!reseau || reseau.length === 0) {
      alert('Vous devez choisir un numemro orange ou mtn ou moov.');
      return;
    }
    setLoading(true);
    const type = currentTransaction.transactionName;
    const data = {
      creatorId: state.user.id,
      type,
      libelle: type === 'rechargement' ? 'Rechargement de portefeuille' : 'Retrait de fonds',
      numero: transaction.numero,
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
    setMobileTransaction(!mobileTransaction);
    setInputInfo(null);
  };
  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
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
                numero: '',
                montant: '',
              }}
              validationSchema={validTransaction}
              onSubmit={handleAddTransaction}
            >
              <View style={styles.numeroContainer}>
                <AppFormField
                  getInputValue={(num) => handleCheckNumero(num)}
                  style={styles.formFiel}
                  name="numero"
                  label="numero"
                />
              </View>
              {inputInfo && <Image style={styles.inputNumero} source={inputInfo} />}
              <AppSpacer />
              <AppFormField
                style={styles.formFiel}
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
        <RadioButtonWithLabel
          label="Carte de crédit"
          onPress={() => setOnCreditCardSelect(!onCreditCardSelect)}
          onSelectButton={onCreditCardSelect}
        >
          {onCreditCardSelect && (
            <View style={styles.creditContainer}>
              <AppText>Module encours de developpement.</AppText>
            </View>
          )}
        </RadioButtonWithLabel>
      </ScrollView>
      {loading && <AppActivityIndicator />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
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

  formContainer: {
    marginVertical: 20,
  },
  creditContainer: {
    width: '90%',
  },
  inputNumero: { height: 40, width: 40, position: 'absolute', right: 10, top: 10 },
});
