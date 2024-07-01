'use client';

import React, { useState } from "react"
import useStore from '@/store/useStore'
import DashboardLayout from "../dashboard/layout";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Page: React.FC = () => {
    const { user } = useStore();
    const router = useRouter();

      useEffect(() => {
        console.log(user);
        
      
        return () => {
          
        }
      }, [])
      
    
    return (
       <h1>hello</h1>
    )
}

export default Page;