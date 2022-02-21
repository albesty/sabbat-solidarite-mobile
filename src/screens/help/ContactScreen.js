import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import AppText from '../../components/common/AppText';
import { colors } from '../../utils/styles';
import routes from '../../navigation/routes';
import useUploadImage from '../../hooks/useUploadImage';
import { Asset } from 'expo-asset';

export default function ContactScreen({ navigation }) {
  const { getFilePrint } = useUploadImage();
  const handleGetCGU = () => {
    const url = Asset.fromModule(require('../../../assets/CGU_SOLIDARITE.pdf')).uri;
    getFilePrint(url);
  };
  return (
    <ScrollView contentContainerStyle={styles.contentContainerStyle}>
      <Image
        source={require('../../../assets/icon.png')}
        style={{
          width: '100%',
          height: 300,
        }}
      />
      <AppText style={styles.slogan}>Ensemble, nous sommes plus fort.</AppText>

      <View style={{ marginTop: 40 }}>
        <View style={styles.phoneContact}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="whatsapp" size={40} color={colors.vert} />
            <MaterialCommunityIcons name="phone-outline" size={40} color="black" />
          </View>
          <AppText style={{ fontSize: 18, fontWeight: 'bold' }}>+225 0708525827</AppText>
        </View>
        <View style={styles.messengerContact}>
          <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons name="facebook" size={40} color={colors.bleuFbi} />
            <MaterialCommunityIcons name="facebook-messenger" size={40} color={colors.bleuFbi} />
          </View>
          <AppText style={{ fontWeight: 'bold', fontSize: 18 }}>sabbat-group</AppText>
        </View>

        <View style={styles.mailAdresse}>
          <View style={styles.email}>
            <MaterialCommunityIcons name="email" size={40} color={colors.grey} />
            <AppText style={{ fontSize: 18, fontWeight: 'bold' }}>sabbattech@gmail.com</AppText>
          </View>
        </View>
        <View style={styles.faq}>
          <AppText>Consulter la</AppText>
          <AppText onPress={() => navigation.navigate(routes.FAQ)} style={styles.faqText}>
            FAQ
          </AppText>
        </View>
        <View style={styles.faq}>
          <AppText>Lire les</AppText>
          <AppText onPress={handleGetCGU} style={styles.faqText}>
            Conditions Générales d'Utilisation
          </AppText>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingBottom: 20,
  },
  email: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faq: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 20,
  },
  faqText: {
    color: colors.bleuFbi,
    marginLeft: 10,
  },
  phoneContact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
    marginHorizontal: 20,
  },
  messengerContact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
    marginHorizontal: 20,
  },
  mailAdresse: {
    marginVertical: 20,
    marginHorizontal: 20,
  },
  slogan: {
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: -10,
  },
});
