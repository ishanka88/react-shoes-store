import React, { useEffect, useState } from "react";
import img1 from "../assets/img/icon/services1.svg";
import img2 from "../assets/img/icon/services2.svg";
import img3 from "../assets/img/icon/services3.svg";
import img4 from "../assets/img/icon/services4.svg";
import { Carousel } from 'react-bootstrap';


import { Product } from "../models/Products";
import { TabContent, TabPane } from 'reactstrap';
import classNames from "classnames";



import { useProductData } from '../context/DataContext';


const CustomCarousel = ({ product, currentIndex, setCurrentIndex }: { product: Product, currentIndex: number, setCurrentIndex: React.Dispatch<React.SetStateAction<number>> }) => {
  const safeIndex = Math.min(currentIndex, product.mainImages.length - 1);

  return (
    <Carousel activeIndex={safeIndex} onSelect={setCurrentIndex} controls={false} indicators={false} fade={true}  interval={3000} >
      {product.mainImages.map((image: string, index: number) => (
        <Carousel.Item key={index}>
          <div
            className="popular-img imageFit"
            style={{
              backgroundImage: `url(${image})`,
              width: '100%',
              height: '450px',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '15px',
            }}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};



const SizesComponent: React.FC<{ product: Product }> = ({ product }) => {
  const divs = [];
  
  // Check if sizes exists and stock is available
  if (product.sizes && product.stock !== undefined) {
    // If stock is 0, render "SOLD OUT"
    if (product.stock === 0) {
      return (
        <div
          className="text-center"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "15px 0px 10px 0px",
          }}
        >
          <span 
          style={{
            fontSize: "24px",   // Large enough to catch attention
            fontWeight: "bold",  // Make the text stand out
            color: "#dc3545",    // Red color to indicate urgency
            textTransform: "uppercase", // Make it bold and clear
            letterSpacing: "1px", // Slight spacing for a more modern look
            textDecoration: "line-through", // Optional: Strikethrough adds to the "out of stock" feel
            opacity: "0.8",       // Optional: Slightly reduce opacity to show it's unavailable
          }}
          
          >Sold Out</span>
        </div>
      );
    } else {
      // Loop over sizes and display circles with size information
      for (const [size, quantity] of Object.entries(product.sizes)) {
        divs.push(
          <div
            key={size} // Add key for each element to avoid React warnings
            className="text-center"
            style={{
              width: "25px",
              height: "25px",
              borderRadius: "50%",
              backgroundColor: quantity === 0 ? "red" : "#007bff", // Red for out of stock, blue for in stock
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: quantity === 0 ? "white":"white",
              fontSize: "12px",
              fontWeight: "bold",
              textAlign: "center",
              position: "relative",
              opacity: quantity === 0 ? "0.2" :"1", 
              
            }}
          >
               {/* {quantity === 0 && (
              <span
                style={{
                  position: "absolute", // Position the cross mark inside the circle
                  fontSize: "50px", // Size of the cross (adjust as needed)
                  fontWeight: "normal", // Lighter weight for thinner cross
                  top: "50%", // Center vertically
                  left: "50%", // Center horizontally
                  transform: "translate(-50%, -50%)", // Center the cross exactly
                  color: "#dc3545" // Center the cross exactly
                }}
              >
                ×
              </span>
            )} */}
            {size} {/* Display size */}
          </div>
        );
      }

      return (
        <div
          className="text-center"
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            padding: "15px 50px 10px 50px",
          }}
        >
          {divs} {/* Render the divs array */}
        </div>
      );
    }
  }

  // Return a fallback or empty content if `sizes` or `stock` is not available
  return (
    <div className="text-center">
      <span style={{ color: "#dc3545", fontSize: "14px" }}>No sizes available</span>
    </div>
  );
};



