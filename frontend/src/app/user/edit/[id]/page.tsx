"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from "../../../dashboard/layout";
import { useForm, SubmitHandler } from 'react-hook-form';
import { TextField, Button, IconButton, FormControl, InputLabel, MenuItem } from '@mui/material';
import { CustomButton, ButtonCustom } from "@/components";
import { fetchUsersAdd, fetchUsersEdit, fetchUsersId } from '@/services';
import useStore from '@/store/useStore';
import { ArrowBack } from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import Select, { SelectChangeEvent } from '@mui/material/Select';

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
    const params = useParams<{ id: string }>()
    const [role, setRole] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setRole(event.target.value as string);
    };

    const fetchDataUsers = async () => {
        if (!user || !user.token) return;

        try {
            const response = await fetchUsersId(user?.token, params.id);
            const result = response.data;
            reset({
                name: result.name,
                email: result.email,
                password: result.password
            })
            setRole(result.role)
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
                name: data.name,
                email: data.email,
                role: role,
                password: data.password,
                confPassword: ""
            };
            const response = await fetchUsersEdit(user?.token, params.id, postData);
            toast.success(response.message || "Data berhasil Diubah!");
            reset({
                name: "",
                email: "",
                password: ""
            });
            setRole("")
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
                <h1 className="text-2xl font-semibold mt-1 ml-2">Edit Data User</h1>
            </div>

            <div className='ml-7'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex flex-row mb-5'>
                        <div className="w-1/3 mr-5">
                            <TextField
                                id="name"
                                label="Nama"
                                variant="outlined"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.name}
                                helperText={errors.name && "Nama is required"}
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
                                InputLabelProps={{ shrink: true }}
                                helperText={errors.email && "Email is required"}
                                {...register('email', { required: true })}
                            />

                        </div>
                    </div>
                    <div className='flex flex-row mb-5'>
                        <div className="w-1/3 mr-5">
                            <FormControl fullWidth>
                                <InputLabel id="role">Role</InputLabel>
                                <Select
                                    labelId="role"
                                    id="role"
                                    label="Role"
                                    value={role}
                                    onChange={handleChange}
                                >
                                    <MenuItem value={"Admin"}>Admin</MenuItem>
                                    <MenuItem value={"Apoteker"}>Apoteker</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        {/* <div className="w-1/3 mr-5">
                            <TextField
                                id="role"
                                label="Role"
                                variant="outlined"
                                fullWidth
                                error={!!errors.role}
                                InputLabelProps={{ shrink: true }}
                                helperText={errors.role && "Role is required"}
                                {...register('role', { required: true })}
                            />
                        </div> */}
                        <div className="w-1/3 mr-5">
                            <TextField
                                id="password"
                                label="Password"
                                variant="outlined"
                                type='password'
                                fullWidth
                                error={!!errors.password}
                                InputLabelProps={{ shrink: true }}
                                helperText={errors.password && "Password is required"}
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
                            {loading ? 'Loading...' : 'Edit'}
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default Page;
