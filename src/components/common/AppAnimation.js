import React from 'react';
import LottieView from 'lottie-react-native';

export default function AppAnimation({
  size = 80,
  source = require('../../../assets/loading.json'),
}) {
  return <LottieView style={{ width: size }} source={source} autoPlay={true} loop={true} />;
}
