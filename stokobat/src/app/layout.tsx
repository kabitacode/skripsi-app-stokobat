"use client"

import React, { useEffect } from "react";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { Roboto } from 'next/font/google'
import { useRouter } from 'next/navigation';
import useStore, { User } from '@/store/useStore'
import { Toaster } from "react-hot-toast";
import { Close } from "@mui/icons-material";


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
  const { user, setUser } = useStore();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (!user) {
        setUser(parsedUser);
      }
    } else {
      router.push('/');
    }
  }, [user, router, setUser]);

  return (
    <html lang="en">
      <body className={roboto.className}>
        <AppRouterCacheProvider>
          <Toaster
            position="bottom-center"
            toastOptions={{
              // Define default options
              icon: undefined,
              className: '',
              duration: 5000,
              style: {
                background: '#363636',
                color: '#fff',
              },

              // Default options for specific types
              success: {
                duration: 5000,
                style: {
                  background: '#5cb85c',
                },
              },
              error: {
                duration: 3000,
                style: {
                  background: '#ff0505',
                },
              },
            }}
          />
          {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
