'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { fetchRegister, login } from '@/services';
import useStore, { User } from '@/store/useStore'
import { AccountCircle } from "@mui/icons-material";
import { Alert, AlertTitle, CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { toast } from 'react-hot-toast';


const Page: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { setUser } = useStore();

  const handleRegister = async (data: any) => {
    setLoading(true);
    try {
      const postData = {
        name: data.name,
        email: data.email,
        role: data.role,
        password: data.password,
      };
      const response = await fetchRegister(postData);
      toast.success(response.message || "Data berhasil Ditambahkan!");
      reset();
      router.back();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-200 h-full">
      <div className="container mx-auto py-10 pt-16 pb-20">
        {
          error && <div className="mb-10 flex items-center justify-center">
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          </div>
        }
        <form onSubmit={handleSubmit(handleRegister)} className="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-lg">
          {
            loading && <CircularProgress />
          }
          <div className="flex items-center justify-center mb-10">
            <AccountCircle sx={{ fontSize: 70 }} />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Nama
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              type="text"
              placeholder="Zhoel"
              {...register('name', { required: true })}
            />
            {errors.email && <p className="mt-3 text-sm text-red-500">Nama is required</p>}
          </div>

          <div className="mb-4">
            <FormControl fullWidth>
              <InputLabel id="role">Role</InputLabel>
              <Select
                labelId="role"
                id="role"
                label="Role"
                {...register('role', { required: true })}
              >
                <MenuItem value={"Admin"}>Admin</MenuItem>
                <MenuItem value={"Apoteker"}>Apoteker</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
              Role
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              type="text"
              placeholder="Admin"
              {...register('role', { required: true })}
            />
            {errors.email && <p className="mt-3 text-sm text-red-500">Role is required</p>}
          </div> */}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              type="email"
              placeholder="john@example.com"
              {...register('email', { required: true })}
            />
            {errors.email && <p className="mt-3 text-sm text-red-500">Email is required</p>}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              type="password"
              placeholder="********"
              {...register('password', { required: true })}
            />
            {errors.password && <p className="mt-3 text-sm text-red-500">Password is required</p>}
          </div>
          <button
            className="w-full mb-5 bg-blue-700 text-white text-sm font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300"
            type="submit"
          >
            {loading ? <CircularProgress size={24} /> : 'Daftar'}
          </button>
          <Link href={'/'}>
            <p className="text-sm text-center font-bold">Sudah punya akun? Masuk disini</p>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Page;