import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.coders.boardgame',
  appName: 'boardgame',
  webDir: 'public',
  plugins: {
    CapacitorHttp:{
      enabled:true,
    }
  }
};

export default config;
