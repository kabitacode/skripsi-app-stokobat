"use client"

import { Button, Flex } from "antd";
import DashboardLayout from "../dashboard/layout";
import Link from 'next/link';
import { Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';

interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
}


export default function Page() {
    const columns: TableColumnsType<DataType> = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Age', dataIndex: 'age', key: 'age' },
        { title: 'Address', dataIndex: 'address', key: 'address' },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (key) => (
                <>
                    <Link href={'/edit'}>
                        <Button className="mr-3">Edit</Button>
                    </Link>
                    <Button danger onClick={() => {
                            console.log(key);
                        }}>Delete</Button>
                </>
            ),
        },
    ];

    const data: DataType[] = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sydney No. 1 Lake Park',
        },
        {
            key: '4',
            name: 'Jim Red',
            age: 32,
            address: 'London No. 2 Lake Park',
        },
    ];
    const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    return (
        <DashboardLayout>
            <div className="flex mt-4 mr-5 ml-5 mb-5 justify-between">
                <div className="">

                </div>
                <div className="">
                    <Link href={'/obat/add'}>
                        <Button type="primary">Tambah Data</Button>
                    </Link>
                </div>
            </div>
            <Table className="ml-5 mr-5" columns={columns} dataSource={data} onChange={onChange} />
        </DashboardLayout>
    )
}