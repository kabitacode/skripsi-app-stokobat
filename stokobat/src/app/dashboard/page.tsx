"use client"

import useStore from '@/store/useStore'
import DashboardLayout from "../dashboard/layout";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
    const { user } = useStore();
    const router = useRouter();


    // if (!user) {
    //   router.push('/');
    //   return null;
    // }

      useEffect(() => {
        console.log(user);
        
      
        return () => {
          
        }
      }, [])
      
    
    return (
       <h1>hello</h1>
    )
}