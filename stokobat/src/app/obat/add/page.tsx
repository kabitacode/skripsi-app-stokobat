import { Breadcrumb, Button, Flex } from "antd";
import DashboardLayout from "../../dashboard/layout";
import Link from 'next/link';

export default function Page() {
    return (
        <DashboardLayout>

            <div className="flex flex-row mt-4 ml-4 justify-between mr-4">
                <div className="">
                    <Breadcrumb
                        items={[
                            {
                                title: <Link href={"/obat"}>Obat</Link>,
                            },
                            {
                                title: 'Tambah Data',
                            }
                        ]}
                    />
                </div>
                <div className="">
                    <Link href={'/obat/add'}>
                        <Button type="primary">Tambah Data</Button>
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    )
}