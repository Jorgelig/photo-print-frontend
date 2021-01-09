import React, { FunctionComponent, useState, useEffect } from 'react'
import { Table, Tag, Space } from 'antd';
import { Button } from 'antd';
import { infoMessage, successMessage, errorMessage } from '../../../utils/Notifications';
import { CreateProduct, GetProductsList } from '../../../actions/get';
import { ProductFormModal } from '../../modsls/ProductModal';
import { CreateProductDTO } from '../../../dto/CreateProductDTO';
import CheckOutlined, { DeleteOutlined, CheckCircleOutlined, DownCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { User } from '../../../entities/User';
import { useLocation, useHistory } from 'react-router';
import { ProductEntity } from '../../../entities/Product';

const columns = [
    {
        title: 'Наименование',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: 'Создано',
        // dataIndex: "created",
        key: 'created',
        render: (res: ProductEntity) => (new Date(res.created).toISOString().split('T')[0]
        )
    } 
];



interface ProductProps {
    isModalVisible: boolean;
}


export const Product: FunctionComponent<ProductProps> = (data: ProductProps) => {
    const [visible, setVisible] = useState(false);
    const [isLoading, setisLoading] = useState(true);
    const [response, setResponse] = useState<any>(null)


    const [user, setUser] = useState<User>();
    let history = useHistory();
    let location = useLocation();




    const createNewProduct = async (productTitle: string, isAqua: boolean, isEat: boolean, unit: string) => {
        setVisible(false);
        infoMessage("Отправлен запрос на создании позиции", "");
        let response;

        let createProductDTO: CreateProductDTO = {
            title: productTitle,
        };


        let body = {
            "product": {
                "title": createProductDTO.title,
                "user_id": user?.id,
            }
        };

        console.log("[CreateProductDTO] ", body)

        response = await CreateProduct(user?.token!, body);

        if (response) {
            successMessage("Позиция успешно создана", "");
            // await this.getDirsList();
        } else {
            errorMessage("Произошла ошибка при создании позиции", response.message);
        }
    }

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
            setResponse(resp)
            setisLoading(false);
        }

        fetchMyAPI()
    
    }, [])

    return (

        <div>
            {isLoading ? "loading" : (
                <div>

                    <Button type="primary" onClick={() => setVisible(true)}> Добавить позицию</Button>
                    <ProductFormModal visible={visible} inputPlaceHolder="Кола" onConfirm={(a, b, c, d) => createNewProduct(a, b, c, d)} onCancel={() => setVisible(false)} title="Создание позиции" okText={"Создать"} />

                    <div>
                        <Table dataSource={response} columns={columns} />;
                    </div>
                </div>
            )}

        </div>
    );
}

