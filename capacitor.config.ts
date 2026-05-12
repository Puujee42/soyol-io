import { CapacitorConfig } from '@capacitor/cli';

/** Capacitor 8 types omit legacy `packageClassList`; kept for Apple Sign In native registration per project checklist. */
const config: CapacitorConfig & { packageClassList?: string[] } = {
  appId: 'mn.soyol.shop',
  appName: 'Soyol Shop',
  webDir: 'public',
  ios: {
    // Prevent iOS WebView from adding automatic top inset (safe-area gap).
    // We handle safe-area with CSS + viewport-fit=cover.
    contentInset: 'never',
    scrollEnabled: true,
  },
  server: {
    url: 'https://soyol-io.vercel.app',
    androidScheme: 'https',
    errorPath: '/offline.html',
  },
  packageClassList: ['SignInWithApplePlugin'],
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    SplashScreen: {
      // Keep splash visible until the web app signals it's ready.
      // This improves perceived startup time on slower networks.
      launchShowDuration: 0,
      launchAutoHide: false,
      backgroundColor: "#ffffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
