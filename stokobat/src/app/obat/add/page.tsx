"use client";

import { useState } from 'react';
import type { FormProps, InputNumberProps, DatePickerProps } from 'antd';
import { Button, Checkbox, Form, Input, Breadcrumb, message, InputNumber, DatePicker } from 'antd';
import DashboardLayout from "../../dashboard/layout";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type FieldType = {
    namaObat: string;
    stok: number;
    harga: number;
    tanggal: string;
};

export default function Page() {
    const [namaObat, setNamaObat] = useState('');
    const [stok, setStok] = useState<number>(0);
    const [harga, setHarga] = useState<number>(0);
    const [tanggal, setTanggal] = useState<Date>();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values: any) => {

        setLoading(true);
        console.log('date:',tanggal);
        
        console.log(namaObat, stok, harga);
        

        try {
            const response = await fetch('/api/your-endpoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            if (response.ok) {
                message.success('Form submitted successfully!');
                router.push('/success-page'); // Redirect to a success page
            } else {
                message.error('Failed to submit the form.');
            }
        } catch (error) {
            message.error('An error occurred while submitting the form.');
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    const onStok: InputNumberProps['onChange'] = (value) => {
        setStok(value as number)
    };

    const onHarga: InputNumberProps['onChange'] = (value) => {
        setHarga(value as number)
    };

    const onTanggal: DatePickerProps['onChange'] = (date, dateString) => {
        setTanggal(dateString)
    };


    return (
        <DashboardLayout>
            <div className="flex flex-row mt-4 ml-4 justify-between mr-4">
                <div className='mb-5'>
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
            </div>

            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600, marginLeft: 15 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout='vertical'
            >
                <Form.Item<FieldType>
                    label="Nama Obat"
                    name={'namaObat'}
                    rules={[{ required: true, message: 'Please input your Nama Obat!' }]}
                >
                    <Input value={namaObat} onChange={(e) => setNamaObat(e.target.value)} />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Stok"
                    name="stok"
                    rules={[{ required: true, message: 'Please input your Stok!' }]}
                >
                    <InputNumber value={stok} onChange={onStok} />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Harga"
                    name="harga"
                    rules={[{ required: true, message: 'Please input your Harga!' }]}
                >
                    <InputNumber value={harga} onChange={onHarga} />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Tanggal Kadaluarsa"
                    name="tanggal"
                    rules={[{ required: true, message: 'Please input your Tanggal!' }]}
                >
                    <DatePicker value={tanggal} onChange={onTanggal} />
                </Form.Item>


                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </DashboardLayout>
    );
}
