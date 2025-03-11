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


import{db} from "../firebaseConfig"

// interface CartItem {
//   id: number;
//   productId:string;
//   name: string;
//   image: string;
//   sizes: { [key: number]: number };
//   quantity: number;
//   price: number;
//   selected: boolean;
// }

interface CartItem {
  id: number;
  productId:string;
  name: string;
  itemCode:string;
  mainImage: string;
  selectedSizes: { [key: number]: number };
  availableSizes: { [key: number]: number };
  quantity: number;
  price: number;
  discount:number;
  selected: boolean;
}

const initialCartList: CartItem[] = [
  {
    id: 1,
    productId:"8J6UEJRN1euEpjs1M1nN",
    name: "Nike Air Max Sneakers",
    itemCode:"C010",
    mainImage: "",
    selectedSizes: { 39:2,40: 1, 41: 0, 42: 2, 43: 0, 44: 1, 45: 0 },
    availableSizes:{},
    quantity: 4,
    price: 6500.00,
    discount:20,
    selected: false,
  },
  {
    id: 2,
    productId:"DzdvNXzIWVvrqTjAZiMc",
    name: "Adidas Running Shoes",
    itemCode:"c010",
    mainImage: "",
    selectedSizes: { 39:2,40: 0, 41: 1, 42: 1, 43: 0, 44: 2, 45: 0 },
    availableSizes:{},
    quantity: 4,
    price: 6000.00,
    discount:20,
    selected: false,
  },
];

