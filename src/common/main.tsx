import React, { useEffect, useState } from "react";
import img7 from "../assets/img/gallery/insta.png";
import img8 from "../assets/img/gallery/instra1.png";
import img9 from "../assets/img/gallery/instra2.png";

import img13 from "../assets/img/icon/services1.svg";
import img14 from "../assets/img/icon/services2.svg";
import img15 from "../assets/img/icon/services3.svg";
import img16 from "../assets/img/icon/services4.svg";
import { Carousel } from 'react-bootstrap';
import { TabContent, TabPane } from "reactstrap";


import { collection,  getDocs, query ,orderBy, limit} from 'firebase/firestore';
import { Product } from "../models/Products";

import{db} from "../firebase/firebaseConfig"



const classNames = require("classnames");


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

const Main: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [verticalActiveTabWithIcon, setVerticalActiveTabWithIcon] = useState("1");
    const [currentIndexes, setCurrentIndexes] = useState<number[]>([]); // Store indexes for each product carousel
  
    useEffect(() => {
      fetchProducts();
    }, [verticalActiveTabWithIcon]);
  
    const toggleVerticalIcon = (tab: any) => {
      if (verticalActiveTabWithIcon !== tab) {
        setVerticalActiveTabWithIcon(tab);
      }
    };
  
    const fetchProducts = async () => {
      try {
        let category = verticalActiveTabWithIcon === "1" ? 'shoes' : '';
  
        // const shoesProductsQuery = query(collection(db, 'Products'), where('category', '==', category));
        const shoesProductsQuery = query(collection(db, 'Products'),orderBy('displayOrder'),limit(6));
        const fetchedProducts: Product[] = [];
        const shoesProductsSnapshot = await getDocs(shoesProductsQuery);
  
        for (const doc of shoesProductsSnapshot.docs) {
            const productData = doc.data();
            
            // Ensure `mainImages` exists or fall back to an empty array
            const mainImages: string[] = productData.mainImages || []; 
          
            // Push the product data into `fetchedProducts` array
            fetchedProducts.push({ id: doc.id, ...productData, mainImages });
          }
          
        setLoading(false);
        setProducts(fetchedProducts);
        setCurrentIndexes(new Array(fetchedProducts.length).fill(0)); // Initialize the indexes for each carousel
      } catch (error) {
        console.error('Error fetching products:', error);
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
            <div className="content-wrapper ">
                <main>

                    <div className="slider-area ">
                        <div className="slider-active">
                            <div className="single-slider hero-overly1 slider-height d-flex align-items-center slider-bg1">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-xl-6 col-lg-8 col-md-8">
                                            <div className="hero__caption">
                                                <span>70% Sale off </span>
                                                <h1 data-animation="fadeInUp" data-delay=".4s">Furniture at Cost</h1>
                                                <p data-animation="fadeInUp" data-delay=".6s">Suspendisse varius enim in eros elementum
                                                    tristique. Duis cursus, mi quis viverra ornare, eros
                                                    dolor interdum nulla.</p>

                                                <div className="hero__btn" data-animation="fadeInUp" data-delay=".7s">
                                                    <a href="products" className="btn hero-btn">Discover More</a>
                                                </div>
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
                                    <div className="section-tittle mb-50 text-center wow fadeInUp" data-wow-duration="1s" data-wow-delay=".2s">
                                        <h2>Popular products</h2>
                                        <p>Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor
                                            interdum nulla.</p>
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
                                                {/* <a className={classNames({
                                                    "nav-item nav-link gj-cursor-pointer": true,
                                                    active: verticalActiveTabWithIcon === "2",
                                                })} onClick={() => {
                                                    toggleVerticalIcon("2");
                                                }}>Table</a>
                                                <a className={classNames({
                                                    "nav-item nav-link gj-cursor-pointer": true,
                                                    active: verticalActiveTabWithIcon === "3",
                                                })} onClick={() => {
                                                    toggleVerticalIcon("3");
                                                }}>Chair</a>
                                                <a className={classNames({
                                                    "nav-item nav-link gj-cursor-pointer": true,
                                                    active: verticalActiveTabWithIcon === "4",
                                                })} onClick={() => {
                                                    toggleVerticalIcon("4");
                                                }}>Bed</a>
                                                <a className={classNames({
                                                    "nav-item nav-link gj-cursor-pointer": true,
                                                    active: verticalActiveTabWithIcon === "5",
                                                })} onClick={() => {
                                                    toggleVerticalIcon("5");
                                                }}>Lightning</a>
                                                <a className={classNames({
                                                    "nav-item nav-link gj-cursor-pointer": true,
                                                    active: verticalActiveTabWithIcon === "6",
                                                })} onClick={() => {
                                                    toggleVerticalIcon("6");
                                                }}>Decore</a> */}
                                            </div>
                                        </nav>

                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <TabContent activeTab={verticalActiveTabWithIcon} className="text-muted mt-4 mt-xl-0 w-100">
                                <TabPane tabId="1">
                                    <div className="row">
                                    {products.length > 0 ? (
                                        <>
                                        {products.map((product, index) => (
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
                                                window.open(`product_details?id=${product.id}`);
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
                                <div className="row justify-content-center">
                                    <div className="room-btn">
                                    <a href="products" className="border-btn">Discover More</a>
                                    </div>
                                </div>
                            </div>
                    </section>



                    <div className="instagram-area">
                        <div className="container-fluid">
                            <div className="row align-items-center">
                                <div className="col-xl-3 col-lg-4 col-md-6">
                                    <div className="instra-tittle mb-40">
                                        <div className="section-tittle">
                                            <img src={img7} alt="" />
                                            <h2>Get Inspired with Instagram</h2>
                                            <p className="mb-35">Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra
                                                ornare, eros dolor interdum nulla.</p>
                                            <a href="product.html" className="border-btn">Discover More</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-9 col-lg-8">
                                    <div className="row no-gutters">
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                            <div className="single-instagram">
                                                <img src={img8} alt="" className="w-100" />
                                                <a href="#"><i className="ti-instagram"></i></a>
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                            <div className="single-instagram">
                                                <img src={img9} alt="" className="w-100" />
                                                <a href="#"><i className="ti-instagram"></i></a>
                                            </div>
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
                                            <img src={img13} alt="" />
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
                                            <img src={img14} alt="" />
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
                                            <img src={img15} alt="" />
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
                                            <img src={img16} alt="" />
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

        </React.Fragment >
    );
};
export default Main;
