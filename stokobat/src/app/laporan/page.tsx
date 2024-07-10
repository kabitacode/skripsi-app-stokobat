"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from "../dashboard/layout";
import Link from 'next/link';
import { Add, ArrowDropDownCircle, Delete, Download, Edit } from "@mui/icons-material";
import { CustomButton, ButtonCustom } from "@/components";
import { fetchDataLaporan, fetchLaporan, fetchObat, fetchObatDelete } from '@/services';
import useStore, { User } from '@/store/useStore'
import { Table, TablePagination, TableHead, TableRow, TableCell, TableBody, CircularProgress, Button, Alert, AlertTitle, TextField, MenuItem, Menu, Fade, IconButton } from '@mui/material';
import { toast } from 'react-hot-toast';
import dayjs, { Dayjs } from 'dayjs';
import { dataMenuLaporan } from '@/utils/data';


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
    const [isLaporanKey, setIsLaporanKey] = useState<string>('Laporan');
    const [isLaporan, setIsLaporan] = useState<string>('Laporan Obat');

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
            setData(apiData.data.laporan);
            setDataMendekatiKadaluarsa(apiData.data.mendekatiKadaluarsa);
            setDataKadaluarsa(apiData.data.kadaluarsa);
            setDataPenjualan(apiData.data.penjualan);
            console.log(apiData);

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
            const apiData = await fetchDataLaporan(user?.token);

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

    return (
        <DashboardLayout>
            {
                loading && <CircularProgress />
            }

            <div className="flex mt-4 mr-5 ml-5 mb-5 justify-between">
                <div className='flex flex-row items-center justify-center'>
                    <h1 className="text-2xl font-semibold">{isLaporan}</h1>
                    <div className="">
                        <IconButton
                            id="demo-customized-button"
                            onClick={handleClick}>
                            <ArrowDropDownCircle />
                        </IconButton>

                        <Menu
                            id="fade-menu"
                            MenuListProps={{
                                'aria-labelledby': 'fade-button',
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            TransitionComponent={Fade}
                        >
                            {
                                dataMenuLaporan.map((item) => {
                                    return (
                                        <MenuItem onClick={() => {
                                            handleClose()
                                            setIsLaporan(item.title)
                                            setIsLaporanKey(item.key)
                                        }}>{item.title}</MenuItem>
                                    )
                                })
                            }


                        </Menu>
                    </div>
                </div>

                <div className="">
                    <CustomButton startIcon={<Download />} onClick={() => handleDownload()}>
                        Export
                    </CustomButton>
                </div>
            </div>



            {
                isLaporanKey == "Laporan" &&
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
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.nama_obat}</TableCell>
                                    <TableCell>{item.kategori}</TableCell>
                                    <TableCell>{item.stok}</TableCell>
                                    <TableCell>{item.harga}</TableCell>
                                    <TableCell>{formattedDate(item.tanggal_kadaluarsa)}</TableCell>
                                    <TableCell>{item.status_kadaluarsa}</TableCell>
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
            }

            {
                isLaporanKey == "Penjualan" &&
                <>
                    <div className='mx-5'>
                        <Table>
                            <TableHead className='bg-blue-700'>
                                <TableRow>
                                    <TableCell sx={{ color: 'white', fontWeight: '600' }}>No</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: '600' }}>Nama Obat</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: '600' }}>Stok</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: '600' }}>Harga Obat</TableCell>
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
                </>
            }

            {
                isLaporanKey == "Mendekati" &&
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
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataMendekatiKadaluarsa.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.nama_obat}</TableCell>
                                    <TableCell>{item.kategori}</TableCell>
                                    <TableCell>{item.stok}</TableCell>
                                    <TableCell>{item.harga}</TableCell>
                                    <TableCell>{formattedDate(item.tanggal_kadaluarsa)}</TableCell>
                                    <TableCell>{item.status_kadaluarsa}</TableCell>
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
            }

            {
                isLaporanKey == "Kadaluarsa" &&
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
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataKadaluarsa.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.nama_obat}</TableCell>
                                    <TableCell>{item.kategori}</TableCell>
                                    <TableCell>{item.stok}</TableCell>
                                    <TableCell>{item.harga}</TableCell>
                                    <TableCell>{formattedDate(item.tanggal_kadaluarsa)}</TableCell>
                                    <TableCell>{item.status_kadaluarsa}</TableCell>
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
            }



        </DashboardLayout>
    )
}

export default Page;