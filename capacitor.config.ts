import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sorminsshack.glazevaultapp',
  appName: 'Vitrify',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    App: {
      // Specify deep link hosts and schemes
      handleLinks: {
        schemes: ['https'],
        hosts: ['resilient-stardust-d78e45.netlify.app'],
      },
    },
  },
};

export default config;
