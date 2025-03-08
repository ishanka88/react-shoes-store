import React, { useState, useEffect } from "react";
import { Product } from "../models/Products";
import { Card, CardBody, Col, Form, Input, Label, Container, Nav, NavItem, NavLink, Row, TabContent, Modal, TabPane } from "reactstrap";
import { toast } from "react-toastify";
import { AdminService } from "../services/AdminService";
import 'react-toastify/dist/ReactToastify.css';
import { getFirestore, collection, doc, updateDoc, getDocs, addDoc, query, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import Swal from "sweetalert2";
import { Notification, Order, OrderItem } from "../models/Order";

import{db} from "../firebaseConfig"


const classNames = require("classnames");





const generateItemCode = (): string => {
    const randomNumbers = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // Random three-digit number
    const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Random letter (A-Z)
    return `${randomLetter}${randomNumbers}`;
};


const Orders: React.FC = () => {
    const [modal_center, setModalCenter] = React.useState(false);
    const [itemCode, setItemCode] = useState<string>(generateItemCode());
    const [imageFiles, setImageFiles] = useState<FileList | null>(null);
    const [product, setProduct] = useState<Product>({} as Product);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [verticalActiveTabWithIcon, setverticalActiveTabWithIcon] = useState("1");
    function togCenterReview() {
        setModalCenter(!modal_center);
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImageFiles(e.target.files);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [verticalActiveTabWithIcon]);

    const toggleVerticalIcon = (tab: any) => {
        if (verticalActiveTabWithIcon != tab) {
            setverticalActiveTabWithIcon(tab);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let status;
            if (verticalActiveTabWithIcon == "1") {
                status = 'pending'
            }
            if (verticalActiveTabWithIcon == "3") {
                status = 'approved'
            }
            if (verticalActiveTabWithIcon == "4") {
                status = 'shipped'
            }
            if (verticalActiveTabWithIcon == "5") {
                status = 'delivered'
            }
            if (verticalActiveTabWithIcon == "6") {
                status = 'cancelled'
            }

            const sofaProductsQuery = query(collection(db, 'Orders'), where('status', '==', status));
            const fetchedProducts: Product[] = [];
            // Fetching the filtered products
            const sofaProductsSnapshot = await getDocs(sofaProductsQuery);

            for (const doc of sofaProductsSnapshot.docs) {
                const productData = doc.data();
                fetchedProducts.push({ id: doc.id, ...productData });
            }
            setLoading(false);
            setOrders(fetchedProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: string, targetUserId: string, targetUserRef: string) => {
        try {
            const orderRef = doc(db, 'Orders', orderId);
            await updateDoc(orderRef, { status: newStatus });

            const notificationData: Notification = {
                createdAt: new Date(),
                description: newStatus,
                targetUserId: targetUserId,
                targetUserRef: targetUserRef,
                isRead: false,
                title: "Order",
                type: 'order'
            };
            await addDoc(collection(db, 'Notifications'), notificationData);
            Swal.fire({
                icon: "success",
                title: "Order status updated successfully!",
                confirmButtonColor: "#FD7F00",
            });

            fetchProducts();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };



    return (
        <React.Fragment>
            <div className="content-wrapper ">
                <main>
                    <div className="container">
                        <div className="row row--30  mb-3 mt-10">
                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="properties__button text-center">

                                        <nav>
                                            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                                <a
                                                    className={classNames({
                                                        "nav-item nav-link ": true,
                                                        active: verticalActiveTabWithIcon === "1",
                                                    })}
                                                    onClick={() => {
                                                        toggleVerticalIcon("1");
                                                    }}>Pending</a>

                                                <a className={classNames({
                                                    "nav-item nav-link ": true,
                                                    active: verticalActiveTabWithIcon === "3",
                                                })} onClick={() => {
                                                    toggleVerticalIcon("3");
                                                }}>Approved</a>

                                                <a className={classNames({
                                                    "nav-item nav-link ": true,
                                                    active: verticalActiveTabWithIcon === "4",
                                                })} onClick={() => {
                                                    toggleVerticalIcon("4");
                                                }}>Shipped/Dispatched</a>

                                                <a className={classNames({
                                                    "nav-item nav-link ": true,
                                                    active: verticalActiveTabWithIcon === "5",
                                                })} onClick={() => {
                                                    toggleVerticalIcon("5");
                                                }}>Delivered</a>

                                                <a className={classNames({
                                                    "nav-item nav-link ": true,
                                                    active: verticalActiveTabWithIcon === "6",
                                                })} onClick={() => {
                                                    toggleVerticalIcon("6");
                                                }}>Cancelled</a>
                                            </div>
                                        </nav>

                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-12  mb-3 mt-20">
                                <div className="course-sidebar-3 sidebar-top-position">
                                    <div className="edu-course-widget widget-course-summery ">

                                        <TabContent activeTab={verticalActiveTabWithIcon} className="text-muted mt-4 mt-xl-0 w-100">
                                            <TabPane tabId="1">
                                                <div className="row">
                                                    {orders !== undefined && orders.length > 0 ? (
                                                        <>

                                                            <div className="table-responsive">
                                                                <table className="table cart-table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th scope="col" className="product-subtotal">Oder Id</th>
                                                                            <th scope="col" className="product-subtotal">Title</th>
                                                                            <th scope="col" className="product-subtotal">Category</th>
                                                                            <th scope="col" className="product-subtotal">Price</th>
                                                                            <th scope="col" className="product-subtotal">Total Amount</th>
                                                                            <th scope="col" className="product-subtotal">Status</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {orders.map(order => (
                                                                            <tr key={order.id}>
                                                                                <td>{order.orderId}</td>
                                                                                {order.orderItems?.map((item: OrderItem, index: number) => (
                                                                                    <React.Fragment key={index}>
                                                                                        <td>{item.item.title ? item.item.title : "-"}</td>
                                                                                        <td>{item.item.category ? item.item.category : "-"}</td>
                                                                                        <td>Rs.{item.item.price ? item.item.price : "-"}</td>
                                                                                    </React.Fragment>
                                                                                ))}
                                                                                <td>Rs.{order.amount}</td>
                                                                                <td>
                                                                                    <div className="form-group">
                                                                                        <select
                                                                                            className="form-control f-14"
                                                                                            value={order.status || ''}
                                                                                            onChange={(e) => updateOrderStatus(order.id, e.target.value, order?.createdUserId as any, order?.createdUserRef as any)}
                                                                                        >
                                                                                            <option value="pending">Pending</option>
                                                                                            <option value="approved">Approved</option>
                                                                                            <option value="shipped">Shipped/Dispatched</option>
                                                                                            <option value="delivered">Delivered</option>
                                                                                            <option value="cancelled">Cancelled</option>
                                                                                        </select>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                        </>
                                                    ) : (
                                                        loading ? (
                                                            <div className="loading-text">Loading...</div>
                                                        ) : (
                                                            <div>No Orders Available</div>
                                                        )
                                                    )}
                                                </div>
                                            </TabPane>
                                        </TabContent>


                                        <TabContent activeTab={verticalActiveTabWithIcon} className="text-muted mt-4 mt-xl-0 w-100">
                                            <TabPane tabId="3">
                                                <div className="row">
                                                    {orders !== undefined && orders.length > 0 ? (
                                                        <>

                                                            <div className="table-responsive">
                                                                <table className="table cart-table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th scope="col" className="product-subtotal">Oder Id</th>
                                                                            <th scope="col" className="product-subtotal">Title</th>
                                                                            <th scope="col" className="product-subtotal">Category</th>
                                                                            <th scope="col" className="product-subtotal">Price</th>
                                                                            <th scope="col" className="product-subtotal">Total Amount</th>
                                                                            <th scope="col" className="product-subtotal">Status</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {orders.map(order => (
                                                                            <tr key={order.id}>
                                                                                <td>{order.orderId}</td>
                                                                                {order.orderItems?.map((item: OrderItem, index: number) => (
                                                                                    <React.Fragment key={index}>
                                                                                        <td>{item.item.title ? item.item.title : "-"}</td>
                                                                                        <td>{item.item.category ? item.item.category : "-"}</td>
                                                                                        <td>Rs.{item.item.price ? item.item.price : "-"}</td>
                                                                                    </React.Fragment>
                                                                                ))}
                                                                                <td>Rs.{order.amount}</td>
                                                                                <td>
                                                                                    <div className="form-group">
                                                                                        <select
                                                                                            className="form-control f-14"
                                                                                            value={order.status || ''}
                                                                                            onChange={(e) => updateOrderStatus(order.id, e.target.value, order?.createdUserId as any, order?.createdUserRef as any)}
                                                                                        >
                                                                                            <option value="approved">Approved</option>
                                                                                            <option value="shipped">Shipped/Dispatched</option>
                                                                                            <option value="delivered">Delivered</option>
                                                                                            <option value="cancelled">Cancelled</option>
                                                                                        </select>
                                                                                    </div>
                                                                                </td>

                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                        </>
                                                    ) : (
                                                        loading ? (
                                                            <div className="loading-text">Loading...</div>
                                                        ) : (
                                                            <div>No Orders Available</div>
                                                        )
                                                    )}
                                                </div>
                                            </TabPane>
                                        </TabContent>

                                        <TabContent activeTab={verticalActiveTabWithIcon} className="text-muted mt-4 mt-xl-0 w-100">
                                            <TabPane tabId="4">
                                                <div className="row">
                                                    {orders !== undefined && orders.length > 0 ? (
                                                        <>

                                                            <div className="table-responsive">
                                                                <table className="table cart-table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th scope="col" className="product-subtotal">Oder Id</th>
                                                                            <th scope="col" className="product-subtotal">Title</th>
                                                                            <th scope="col" className="product-subtotal">Category</th>
                                                                            <th scope="col" className="product-subtotal">Price</th>
                                                                            <th scope="col" className="product-subtotal">Total Amount</th>
                                                                            <th scope="col" className="product-subtotal">Status</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {orders.map(order => (
                                                                            <tr key={order.id}>
                                                                                <td>{order.orderId}</td>
                                                                                {order.orderItems?.map((item: OrderItem, index: number) => (
                                                                                    <React.Fragment key={index}>
                                                                                        <td>{item.item.title ? item.item.title : "-"}</td>
                                                                                        <td>{item.item.category ? item.item.category : "-"}</td>
                                                                                        <td>Rs.{item.item.price ? item.item.price : "-"}</td>
                                                                                    </React.Fragment>
                                                                                ))}
                                                                                <td>Rs.{order.amount}</td>
                                                                                <td>
                                                                                    <div className="form-group">
                                                                                        <select
                                                                                            className="form-control f-14"
                                                                                            value={order.status || ''}
                                                                                            onChange={(e) => updateOrderStatus(order.id, e.target.value, order?.createdUserId as any, order?.createdUserRef as any)}
                                                                                        >
                                                                                            <option value="shipped">Shipped/Dispatched</option>
                                                                                            <option value="delivered">Delivered</option>
                                                                                            <option value="cancelled">Cancelled</option>
                                                                                        </select>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                        </>
                                                    ) : (
                                                        loading ? (
                                                            <div className="loading-text">Loading...</div>
                                                        ) : (
                                                            <div>No Orders Available</div>
                                                        )
                                                    )}
                                                </div>
                                            </TabPane>
                                        </TabContent>

                                        <TabContent activeTab={verticalActiveTabWithIcon} className="text-muted mt-4 mt-xl-0 w-100">
                                            <TabPane tabId="5">
                                                <div className="row">
                                                    {orders !== undefined && orders.length > 0 ? (
                                                        <>

                                                            <div className="table-responsive">
                                                                <table className="table cart-table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th scope="col" className="product-subtotal">Oder Id</th>
                                                                            <th scope="col" className="product-subtotal">Title</th>
                                                                            <th scope="col" className="product-subtotal">Category</th>
                                                                            <th scope="col" className="product-subtotal">Price</th>
                                                                            <th scope="col" className="product-subtotal">Total Amount</th>
                                                                            <th scope="col" className="product-subtotal">Status</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {orders.map(order => (
                                                                            <tr key={order.id}>
                                                                                <td>{order.orderId}</td>
                                                                                {order.orderItems?.map((item: OrderItem, index: number) => (
                                                                                    <React.Fragment key={index}>
                                                                                        <td>{item.item.title ? item.item.title : "-"}</td>
                                                                                        <td>{item.item.category ? item.item.category : "-"}</td>
                                                                                        <td>Rs.{item.item.price ? item.item.price : "-"}</td>
                                                                                    </React.Fragment>
                                                                                ))}
                                                                                <td>Rs.{order.amount}</td>
                                                                                <td>
                                                                                    <div className="form-group">
                                                                                        <select
                                                                                            className="form-control f-14"
                                                                                            value={order.status || ''}
                                                                                            onChange={(e) => updateOrderStatus(order.id, e.target.value, order?.createdUserId as any, order?.createdUserRef as any)}
                                                                                        >
                                                                                            <option value="delivered">Delivered</option>
                                                                                            <option value="cancelled">Cancelled</option>
                                                                                        </select>
                                                                                    </div>
                                                                                </td>

                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                        </>
                                                    ) : (
                                                        loading ? (
                                                            <div className="loading-text">Loading...</div>
                                                        ) : (
                                                            <div>No Orders Available</div>
                                                        )
                                                    )}
                                                </div>
                                            </TabPane>
                                        </TabContent>



                                        <TabContent activeTab={verticalActiveTabWithIcon} className="text-muted mt-4 mt-xl-0 w-100">
                                            <TabPane tabId="6">
                                                <div className="row">
                                                    {orders !== undefined && orders.length > 0 ? (
                                                        <>

                                                            <div className="table-responsive">
                                                                <table className="table cart-table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th scope="col" className="product-subtotal">Oder Id</th>
                                                                            <th scope="col" className="product-subtotal">Title</th>
                                                                            <th scope="col" className="product-subtotal">Category</th>
                                                                            <th scope="col" className="product-subtotal">Price</th>
                                                                            <th scope="col" className="product-subtotal">Total Amount</th>
                                                                            <th scope="col" className="product-subtotal">Status</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {orders.map(order => (
                                                                            <tr key={order.id}>
                                                                                <td>{order.orderId}</td>
                                                                                {order.orderItems?.map((item: OrderItem, index: number) => (
                                                                                    <React.Fragment key={index}>
                                                                                        <td>{item.item.title ? item.item.title : "-"}</td>
                                                                                        <td>{item.item.category ? item.item.category : "-"}</td>
                                                                                        <td>Rs.{item.item.price ? item.item.price : "-"}</td>
                                                                                    </React.Fragment>
                                                                                ))}
                                                                                <td>Rs.{order.amount}</td>
                                                                                <td>
                                                                                    <div className="form-group">
                                                                                        <select
                                                                                            className="form-control f-14"
                                                                                            value={order.status || ''}
                                                                                            onChange={(e) => updateOrderStatus(order.id, e.target.value, order?.createdUserId as any, order?.createdUserRef as any)}
                                                                                        >
                                                                                            <option value="cancelled">Cancelled</option>
                                                                                            <option value="approved">Approved</option>
                                                                                        </select>
                                                                                    </div>
                                                                                </td>

                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                        </>
                                                    ) : (
                                                        loading ? (
                                                            <div className="loading-text">Loading...</div>
                                                        ) : (
                                                            <div>No Orders Available</div>
                                                        )
                                                    )}
                                                </div>
                                            </TabPane>
                                        </TabContent>



                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main >
            </div >

        </React.Fragment >
    );
};

export default Orders;

