'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Alert, AlertTitle, IconButton } from '@mui/material';
import { AccountBox, ArrowDropDown, ArrowRight, Category, ChevronRight, Home, Logout, MedicalInformation, MedicalServices, Medication, Report, Storefront, StoreMallDirectory } from '@mui/icons-material';
import { StyledMenu } from '@/components';
import { logout } from '@/services';
import useStore from '@/store/useStore'

export default function DashboardLayout({ children }: any) {
   const { user, clearUser } = useStore();
   const router = useRouter();

   const [activeLink, setActiveLink] = useState('');
   const [error, setError] = useState<string | null>(null);
   const [loading, setLoading] = useState(false);
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
   const open = Boolean(anchorEl);
   const [isSubMenu, setIsSubMenu] = useState(false);
   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
   };
   const handleClose = () => {
      setAnchorEl(null);
   };

   const pathname = usePathname();

   useEffect(() => {
      //get current url path
      setActiveLink(pathname);

   }, [pathname]);


   const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
   };

   const { push } = useRouter();
   function handleLink() {
      push('/user')
   }

   const handleLogout = async () => {
      if (!user?.token) return;

      try {
         await logout(user?.token);
         clearUser();
         router.push('/');
      } catch (error: any) {
         setError(error.response?.data?.message || error.message);
      } finally {
         setLoading(false);
      }
   }

   return (
      <div>
         <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 ">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
               <div className="flex items-center justify-between">
                  <div className="flex items-center justify-start">
                     <button onClick={toggleSidebar} aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                        <span className="sr-only">Open sidebar</span>
                        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                           <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                        </svg>
                     </button>
                     <Link href="https://flowbite.com" className="flex ml-2 md:mr-24">
                        <img src="https://flowbite.com/docs/images/logo.svg" className="h-8 mr-3" alt="FlowBite Logo" />
                        <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">StokObat</span>
                     </Link>
                  </div>
                  <IconButton
                     id="demo-customized-button"
                     onClick={handleClick}>
                     <AccountCircle />
                  </IconButton>


                  <StyledMenu
                     id="demo-customized-menu"
                     MenuListProps={{
                        'aria-labelledby': 'demo-customized-button',
                     }}
                     anchorEl={anchorEl}
                     open={open}
                     onClose={handleClose}
                  >
                     {
                        user?.role == "Admin" &&
                        <MenuItem onClick={handleLink} disableRipple>
                           <AccountBox />
                           User
                        </MenuItem>
                     }
                     <MenuItem onClick={handleLogout} disableRipple>
                        <Logout />
                        Logout
                     </MenuItem>
                  </StyledMenu>
               </div>
            </div>
         </nav>
         <aside id="logo-sidebar" className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700`} aria-label="Sidebar">
            <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
               <ul className="space-y-2 font-medium">
                  <li className={`py-1 ${activeLink === '/dashboard' ? 'bg-blue-700 text-white' : 'bg-white text-gray-700'}`}>
                     <Link href="/dashboard" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white  dark:hover:bg-gray-700">
                        <Home sx={{ color: activeLink === '/dashboard' ? 'white' : 'black' }} fontSize='small' />
                        <span className={`py-1 ${activeLink === '/dashboard' ? 'text-white ml-3' : 'ml-3'}`} >Home</span>
                     </Link>
                  </li>
                  <li className={`py-1 ${activeLink === '/obat' || activeLink === '/obat/add' ? 'bg-blue-700 text-white' : 'bg-white text-gray-700'}`}>
                     <Link href="/obat" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white  dark:hover:bg-gray-700">
                        <Medication sx={{ color: activeLink === '/obat' || activeLink === '/obat/add' ? 'white' : 'black' }} fontSize='small' />
                        <span className={`py-1 ${activeLink === '/obat' || activeLink === '/obat/add' ? 'text-white ml-3' : 'ml-3'}`} >Daftar Obat</span>
                     </Link>
                  </li>
                  <li className={`py-1 ${activeLink === '/kategori' || activeLink === '/kategori/add' ? 'bg-blue-700 text-white' : 'bg-white text-gray-700'}`}>
                     <Link href="/kategori" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white  dark:hover:bg-gray-700">
                        <Category sx={{ color: activeLink === '/kategori' || activeLink === '/kategori/add' ? 'white' : 'black' }} fontSize='small' />
                        <span className={`py-1 ${activeLink === '/kategori' || activeLink === '/kategori/add' ? 'text-white ml-3' : 'ml-3'}`}>Kategori Obat</span>
                     </Link>
                  </li>
                  {/* <li className={`py-1 ${activeLink === '/batch' || activeLink === '/batch/add' ? 'bg-blue-700 text-white' : 'bg-white text-gray-700'}`}>
                     <Link href="/batch" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white  dark:hover:bg-gray-700">
                        <span className={`py-1 ${activeLink === '/batch' || activeLink === '/batch/add' ? 'text-white ml-3' : 'ml-3'}`}>Batch Obat</span>
                     </Link>
                  </li> */}
                  <li className={`py-1 ${activeLink === '/penjualan' || activeLink === '/penjualan/add' ? 'bg-blue-700 text-white' : 'bg-white text-gray-700'}`}>
                     <Link href="/penjualan" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white  dark:hover:bg-gray-700">
                        <Storefront sx={{ color: activeLink === '/penjualan' || activeLink === '/penjualan/add' ? 'white' : 'black' }} fontSize='small' />
                        <span className={`py-1 ${activeLink === '/penjualan' || activeLink === '/penjualan/add' ? 'text-white ml-3' : 'ml-3'}`}>Transaksi Penjualan</span>
                     </Link>
                  </li>
                  <li onClick={() => setIsSubMenu(!isSubMenu)} className={`py-1 ${activeLink === '/laporan' || activeLink === '/laporan/laporan-kadaluarsa' || activeLink === '/laporan/laporan-mendekati' || activeLink === '/laporan/laporan-penjualan' ? 'bg-blue-700 text-white' : 'bg-white text-gray-700'}`}>
                     <div className="flex justify-between items-center p-2 text-gray-900 rounded-lg dark:text-white  dark:hover:bg-gray-700">
                        <div className='flex items-center'>
                           <Report sx={{ color: activeLink === '/laporan' || activeLink === '/laporan/laporan-kadaluarsa' || activeLink === '/laporan/laporan-mendekati' || activeLink === '/laporan/laporan-penjualan'? 'white' : 'black' }} fontSize='small' />
                           <span className={`py-1 ${activeLink === '/laporan' || activeLink === '/laporan/laporan-kadaluarsa' || activeLink === '/laporan/laporan-mendekati' || activeLink === '/laporan/laporan-penjualan' ? 'text-white ml-3' : 'ml-3'}`}>Laporan</span>
                        </div>
                        {
                           isSubMenu ? <ArrowDropDown sx={{ color: 'white' }} fontSize='large' /> : <ArrowRight sx={{ color: 'white' }} fontSize='large' />
                        }
                     </div>
                  </li>

                  {
                     isSubMenu ? (
                        <div className=''>
                           <li className={`py-1 ${activeLink === '/laporan' ? 'bg-blue-900 text-white' : 'bg-blue-700 text-white'}`}>
                              <Link href="/laporan" className="flex items-center p-2 text-white rounded-lg dark:text-white  dark:hover:bg-gray-700">
                                 <MedicalInformation sx={{ color: activeLink === '/laporan' ? 'white' : 'black' }} fontSize='small' />
                                 <span className={`py-1 ${activeLink === '/laporan' ? 'text-white ml-3' : 'ml-3'}`}>Laporan Obat</span>
                              </Link>
                           </li>
                           <li className={`py-1 ${activeLink === '/laporan/laporan-kadaluarsa' ? 'bg-blue-900 text-white' : 'bg-blue-700 text-white'}`}>
                              <Link href="/laporan/laporan-kadaluarsa" className="flex items-center p-2 text-white rounded-lg dark:text-white  dark:hover:bg-gray-700">
                                 <MedicalServices sx={{ color: activeLink === '/laporan/laporan-kadaluarsa' ? 'white' : 'black' }} fontSize='small' />
                                 <span className={`py-1 ${activeLink === '/laporan/laporan-kadaluarsa' ? 'text-white ml-3' : 'ml-3'}`}>Laporan Kadaluarsa</span>
                              </Link>
                           </li>
                           <li className={`py-1 ${activeLink === '/laporan/laporan-mendekati' ? 'bg-blue-900 text-white' : 'bg-blue-700 text-white'}`}>
                              <Link href="/laporan/laporan-mendekati" className="flex items-center p-2 text-white rounded-lg dark:text-white  dark:hover:bg-gray-700">
                                 <Medication sx={{ color: activeLink === '/laporan/laporan-mendekati' ? 'white' : 'black' }} fontSize='small' />
                                 <span className={`py-1 ${activeLink === '/laporan/laporan-mendekati' ? 'text-white ml-3' : 'ml-3'}`}>Laporan Mendekati Kadaluarsa</span>
                              </Link>
                           </li>
                           <li className={`py-1 ${activeLink === '/laporan/laporan-penjualan' ? 'bg-blue-900 text-white' : 'bg-blue-700 text-white'}`}>
                              <Link href="/laporan/laporan-penjualan" className="flex items-center p-2 text-white rounded-lg dark:text-white  dark:hover:bg-gray-700">
                                 <StoreMallDirectory sx={{ color: activeLink === '/laporan/laporan-penjualan' ? 'white' : 'black' }} fontSize='small' />
                                 <span className={`py-1 ${activeLink === '/laporan/laporan-penjualan' ? 'text-white ml-3' : 'ml-3'}`}>Laporan Penjualan</span>
                              </Link>
                           </li>
                        </div>
                     ) : null
                  }


               </ul>
            </div>
         </aside>
         <div className="p-2 sm:ml-64 mt-14">
            {
               error && <div className="mb-10 flex items-center justify-center">
                  <Alert severity="error">
                     <AlertTitle>Error</AlertTitle>
                     {error}
                  </Alert>
               </div>
            }
            {children}
         </div>
      </div>
   );
}