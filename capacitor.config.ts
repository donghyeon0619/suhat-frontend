import type { CapacitorConfig } from '@capacitor/cli';
import {CapacitorCookies} from "@capacitor/core";

const config: CapacitorConfig = {
  appId: 'com.coders.boardgame',
  appName: 'boardgame',
  webDir: 'public',
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
