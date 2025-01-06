<template>
  <NuxtPage />
  <!-- <el-container>
    <el-main>
    </el-main>
    <el-footer>
      Created by <a href="https://econ-sense.com/about.html" target="_blank">EN Chu</a>
    </el-footer>
  </el-container> -->
</template>
<script setup lang="ts">
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUjd-FjoB2jX5Hhm8gnOEyD-NLl1qwmRw",
  authDomain: "enoch-259ad.firebaseapp.com",
  projectId: "enoch-259ad",
  storageBucket: "enoch-259ad.firebasestorage.app",
  messagingSenderId: "180766333999",
  appId: "1:180766333999:web:cdd879382f36205a04bada",
  measurementId: "G-05HZ6B2YC0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
</script>
