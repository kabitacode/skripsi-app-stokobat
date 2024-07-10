"use client"

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from "../../../dashboard/layout";
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { TextField, Button, IconButton, FormControl, InputLabel, Select, MenuItem, TablePagination, TableHead, TableRow, TableBody, Table, TableCell } from '@mui/material';
import { CustomButton, ButtonCustom } from "@/components";
import { fetchPenjualanById, fetchKategori, fetchPenjualanAdd, fetchObat, fetchPenjualanByKategori } from '@/services';
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
    jumlah: string;
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
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [dataAllObat, setDataAllObat] = useState<any[]>([]);

    const params = useParams<{ id: string }>()

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

    const fetchDataObatByKategori = async (id: string) => {
        if (!user || !user.token) return;

        try {
            const response = await fetchPenjualanByKategori(id, user?.token);
            const result = response.data;

            setDataObat(result);
            setLoading(false);

        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchDataObat = async () => {
        if (!user || !user.token) return;

        try {
            const apiData = await fetchObat(user?.token);
            setDataAllObat(apiData.data);
            setLoading(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchDataId = async () => {
        if (!user || !user.token) return;

        try {
            const response = await fetchPenjualanById(params.id, user?.token);
            const result = response.data;
            
            setLoading(false);
            fetchDataObatByKategori(result.obat.kategori.id)
            setValue('nama_obat', result.obat.id);
            setValue('jumlah', result.jumlah);
            setTanggal(dayjs(result.tanggal_transaksi))
            setValue('kategori', result.obat.kategori.id);
            setSelectedKategori(result.obat.kategori.id)
            

        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchDataKategori();
        fetchDataObat();
        fetchDataId();
    }, [user]);

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        if (!user || !user.token) return;
        setLoading(true);
        try {
            const postData = {
                id_obat: data.nama_obat,
                id_kategori: data.kategori,
                jumlah: data.jumlah,
                tanggal_transaksi: tanggal?.format('YYYY-MM-DD'),
            };
            const response = await fetchPenjualanAdd(user?.token, postData);
            toast.success(response.message || "Data berhasil Ditambahkan!");
            reset();
            setTanggal(dayjs);
            router.back();
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
            await fetchDataObatByKategori(value);
        } else {
            setDataObat([]);
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset page to 0
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setPage(0); // Reset page to 0 when search query changes
    };

    const filteredData = dataAllObat.filter(item =>
        item.nama_obat.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formattedDate = (dateString: string) => {
        return dayjs(dateString).format('DD MMMM YYYY');
    };

    return (
        <DashboardLayout>
            <div className="flex flex-row mt-4 ml-4 mr-4 mb-10">
                <IconButton onClick={() => router.back()}>
                    <ArrowBack />
                </IconButton>
                <h1 className="text-2xl font-semibold mt-1 ml-2">Edit Data Penjualan</h1>
            </div>

            <div className='ml-7'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex flex-row mb-5'>
                        <div className="mr-5">
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

                        <div className="w-1/3 mr-5">
                            <TextField
                                id="jumlah"
                                label="Jumlah"
                                type='number'
                                variant="outlined"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.jumlah}
                                helperText={errors.jumlah && "Jumlah is required"}
                                {...register('jumlah', { required: true })}
                            />
                        </div>
                    </div>

                    <div className='flex flex-row mb-5'>
                        <div className="w-1/3 mr-5">
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
                            selectedKategori ? <div className="w-1/3">
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

            <div className="ml-5 mb-6 mt-10 w-1/3">
                <TextField
                    label="Cari Obat"
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>

            <div className='mx-5'>
                <Table>
                    <TableHead className='bg-blue-700'>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: '600' }}>No</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: '600' }}>Nama Obat</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: '600' }}>Kategori</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: '600' }}>Stok</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: '600' }}>Harga</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: '600' }}>Tanggal Kadaluarsa</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: '600' }}>Status Kadaluarsa</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: '600' }}>Uploader</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.nama_obat}</TableCell>
                                <TableCell>{item.kategori.nama}</TableCell>
                                <TableCell>{item.stok}</TableCell>
                                <TableCell>{item.harga}</TableCell>
                                <TableCell>{formattedDate(item.tanggal_kadaluarsa)}</TableCell>
                                <TableCell>{item.status_kadaluarsa}</TableCell>
                                <TableCell>{item.user.name} | {item.user.role}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
        </DashboardLayout>
    );
};

export default Page;
