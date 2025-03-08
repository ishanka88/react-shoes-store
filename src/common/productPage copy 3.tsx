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




import { Row, Col } from "reactstrap"; 
import { motion } from "framer-motion";



// Product Images
import image1 from "./productImages/productimage1.jpeg";
import image2 from "./productImages/productimage2.jpeg";
import image3 from "./productImages/productimage3.jpeg";
import image4 from "./productImages/productimage4.jpeg";
import image5 from "./productImages/image444.jpeg";


// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCeJaXISrsrsZW0M5xNZBLtSBH6IhvbUpA",
  authDomain: "tacco-a1194.firebaseapp.com",
  projectId: "tacco-a1194",
  storageBucket: "tacco-a1194.firebasestorage.app",
  messagingSenderId: "1030388201429",
  appId: "1:1030388201429:web:ee4b254cba13c557052f5c",
  measurementId: "G-FRD63MGYB0"
};



const ProductPage: React.FC = () => {

    let name= "C010"
    let image ="./productimage4.jpeg";
    let unit_amount = 25
    let quantity = 199
    let description = "AVHAGYFSYG  anjhja  ananka anakak aaakak aaka"
    
    
    const productData = { name, image, unit_amount, description, quantity };
    const [currentImage, setCurrentImage] = useState(0);

    const productImages = [image1, image2, image3, image4,image5];

    const imageVariants = {
      exit: { opacity: 0, y: 20, scale: 0.98, transition: { duration: 0.4 } },
      enter: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
    };


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
                                                <h1 data-animation="fadeInUp" data-delay=".4s">CODE : C010</h1>
                                                <nav aria-label="breadcrumb">
                                                    <ol className="breadcrumb">
                                                        <li className="breadcrumb-item"><a href="index-2.html">Home</a></li>
                                                        <li className="breadcrumb-item"><a href="#">Products</a></li>
                                                    </ol>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="instagram-area pb-padding">
                          <div className="container-fluid">
                            <div className="row align-items-top">

                              {/* Left Side: Main Image & Thumbnails */}
                              <div className="col-xl-6 col-lg-5 col-md-6">
                                <div className="instra-tittle mb-40">
                                  <div className="section-tittle">
                                    <div>
                                      {/* Main Image */}
                                      <motion.div initial="exit" animate="enter" exit="exit" variants={imageVariants} key={currentImage}>
                                        <div className="responsive-container">
                                          <img 
                                            src={productImages[currentImage]} 
                                            alt="Responsive Image" 
                                            className="responsive-image"
                                            style={{ width: '100%', height: 'auto' }} // Ensures the image takes full width of the container
                                          />
                                        </div>
                                      </motion.div>
                                    </div>

                                    {/* Thumbnails */}
                                    <div className="d-flex responsive-container thumbnail-container">
                                      {productImages.map((img, index) => (
                                        <div className="thumbnail-wrapper" key={index}>
                                          <img
                                            src={img}
                                            onClick={() => setCurrentImage(index)}
                                            alt="thumbnail-image"
                                            className="rounded-md cursor-pointer responsive-image thumbnail"
                                          />
                                        </div>
                                      ))}
                                    </div>

                                  </div>
                                </div>
                              </div>

                              {/* Right Side: Product Details */}
                              <div className="col-xl-6 col-lg-5">
                                <div className="col no-gutters">
                                  <div>
                                    <h2 className="text-4xl font-bold mb-5">{name}</h2>
                                  </div>
                                  <div className="mb-5">
                                    <span className="text-2xl mr-3 font-bold">$29.99</span>
                                    <span className="text-gray-400 line-through">$49.99</span>
                                  </div>
                                  <p className="mb-5">
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit quos, dolor eligendi et amet culpa
                                    veritatis! Perspiciatis fugiat fuga in ipsam. Natus voluptatibus quae laudantium
                                  </p>
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
export default ProductPage;
