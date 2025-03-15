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
import { CartItem } from "../models/CartItem";

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

interface ModifiedCartItem {
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


const ShoppingCart: React.FC = () => {
  const { productsList , loading } = useProductData();
  
  const [verticalActiveTabWithIcon, setVerticalActiveTabWithIcon] = useState("1");
  const [availableCartProductsList, setAvailableCartProductsList] = useState<Product[]>([]); // Initialize state


  const [cartListFromDatabase, setCartListFromDatabase] = useState<CartItem[]>([]);
  const [cart, setCart] = useState<ModifiedCartItem[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const [saveButton, setSaveButton] = useState(true);

  useEffect(() => {
    const loadCartData = async () => {
      try {
        const originalCart = await UserCartDetails.getUserCartDetails();
        if (Array.isArray(originalCart) && originalCart.length > 0) {
          // Set the cart data from database
          setCartListFromDatabase(originalCart);

          const modifiedCartItemList: ModifiedCartItem[] = [];
          let isStockMismatchDetected = false; // Flag to track any stock mismatch

          originalCart.forEach((item, index) => {
            if (item.id) {
              const product = findProductById(item.id);

              if (product && product.sizes) {
                const updatedSelectedSizesArray = Object.keys(product.sizes).reduce((acc, size) => {
                  const parsedSize = parseInt(size);
                  const itemQuantity = item.sizes?.[parsedSize] ?? 0;
                  const availableStock = product.sizes ? product.sizes[parsedSize] : 0; 

                  // If item quantity exceeds available stock, update to available stock
                  if (itemQuantity > availableStock) {
                    acc[parsedSize] = availableStock;
                    if (!isStockMismatchDetected) {
                      isStockMismatchDetected = true;
                    }
                  } else {
                    acc[parsedSize] = itemQuantity;
                  }

                  return acc;
                }, {} as { [size: number]: number });

                const totalQuantity = isStockMismatchDetected
                  ? Object.values(updatedSelectedSizesArray).reduce((sum, qty) => sum + qty, 0)
                  : item.quantity || 0;

                const modifiedCartItem: ModifiedCartItem = {
                  id: index + 1, // Use index+1 for unique item IDs (starting from 1)
                  productId: item.id,
                  name: product.name || "",
                  itemCode: item.itemCode || "",
                  mainImage: product.mainImages[0],
                  selectedSizes: updatedSelectedSizesArray,
                  availableSizes: product.sizes,
                  quantity: totalQuantity,
                  price: product.price || 0,
                  discount: product.discount || 0,
                  selected: false,
                };

                modifiedCartItemList.push(modifiedCartItem);
              }
            } else {
              console.warn(`Product with id ${item.id} not found.`);
            }
          });

          if (isStockMismatchDetected) {
            alert('Some selected sizes are out of stock. Your cart has been updated with the available sizes.');
          }

          setCart(modifiedCartItemList);
        } else {
          console.warn("Invalid cart format or empty cart");
        }
      } catch (error) {
        console.error("Error parsing cart data:", error);
      }
    };

    loadCartData(); // Call the async function
  }, [loading]);
  


  // Function to find a product by its ID
  const findProductById = (id: string): Product | undefined => {
    // Find the product in the product list by ID
    const product = productsList.find((product) => product.id === id);
    return product; // This can be undefined if not found
  };
  

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
  
    setAvailableCartProductsList(allProducts);

  }, []); // ✅ Empty array prevents unnecessary re-creation

