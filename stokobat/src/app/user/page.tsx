"use client"

import DashboardLayout from "../dashboard/layout";
import Link from 'next/link';


export default function Page() {

    return (
        <DashboardLayout>
            <div className="flex mt-4 mr-5 ml-5 mb-5 justify-between">
                <div className="">

                </div>
                <div className="">
                    <Link href={'/user/add'}>
                       
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    )
}