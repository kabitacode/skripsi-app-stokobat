"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from "../dashboard/layout";
import Link from 'next/link';
import { Add, Delete, Edit, ListAlt, MedicationOutlined, TrendingUp } from "@mui/icons-material";
import { CustomButton, ButtonCustom } from "@/components";
import { fetchDashboard } from '@/services';
import useStore, { User } from '@/store/useStore'
import { Table, TablePagination, TableHead, TableRow, TableCell, TableBody, CircularProgress, Button, Alert, AlertTitle, Card, CardContent, Typography } from '@mui/material';
import { toast } from 'react-hot-toast';

interface dataResponse {
  totalKadaluarsa: string;
  totalMendekatiKadaluarsa: string;
  totalStok: string;
}

const Page: React.FC = () => {
  const router = useRouter();
  const { user, setUser } = useStore();
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [result, setResult] = useState<dataResponse>();


  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user || !user.token) return;

    try {
      const apiData = await fetchDashboard(user?.token);
      setResult(apiData.data);


      setLoading(false);

    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
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
              <MedicationOutlined />
            </div>
            <div className='text-center'>
              <Typography variant="h3" component="div">
                {result?.totalStok}
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
              <ListAlt />
            </div>
            <div className='text-center'>
              <Typography variant="h3" component="div">
                {result?.totalKadaluarsa}
              </Typography>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex ml-10">
        <Card sx={{ minWidth: 300, backgroundColor: "#95d0fb"}} className=''>
          <CardContent>
            <div className='flex flex-row justify-between mb-3 items-center'>
              <Typography variant="h6" component="div">
                Mendekati Kadaluarsa
              </Typography>
              <TrendingUp />
            </div>
            <div className='text-center'>
              <Typography variant="h3" component="div">
                {result?.totalMendekatiKadaluarsa}
              </Typography>
            </div>
          </CardContent>
        </Card>
      </div>
    </React.Fragment>
  )
}

export default Page;