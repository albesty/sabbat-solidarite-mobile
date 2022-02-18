import { StyleSheet, Text, View, Modal, ImageBackground, ScrollView } from 'react-native';
import React from 'react';
import AppIconButton from '../../components/common/AppIconButton';
import AppText from '../../components/common/AppText';
import AppSpacer from '../../components/common/AppSpacer';
import AppButton from '../../components/common/AppButton';
import routes from '../../navigation/routes';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../utils/styles';

export default function WelcomeModal({ closeModal, visible, onButtonPress }) {
  const navigation = useNavigation();

  return (
    <Modal visible={visible} transparent>
      <ImageBackground
        blurRadius={2}
        style={styles.ImageBackground}
        source={require('../../../assets/main_dans_la_main.jpg')}
      >
        <AppIconButton onPress={closeModal} style={styles.closeButton} icon="close" />
        <ScrollView
          contentContainerStyle={styles.contentContainerStyle}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.info}>
            <AppText style={{ fontWeight: 'bold', alignSelf: 'center' }}>Sabbat-solidarité</AppText>
            <AppText style={{ fontWeight: 'bold', alignSelf: 'center' }}>
              {' '}
              Une solution d'épargne entres copins ou en association.
            </AppText>
            <AppSpacer />
            <AppText>Objectifs principaux:</AppText>
            <AppSpacer />
            <View>
              <AppText>
                1 - Permettre la mise en place facile, transparente et sécurisée d'une épargne
                (caisse) en association.
              </AppText>
              <AppSpacer />
              <View>
                <AppText>
                  2 - Garantir le financement de projets de chaque association à travers notre
                  concept de fonds triplés.
                </AppText>
                <AppText>
                  Le concept de fonds triplés est l'octroi de crédit de financement dont le montant
                  est égal au triple de votre épargne.
                </AppText>
                <AppSpacer />
                <AppText>Pour en bénéficier, c'est très simple:</AppText>
                <AppSpacer />
                <AppText>- Votre association doit comprendre au moins 5 membres actifs.</AppText>
                <AppText>
                  - Votre association doit avoir fait au moins un (1) an de cotisation regulière.
                </AppText>
              </View>
              <View style={styles.help}>
                <AppText>Pour plus d'informations, </AppText>
                <AppText
                  style={styles.helpText}
                  onPress={() => navigation.navigate(routes.CONTACT)}
                >
                  contactez nous.
                </AppText>
              </View>
            </View>
            <AppSpacer />
            <AppSpacer />
            <AppButton onPress={onButtonPress} title="Adherer ou créer une association." />
          </View>
        </ScrollView>
      </ImageBackground>
    </Modal>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingBottom: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  ImageBackground: {
    width: '100%',
    height: '100%',
  },
  info: {
    marginHorizontal: 10,
    paddingVertical: 10,
  },
  help: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  helpText: {
    color: colors.bleuFbi,
  },
});
