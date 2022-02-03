import { create } from 'apisauce';
import { Buffer } from 'buffer';
import { signUploadRequest } from '../api/services/fileUploaderService';

export default function useUploadImage() {
  const getFileNameAndType = (imageUrl) => {
    let fileType = '';
    const fileName = imageUrl.split('/').pop();
    const type = fileName.split('.').pop();
    if (type === 'jpeg' || type === 'jpg') fileType = 'image/jpeg';
    if (type === 'png') fileType = 'image/png';
    if (type === 'pdf') fileType = 'application/pdf';
    return { fileName, fileType };
  };

  const dataTransformer = (imagesDataArray) => {
    const urlArray = imagesDataArray.map((image) => image.url);
    let newArray = [];
    urlArray.forEach((url) => {
      const { fileType, fileName } = getFileNameAndType(url);
      const modifiedData = {
        fileName,
        fileType,
      };
      newArray.push(modifiedData);
    });
    return newArray;
  };

  const directUpload = async (imagesArray, signedArray, getUploadProgress) => {
    let uploadSuccess = false;
    try {
      const base64DataArray = imagesArray.map((image) => image.imageData);
      if (signedArray.length > 0 && base64DataArray.length > 0) {
        for (let i = 0; i < base64DataArray.length; i++) {
          const { fileType } = getFileNameAndType(imagesArray[i].url);
          const byApiSauce = create({
            baseURL: signedArray[i].signedUrl,
          });

          const bufferData = new Buffer(base64DataArray[i], 'base64');
          const result = await byApiSauce.put('', bufferData, {
            headers: {
              'x-amz-acl': 'public-read',
              'Content-Encoding': 'base64',
              'Content-Type': fileType,
            },
            onUploadProgress: (progress) =>
              getUploadProgress((progress.loaded / progress.total) * 100),
          });
          if (result.ok) uploadSuccess = true;
        }
      }
      return uploadSuccess;
    } catch (e) {
      throw new Error(`error: ${e.data}`);
    }
  };

  const uploader = async (imageArray, updateProgress) => {
    const transformedArray = dataTransformer(imageArray);
    const response = await signUploadRequest({ dataArray: transformedArray });
    if (!response.ok) {
      alert("Erreur lors du chargement de l'image.");
      return;
    }
    const signedReqArray = response.data;
    const directUploadResponse = await directUpload(imageArray, signedReqArray, (progress) =>
      updateProgress(progress)
    );
    if (!directUploadResponse) {
      alert("Erreur lors de l'enregistrement de l'image");
      return;
    }
    return { signedUrlsArray: signedReqArray };
  };

  return { dataTransformer, directUpload, uploader };
}
