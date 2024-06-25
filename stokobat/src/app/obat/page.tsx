import {Button, Flex } from "antd";
import DashboardLayout from "../dashboard/layout";
import Link from 'next/link';

export default function Page() {
    return (
        <DashboardLayout>
            <div className="flex mt-4 w-32 items-end">
                <div className="flex-1 items-end">
                    <Link href={'/obat/add'}>
                        <Button type="primary">Tambah Data</Button>
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    )
}