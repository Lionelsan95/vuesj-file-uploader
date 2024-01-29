<script setup lang="ts">
defineProps<{
  msg: string
}>()

import S3MultipartFileUploader from '@/helpers/uploader/S3MultipartFileUploader';

function handleUpload(file: File) {
  console.log('uploading ...')
  let mulitUploader = new S3MultipartFileUploader();
  
  mulitUploader.upload(file, uploadProgress, uploadFinished, uploadError);
}

function uploadProgress(percentage: number) {
  console.log('uploading' + percentage)
}

function uploadError() {
  console.log('error while uploading')
}

function uploadFinished() {
  console.log('upload finished')
}

</script>

<template>
  <div class="container">
    <div class="card">
      <h3>Upload Files</h3>
      <div class="drop_box">
        <header>
          <h4>Select File here</h4>
        </header>
        <p>Files Supported: PDF, TEXT, DOC , DOCX</p>
        <input @change="handleUpload" type="file" accept=".doc,.docx,.pdf" id="fileID" >
      </div>

    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap");
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

.container {
  height: 100vh;
  width: 100%;
  align-items: center;
  display: flex;
  justify-content: center;
  background-color: #fcfcfc;
}

.card {
  border-radius: 10px;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.3);
  width: 600px;
  height: 260px;
  background-color: #ffffff;
  padding: 10px 30px 40px;
}

.card h3 {
  font-size: 22px;
  font-weight: 600;
  
}

.drop_box {
  margin: 10px 0;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 3px dotted #a3a3a3;
  border-radius: 5px;
}

.drop_box h4 {
  font-size: 16px;
  font-weight: 400;
  color: #2e2e2e;
}

.drop_box p {
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 12px;
  color: #a3a3a3;
}

.btn {
  text-decoration: none;
  background-color: #005af0;
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  outline: none;
  transition: 0.3s;
}

.btn:hover{
  text-decoration: none;
  background-color: #ffffff;
  color: #005af0;
  padding: 10px 20px;
  border: none;
  outline: 1px solid #010101;
}
.form input {
  margin: 10px 0;
  width: 100%;
  background-color: #e2e2e2;
  border: none;
  outline: none;
  padding: 12px 20px;
  border-radius: 4px;
}
</style>
