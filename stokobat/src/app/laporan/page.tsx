"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from "../dashboard/layout";
import Link from 'next/link';
import { Add, Delete, Download, Edit } from "@mui/icons-material";
import { CustomButton, ButtonCustom } from "@/components";
import { fetchLaporan, fetchObat, fetchObatDelete } from '@/services';
import useStore, { User } from '@/store/useStore'
import { Table, TablePagination, TableHead, TableRow, TableCell, TableBody, CircularProgress, Button, Alert, AlertTitle, TextField } from '@mui/material';
import { toast } from 'react-hot-toast';
import dayjs, { Dayjs } from 'dayjs';
interface dataResponse {
    message: string
}

const Page: React.FC = () => {
    const router = useRouter();
    const { user, setUser } = useStore();
    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState<string>('');


    const fetchData = async () => {
        if (!user || !user.token) return;

        try {
            const apiData = await fetchObat(user?.token);
            setData(apiData.data);
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
            const apiData = await fetchLaporan(user?.token);
            console.log(apiData);
            
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

    const filteredData = data.filter(item =>
        item.nama_obat.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formattedDate = (dateString: string) => {
        return dayjs(dateString).format('DD MMMM YYYY');
    };

    return (
        <DashboardLayout>
            {
                loading && <CircularProgress />
            }

            <div className="flex mt-4 mr-5 ml-5 mb-5 justify-between">
                <h1 className="text-2xl font-semibold">Laporan</h1>

                <div className="">
                    <CustomButton startIcon={<Download />} onClick={() => handleDownload()}>
                        Export
                    </CustomButton>
                </div>
            </div>

            <div className="ml-5 mb-6 w-1/3">
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
    )
}

export default Page;