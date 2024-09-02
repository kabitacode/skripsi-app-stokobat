"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from "../../dashboard/layout";
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { TextField, Button, IconButton, Box, InputLabel, MenuItem, FormControl, CircularProgress } from '@mui/material';
import Select from '@mui/material/Select';
import { fetchKategori, fetchObatAdd, fetchUsersAdd } from '@/services';
import useStore from '@/store/useStore';
import { ArrowBack } from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import dayjs, { Dayjs } from 'dayjs';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface FormData {
    name: string;
    stok: string;
    harga: string;
    harga_beli: string;
    tanggal: Dayjs | null;
    kategori: string;
    penerbit: string;
}

interface dataResponse {
    id: number;
    nama: string;
    penerbit: string;
}

const Page: React.FC = () => {
    const { register, handleSubmit, reset, formState: { errors }, control, setValue } = useForm<FormData>();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<dataResponse[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [tanggal, setTanggal] = useState<Dayjs | null>(dayjs());

    const router = useRouter();
    const { user } = useStore();

    const fetchData = async () => {
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

    useEffect(() => {
        fetchData();
    }, [user]);


    const onSubmit: SubmitHandler<FormData> = async (data) => {
        if (!user || !user.token) return;
        setLoading(true);
        try {
            const postData = {
                nama_obat: data.name,
                stok: data.stok,
                harga: data.harga,
                harga_beli: data.harga_beli,
                tanggal_kadaluarsa: tanggal?.format('YYYY-MM-DD'),
                id_kategori: data.kategori,
                id_penerbit: data.penerbit,
            };
            const response = await fetchObatAdd(user?.token, postData);
            toast.success(response.message || "Data berhasil Ditambahkan!");
            reset();
            setTanggal(dayjs());
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
                <h1 className="text-2xl font-semibold mt-1 ml-2">Tambah Data Obat</h1>
                {
                    loading && <CircularProgress />
                }
            </div>

            <div className='ml-7'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex flex-row mb-5'>
                        <div className="w-1/3 mr-5">
                            <TextField
                                id="name"
                                label="Nama Obat"
                                variant="outlined"
                                fullWidth
                                error={!!errors.name}
                                helperText={errors.name && "Nama Obat is required"}
                                {...register('name', { required: true })}
                            />
                        </div>
                        <div className="w-1/3">
                            <TextField
                                id="stok"
                                label="Stok"
                                type='number'
                                variant="outlined"
                                fullWidth
                                error={!!errors.stok}
                                helperText={errors.stok && "Stok is required"}
                                {...register('stok', { required: true })}
                            />
                        </div>
                    </div>
                    <div className='flex flex-row mb-5'>
                        <div className="w-1/3 mr-5">
                            <TextField
                                id="harga"
                                label="Harga Jual"
                                type='number'
                                variant="outlined"
                                fullWidth
                                error={!!errors.harga}
                                helperText={errors.harga && "Harga Jual is required"}
                                {...register('harga', { required: true })}
                            />
                        </div>
                        <div className="w-1/3">
                            <TextField
                                id="harga_beli"
                                label="Harga Beli"
                                type='number'
                                variant="outlined"
                                fullWidth
                                error={!!errors.harga_beli}
                                helperText={errors.harga_beli && "Harga Beli is required"}
                                {...register('harga_beli', { required: true })}
                            />
                        </div>
                    </div>
                    <div className='flex flex-row mb-5'>
                        <div className="w-1/3 mr-5">
                            <FormControl fullWidth error={!!errors.kategori}>
                                <InputLabel id="kategori-label">Kategori</InputLabel>
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
                                            onChange={onChange}
                                        >
                                            {data.map((item) => (
                                                <MenuItem key={item.id} value={item.id}>{item.nama}</MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                                {errors.kategori && <p className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained mui-1wc848c-MuiFormHelperText-root" id="kategori">{errors.kategori.message}</p>}
                            </FormControl>
                        </div>
                        <div className="w-1/3">
                        <FormControl fullWidth error={!!errors.kategori}>
                            <InputLabel id="penerbit-label">Penerbit</InputLabel>
                            <Controller
                                name="penerbit"
                                control={control}
                                defaultValue=""
                                rules={{ required: "Penerbit is required" }}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <Select
                                        labelId="penerbit-label"
                                        id="penerbit"
                                        value={value}
                                        label="Penerbit"
                                        onChange={onChange}
                                    >
                                        {data.map((item) => (
                                            <MenuItem key={item.id} value={item.id}>{item.penerbit}</MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            {errors.penerbit && <p className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained mui-1wc848c-MuiFormHelperText-root" id="penerbit">{errors.penerbit.message}</p>}
                        </FormControl>
                    </div>
                    </div>
                    <div className="w-1/3">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Tanggal Kadaluarsa"
                                minDate={dayjs()}
                                value={tanggal}
                                onChange={(newValue) => {
                                    setTanggal(newValue);
                                    setValue('tanggal', newValue, { shouldValidate: true });
                                }}
                            />
                        </LocalizationProvider>
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
