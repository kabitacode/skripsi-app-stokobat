"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from "../../dashboard/layout";
import Link from 'next/link';
import { Add, ArrowDropDownCircle, Delete, Download, Edit } from "@mui/icons-material";
import { CustomButton, ButtonCustom } from "@/components";
import { fetchDataLaporan, fetchFilterPenjualan, fetchFilterPenjualanByEmptyStok, fetchLaporanKadaluarsa, fetchLaporanMendekatiKadaluarsa, fetchLaporanObat, fetchLaporanPenjualan, fetchObat, fetchObatDelete } from '@/services';
import useStore, { User } from '@/store/useStore'
import { Table, TablePagination, TableHead, TableRow, TableCell, TableBody, CircularProgress, Button, Alert, AlertTitle, TextField, Menu, Fade, IconButton } from '@mui/material';
import { toast } from 'react-hot-toast';
import dayjs, { Dayjs } from 'dayjs';
import { dataMenuLaporan } from '@/utils/data';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
interface dataResponse {
    message: string
}

const Page: React.FC = () => {
    const router = useRouter();
    const { user, setUser } = useStore();
    const [data, setData] = useState<any[]>([]);
    const [dataPenjualan, setDataPenjualan] = useState<any[]>([]);
    const [dataMendekatiKadaluarsa, setDataMendekatiKadaluarsa] = useState<any[]>([]);
    const [dataKadaluarsa, setDataKadaluarsa] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const [start_date, setStartDate] = useState<Dayjs | null>(dayjs());
    const [end_date, setEndDate] = useState<Dayjs | null>(dayjs());
    const [status, setStatus] = React.useState('');
    const [statusStok, setStatusStok] = React.useState('');

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const fetchData = async () => {
        if (!user || !user.token) return;

        try {
            const apiData = await fetchDataLaporan(user?.token);
            setDataPenjualan(apiData.data.penjualan);

            setLoading(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const getFilter = async () => {
        setLoading(true)
        if (!user || !user.token) return;
        try {
            const tanggalMulai = start_date?.format('YYYY-MM-DD')
            const tanggalSelesai = end_date?.format('YYYY-MM-DD')
            const response = await fetchFilterPenjualan(user?.token, tanggalMulai, tanggalSelesai)
            setDataPenjualan(response.data);


            toast.success(response.message || "Success!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const getFilterByEmptyStok = async (param: any) => {
        setLoading(true)
        if (!user || !user.token) return;
        try {
            const response = await fetchFilterPenjualanByEmptyStok(user?.token)
            setDataPenjualan(response.data);
            console.log(response.data);

            toast.success(response.message || "Success!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset page to 0
    };

    const handleDownload = async () => {
        if (!user || !user.token) return;

        try {
            let apiData = await fetchLaporanPenjualan(user?.token);

            toast.success(apiData.message || "Data berhasil Didownload!");
            fetchData();
            setLoading(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setPage(0); // Reset page to 0 when search query changes
    };

    const formattedDate = (dateString: string) => {
        return dayjs(dateString).format('DD MMMM YYYY');
    };

    const handleChangeStok = (event: SelectChangeEvent) => {
        setStatusStok(event.target.value);
        getFilterByEmptyStok(event.target.value)
    };

    return (
        <DashboardLayout>
            {
                loading && <CircularProgress />
            }

            <div className="flex mt-4 mr-5 ml-5 mb-5 justify-between">
                <div className='flex flex-row items-center justify-center'>
                    <h1 className="text-2xl font-semibold">Laporan Penjualan</h1>
                </div>

                <div className="">
                    <CustomButton startIcon={<Download />} onClick={() => handleDownload()}>
                        Export
                    </CustomButton>
                </div>
            </div>

            <div className='ml-5 mb-5'>
                <h4 className="text-lg font-semibold mb-3">Filter By Tanggal</h4>
                <div className="flex flex-row items-center">
                    <div className='mr-3'>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Tanggal Mulai"
                                value={start_date}
                                onChange={(newValue) => setStartDate(newValue)}
                            />
                        </LocalizationProvider>
                    </div>

                    <div className='mr-3'>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Tanggal Selesai"
                                value={end_date}
                                onChange={(newValue) => setEndDate(newValue)}
                            />
                        </LocalizationProvider>
                    </div>
                    <Button variant="contained" sx={{ height: 40 }} onClick={() => getFilter()}>Filter</Button>
                </div>
            </div>

            <div className='ml-5 mb-5'>
                <h4 className="text-lg font-semibold mb-3">Filter By Stok</h4>
                <div className="mr-3">
                    <FormControl sx={{ minWidth: 140 }} size="small">
                        <InputLabel id="demo-select-small-label">Status Stok</InputLabel>
                        <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            value={statusStok}
                            label="Age"
                            onChange={handleChangeStok}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={"true"}>Stok Habis</MenuItem>
                            <MenuItem value={""}>Semua Stok</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>



            <div className='mx-5'>
                <Table>
                    <TableHead className='bg-blue-700'>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: '600' }}>No</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: '600' }}>Nama Obat</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: '600' }}>Stok</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: '600' }}>Harga Obat (pcs)</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: '600' }}>Jumlah</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: '600' }}>Total Harga</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: '600' }}>Tanggal Transaksi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataPenjualan.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.nama_obat}</TableCell>
                                <TableCell>{item.stok}</TableCell>
                                <TableCell>{item.harga_obat}</TableCell>
                                <TableCell>{item.jumlah}</TableCell>
                                <TableCell>{item.total_harga}</TableCell>
                                <TableCell>{formattedDate(item.tanggal_transaksi)}</TableCell>
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
    )
}

export default Page;