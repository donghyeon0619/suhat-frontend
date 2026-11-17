import type { CapacitorConfig } from '@capacitor/cli';
import { testApiOrigin } from './scripts/test-api-origin.cjs';

const testOrigin = testApiOrigin(process.env.SUHAT_TEST_API_URL);

const config: CapacitorConfig = {
  appId: 'com.coders.suhat',
  appName: 'SUAHT',
  webDir: 'dist',
  overrideUserAgent: testOrigin ? process.env.SUHAT_TEST_USER_AGENT : undefined,
  plugins: {
    CapacitorHttp:{
      enabled: true,
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
      backgroundColor: '#FFFFFF',
      splashFullScreen: 'true',
      androidScaleType: 'FIT_CENTER',

    },
  },
  server: {
    hostname: testOrigin ? new URL(testOrigin).hostname : 'suhat.kr',
    cleartext: false,
  }
};

export default config;
