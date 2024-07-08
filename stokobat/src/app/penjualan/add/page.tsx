"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from "../../dashboard/layout";
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { TextField, Button, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material'; // Import komponen TextField dari Material-UI
import { CustomButton, ButtonCustom } from "@/components";
import { fetchPenjualanById, fetchKategori, fetchPenjualanAdd } from '@/services';
import useStore from '@/store/useStore';
import { ArrowBack } from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import dayjs, { Dayjs } from 'dayjs';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface FormData {
    id: string;
    tanggal_transaksi: Dayjs | null;
    nama_obat: string;
    kategori: string;
}


interface dataResponse {
    id: string;
    nama: string;
}

interface dataResponseObat {
    id: string;
    nama_obat: string;
}

const Page: React.FC<FormData> = () => {
    const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm<FormData>();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<dataResponse[]>([]);
    const [dataObat, setDataObat] = useState<dataResponseObat[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [tanggal, setTanggal] = useState<Dayjs | null>(dayjs());
    const [selectedKategori, setSelectedKategori] = useState<string>("");


    const router = useRouter();
    const { user } = useStore();



    const fetchDataKategori = async () => {
        if (!user || !user.token) return;

        try {
            const response = await fetchKategori(user?.token);
            const result = response.data;


            setData(result);
            setLoading(false);

        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchDataObat = async (id: string) => {
        if (!user || !user.token) return;

        try {
            const response = await fetchPenjualanById(id, user?.token);
            const result = response.data;
            
            setDataObat(result);
            setLoading(false);

            router.back();

        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDataKategori();
    }, [user]);

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        if (!user || !user.token) return;
        setLoading(true);
        try {
            const postData = {
                id_obat: data.nama_obat,
                tanggal_transaksi: data.tanggal_transaksi,
            };
            const response = await fetchPenjualanAdd(user?.token, postData);
            toast.success(response.message || "Data berhasil Ditambahkan!");
            reset();
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleKategoriChange = async (value: any) => {
        setSelectedKategori(value); 
        setValue('kategori', value); 
        if (value) {
            await fetchDataObat(value); 
        } else {
            setDataObat([]); 
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-row mt-4 ml-4 mr-4 mb-10">
                <IconButton onClick={() => router.back()}>
                    <ArrowBack />
                </IconButton>
                <h1 className="text-2xl font-semibold mt-1 ml-2">Tambah Data Penjualan</h1>
            </div>

            <div className='ml-7'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-1/3 mb-5">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Tanggal Transaksi"
                                value={tanggal}
                                onChange={(newValue) => {
                                    setTanggal(newValue);
                                    setValue('tanggal_transaksi', newValue, { shouldValidate: true });
                                }}
                            />
                        </LocalizationProvider>
                    </div>

                    <div className="w-1/3 mb-5">
                        <FormControl fullWidth error={!!errors.nama_obat}>
                            <InputLabel id="obat-label">Kategori</InputLabel>
                            <Controller
                                name="kategori"
                                control={control}
                                defaultValue=""
                                rules={{ required: "Kategori is required" }}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <Select
                                        labelId="kategori-label"
                                        id="kategori"
                                        value={value}
                                        label="Kategori"
                                        onChange={(e) => {
                                            onChange(e.target.value);
                                            handleKategoriChange(e.target.value); // Panggil fungsi saat kategori berubah
                                        }}
                                    >
                                        {data.map((item) => (
                                            <MenuItem key={item.id} value={item.id}>{item.nama}</MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            {errors.nama_obat && <p className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained mui-1wc848c-MuiFormHelperText-root" id="kategori">{errors.nama_obat.message}</p>}
                        </FormControl>
                    </div>

                    {
                        selectedKategori ? <div className="w-1/3 mb-5">
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
                                            {dataObat.map((item) => (
                                                <MenuItem key={item.id} value={item.id}>{item.nama_obat}</MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                                {errors.nama_obat && <p className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained mui-1wc848c-MuiFormHelperText-root" id="kategori">{errors.nama_obat.message}</p>}
                            </FormControl>
                        </div> : null
                    }

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
