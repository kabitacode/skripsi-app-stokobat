"use client"

import React, { useEffect } from "react";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { Roboto } from 'next/font/google'
import { useRouter } from 'next/navigation';
import useStore, {User} from '@/store/useStore'


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

  // useEffect(() => { 
  //   if (!user?.token) {
  //     router.push('/');
  //   }
  // }, [user, router]); 


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
