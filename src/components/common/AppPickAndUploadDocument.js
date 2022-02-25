import React, { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import AppIconButton from './AppIconButton';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { colors } from '../../utils/styles';
import useUploadImage from '../../hooks/useUploadImage';
import UploaderModal from './UploaderModal';
import { updateReglement } from '../../api/services/associationServices';
import { AssociationContext } from '../../contexts/AssociationContext';
import { associationsActions } from '../../reducers/associationReducer';

export default function AppPickAndUploadDocument({ association }) {
  const { uploader } = useUploadImage();
  const { associationDispatch } = useContext(AssociationContext);
  const [progress, setProgress] = useState(0);
  const [uploadModal, setUploadModal] = useState(false);

  const getFileAndUploadIt = async () => {
    try {
      const { type, uri, name } = await DocumentPicker.getDocumentAsync();
      if (type === 'success') {
        const content = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
        const imageArray = [{ url: uri, imageData: content }];
        setProgress(0);
        setUploadModal(true);
        const result = await uploader(imageArray, (progress) => {
          setProgress(progress);
        });
        const updateResponse = await updateReglement({
          associationId: association.id,
          reglementUrl: result.signedUrlsArray[0].url,
        });
        if (!updateResponse.ok) {
          setUploadModal(false);
          alert('Impossible de mettre votre reglement à jour.');
          return;
        }
        associationDispatch({
          type: associationsActions.update_info,
          association: updateResponse.data,
        });
        alert('Le reglement a été mise à jour avec succès.');
        setUploadModal(false);
      }
    } catch (e) {
      throw new Error(e);
    }
  };

  return (
    <>
      <AppIconButton style={styles.button} icon="file-document-edit" onPress={getFileAndUploadIt} />
      {uploadModal && <UploaderModal style={styles.avatarLoading} progress={progress} />}
    </>
  );
}

const styles = StyleSheet.create({
  avatarLoading: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: colors.bleuFbi,
    alignSelf: 'flex-end',
  },
});
