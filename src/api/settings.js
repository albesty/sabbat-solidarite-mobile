import Constants from 'expo-constants';

const settings = {
  dev: {
    baseUrl: 'http://192.168.1.178:5000/api',
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
  if (Constants.manifest.releaseChannel === 'staging') return settings.staging;
  return settings.prod;
};

export default getCurrentSettings();
