import { StyleSheet, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Card } from 'react-native-paper';
import AppText from '../common/AppText';
import { colors } from '../../utils/styles';
import useAuth from '../../hooks/useAuth';
import { sendAdhesionMessage } from '../../api/services/memberServices';
import { AuthContext } from '../../contexts/AuthContext';
import { MemberContext } from '../../contexts/MemberContext';
import AppButton from '../common/AppButton';
import { memberActions } from '../../reducers/memberReducer';
import AppWaitInfo from '../common/AppWaitInfo';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import AppIconButton from '../common/AppIconButton';
import AppSpacer from '../common/AppSpacer';
export default function AssociationCard({
  onPress,
  coverStyle,
  cardStyle,
  association,
  adhesionState,
  handleValidPress,
  showActions = true,
}) {
  const { state } = useContext(AuthContext);
  const { dispatch } = useContext(MemberContext);
  const { isAdmin } = useAuth();
  const [cardLoading, setCardLoading] = useState(false);
  const [disableSendButton, setDisableSendButton] = useState(false);
  const [error, setError] = useState(null);

  const sendMessageForAdhesion = async () => {
    setCardLoading(true);
    setDisableSendButton(true);
    setError(null);
    const data = {
      userId: state.user.id,
      associationId: association.id,
    };
    const response = await sendAdhesionMessage(data);
    if (!response.ok) {
      setCardLoading(false);
      setDisableSendButton(false);
      setError(response.data?.message);
      return;
    }
    dispatch({ type: memberActions.SEND_ADHESION_MESSAGE, list: response.data });
    setCardLoading(false);
    setDisableSendButton(false);
  };

  return (
    <TouchableWithoutFeedback onPress={handleValidPress}>
      <Card onPress={onPress} elevation={5} mode="elevated" style={[styles.card, cardStyle]}>
        <Card.Cover
          style={[{ height: 150 }, coverStyle]}
          source={require('../../../assets/main_dans_la_main.jpg')}
        />
        <Card.Content>
          <Card.Title
            title={association.nom}
            subtitle={association.description}
            titleNumberOfLines={1}
            subtitleNumberOfLines={2}
            subtitleStyle={styles.subtitle}
          />
        </Card.Content>
        {showActions && (
          <Card.Actions>
            <AppSpacer />
            <AppSpacer />
            {adhesionState === 'member' ? (
              <View style={styles.contentContainer}>
                <AppIconButton color={colors.vert} icon="account-group" />
                <AppText style={styles.memberStyle}>membre</AppText>
              </View>
            ) : adhesionState === 'ondemand' ? (
              <View style={styles.contentContainer}>
                <AppButton
                  style={styles.stopButton}
                  mode="outlined"
                  title="Annuler"
                  labelStyle={styles.exitButton}
                />
                <AppText style={styles.checking}>envoyé</AppText>
              </View>
            ) : (
              <AppButton
                labelStyle={styles.labelButton}
                disabled={disableSendButton}
                style={[styles.adminStatyle, styles.button]}
                title="Adhérer"
                onPress={sendMessageForAdhesion}
                loading={cardLoading}
              />
            )}
          </Card.Actions>
        )}
      </Card>
      {!association.isValid && <AppWaitInfo info="Encours de vaidation..." />}
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
  subtitle: {
    fontSize: 15,
  },
  adminStatyle: {
    width: '40%',
    minWidth: '30%',
  },
  button: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 5,
  },
  labelButton: {
    paddingVertical: 5,
  },
  memberStyle: {
    color: colors.vert,
  },
  checking: {
    color: colors.bleuFbi,
    marginLeft: 70,
  },
  exitButton: {
    color: colors.rougeBordeau,
    marginLeft: 10,
    paddingVertical: 5,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 10,
    bottom: 0,
  },
  stopButton: {
    width: '40%',
  },
});
