import AsyncStorage from '@react-native-async-storage/async-storage';

const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem('@token', token);
  } catch (error) {
    throw new Error(error);
  }
};

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('@token');
    return token;
  } catch (error) {
    throw new Error(error);
  }
};

const removeItem = async () => {
  try {
    await AsyncStorage.removeItem('@token');
  } catch (error) {
    throw new Error(error);
  }
};

export { storeToken, getToken, removeItem };
