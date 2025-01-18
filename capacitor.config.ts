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
    }
  },
  server: {
    cleartext: true,
  }
};

export default config;
