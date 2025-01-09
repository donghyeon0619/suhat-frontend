import type { CapacitorConfig } from '@capacitor/cli';
import {CapacitorCookies} from "@capacitor/core";

const config: CapacitorConfig = {
  appId: 'com.coders.suhat',
  appName: 'SUHAT',
  webDir: 'dist',
  plugins: {
    CapacitorHttp:{
      enabled:true,
    },
    CapacitorCookies:{
      enabled:true
    }
  }
};

export default config;
