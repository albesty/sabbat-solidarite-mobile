import { StyleSheet, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import AppText from './AppText';
import AppIconButton from './AppIconButton';
import { colors } from '../../utils/styles';
import { TextInput } from 'react-native-paper';
import { AuthContext } from '../../contexts/AuthContext';
import { editUserInfo } from '../../api/services/authServices';
import { actions } from '../../reducers/authReducer';
import AppAnimation from './AppAnimation';

export default function AppLabelValueAction({ label }) {
  const { state, dispatch } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const currentUser = state.user;
  const [currentLabelValue, setCurrentLabelValue] = useState('');
  const [validateInfo, setValideInfo] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSaveEditedInfo = async () => {
    setLoading(true);
    const editedLabel = label.toLowerCase();
    let data = {
      id: state.user.id,
    };
    data[`${editedLabel}`] = currentLabelValue;
    const response = await editUserInfo(data);
    if (!response.ok) {
      setLoading(false);
      alert('Erreur lors de la mise à jour de vos infos.');
      return;
    }
    dispatch({ type: actions.update_info, updatedUser: response.data });
    setEditing(false);
    setLoading(false);
    alert('Vos infos ont été mises à jour avec succès.');
  };
  useEffect(() => {
    const selectedLabel = label.toLowerCase() === 'pseudo' ? 'username' : label.toLowerCase();
    setCurrentLabelValue(currentUser[`${selectedLabel}`] || '');
  }, []);

  useEffect(() => {
    if (editing && currentLabelValue.length > 0) setValideInfo(true);
    else setValideInfo(false);
  }, [editing, currentLabelValue]);

  return (
    <>
      <View style={styles.container}>
        <View>
          <AppText style={styles.label}>{label}</AppText>
          <AppText style={styles.value}>
            {currentLabelValue ? currentLabelValue : 'editer pour ajouter'}
          </AppText>
          {editing && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                onChangeText={(val) => setCurrentLabelValue(val)}
                value={currentLabelValue}
                placeholder={`${label.toLowerCase()}`}
              />

              {validateInfo && (
                <AppIconButton
                  onPress={handleSaveEditedInfo}
                  color={colors.vert}
                  icon={'account-check'}
                  styles={styles.actionButton}
                />
              )}
            </View>
          )}
        </View>
        <AppIconButton
          onPress={() => setEditing(!editing)}
          color={editing ? colors.rougeBordeau : colors.bleuFbi}
          icon={editing ? 'cancel' : 'account-edit'}
          styles={styles.actionButton}
        />
      </View>
      {loading && (
        <View style={styles.loading}>
          <AppAnimation />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginVertical: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  value: {
    fontSize: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: 200,
    marginRight: 10,
  },
  loading: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    opacity: 0.3,
  },
});
