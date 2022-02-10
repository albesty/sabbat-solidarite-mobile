import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AppTabBarIcon({ name, size, color }) {
  return <MaterialCommunityIcons name={name} size={size} color={color} />;
}
