"use client";

import { useState } from 'react';
import DashboardLayout from "../../dashboard/layout";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type FieldType = {
    namaObat: string;
    stok: number;
    harga: number;
    tanggal: string;
};

export default function Page() {
    const [namaObat, setNamaObat] = useState('');
    const [stok, setStok] = useState<number>(0);
    const [harga, setHarga] = useState<number>(0);
    const [tanggal, setTanggal] = useState<Date>();
    const [loading, setLoading] = useState(false);
    const router = useRouter();


    return (
        <DashboardLayout>
            <div className="flex flex-row mt-4 ml-4 justify-between mr-4">
                <div className='mb-5'>
                  
                </div>
            </div>

            <div className='w-full max-w-md mx-auto bg-white p-8 rounded-md shadow-md'>
              
            </div>

        </DashboardLayout>
    );
}
