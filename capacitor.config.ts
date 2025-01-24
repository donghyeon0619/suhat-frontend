import type { CapacitorConfig } from '@capacitor/cli';
import {CapacitorCookies} from "@capacitor/core";

const config: CapacitorConfig = {
  appId: 'com.coders.suhat',
  appName: 'SUAHT',
  webDir: 'dist',
  plugins: {
    CapacitorHttp:{
      enabled:true,
    },
    CapacitorCookies:{
      enabled:true
    },
    Keyboard: {
      resize: 'none'
    },
    SplashScreen :{
      launchShowDuration: 4000,
      launchAutoHide: true,
      backgroundColor: '#000000',
      splashFullScreen: 'true'
    }
  },
  server: {
    hostname: 'suhat.kr',
    cleartext: false,
  }
};

export default config;
