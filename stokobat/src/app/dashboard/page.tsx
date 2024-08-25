"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from "../dashboard/layout";
import Link from 'next/link';
import { Add, Close, Delete, Edit, ListAlt, MedicationOutlined, TrendingUp } from "@mui/icons-material";
import { CustomButton, ButtonCustom } from "@/components";
import { fetchDashboard } from '@/services';
import useStore, { User } from '@/store/useStore'
import { Table, TablePagination, TableHead, TableRow, TableCell, TableBody, CircularProgress, Button, Alert, AlertTitle, Card, CardContent, Typography, IconButton, TextField } from '@mui/material';
import { toast } from 'react-hot-toast';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import dayjs, { Dayjs } from 'dayjs';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { BarChart, LineChart } from '@mui/x-charts';

import axios from 'axios';
import { fetchDashboardPenjualan } from '@/services/dashboard';

interface dataResponse {
  totalKadaluarsa: string;
  totalMendekatiKadaluarsa: string;
  totalStokObat: string;
}

const Page: React.FC = () => {
  const router = useRouter();
  const { user, setUser } = useStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<dataResponse>();
  const [openStok, setOpenStok] = React.useState(false);
  const [openKadaluarsa, setOpenKadaluarsa] = React.useState(false);
  const [openMendekati, setOpenMendekati] = React.useState(false);

  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [dataMendekati, setDataMendekati] = useState<any[]>([]);
  const [pageMendekati, setPageMendekati] = useState(0);
  const [rowsPerPageMendekati, setRowsPerPageMendekati] = useState(10);
  const [searchQueryMendekati, setSearchQueryMendekati] = useState<string>('');

  const [dataKadaluarsa, setDataKadaluarsa] = useState<any[]>([]);
  const [pageKadaluarsa, setPageKadaluarsa] = useState(0);
  const [rowsPerPageKadaluarsa, setRowsPerPageKadaluarsa] = useState(10);
  const [searchQueryKadaluarsa, setSearchQueryKadaluarsa] = useState<string>('');

  const [dataPenjualan, setDataPenjualan] = useState([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);


  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user || !user.token) return;

    try {
      const apiData = await fetchDashboard(user?.token);
      setResult(apiData.data);
      setData(apiData.data.detail.stokObat)
      setDataKadaluarsa(apiData.data.detail.kadaluarsaObat)
      setDataMendekati(apiData.data.detail.mendekatiKadaluarsaObat)
      console.log(apiData.data);

      setLoading(false);



    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Grafik
  const fetchDataPenjualan = async () => {
    setLoading(true)
    if (!user || !user.token) return;
    try {
      const bulan = selectedDate.month() + 1; // Karena bulan dimulai dari 0
      const tahun = selectedDate.year();
      const response = await fetchDashboardPenjualan(user?.token, bulan, tahun)
      setDataPenjualan(response.data);
      console.log('laporan', response);

    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchDataPenjualan();
    }
  }, [selectedDate]);

  const labels = dataPenjualan?.map(item => item.obat.nama_obat);
  const jumlahData = dataPenjualan?.map(item => item.total_jumlah);
  const pendapatanData = dataPenjualan?.map(item => item.total_pendapatan);


  //Stok
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

  const filteredData = data.filter(item =>
    item.nama_obat.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.status_kadaluarsa.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kategori.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //Mendekati
  const handleChangePageMendekati = (event: unknown, newPage: number) => {
    setPageMendekati(newPage);
  };

  const handleChangeRowsPerPageMendekati = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPageMendekati(parseInt(event.target.value, 10));
    setPageMendekati(0); // Reset page to 0
  };

  const handleSearchChangeMendekati = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryMendekati(event.target.value);
    setPageMendekati(0); // Reset page to 0 when search query changes
  };

  const filteredDataMendekati = dataMendekati.filter(item =>
    item.nama_obat.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.status_kadaluarsa.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kategori.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //Kadaluarsa
  const handleChangePageKadaluarsa = (event: unknown, newPage: number) => {
    setPageKadaluarsa(newPage);
  };

  const handleChangeRowsPerPageKadaluarsa = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPageKadaluarsa(parseInt(event.target.value, 10));
    setPageKadaluarsa(0); // Reset page to 0
  };

  const handleSearchChangeKadaluarsa = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryKadaluarsa(event.target.value);
    setPageKadaluarsa(0); // Reset page to 0 when search query changes
  };

  const filteredDataKadaluarsa = dataKadaluarsa.filter(item =>
    item.nama_obat.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.status_kadaluarsa.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kategori.toLowerCase().includes(searchQuery.toLowerCase())
  );



  const formattedDate = (dateString: string) => {
    return dayjs(dateString).format('DD MMMM YYYY');
  };

  return (
    <React.Fragment>
      {
        loading && <CircularProgress />
      }

      <div className="flex mt-10 ml-10 mx-5 mb-10">
        <Card sx={{ minWidth: 200, backgroundColor: "#b9cfe8" }} className='mr-10'>
          <CardContent>
            <div className='flex flex-row justify-between mb-3 items-center'>
              <Typography variant="h6" component="div">
                Stok Obat
              </Typography>
              <IconButton onClick={() => setOpenStok(true)}>
                <MedicationOutlined />
              </IconButton>
            </div>
            <div className='text-center'>
              <Typography variant="h3" component="div">
                {result?.totalStokObat}
              </Typography>
            </div>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 250, backgroundColor: '#e3ef99' }} className='mr-10'>
          <CardContent>
            <div className='flex flex-row justify-between mb-3 items-center'>
              <Typography variant="h6" component="div">
                Total Kadaluarsa
              </Typography>
              <IconButton onClick={() => setOpenKadaluarsa(true)}>
                <ListAlt />
              </IconButton>
            </div>
            <div className='text-center'>
              <Typography variant="h3" component="div">
                {result?.totalKadaluarsa}
              </Typography>
            </div>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 300, backgroundColor: "#95d0fb" }} className=''>
          <CardContent>
            <div className='flex flex-row justify-between mb-3 items-center'>
              <Typography variant="h6" component="div">
                Mendekati Kadaluarsa
              </Typography>
              <IconButton onClick={() => setOpenMendekati(true)}>
                <TrendingUp />
              </IconButton>
            </div>
            <div className='text-center'>
              <Typography variant="h3" component="div">
                {result?.totalMendekatiKadaluarsa}
              </Typography>
            </div>
          </CardContent>
        </Card>

      </div>


      <div className='mx-8'>
        <h1 className="text-2xl font-semibold mb-7">Laporan Transaksi Penjualan</h1>

        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={['year', 'month']}
              label="Pilih Bulan & Tahun"
              value={selectedDate}
              onChange={(newValue: Dayjs | null) => {
                if (newValue) {
                  setSelectedDate(newValue);
                }
              }}
              renderInput={(params) => <TextField {...params} helperText={null} />}
              disableFuture
            />
          </LocalizationProvider>
          <Button variant="contained" onClick={fetchDataPenjualan}>Lihat Laporan</Button>
        </Box>



        {loading ? (
          <CircularProgress />
        ) : (
          dataPenjualan?.length > 0 ? (
            <BarChart
              xAxis={[{ data: labels, label: 'Obat', scaleType: 'band' }]}
              series={[
                { data: jumlahData, label: 'Total Jumlah', color: '#42a5f5' },
                { data: pendapatanData, label: 'Total Pendapatan', color: '#ef5350' }
              ]}
              width={800}
              height={400}
            />

          ) : (
            <Typography>Masukkan bulan dan tahun untuk melihat laporan penjualan.</Typography>
          )
        )}
      </div>

      {/* //Modal Stok */}
      <div>
        <Modal
          open={openStok}
          onClose={() => setOpenStok(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className="mb-5 flex flex-row items-center justify-between">
              <div></div>
              <div></div>
              <div></div>
              <Typography id="modal-modal-title" variant="h6" component="h2" className='text-center font-extrabold'>
                Total Stok Obat
              </Typography>
              <div></div>
              <IconButton onClick={() => setOpenStok(false)}>
                <Close />
              </IconButton>
            </div>
            <div className="ml-5 mb-6 w-1/3">
              <TextField
                label="Cari Obat"
                placeholder='Cari Obat, Kategori, Status Kadaluarsa'
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
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
          </Box>
        </Modal>
      </div>
      {/* //Modal Kadaluarsa */}
      <div>
        <Modal
          open={openKadaluarsa}
          onClose={() => setOpenKadaluarsa(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className="mb-5 flex flex-row items-center justify-between">
              <div></div>
              <div></div>
              <div></div>
              <Typography id="modal-modal-title" variant="h6" component="h2" className='text-center font-extrabold'>
                Total Kadaluarsa
              </Typography>
              <div></div>
              <IconButton onClick={() => setOpenKadaluarsa(false)}>
                <Close />
              </IconButton>
            </div>
            <div className="ml-5 mb-6 w-1/3">
              <TextField
                label="Cari Obat"
                placeholder='Cari Obat, Kategori, Status Kadaluarsa'
                variant="outlined"
                fullWidth
                value={searchQueryKadaluarsa}
                onChange={handleSearchChangeKadaluarsa}
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDataKadaluarsa.slice(pageKadaluarsa * rowsPerPageKadaluarsa, pageKadaluarsa * rowsPerPageKadaluarsa + rowsPerPageKadaluarsa).map((item, index) => (
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
                count={dataKadaluarsa.length}
                rowsPerPage={rowsPerPageKadaluarsa}
                page={pageKadaluarsa}
                onPageChange={handleChangePageKadaluarsa}
                onRowsPerPageChange={handleChangeRowsPerPageKadaluarsa}
              />
            </div>
          </Box>
        </Modal>
      </div>
      {/* //Modal Mendekati */}
      <div>
        <Modal
          open={openMendekati}
          onClose={() => setOpenMendekati(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className="mb-5 flex flex-row items-center justify-between">
              <div></div>
              <div></div>
              <div></div>
              <Typography id="modal-modal-title" variant="h6" component="h2" className='text-center font-extrabold'>
                Total Mendekati Kadaluarsa
              </Typography>
              <div></div>
              <IconButton onClick={() => setOpenMendekati(false)}>
                <Close />
              </IconButton>
            </div>
            <div className="ml-5 mb-6 w-1/3">
              <TextField
                label="Cari Obat"
                placeholder='Cari Obat, Kategori, Status Kadaluarsa'
                variant="outlined"
                fullWidth
                value={searchQueryMendekati}
                onChange={handleSearchChangeMendekati}
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDataMendekati.slice(pageMendekati * rowsPerPageMendekati, pageMendekati * rowsPerPageMendekati + rowsPerPageMendekati).map((item, index) => (
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
                count={dataMendekati.length}
                rowsPerPage={rowsPerPageMendekati}
                page={pageMendekati}
                onPageChange={handleChangePageMendekati}
                onRowsPerPageChange={handleChangeRowsPerPageMendekati}
              />
            </div>
          </Box>
        </Modal>
      </div>
    </React.Fragment>
  )
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid gray',
  borderRadius: "15px",
  boxShadow: 24,
  overflow: 'scroll',
  height: '80%',
  display: 'block',
  p: 2,
};

export default Page;