const Products: React.FC = () => {
    const { productsList , loading } = useProductData();

    const [verticalActiveTabWithIcon, setVerticalActiveTabWithIcon] = useState("1");
    const [currentIndexes, setCurrentIndexes] = useState<number[]>([]); // Store indexes for each product carousel
  
    const toggleVerticalIcon = (tab: any) => {
      if (verticalActiveTabWithIcon !== tab) {
        setVerticalActiveTabWithIcon(tab);
      }
    };
  

  
    const handleIndexChange = (index: number, newIndex: number | ((prevIndex: number) => number)) => {
      setCurrentIndexes((prevIndexes) => {
        const updatedIndexes = [...prevIndexes];
        updatedIndexes[index] = typeof newIndex === 'function' ? newIndex(prevIndexes[index]) : newIndex;
        return updatedIndexes;
      });
    };
  
    return (
      <React.Fragment>
        <div className="content-wrapper">
          <main>
            <div className="slider-area">
              <div className="slider-active">
                <div className="single-slider hero-overly2 slider-height2 d-flex align-items-center slider-bg2">
                  <div className="container">
                    <div className="row">
                      <div className="col-xl-6 col-lg-8 col-md-8">
                        <div className="hero__caption hero__caption2">
                          <h1 data-animation="fadeInUp" data-delay=".4s">Products</h1>
                          <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                              <li className="breadcrumb-item"><a href="main">Home</a></li>
                              <li className="breadcrumb-item"><a href="Products">Products</a></li>
                            </ol>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <section className="properties new-arrival fix">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-xl-7 col-lg-8 col-md-10">
                    <div className="section-tittle mb-60 text-center wow fadeInUp" data-wow-duration="1s" data-wow-delay=".2s">
                      <h2>Popular products</h2>
                      <p>Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.</p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-12">
                    <div className="properties__button text-center">
                      <nav>
                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                          <a
                            className={classNames({
                              "nav-item nav-link gj-cursor-pointer": true,
                              active: verticalActiveTabWithIcon === "1",
                            })}
                            onClick={() => {
                              toggleVerticalIcon("1");
                            }}>SHOES</a>
                        </div>
                      </nav>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <TabContent activeTab={verticalActiveTabWithIcon} className="text-muted mt-4 mt-xl-0 w-100">
                    <TabPane tabId="1">
                      <div className="row">
                        {productsList.length > 0 ? (
                          <>
                            {productsList.map((product, index) => (
                              <div className="col-lg-4 col-md-6 col-sm-6" key={product.id}>
                                <div
                                  className="single-new-arrival mb-50 text-center"
                                  style={{
                                    borderRadius: '15px',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                    width: '100%',
                                    maxWidth: '300px',
                                    margin: '0 auto',
                                    overflow: 'hidden',
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => {
                                    window.open(`/product_details?id=${product.id}`, '_blank');
                                  }}
                                >
                                  <CustomCarousel
                                    key={index}
                                    product={product}
                                    currentIndex={currentIndexes[index]}
                                    setCurrentIndex={(newIndex: number | ((prevIndex: number) => number)) => handleIndexChange(index, newIndex)}
                                    
                                  />
                                </div>

                                <div>
                                    <SizesComponent product={product} />
                                </div>
  
                                <div className="text-center" style={{ padding: "0px 20px 60px 20px" }}>
                                  <h3>
                                    <a
                                      className="text-decoration-none text-dark"
                                      href="product_details.html"
                                      target="_blank"
                                      style={{
                                        transition: "color 0.3s",
                                        fontFamily: "Roboto, sans-serif",
                                        fontWeight: "bold",
                                      }}
                                      onMouseOver={(e) => {
                                        const target = e.target as HTMLAnchorElement;
                                        target.style.color = "#007bff";
                                      }}
                                      onMouseOut={(e) => {
                                        const target = e.target as HTMLAnchorElement;
                                        target.style.color = "black";
                                      }}
                                    >
                                      Code : {product?.itemCode}
                                    </a>
                                  </h3>
                                  <span className="sans-serif">Rs. {product?.price?.toLocaleString()}</span>
                                </div>
                              </div>
                            ))}
                          </>
                        ) : (
                          loading ? (
                            <div className="loading-text">Loading...</div>
                          ) : (
                            <div>No Products Available</div>
                          )
                        )}
                      </div>
                    </TabPane>
                  </TabContent>
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
  
  export default Products;