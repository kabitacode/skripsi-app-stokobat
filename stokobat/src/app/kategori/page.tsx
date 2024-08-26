"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from "../dashboard/layout";
import Link from 'next/link';
import { Add, Delete, Edit } from "@mui/icons-material";
import { CustomButton, ButtonCustom } from "@/components";
import { fetchKategori, fetchKategoriDelete } from '@/services';
import useStore, { User } from '@/store/useStore'
import { Table, TablePagination, TableHead, TableRow, TableCell, TableBody, CircularProgress, Button, Alert, AlertTitle, TextField } from '@mui/material';
import { toast } from 'react-hot-toast';

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
            const apiData = await fetchKategori(user?.token);
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

    const handleEdit = (id: string) => {
        router.push(`/kategori/edit/${id}`);
    };

    const handleDelete = async (id: string) => {
        if (!user || !user.token) return;

        try {
            const apiData = await fetchKategoriDelete(user?.token, id);
            toast.success(apiData.message || "Data berhasil Dihapus!");
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
        item.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout>
            {
                loading && <CircularProgress />
            }

            <div className="flex mt-4 mr-5 ml-5 mb-5 justify-between">
                <h1 className="text-2xl font-semibold">Data Kategori</h1>

                <div className="">
                    <Link href={'/kategori/add'}>
                        <CustomButton startIcon={<Add />}>
                            Tambah
                        </CustomButton>
                    </Link>
                </div>
            </div>

            <div className="ml-5 mb-6 w-1/3">
                <TextField
                    label="Cari Kategori"
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
                            <TableCell sx={{ color: 'white', fontWeight: '600' }}>Nama Kategori</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: '600' }}>Penerbit</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: '600', textAlign: 'center' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.nama}</TableCell>
                                <TableCell>{item.penerbit}</TableCell>
                                <TableCell>
                                    <div className='flex flex-row justify-center'>
                                        <div className='mr-2'>
                                            <ButtonCustom
                                                color='success'
                                                onClick={() => handleEdit(item.id)}
                                                fontSize="0.75rem"
                                                textTransform="none"
                                                variant='outlined'
                                            >
                                                Edit
                                            </ButtonCustom>
                                        </div>
                                        <div>
                                            <ButtonCustom
                                                color="error"
                                                onClick={() => handleDelete(item.id)}
                                                variant="outlined"
                                                textTransform='none'
                                                fontSize="0.75rem"
                                            >
                                                Delete
                                            </ButtonCustom>
                                        </div>
                                    </div>
                                </TableCell>
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