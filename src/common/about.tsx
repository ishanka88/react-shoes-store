import React, { useEffect, useState } from "react";
import img1 from "../assets/img/icon/services1.svg";
import img2 from "../assets/img/icon/services2.svg";
import img3 from "../assets/img/icon/services3.svg";
import img4 from "../assets/img/icon/services4.svg";
import img5 from "../assets/img/gallery/about1.png";
import img6 from "../assets/img/gallery/about2.png";
import img7 from "../assets/img/gallery/insta.png";
import img8 from "../assets/img/gallery/instra1.png";
import img9 from "../assets/img/gallery/instra2.png";


const About: React.FC = () => {


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
                                                <h1 data-animation="fadeInUp" data-delay=".4s">About</h1>
                                                <nav aria-label="breadcrumb">
                                                    <ol className="breadcrumb">
                                                        <li className="breadcrumb-item"><a href="index-2.html">Home</a></li>
                                                        <li className="breadcrumb-item"><a href="#">About</a></li>
                                                    </ol>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="about-area section-padding40">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-lg-10">
                                    <div className="section-tittle mb-60 text-center pt-10">
                                        <h2>Our Story</h2>
                                        <p className="pera">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                                            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                                            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                                            cillum dolore eu fugiat nulla pariatur.</p>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="about-img pb-bottom">
                                        <img src={img5} alt="" className="w-100" />
                                    </div>
                                </div>
                            </div>
                            <div className="row justify-content-center">
                                <div className="col-lg-10">
                                    <div className="section-tittle mb-60 text-center pt-10">
                                        <h2>Journey start from</h2>
                                        <p className="pera">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                                            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                                            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                                            cillum dolore eu fugiat nulla pariatur.</p>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="about-img pb-bottom">
                                        <img src={img6} alt="" className="w-100" />
                                    </div>
                                </div>
                            </div>
                            <div className="row justify-content-center">
                                <div className="col-lg-10">
                                    <div className="section-tittle text-center pt-10">
                                        <h2>2024</h2>
                                        <p className="pera">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                                            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                                            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                                            cillum dolore eu fugiat nulla pariatur.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="instagram-area pb-padding">
                        <div className="container-fluid">
                            <div className="row align-items-center">
                                <div className="col-xl-3 col-lg-4 col-md-6">
                                    <div className="instra-tittle mb-40">
                                        <div className="section-tittle">
                                            <img src={img7} alt="" />
                                            <h2>Get Inspired with Instagram</h2>
                                            <p className="mb-35">Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra
                                                ornare, eros dolor interdum nulla.</p>
                                            <a href="#" className="border-btn">Discover More</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-9 col-lg-8">
                                    <div className="row no-gutters">
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                            <img src={img8} alt="" className="w-100" />
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                            <img src={img9} alt="" className="w-100" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
export default About;
