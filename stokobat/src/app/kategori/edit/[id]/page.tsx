"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from "../../../dashboard/layout";
import { useForm, SubmitHandler } from 'react-hook-form';
import { TextField, Button, IconButton } from '@mui/material';
import { CustomButton, ButtonCustom } from "@/components";
import { fetchKategoriEdit, fetchKategoriId } from '@/services';
import useStore from '@/store/useStore';
import { ArrowBack } from '@mui/icons-material';
import { toast } from 'react-hot-toast';

interface FormData {
    nama: string;
    supplier: string;
}

interface dataResponse {
    message: string
}

const Page: React.FC<FormData> = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<dataResponse>();
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { user } = useStore();
    const params = useParams<{ id: string }>()


    const fetchDataUsers = async () => {
        if (!user || !user.token) return;

        try {
            const response = await fetchKategoriId(user?.token, params.id);
            const result = response.data;
            reset({
                nama: result.nama,
                supplier: result.penerbit
            })
            setLoading(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDataUsers();
    }, [user]);

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        if (!user || !user.token) return;
        setLoading(true);
        try {
            const postData = {
                nama: data.nama,
                penerbit: data.supplier
            };
            const response = await fetchKategoriEdit(user?.token, params.id, postData);
            toast.success(response.message || "Data berhasil Diubah!");
            reset({
                nama: "",
                supplier: ""
            });
            router.back();
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-row mt-4 ml-4 mr-4 mb-10">
                <IconButton onClick={() => router.back()}>
                    <ArrowBack />
                </IconButton>
                <h1 className="text-2xl font-semibold mt-1 ml-2">Edit Data Kategori</h1>
            </div>

            <div className='ml-7'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-1/3 mr-5 mb-5">
                        <TextField
                            id="name"
                            label="Nama Kategori"
                            variant="outlined"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.nama}
                            helperText={errors.nama && "Nama Kategori is required"}
                            {...register('nama', { required: true })}
                        />
                    </div>
                    <div className="w-1/3 mr-5 mb-5">
                        <TextField
                            id="supplier"
                            label="Supplier / Penerbit"
                            variant="outlined"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.supplier}
                            helperText={errors.supplier && "Supplier is required"}
                            {...register('supplier', { required: true })}
                        />
                    </div>
                    <div className="mt-8">
                        <Button
                            size='large'
                            className='w-1/6'
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            style={{ textTransform: 'none' }}
                        >
                            {loading ? 'Loading...' : 'Edit'}
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default Page;
