import React, { useEffect, useState } from "react";
import img1 from "../assets/img/icon/services1.svg";
import img2 from "../assets/img/icon/services2.svg";
import img3 from "../assets/img/icon/services3.svg";
import img4 from "../assets/img/icon/services4.svg";
import img5 from "../assets/img/gallery/card.jpg";


const Checkout: React.FC = () => {


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
                                                <h1 data-animation="fadeInUp" data-delay=".4s">Checkout</h1>
                                                <nav aria-label="breadcrumb">
                                                    <ol className="breadcrumb">
                                                        <li className="breadcrumb-item"><a href="index-2.html">Home</a></li>
                                                        <li className="breadcrumb-item"><a href="#">checkout</a></li>
                                                    </ol>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <section className="checkout_area section-padding40">
                        <div className="container">
                            <div className="returning_customer">
                                <div className="check_title">
                                    <h2>
                                        Returning Customer?
                                        <a href="login.html">Click here to login</a>
                                    </h2>
                                </div>
                                <p>
                                    If you have shopped with us before, please enter your details in the
                                    boxes below. If you are a new customer, please proceed to the
                                    Billing & Shipping section.
                                </p>
                                <form className="row contact_form" action="#">
                                    <div className="col-md-6 form-group p_star">
                                        <input type="text" className="form-control" id="name" name="name" value=" " />
                                        <span className="placeholder" data-placeholder="Username or Email"></span>
                                    </div>
                                    <div className="col-md-6 form-group p_star">
                                        <input type="password" className="form-control" id="password" name="password"  />
                                        <span className="placeholder" data-placeholder="Password"></span>
                                    </div>
                                    <div className="col-md-12 form-group d-flex flex-wrap">
                                        <a href="login.html"  className="btn"> log in</a>
                                        <div className="checkout-cap ml-5">
                                            <input type="checkbox" id="fruit01" name="keep-log"/>
                                                <label >Create an account?</label>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="cupon_area">
                                <div className="check_title">
                                    <h2> Have a coupon?
                                        <a href="#">Click here to enter your code</a>
                                    </h2>
                                </div>
                                <input type="text" placeholder="Enter coupon code" />
                                <a className="btn" href="#">Apply Coupon</a>
                            </div>
                            <div className="billing_details">
                                <div className="row">
                                    <div className="col-lg-8">
                                        <h3>Billing Details</h3>
                                        <form className="row contact_form" action="#" >
                                            <div className="col-md-6 form-group p_star">
                                                <input type="text" className="form-control" id="first" name="name" />
                                                <span className="placeholder" data-placeholder="First name"></span>
                                            </div>
                                            <div className="col-md-6 form-group p_star">
                                                <input type="text" className="form-control" id="last" name="name" />
                                                <span className="placeholder" data-placeholder="Last name"></span>
                                            </div>
                                            <div className="col-md-12 form-group">
                                                <input type="text" className="form-control" id="company" name="company"
                                                    placeholder="Company name" />
                                            </div>
                                            <div className="col-md-6 form-group p_star">
                                                <input type="text" className="form-control" id="number" name="number" />
                                                <span className="placeholder" data-placeholder="Phone number"></span>
                                            </div>
                                            <div className="col-md-6 form-group p_star">
                                                <input type="text" className="form-control" id="email" name="compemailany" />
                                                <span className="placeholder" data-placeholder="Email Address"></span>
                                            </div>
                                            <div className="col-md-12 form-group p_star">
                                                <select className="country_select">
                                                    <option value="1">Country</option>
                                                    <option value="2">Country</option>
                                                    <option value="4">Country</option>
                                                </select>
                                            </div>
                                            <div className="col-md-12 form-group p_star">
                                                <input type="text" className="form-control" id="add1" name="add1" />
                                                <span className="placeholder" data-placeholder="Address line 01"></span>
                                            </div>
                                            <div className="col-md-12 form-group p_star">
                                                <input type="text" className="form-control" id="add2" name="add2" />
                                                <span className="placeholder" data-placeholder="Address line 02"></span>
                                            </div>
                                            <div className="col-md-12 form-group p_star">
                                                <input type="text" className="form-control" id="city" name="city" />
                                                <span className="placeholder" data-placeholder="Town/City"></span>
                                            </div>
                                            <div className="col-md-12 form-group p_star">
                                                <select className="country_select">
                                                    <option value="1">District</option>
                                                    <option value="2">District</option>
                                                    <option value="4">District</option>
                                                </select>
                                            </div>
                                            <div className="col-md-12 form-group">
                                                <input type="text" className="form-control" id="zip" name="zip"
                                                    placeholder="Postcode/ZIP" />
                                            </div>
                                            <div className="col-md-12 form-group">
                                                <div className="checkout-cap">
                                                    <input type="checkbox" id="fruit1" name="keep-log"/>
                                                        <label >Create an account?</label>
                                                </div>
                                            </div>
                                            <div className="col-md-12 form-group">
                                                <div className="creat_account">
                                                    <h3>Shipping Details</h3>
                                                    <div className="checkout-cap">
                                                        <input type="checkbox" id="f-option3" name="selector" />
                                                        <label >Ship to a different address?</label>
                                                    </div>
                                                </div>
                                                <textarea className="form-control" name="message" id="message" 
                                                    placeholder="Order Notes"></textarea>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="order_box">
                                            <h2>Your Order</h2>
                                            <ul className="list">
                                                <li>
                                                    <a href="#">Product<span>Total</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">Fresh Blackberry
                                                        <span className="middle">x 02</span>
                                                        <span className="last">$720.00</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">Fresh Tomatoes
                                                        <span className="middle">x 02</span>
                                                        <span className="last">$720.00</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">Fresh Brocoli
                                                        <span className="middle">x 02</span>
                                                        <span className="last">$720.00</span>
                                                    </a>
                                                </li>
                                            </ul>
                                            <ul className="list list_2">
                                                <li>
                                                    <a href="#">Subtotal <span>$2160.00</span></a>
                                                </li>
                                                <li>
                                                    <a href="#">Shipping
                                                        <span>Flat rate: $50.00</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">Total<span>$2210.00</span>
                                                    </a>
                                                </li>
                                            </ul>
                                            <div className="payment_item">
                                                <div className="radion_btn">
                                                    <input type="radio" id="f-option5" name="selector" />
                                                    <label >Check payments</label>
                                                    <div className="check"></div>
                                                </div>
                                                <p> Please send a check to Store Name, Store Street, Store Town, Store State /
                                                    County, Store Postcode. </p>
                                            </div>
                                            <div className="payment_item active">
                                                <div className="radion_btn">
                                                    <input type="radio" id="f-option6" name="selector" />
                                                    <label >Paypal </label>
                                                    <img src={img5} alt="" />
                                                    <div className="check"></div>
                                                </div>
                                                <p> Please send a check to Store Name, Store Street, Store Town, Store State /
                                                    County, Store Postcode. </p>
                                            </div>
                                            <div className="creat_account checkout-cap">
                                                <input type="checkbox" id="f-option8" name="selector" />
                                                <label >I’ve read and accept the <a href="#">terms & conditions*</a>
                                                </label>
                                            </div>
                                            <a className="btn w-100" href="#">Proceed to Paypal</a>
                                        </div>
                                    </div>
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
                                            <img src={img1} alt=""/>
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
                                            <img src={img2} alt=""/>
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
                                            <img src={img3} alt=""/>
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
                                            <img src={img4} alt=""/>
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
export default Checkout;
