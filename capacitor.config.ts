import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'boardgame-frontend',
  webDir: 'dist',
  plugins: {
    CapacitorHttp:{
      enabled:true,
    }
  }
};

export default config;
