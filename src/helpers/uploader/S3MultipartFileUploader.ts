/* eslint-disable no-await-in-loop */
import axios from 'axios';
import { httpClient } from '../httpClient';
import { GATEWAY_BASE_URL } from '../constants';

const MINIO_MAX_PART_SIZE = 128 * 1024 * 1024;

export class S3MultipartFileUploader {
  async upload(file: File, progressCallback: Function, onFinishCallback: Function, onErrorCallback: Function) {
    console.log('inside the method ...');
    console.log(file);
    const parts = [];
    let uploadError = false;

    const objectName = file.name;
    const partSize = this.calculateChunkSize(file.size);
    const totalParts = Math.ceil(file.size / partSize);

    // Initiate upload
    const uploadId = await this.initiateUpload(objectName);

    // Upload parts
    for (let i = 0; i < totalParts; i += 1) {
      const start = i * partSize;
      const end = Math.min(start + partSize, file.size);
      const part = file.slice(start, end);

      const PartNumber = i + 1;
      const partPresignedUrl = await this.getPartPresignedUrl(uploadId, objectName, PartNumber);

      const ETag = await this.uploadPart(partPresignedUrl, part, file.type, PartNumber, totalParts, progressCallback);

      if (ETag == null) {
        uploadError = true;
        break;
      }

      parts.push({ ETag, PartNumber });
    }
    console.table(parts);

    if (uploadError === true) {
      console.log('aborting upload');
      onErrorCallback();
      return;
    }

    // Complete upload
    const response = await this.completeUpload(objectName, uploadId, parts);

    if (response === false) {
      onErrorCallback();
    } else {
      onFinishCallback(response);
    }
  }

  calculateChunkSize(size: any) {
    if (size < MINIO_MAX_PART_SIZE) {
      return size;
    }
    return MINIO_MAX_PART_SIZE;
  }

  async initiateUpload(objectName: string): string  {
    const data = {
      objectName,
    };

    const response = await httpClient(
      `${GATEWAY_BASE_URL}/s3InitiateMultipartUpload`,
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {}
      }).then((data: any) => JSON.parse(data.body))
      .catch((error) => {
        console.error(error);
      });
    return response.uploadId;
  }

  async getPartPresignedUrl(uploadId: string, objectName: string, partNumber: number) {
    const data = {
      objectName,
      uploadId,
      partNumber,
    };

    const response = await httpClient(
      `${GATEWAY_BASE_URL}/s3UploadPartPresignedUrl`,
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {}
      }).then((data: any) => JSON.parse(data.body))
      .catch((error) => {
        console.error(error);
        return false;
      });
    return response.signedUrl;
  }

  async uploadPart(partPresignedUrl: string, part: Object, type: string, partNumber: number, totalParts: number, progressCallback: Function) {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': type,
      },
      data: part,
      onUploadProgress: (progressEvent: any) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        progressCallback(percentCompleted, partNumber, totalParts);
      },
    };
    try {
      const response = await axios(partPresignedUrl, options);
      return response.headers.etag;
    } catch (error) {
      console.error(`Failed to upload part ${partNumber}`, error);
      return null;
    }
  }

  async completeUpload(objectName: string, uploadId: string, parts: Record<any, number>[]) {
    const data = {
      objectName,
      uploadId,
      parts,
    };

    const response = await httpClient(
      `${GATEWAY_BASE_URL}/s3CompleteMultipartUpload`,
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {}
      }).then((data: any) => JSON.parse(data.body))
      .catch((error) => {
        console.error(error);
        return false;
      });
    return response.S3filePath;
  }
}
export default S3MultipartFileUploader;
