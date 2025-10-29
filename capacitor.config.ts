
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wanderlink.app',
  appName: 'WanderLink',
  webDir: 'out',
  server: {
<<<<<<< HEAD
    url: `http://${process.env.HOST || 'localhost'}:3000`, 
=======
    url: 'http://192.168.100.26:3000', 
>>>>>>> 0d1192a5251aac79b7e20cc5776074323faf8589
    cleartext: true
  }
};

export default config;
