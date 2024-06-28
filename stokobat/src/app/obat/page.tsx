"use client"

import React, { useEffect, useState } from 'react';

import { Alert, AlertTitle, Button, CircularProgress } from "@mui/material";
import DashboardLayout from "../dashboard/layout";
import Link from 'next/link';
import { Add } from "@mui/icons-material";
import { CustomButton } from "@/components";
import { fetchObat } from '@/services/api';



export default function Page() {
    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDataFromApi = async () => {
            try {
                const apiData = await fetchObat();
                console.log(apiData);

                setData(apiData);
                setLoading(false);
            } catch (error: any) {
                setError(error.response?.data?.message || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDataFromApi();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <DashboardLayout>
            {
                error && <div className="mb-5 mt-5 w-1/2">
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {error}
                    </Alert>
                </div>
            }
            <div className="flex mt-4 mr-5 ml-5 mb-5 justify-between">
                <div className="">

                </div>
                <div className="">
                    <Link href={'/obat/add'}>
                        <CustomButton startIcon={<Add />}>
                            Tambah
                        </CustomButton>
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    )
}