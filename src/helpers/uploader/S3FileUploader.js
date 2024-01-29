/* eslint-disable comma-dangle */
/* eslint-disable no-await-in-loop */
import axios from 'axios';
import httpClient from '../utils/httpClient';
import { GATEWAY_BASE_URL } from '../utils/constants';

class S3FileUploader {
  async upload(file, progressCallback) {
    const objectName = file.name;
    const presignedUrl = await this.getPresignedUrl(objectName);

    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      data: file,
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        progressCallback(percentCompleted, 1, 1);
      }
    };
    try {
      const response = await axios(presignedUrl, options);
      console.log('File uploaded successfully', response.status);
    } catch (error) {
      console.error('Failed to upload file', error);
    }
  }

  async getPresignedUrl(objectName) {
    const data = {
      objectName,
    };

    const response = await httpClient(
      `${GATEWAY_BASE_URL}/s3`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }).then((data) => JSON.parse(data.body))
      .catch((error) => {
        console.error(error);
        return false;
      });
    console.table(response);
    return response.signedUrl;
  }
}
export default S3FileUploader;
