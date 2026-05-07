'use client';

import { SWRConfig } from 'swr';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

const swrDefaults = {
  revalidateOnFocus: false,
  dedupingInterval: 120000,
  errorRetryCount: 2,
};

import FloatingChatButton from '@/components/FloatingChatButton';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  usePushNotifications();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    document.documentElement.classList.add('cap-native');
    return () => {
      document.documentElement.classList.remove('cap-native');
    };
  }, []);

  // Hide native splash screen once the web UI is ready
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    let cancelled = false;
    (async () => {
      try {
        const { SplashScreen } = await import('@capacitor/splash-screen');
        // give the first paint a moment on slow devices
        setTimeout(() => {
          if (!cancelled) SplashScreen.hide().catch(() => {});
        }, 600);
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Add subtle "native feel" haptics on taps
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let Haptics: any = null;
    import('@capacitor/haptics')
      .then((m) => {
        Haptics = m.Haptics;
      })
      .catch(() => {});

    const handler = (e: Event) => {
      if (!Haptics) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const el = target.closest?.('button,a,[role="button"],[data-haptic]');
      if (!el) return;
      // avoid haptics for disabled buttons
      if ((el as HTMLButtonElement).disabled) return;

      Haptics.impact({ style: 'medium' }).catch(() => {});
    };

    // capturing makes it feel instant
    window.addEventListener('pointerup', handler, { capture: true });
    return () => window.removeEventListener('pointerup', handler, { capture: true } as any);
  }, []);

  return (
    <SWRConfig value={swrDefaults}>
      <LanguageProvider>
        <AuthProvider>
          <ErrorBoundary>
            {children}
            <FloatingChatButton />
            <Toaster position="top-right" reverseOrder={false} />
          </ErrorBoundary>
        </AuthProvider>
      </LanguageProvider>
    </SWRConfig>
  );
}
