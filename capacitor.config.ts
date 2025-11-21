import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.alertup',
  appName: 'AlertUp',
  webDir: 'dist/frontend/browser',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#a03333ff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      spinnerColor: "#ffffffff",
      splashFullScreen: true,
      splashImmersive: true
    }
  },
  server: {
    allowNavigation: ["emergenze.protezionecivile.gov.it"]
  }
};

export default config;