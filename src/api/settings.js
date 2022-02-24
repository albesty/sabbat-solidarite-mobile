import Updates from 'expo-updates';

const settings = {
  dev: {
    baseUrl: 'http://192.168.1.100:5000/api',
  },
  staging: {
    baseUrl: 'https://sabbat-solidarite.herokuapp.com/api',
  },
  prod: {
    baseUrl: 'https://sabbat-solidarite.herokuapp.com/api',
  },
};

const getCurrentSettings = () => {
  if (__DEV__) return settings.dev;
  if (Updates.releaseChannel === 'staging') return settings.staging;
  return settings.prod;
};

export default getCurrentSettings();
