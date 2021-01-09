import React, { useState } from 'react';
import { Button, Modal, Form, Input, Radio } from 'antd';
import { Checkbox } from 'antd';

import { Select } from 'antd';

const { Option } = Select;


interface Values {
    title: string;
    description: string;
    modifier: string;
}

interface ProductFormModalProps {
    visible: boolean;
    title: string;
    // isAqua: boolean;
    // isEat: boolean;
    // unit: string;
    inputPlaceHolder: string;
    okText: string;
    //   onConfirm: (values: Values) => void;
    onConfirm: (productTitle: string, isAqua: boolean, isEat: boolean, unit: string) => void;
    onCancel: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
    visible,
    onConfirm,
    onCancel,
    title,
    inputPlaceHolder,
    okText
}) => {
    const [form] = Form.useForm();

    function onChangeAqua(e) {
        setIsAqua(e.target.checked);
        
    }

    function onChangeEat(e) {
        setIsEat(e.target.checked);
    }

    function handleChange(value) {
        
    }

    const [isAqua, setIsAqua] = useState(false);
    const [isEat, setIsEat] = useState(false);

    return (
        <Modal
            visible={visible}
            title={title}
            okText={okText}
            cancelText="Отменить"
            onCancel={onCancel}
            onOk={() => {
                
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields();
                        console.log(values);
                        onConfirm(values.title, isAqua, isEat, values.unit);
                    })
                    .catch(info => {
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={{ modifier: 'public' }}
            >
                <Form.Item
                    name="title"
                    label="Название"
                >
                    <Input placeholder={inputPlaceHolder} />
                </Form.Item>
              
            </Form>


        </Modal>
    );
};