const ShoppingCart: React.FC = () => {
  const [verticalActiveTabWithIcon, setVerticalActiveTabWithIcon] = useState("1");
  const [productsList, setProductsList] = useState<Product[]>([]); // Initialize state


  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectAll, setSelectAll] = useState(false);


  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
            if (parsedCart.length ===0 ){
              setCart(initialCartList);
            }else{
              setCart(parsedCart);
            }
          
        } else {
          console.warn("Invalid cart format in localStorage");
        }
      } catch (error) {
        console.error("Error parsing cart data:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it updates
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  

  // fetch data
  const fetchSelectedProducts = useCallback(async (productIds: string[]) => {
    if (productIds.length === 0) return []; // Prevent empty queries
  
    const chunkSize = 10; // Firestore's limit for "in" queries
    let allProducts: Product[] = [];
  
    for (let i = 0; i < productIds.length; i += chunkSize) {
      const chunk = productIds.slice(i, i + chunkSize);
      
      // Query by Document ID
      const q = query(
        collection(db, "Products"),
        where(documentId(), "in", chunk)
      );
    
      try {
        const querySnapshot = await getDocs(q);
        const products = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        allProducts = [...allProducts, ...products];
        console.log(allProducts)
      } catch (error) {
        console.error("Error fetching chunk:", error);
      }
    }
  
    setProductsList(allProducts);

  }, []); // ✅ Empty array prevents unnecessary re-creation

  // Update cart list
  const updateCartList = () => {
    setCart(prevCart =>
      prevCart.map(cartItem => {
        const product = productsList.find(p => p.id === cartItem.productId);

        if (product) {
          return {
            ...cartItem, // Keep existing properties
            name: product.name ?? "", // ✅ Ensure name is a string
            mainImage: product.galleryImages?.[0] ?? "", // ✅ Avoid undefined error
            availableSizes: product.sizes ?? {}, // ✅ Ensure default empty object
            price: product.price ?? 0, // ✅ Ensure price is a number
            discount: product.discount ?? 0 // ✅ Ensure discount is a number
          };
        }

        return cartItem; // Keep unchanged if product not found
      })
    );
  };

  useEffect(() => {
    const productIds = cart.map(item => item.productId);
    fetchSelectedProducts(productIds);
  }, []); // ✅ Corrected dependency array
  
  useEffect(() => {
    if (productsList.length > 0) {
        updateCartList();
    }
   
  }, [productsList]); // ✅ Corrected dependency array
  




  const toggleSelect = (id: number) => {
    setCart(cart.map(item => (item.id === id ? { ...item, selected: !item.selected } : item)));
  };

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setCart(cart.map(item => ({ ...item, selected: newSelectAll })));
  };

  const updateQuantity = (id: number, size: number, amount: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const updatedSizes = {
          ...item.selectedSizes,
          [size]: Math.max(0, (item.selectedSizes[size] || 0) + amount), // Prevent negative values
        };
  
        // Calculate total quantity from updated sizes
        const totalQuantity = Object.values(updatedSizes).reduce((sum, qty) => sum + qty, 0);
  
        return { ...item, selectedSizes: updatedSizes, quantity: totalQuantity };
      }
      return item;
    }));
  };

  const selectedTotalPairs = cart.reduce((acc, item) => 
    item.selected ? acc + item.quantity : acc, 0
  );

  const deliverCharges = ()=>{
    if(selectedTotalPairs===0 ){
      return [0,"Rs. 0.00"]
    }if (selectedTotalPairs===1) {
      return [400,"Rs. 400.00"]
    } else {
      return [0, <span color="green"> Free</span>]
    }
  }


  const removeItem = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.filter(item => item.selected).reduce((acc, item) =>
    acc + item.price * Object.values(item.selectedSizes).reduce((sum, qty) => sum + qty, 0), 0
  );



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

                        <div style={{padding:"50px 0px 50px 0px"}}>
                          <Container >
                            <h2>SHOPPING CART</h2>
                            <Row className="d-flex justify-content-between">
                              <Col xl={7} lg={8} md={12} sm={12}  xs={12}>
                                  <div className="d-flex align-items-center mb-0 black-line ">
                                    <Input
                                      type="checkbox"
                                      checked={selectAll}
                                      onChange={toggleSelectAll}
                                      className="me-2"
                                    />
                                    <span style={{padding:"0px 10px 0px 10px"}}> Select all variations ({cart.length})</span>
                                    
                                  </div>

                                  <div style={{margin:"1rem 0rem 0rem 0rem"}}>
                                      
                                      {cart.map(item => (
                                        <Row key={item.id} className="mb-3 cart-item">
                                          <Col xl={12} md={12} xs={12}>
                                            <div className="d-flex align-items-center justify-content-between">
                                              <div>
                                                <Input
                                                  type="checkbox"
                                                  checked={item.selected}
                                                  onChange={() => toggleSelect(item.id)}
                                                  className="me-3"
                                                />
                                              </div>
                                              <div className="d-flex align-items-center ">
                                                <FontAwesomeIcon icon={faTrash} onClick={() => removeItem(item.id)}/>
                                                
                                                {/* <FaTrash className="d-flex align-items-center delete-button " onClick={() => removeItem(item.id)} /> */}
                                              </div>
                                            </div>
                                          
                                            <Row>
                                                <Col xl={4} lg={4} md={4} >
                                                  <div style={{padding:"0px 10px 10px 10px"}}>
                                                    <img
                                                      src={item.mainImage}
                                                      alt={item.name}
                                                      className="img-fluid rounded-3 thumbnail-image"
                                                      style={{borderRadius:"15px", padding:"0px"}}
                                                    />
                                                  </div>
                                                </Col>
                        
                                                <Col xl={8} lg={8} md={8}>

                                                  <div className="">
                                                    <div className="d-flex justify-content-start ">
                                                      <h4 style={{margin: "0px 0px 0px 0px" }}>{item.name}</h4>
                                                    </div>
                                                    <div className="d-flex justify-content-start ">
                                                        <p style={{margin: "0px 0px 15px 0px", fontSize:"12px"}}>CODE : {item.itemCode}</p>
                                                    </div>
                                      
                                                    <div className="d-flex justify-content-start ">
                                                      <p>Rs. {(item.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / Pair</p>
                                                    </div>
                                                    <div className="d-flex justify-content-between">
                                                      <p style={{margin:"0px"}}>Quantity : {item.quantity}</p>
                                                      <p style={{ margin: "0px" }}>
                                                        Rs {(item.price * item.quantity).toLocaleString(undefined, { 
                                                          minimumFractionDigits: 2, 
                                                          maximumFractionDigits: 2 
                                                        })}
                                                      </p>

                                                    </div>
                                                
                                                    
                                                    <div >
                                                        <div className="size-container">
                                                            {Object.entries(item.selectedSizes).map(([size, quantity]) => (
                                                              <div key={size} className="size-item ">
                                                                <div>Size {size}</div>

                                                                <div className="size-item-buttons th">
                                                                    
                                                                      <button
                                                                        className="size-button" onClick={() => updateQuantity(item.id, Number(size), -1)}>
                                                                          <div>

                                                                            <svg
                                                                            
                                                                                className="minus"
                                                                                style={{display:"flex", justifyContent:"center", alignItems:"center"}}
                            
                                                                                width="12"
                                                                                height="12"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                              >
                                                                                <defs>
                                                                                  <path
                                                                                    d="M12 7.023V4.977a.641.641 0 0 0-.643-.643h-3.69V.643A.641.641 0 0 0 7.022 0H4.977a.641.641 0 0 0-.643.643v3.69H.643A.641.641 0 0 0 0 4.978v2.046c0 .356.287.643.643.643h3.69v3.691c0 .356.288.643.644.643h2.046a.641.641 0 0 0 .643-.643v-3.69h3.691A.641.641 0 0 0 12 7.022Z"
                                                                                    id="b"
                                                                                  />
                                                                                </defs>
                                                                                <use fill="#FF7E1B" fillRule="nonzero" xlinkHref="#b" />
                                                                              </svg>    
                                                                          </div>
                                                                      </button>
                                                                                                  
                                                                      
  
                                                                    <div  style={{padding:"0px" , width:"2px", display:"flex", justifyContent:"center", alignItems:"center"}} >
                                                                        <span style={{padding:"0px"}} className="cart2-values">{quantity}</span>
                                                                    </div>
                                                  
                                                                    <button
                                                                      className="size-button" onClick={() => updateQuantity(item.id, Number(size), 1)}>
                                                                           <svg
                                                                           
                                                                              className="plus"
                                                                              style={{display:"flex", justifyContent:"center", alignItems:"center"}}
                                                                              width="12"
                                                                              height="12"
                                                                              xmlns="http://www.w3.org/2000/svg"
                                                                              xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                            >
                                                                              <defs>
                                                                                <path
                                                                                  d="M12 7.023V4.977a.641.641 0 0 0-.643-.643h-3.69V.643A.641.641 0 0 0 7.022 0H4.977a.641.641 0 0 0-.643.643v3.69H.643A.641.641 0 0 0 0 4.978v2.046c0 .356.287.643.643.643h3.69v3.691c0 .356.288.643.644.643h2.046a.641.641 0 0 0 .643-.643v-3.69h3.691A.641.641 0 0 0 12 7.022Z"
                                                                                  id="b"
                                                                                />
                                                                              </defs>
                                                                              <use fill="#FF7E1B" fillRule="nonzero" xlinkHref="#b" />
                                                                            </svg>    
                                                                    </button>
                                                                </div>
                                                              </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                            
                                                        
                                                  </div>
                                                </Col>
                                                </Row>
                                          </Col>
                                        </Row>
                                      ))}
                                  </div>

                              </Col>
                              {/* Right Side - Takes 4 columns on xl, 12 on smaller screens */}
                              <Col xl={5} lg={4} md={12} sm={12}  xs={12} className="bg-secondary text-white p-4 " style={{padding:"40px 0px 50px 0px"}}>
                                  <Row className="justify-content-center mt-5 ">

                                    <div className="order-summary">
                                        <h2 className="title">Order summary ({selectedTotalPairs} {selectedTotalPairs === 1 ? 'Pair' : 'Pairs'}) </h2>
                                        
                                        <div className="subtotal-row">
                                            <span>Subtotal</span>
                                            <span>Rs. {subtotal.toLocaleString(undefined, { 
                                                          minimumFractionDigits: 2, 
                                                          maximumFractionDigits: 2 
                                                        })}</span>
                                        </div>
                                        
                                        <div className="subtotal-row black-line">
                                            <span>Delivery Charges</span>
                                            <span>{deliverCharges()[1]}</span>

                                        
                                        </div>

                                        <div className="total-row" >
                                            <span>Total</span>
                                            <span>
                                                Rs. {(Number(subtotal) + Number(deliverCharges()?.[0] || 0)).toLocaleString('en-IN', { 
                                                  minimumFractionDigits: 2, 
                                                  maximumFractionDigits: 2 
                                                })}
                                            </span>
                                         
                                        </div>
                                        
                                        <button className="checkout-button">
                                          <FontAwesomeIcon 
                                            icon={faLock} 
                                            style={{height: "14px", margin: "0px 8px 2px 0px"}} 
                                          />
                                          <span>Check out</span>
                                        </button>
                                        
                                        <div className ="protected-section">
                                            <h3>You're protected on Tacco.lk</h3>
                                            <ul className="protection-list">
                                            <li>
                                              <span style={{padding:"0px 5px 0px 0px"}}><img className="badge" style={{width:"23px"}} src={img1} alt="" /></span>
                                                <span >Cash on delivery (COD) Available</span>
                                              </li>
                            
                                              <li>
                                                <span style={{padding:"0px 5px 0px 0px"}}><img className="badge" src={img2} alt="" /></span>
                                                <span >Secure payment</span>
                                                <div className="badges">
                                                  <span><img src={img7} className="badge"/></span>
                                                  <span><img src={img8} className="badge"/></span>
                                                </div>
                                              </li>
                                              <li>
                                              <span style={{padding:"0px 5px 0px 0px"}}><img className="badge" src={img3} alt="" /></span>
                                                <span >Refund and returns</span>
                                              </li>
                            
                                            </ul>

                                        </div>
                                    </div>
                                    {/* <Col>
                                      <div className="order-summary p-3 bg-light rounded">
                                        <h5 style={{padding:"20px 0px 10px 0px"}}>Order Summary ({cart.filter(item => item.selected).length} shoes)</h5>
                                        <p>Subtotal : Rs. {subtotal.toLocaleString(undefined, { 
                                                          minimumFractionDigits: 2, 
                                                          maximumFractionDigits: 2 
                                                        })}
                                        </p>
                                        <p>Delivery Charges : Rs. 400</p>
                                        <p>TOTAL : Rs. 60000</p>

            
                                        <Button color="warning" block>Check out</Button>
                                      </div>
                                    </Col> */}
                                  </Row>
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

export default ShoppingCart;