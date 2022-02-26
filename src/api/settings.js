import Updates from 'expo-updates';

const settings = {
  dev: {
    baseUrl: 'http://192.168.1.100:5000/api',
  },
  staging: {
    baseUrl: 'https://sabbat-solidarite.herokuapp.com/api',
  },
  production: {
    baseUrl: 'https://sabbat-solidarite.herokuapp.com/api',
  },
};

const getCurrentSettings = () => {
  if (__DEV__) return settings.dev;
  if (Updates.releaseChannel === 'staging') return settings.staging;
  return settings.production;
};

export default getCurrentSettings();
