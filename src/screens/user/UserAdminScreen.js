import React, { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { getAllUsers } from '../../api/services/authServices';
import AppActivityIndicator from '../../components/common/AppActivityIndicator';
import AppMessage from '../../components/common/AppMessage';
import SmallMemberItem from '../../components/member/SmallMemberItem';
import routes from '../../navigation/routes';
import { AuthContext } from '../../contexts/AuthContext';
import { actions } from '../../reducers/authReducer';

export default function UserAdminScreen({ navigation }) {
  const { dispatch } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const getRegisteredUsers = useCallback(async () => {
    setLoading(true);
    const response = await getAllUsers();
    if (!response.ok) {
      setLoading(false);
      alert('Erreur: lors du chargement des utilisateurs');
      return;
    }
    setUsers(response.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    getRegisteredUsers();
  }, []);

  const handleGetUser = (user) => {
    dispatch({ type: actions.select_user, user });
    navigation.navigate(routes.USER, { screen: routes.USER_COMPTE, params: user });
  };

  return (
    <>
      {users.length > 0 && (
        <FlatList
          contentContainerStyle={styles.contentContainerStyle}
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <SmallMemberItem
              onPress={() => handleGetUser(item)}
              style={styles.itemContainer}
              creator={item}
            />
          )}
        />
      )}
      {users.length === 0 && <AppMessage message="Aucun utilisateur trouvé." />}
      {loading && <AppActivityIndicator />}
    </>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    marginHorizontal: 20,
    paddingVertical: 20,
  },
  itemContainer: {
    marginVertical: 10,
  },
});
