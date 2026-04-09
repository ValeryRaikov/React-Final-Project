import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import './Admin.css';

import Login from '../login/Login';
import Sidebar from '../sidebar/Sidebar';
import NotFound from '../not-found/NotFound';
import Home from '../home/Home';
import AddProduct from '../services/products/add-product/AddProduct';
import ListProduct from '../services/products/list-product/ListProduct';
import EditProduct from '../services/products/edit-product/EditProduct';
import DeleteProduct from '../services/products/delete-product/DeleteProduct';
import ProtectedRoutes from '../common/ProtectedRoutes';
import AddPromocode from '../services/promocodes/add-promocode/AddPromocode';
import ListPromocodes from '../services/promocodes/list-promocodes/ListPromocodes';
import EditPromocode from '../services/promocodes/edit-promocode/EditPromocode';
import DeletePromocode from '../services/promocodes/delete-promocode/DeletePromocode';
import AddUser from '../services/users/add-user/AddUser';
import ListUser from '../services/users/list-user/ListUser';
import EditUser from '../services/users/edit-user/EditUser';
import DeleteUser from '../services/users/delete-user/DeleteUser';

export default function Admin() {

    function RedirectToAdmin() {
        const navigate = useNavigate();
    
        useEffect(() => {
            navigate('/admin');
        }, [navigate]);
    
        return null;
    }

    return (
        <div className="admin">
            <Sidebar />

            <Routes>
                <Route path='/' element={<RedirectToAdmin />}/>
                <Route path='/admin' element={<Home />}/>
                <Route path='/admin-login' element={<Login />} />
                <Route element={<ProtectedRoutes />}>
                    <Route path='/add-product' element={<AddProduct />} />
                    <Route path='/list-products' element={<ListProduct />} />
                    <Route path='/update-product/:productId' element={<EditProduct />} />
                    <Route path='/remove-product/:productId' element={<DeleteProduct />} />
                    <Route path="/add-promocode" element={<AddPromocode />} />
                    <Route path="/list-promocodes" element={<ListPromocodes />} />
                    <Route path="/update-promocode/:promocodeId" element={<EditPromocode />} />
                    <Route path="/remove-promocode/:promocodeId" element={<DeletePromocode />} />
                    <Route path="/add-user" element={<AddUser />} />
                    <Route path="/list-users" element={<ListUser />} />
                    <Route path="/edit-user/:userId" element={<EditUser />} />
                    <Route path="/delete-user/:userId" element={<DeleteUser />} />
                </Route>
                <Route path='/*' element={<NotFound />} />
            </Routes>
        </div>
    );
}