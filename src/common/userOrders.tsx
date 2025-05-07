import React, { useState,useEffect, useCallback } from "react";
import { Container, Row, Col, Button, Input, Table } from "reactstrap";
import { VscWorkspaceTrusted } from "react-icons/vsc";

import { FaTrash } from "react-icons/fa";
import img1 from "../assets/img/icon/services1.svg";
import img2 from "../assets/img/icon/services2.svg";
import img3 from "../assets/img/icon/services3.svg";
import img4 from "../assets/img/icon/services4.svg";

import img7 from "../assets/img/icon/master.avif";
import img8 from "../assets/img/icon/visa.avif";
import { NavLink } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash,faLock } from '@fortawesome/free-solid-svg-icons';

import "./shoppingCart.css";
import './index.css'

import {  collection, getDocs, query, where, documentId } from 'firebase/firestore';
import { Product } from "../models/Products";

import{db} from "../firebase/firebaseConfig"

import { UserCartDetails } from "../services/UserCartDetails";
import {useProductData} from "../context/DataContext"
import { CartItem , ModifiedCartItem} from "../models/CartItem";

import CheckoutForm from './elements/checkoutForm'; // Import the CheckoutForm component

import { getAuth } from "firebase/auth";
import { Alert } from "react-bootstrap";
import { PenLine, Save } from "lucide-react";

import { Order ,OrderItem} from "../models/Order";
import { it } from "node:test";
import { useUserContext } from "../context/UserContext";
import { getOrdersByIds } from "../firebase/getOrdersByIds";
import { rootCertificates } from "tls";
import OrderDetail from "./elements/orderDetail";



const UserOrders: React.FC = () => {
  const auth = getAuth();



  const { userData } = useUserContext();
  const [orders, setOrders] = useState<Order []>([]);
  const [isOrdersAvailable, setIsOrdersAvailable] = useState(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const orderIds: number[] = userData?.customerDetails.orders||[]

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      // Convert orderIds from number array to string array
      const orderIdsAsStrings = orderIds.map(id => id.toString());

      try {
        const fetchedOrders = await getOrdersByIds(orderIdsAsStrings); // Fetch orders by IDs (now strings)
        setOrders(fetchedOrders);
        if (fetchedOrders.length >0){
          setIsOrdersAvailable(true)
        }

      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    if (orderIds.length > 0) {
      fetchOrders();
    }
  }, [userData]); // Re-run if orderIds changes

  if (error) return <div>{error}</div>;




  return (
        <React.Fragment>
                <div className="content-wrapper ">
                    <main>
                        <div className="slider-area ">
                            <div className="slider-active">
                                <div className="single-slider hero-overly2  slider-height2 d-flex align-items-center slider-bg2">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-xl-6 col-lg-8 col-md-8">
                                                <div className="hero__caption hero__caption2">
                                                    <h1 data-animation="fadeInUp" data-delay=".4s">ORDERS</h1>
                                                    <nav aria-label="breadcrumb">
                                                        <ol className="breadcrumb">
                                                            <li className="breadcrumb-item"><a href="main">Home</a></li>
                                                            <li className="breadcrumb-item"><a href="orders">Orders</a></li>
                                                        </ol>
                                                    </nav>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{padding:"50px 0px 50px 0px"}}>
                          <Container >
                            <h2>ORDERS</h2>
                            <Row className="d-flex justify-content-between">
                              <Col xl={7} lg={8} md={12} sm={12}  xs={12}>
                        
                                  {isOrdersAvailable? (
                                    <div style={{ margin: "1rem 0rem 0rem 0rem" }}>
                                      {orders.map(order => (
                                        <Row key={order.orderId} className="mb-3 cart-item">
                                          <OrderDetail order={order} />
                                        </Row>
                                      ))}
                                    </div>
                                    
                                    ):(

                                      <div className="d-flex justify-content-center" style={{padding: "80px" , fontWeight:"bold"}}> <span> No Orders Placed !</span></div>
                                    )
                                  }


                              </Col>
                              
                            </Row>
                          </Container>
                        </div>



                        <div className="categories-area section-padding40 gray-bg">
                          <div className="container">
                              <div className="row">
                                  <div className="col-lg-3 col-md-6 col-sm-6">
                                      <div className="single-cat mb-50 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".2s">
                                          <div className="cat-icon">
                                              <img src={img1} alt="" />
                                          </div>
                                          <div className="cat-cap">
                                              <h5>Fast & Free Delivery</h5>
                                              <p>Free delivery on all orders</p>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="col-lg-3 col-md-6 col-sm-6">
                                      <div className="single-cat mb-50 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".2s">
                                          <div className="cat-icon">
                                              <img src={img2} alt="" />
                                          </div>
                                          <div className="cat-cap">
                                              <h5>Secure Payment</h5>
                                              <p>Free delivery on all orders</p>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="col-lg-3 col-md-6 col-sm-6">
                                      <div className="single-cat mb-50 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".4s">
                                          <div className="cat-icon">
                                              <img src={img3} alt="" />
                                          </div>
                                          <div className="cat-cap">
                                              <h5>Money Back Guarantee</h5>
                                              <p>Free delivery on all orders</p>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="col-lg-3 col-md-6 col-sm-6">
                                      <div className="single-cat mb-50 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".5s">
                                          <div className="cat-icon">
                                              <img src={img4} alt="" />
                                          </div>
                                          <div className="cat-cap">
                                              <h5>Online Support</h5>
                                              <p>Free delivery on all orders</p>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>  
                      </div>

                </main>
            </div>


        </React.Fragment>
    );
};

export default UserOrders;