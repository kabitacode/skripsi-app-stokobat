"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from "../dashboard/layout";
import Link from 'next/link';
import { Add, Delete, Edit } from "@mui/icons-material";
import { CustomButton, ButtonCustom } from "@/components";
import { fetchUsers } from '@/services';
import useStore from '@/store/useStore'
import { Table, TablePagination, TableHead, TableRow, TableCell, TableBody, CircularProgress, Button, Alert, AlertTitle } from '@mui/material';



const Page: React.FC = () => {
    const router = useRouter();
    const { user } = useStore();
    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Check if user is authenticated
    useEffect(() => {
        if (!user?.token) {
            setError('User is not authenticated');
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        const fetchDataUsers = async () => {
            if (!user || !user.token) return;

            try {
                const apiData = await fetchUsers(user?.token);
                setData(apiData.data);
                setLoading(false);
                console.log(apiData);

            } catch (error: any) {
                console.log(error);

                setError(error.response?.data?.message || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDataUsers();
    }, [user]);




    if (loading) {
        return <CircularProgress />;
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset page to 0
    };

    const handleEdit = (id: string) => {
        router.push(`/user/edit/${id}`);
    };

    const handleDelete = (id: string) => {
        // Logika untuk meng-handle tombol delete
        console.log('Delete item with ID:', id);
    };

    return (
        <DashboardLayout>
            {
                error && <div className="mb-5 mt-5 w-1/2">
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {error}
                    </Alert>
                </div>
            }
            <div className="flex mt-4 mr-5 ml-5 mb-5 justify-between">
                <div className="">

                </div>
                <div className="">
                    <Link href={'/user/add'}>
                        <CustomButton startIcon={<Add />}>
                            Tambah
                        </CustomButton>
                    </Link>
                </div>
            </div>

            <div className='mx-5'>
                <Table>
                    <TableHead className='bg-blue-700'>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: '600' }}>No</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: '600' }}>Name</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: '600' }}>Email</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: '600' }}>Role</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: '600', textAlign: 'center' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.email}</TableCell>
                                <TableCell>{item.role}</TableCell>
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