"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from "../../dashboard/layout";
import { useForm, SubmitHandler } from 'react-hook-form';
import { TextField, Button, IconButton } from '@mui/material'; // Import komponen TextField dari Material-UI
import { CustomButton, ButtonCustom } from "@/components";
import { fetchUsersAdd } from '@/services';
import useStore from '@/store/useStore';
import { ArrowBack } from '@mui/icons-material';
import { toast } from 'react-hot-toast';

interface FormData {
    name: string;
    role: string;
    email: string;
    password: string;
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

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        if (!user || !user.token) return;
        setLoading(true);
        try {
            const postData = {
                name: data.name,
                email: data.email,
                role: data.role,
                password: data.password,
            };
            const response = await fetchUsersAdd(user?.token, postData);
            toast.success(response.message || "Data berhasil Ditambahkan!");
            reset();
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
                <h1 className="text-2xl font-semibold mt-1 ml-2">Tambah Data User</h1>
            </div>

            <div className='ml-7'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex flex-row mb-5'>
                        <div className="w-1/3 mr-5">
                            <TextField
                                id="name"
                                label="Name"
                                variant="outlined"
                                fullWidth
                                error={!!errors.name}
                                helperText={errors.name && "Name is required"}
                                {...register('name', { required: true })}
                            />
                        </div>
                        <div className="w-1/3">
                            <TextField
                                id="email"
                                label="Email"
                                type='email'
                                variant="outlined"
                                fullWidth
                                error={!!errors.email}
                                helperText={errors.email && "Email is required"}
                                {...register('email', { required: true })}
                            />
                        </div>
                    </div>
                    <div className='flex flex-row mb-5'>
                        <div className="w-1/3 mr-5">
                            <TextField
                                id="role"
                                label="Role"
                                variant="outlined"
                                fullWidth
                                error={!!errors.role}
                                helperText={errors.role && "Role is required"}
                                {...register('role', { required: true })}
                            />
                        </div>
                        <div className="w-1/3">
                            <TextField
                                id="password"
                                label="password"
                                variant="outlined"
                                type='password'
                                fullWidth
                                error={!!errors.password}
                                helperText={errors.password && "password is required"}
                                {...register('password', { required: true })}
                            />
                        </div>
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
                            {loading ? 'Loading...' : 'Tambah'}
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default Page;
