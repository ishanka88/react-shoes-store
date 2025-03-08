import React, { useEffect, useState } from "react";
import img1 from "../assets/img/icon/services1.svg";
import img2 from "../assets/img/icon/services2.svg";
import img3 from "../assets/img/icon/services3.svg";
import img4 from "../assets/img/icon/services4.svg";
import img5 from "../assets/img/gallery/card1.png";
import img6 from "../assets/img/gallery/card2.png";
import { NavLink } from "react-router-dom";
import { RouteName } from "../RouteName";


import { Product } from "../models/Products";
import { Button } from "reactstrap";

const Cart: React.FC = () => {
    const [selected, setSelected] = useState(false);



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
                                                <h1 data-animation="fadeInUp" data-delay=".4s">SHOPPING CART</h1>
                                                <nav aria-label="breadcrumb">
                                                    <ol className="breadcrumb">
                                                        <li className="breadcrumb-item"><a href="main">Home</a></li>
                                                        <li className="breadcrumb-item"><a href="cart">Shopping cart</a></li>
                                                    </ol>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <section className="cart_area section-padding40">
                        <div className="container">
                            <div className="d-flex justify-content-between">
                                {/* Cart Details */}
                                <div className="cart_inner">
                                    <div>
                                        <Button
                                            color={selected ? "primary" : "secondary"} // Change color when selected
                                            outline={!selected} // Add outline when not selected
                                            className="square-button"
                                            onClick={() => setSelected(!selected)}
                                            >
                                            {selected ? "Selected" : "Select"}
                                        </Button>
                                    </div>
                                    
                                    <div>awa</div>
                                    
                                </div>

                                {/* Total Amount */}
                                <div>
                                    <div> price</div>

                                </div>

                            </div>
                        </div>
                    </section>


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
export default Cart;
