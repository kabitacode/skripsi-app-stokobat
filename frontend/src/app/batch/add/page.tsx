"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from "../../dashboard/layout";
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { TextField, Button, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material'; // Import komponen TextField dari Material-UI
import { CustomButton, ButtonCustom } from "@/components";
import { fetchBatchAdd, fetchObat } from '@/services';
import useStore from '@/store/useStore';
import { ArrowBack } from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import dayjs, { Dayjs } from 'dayjs';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface FormData {
    id: string;
    tanggal_produksi: Dayjs | null;
    nama_obat: string;
}


interface dataResponse {
    id: string;
    nama_obat: string;
}

const Page: React.FC<FormData> = () => {
    const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm<FormData>();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<dataResponse[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [tanggal, setTanggal] = useState<Dayjs | null>(dayjs());

    const router = useRouter();
    const { user } = useStore();


    const fetchData = async () => {
        if (!user || !user.token) return;

        try {
            const response = await fetchObat(user?.token);
            const result = response.data;


            setData(result);
            setLoading(false);

        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        if (!user || !user.token) return;
        setLoading(true);
        try {
            const postData = {
                id_obat: data.nama_obat,
                tanggal_produksi: data.tanggal_produksi,
            };
            const response = await fetchBatchAdd(user?.token, postData);
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
                <h1 className="text-2xl font-semibold mt-1 ml-2">Tambah Data Batch</h1>
            </div>

            <div className='ml-7'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-1/3 mb-5">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Tanggal Produksi"
                                value={tanggal}
                                onChange={(newValue) => {
                                    setTanggal(newValue);
                                    setValue('tanggal_produksi', newValue, { shouldValidate: true });
                                }}
                            />
                        </LocalizationProvider>
                    </div>

                    <div className="w-1/3 mb-5">
                        <FormControl fullWidth error={!!errors.nama_obat}>
                            <InputLabel id="obat-label">Nama Obat</InputLabel>
                            <Controller
                                name="nama_obat"
                                control={control}
                                defaultValue=""
                                rules={{ required: "Nama Obat is required" }}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <Select
                                        labelId="obat-label"
                                        id="obat"
                                        value={value}
                                        label="Nama Obat"
                                        onChange={onChange}
                                    >
                                        {data.map((item) => (
                                            <MenuItem key={item.id} value={item.id}>{item.nama_obat}</MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            {errors.nama_obat && <p className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained mui-1wc848c-MuiFormHelperText-root" id="kategori">{errors.nama_obat.message}</p>}
                        </FormControl>
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
