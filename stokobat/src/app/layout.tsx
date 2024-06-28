"use client"

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { Roboto } from 'next/font/google'
import { useRouter } from 'next/navigation';
import useStore, {User} from '@/store/useStore'
import { useEffect } from "react";

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { user } = useStore();

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]); 


  return (
    <html lang="en">
      <body className={roboto.className}>
        <AppRouterCacheProvider>
          {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