  // Update cart list
  const updateCartList = () => {
    setCart(prevCart =>
      prevCart.map(cartItem => {
        const product = availableCartProductsList.find(p => p.id === cartItem.productId);

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
    if (availableCartProductsList.length > 0) {
        updateCartList();
    }
   
  }, [availableCartProductsList]); // ✅ Corrected dependency array
  




  const toggleSelect = (id: number) => {
    setCart(cart.map(item => (item.id === id ? { ...item, selected: !item.selected } : item)));
  };

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setCart(cart.map(item => ({ ...item, selected: newSelectAll })));
  };

  const updateQuantity = (id: number, size: number, amount: number) => {
    setSaveButton(false)
    setCart(cart.map(item => {
      if (item.id === id) {
        if ((item.selectedSizes?.[size] === item.availableSizes?.[size])&& amount>0){

          if(item.selectedSizes?.[size]===0){
            alert("Out of stock")
          }else{
            alert("Maximum available quantity reached")
          }
            return item;

        }
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
    acc + (item.price * ((100 - Number(item.discount)) / 100))* Object.values(item.selectedSizes).reduce((sum, qty) => sum + qty, 0), 0
  );

  

  // Helper function to update the cart list with the updated sizes and quantities
  const updateCartWithNewSizes = (cartListFromDatabase: any[], cart: any[]) => {
    return cartListFromDatabase.map((item1) => {
      // Find the matching item in the cart array
      const matchingItem = cart.find((item2) => item1.id === item2.productId);

      // If a match is found, update the sizes and quantities
      if (matchingItem) {
        return {
          ...item1, // Keep the other properties of item1
          sizes: matchingItem.selectedSizes, // Update sizes with the corresponding sizes from cart
          quantity: matchingItem.quantity, // Update quantity
        };
      }
      return item1; // Return the original item if no match is found
    });
  };

  // Function to handle the save cart process
  const saveCart = ()=>{
      const save = async () => {

        // Step 1: Confirm the action before proceeding
        const isConfirmed = window.confirm("Are you sure you want to save the cart?");
        if (!isConfirmed) return; // If not confirmed, exit early

        // Step 2: Update the cart list with the new sizes and quantities
        const updatedCartList = updateCartWithNewSizes(cartListFromDatabase, cart);

        // Step 3: Try to save the updated cart list
        try {
          const response = await UserCartDetails.addUserCartDetails(updatedCartList);

          // Step 4: Handle success or failure
          if (response) {
            alert("Cart successfully saved!");
          } else {
            alert("Error saving the cart. Please try again.");
          }
        } catch (error) {
          // Step 5: Catch any errors and log them
          console.error("Error saving cart:", error);
          alert("An error occurred while saving the cart. Please try again.");
        }

      }
      save()
  };

  const getItemPriceWithDiscount = (item: ModifiedCartItem): number => {
    // Check if price and discount are available and valid
    if (item?.price && item?.discount !== undefined) {
      const discountedPrice = Number(item.price) * ((100 - Number(item.discount)) / 100);
      return discountedPrice
    } 
    return 0; // Return "N/A" if price or discount is not available
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
                                  <div className="d-flex align-items-center justify-content-between mb-0 black-line ">
                                    <div>
                                        <Input
                                          type="checkbox"
                                          checked={selectAll}
                                          onChange={toggleSelectAll}
                                          className="me-2"
                                        />
                                        <span style={{padding:"0px 10px 0px 10px"}}> Select all ({cart.length})</span>
                                    </div>

                                    <div>
                                      <button className ={saveButton? `save-cart-btn disabled `:` save-cart-btn `}  onClick={() => saveCart()}>Save Changes</button>
                                    </div>

                                    
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
                                                      <div className="element-position ">
                                                          <h4 style={{margin: "0px 0px 0px 0px" }}>{item.name}</h4>
                                                      </div>

                                                      <div className="element-position ">
                                                          <p style={{margin: "0px 0px 15px 0px", fontSize:"12px"}}>CODE : {item.itemCode}</p>
                                                      </div>
                                      
                                                      <div>
                                                          <p style={{marginBottom:"1px"}}>
                                                            Rs.&nbsp;
                                                            {isNaN(getItemPriceWithDiscount(item)) || getItemPriceWithDiscount(item) === 0
                                                              ? "N/A"
                                                              : getItemPriceWithDiscount(item).toLocaleString(undefined, { 
                                                                  minimumFractionDigits: 2, 
                                                                  maximumFractionDigits: 2 
                                                                })}
                                                            / Pair 
                                                          </p>
                                                          <p>
                                                            {item.discount === 0 ? "" : `${item.discount}% discount included`}
                                                          </p>
                                                      </div>
                                                      
                                                      <div className="d-flex justify-content-between">
                                                          <p style={{margin:"0px"}}>Quantity : {item.quantity}</p>
                                                          <p style={{ margin: "0px" }}>
                                                            Rs {(getItemPriceWithDiscount(item) * item.quantity).toLocaleString(undefined, { 
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