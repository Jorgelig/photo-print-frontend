import React, { FunctionComponent, useState, useEffect } from 'react'
import { Table, Tag, Space, Select } from 'antd';
import { Button } from 'antd';
import { infoMessage, successMessage, errorMessage } from '../../utils/Notifications';
import { CreateProduct, GetProductsList, CreateIncomeArray, GetStorageList } from '../../actions/get';
import { IncomeModal } from '../modsls/IncomeModal';
import { AddIncomeBody, CreateIncomeBody } from '../../entities/Income';
import { Input, InputNumber, Popconfirm, Form, Typography } from 'antd';
import { StorageEntity } from '../../entities/Storage';
import { ProductEntity } from '../../entities/Product';
import { User } from '../../entities/User';
import { useLocation, useHistory } from 'react-router';
const { Option } = Select;




interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: Item;
    index: number;
    children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                    children
                )}
        </td>
    );
};

interface Item {
   amount: string;
    title: string;
}



const EditableTable = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState<any[]>([]);
    const [editingKey, setEditingKey] = useState('');
    const [isLoading, setisLoading] = useState(true);
    const [products, setProducts] = useState<any[]>([])

    const [storage, setStorage] = useState<any[]>([]);

    const [user, setUser] = useState<User>();
    let history = useHistory();
    let location = useLocation();



    useEffect(() => {
        setisLoading(true);
        async function fetchMyAPI() {
            if (localStorage.hasOwnProperty("user")) {
                let user = JSON.parse(localStorage.getItem("user") || {} as any);
                setUser(user);
            } else {
                history.push('/login');
            }


            let resp = await GetProductsList(user?.token!);
            setProducts(resp)

            let st = await GetStorageList(user?.token!);
            setStorage(st);
            setisLoading(false);
        }
        fetchMyAPI()
    }, [])


    const isEditing = (record: StorageEntity)  =>  {
        return record.product.title === editingKey ? true : false;
    }

    const edit = (record: Partial<StorageEntity> ) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.product!.title);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key: React.Key) => {
        try {
            const row = (await form.validateFields()) as any;
            console.log("row", row);
            storage.map(p => {
                if (p.product.title == key) {
                    p.income = parseInt(row.income, 10);
                    p.amount = 10000
                }
            })

            setProducts(products)
            setStorage(storage);
            setEditingKey('');

            // const newData = [...products];
            // const index = newData.findIndex(item => key === item.key);
            // if (index > -1) {
            //     const item = newData[index];
            //     newData.splice(index, 1, {
            //         ...item,
            //         ...row,
            //     });
            //     setProducts(newData);
            //     setEditingKey('');
            // } else {
            //     newData.push(row);
            //     setProducts(newData);
            //     setEditingKey('');
            // }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };



    const createIncome = async (products: any[]) => {
        
        let dtos: CreateIncomeBody[] = [];
        products.forEach( p => {
            let dto: CreateIncomeBody = {
                amount: p.amount,
                product_id: p.id,
                user_id: user?.id!,
            };
            if (p.amount != undefined) {
                dtos.push(dto);
            }
        });

        const body = {
            "incomes": dtos,
        }

        console.log(body);

        CreateIncomeArray(user?.token!, body);

    }


const Footer =() => {
    return (
        <div>
            <Button type="primary" onClick={() => createIncome(products)}> Сохранить все изменения</Button> 
        </div>
    )
}




    const columns = [
        {
            title: 'Позиция',
            // dataIndex: 'title',
            width: '25%',
            editable: false,
            render: (storage: StorageEntity) => (
                storage.product.title
            )
        },
        {
            title: 'Количество (склад)',
            dataIndex: "amount",
            key: 'storage.amount',
            width: '15%',
            editable: false,
            // render: (product: ProductEntity) => (
            //     product.storage[0].amount || "xui"
            // )
        },
        {
            title: 'Приход',
            // dataIndex: 'amount',
            key:"income", 
            width: '15%',
            editable: true,
        },
        {
            title: 'Действия',
            dataIndex: 'operation',
            render: (_: any, record: StorageEntity) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <a href="javascript:;" onClick={() => save(record.product.title)} style={{ marginRight: 8 }}>
                            Сохранить
              </a>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Отменить</a>
                        </Popconfirm>
                    </span>
                ) : (
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                            Редактировать
                        </Typography.Link>
                    );
            },
        },
    ];

    const mergedColumns = columns.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: StorageEntity) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                amount: 0,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <>
            {isLoading ? "loading" : (
                <Form form={form} component={false}>
                    <Table
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        bordered
                        dataSource={storage}
                        columns={mergedColumns}
                        rowClassName="editable-row"
                        pagination={{
                            onChange: cancel,
                        }}
                        footer={Footer}
                    />
                </Form>)
            }

        </>
    );
};



const columns = [
    {
        title: 'Наименование',
        dataIndex: 'product_title',
        key: 'product_title',
    },
    {
        title: 'Приход (количество)',
        dataIndex: 'amount',
        key: 'amount',
    },
];



interface IncomeProps {
    isModalVisible: boolean;
}


export const Income: FunctionComponent<IncomeProps> = (props: IncomeProps) => {
    const [visible, setVisible] = useState(false);
    const [isLoading, setisLoading] = useState(true);
    const [storage, setStorage] = useState<any>(null)

    const [income, setIncome] = useState<AddIncomeBody[]>([])


    const [user, setUser] = useState<User>();
    let history = useHistory();
    let location = useLocation();


    useEffect(() => {
        setisLoading(true);
        async function fetchMyAPI() {
            if (localStorage.hasOwnProperty("user")) {
                let user = JSON.parse(localStorage.getItem("user") || {} as any);
                setUser(user);
            } else {
                history.push('/login');
            }


            let resp = await GetStorageList(user?.token!);
            setStorage(resp)
            setisLoading(false);
        }

        fetchMyAPI()

    }, [])


    function handleChange(product_title: string, amount: number) {
        let income: AddIncomeBody = {
            product_id: 0,
            amount: amount,
            product_title: product_title
        };
        setIncome(result => [...result, income]);
    }


    function saveIncome() {
        storage.map(p => {

            income.map(i => {
                if (p.title === i.product_title) {
                    i.product_id = p.id;
                }
            })
        })





    }

    return (

        <div>
            {isLoading ? "loading" : (
                <>
                    <h1>
                        Создание прихода
                    {/* <Button type="primary" onClick={() => setVisible(true)} style={{ float: 'right' }}>Добавить приход</Button> */}
                        {/* <IncomeModal visible={visible} inputPlaceHolder="Кола" onConfirm={(product_title, amount) => handleChange(product_title, amount)} onCancel={() => setVisible(false)} title="Добавление прихода" okText={"Добавить"} products={products} /> */}
                    </h1>

                    {/* <div>
                        <Table dataSource={income} columns={columns} />;
                    <Button type="primary" onClick={() => saveIncome()} style={{ float: 'right' }}>Сохранить</Button>
                    </div> */}

                    <EditableTable  />
                </>
            )}

        </div>
    );
}

