import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/img/logo/logo.png";
import logo2 from "../assets/img/logo/logo2.png";
import { RouteName } from "../RouteName";
import { NavLink, useLocation } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

import { CartItem } from "../models/CartItem";

import img9 from "../assets/img/gallery/instra2.png";

import "./header.css";
import './index.css'

const sampleCartItems: CartItem[] = [
    {
      id: "1",
      title: "Fall Limited Edition Sneakers",
      mainImage: "https://tacco.s3.amazonaws.com/taccoImages/WhatsApp%20Image%202025-02-12%20at%209.58.40%20AM.jpeg",
      category: "Footwear",
      itemCode: "FL-12345",
      price: 6500.00,
      discount: 20, // Discount in percentage
      sizes: {
        38: 5, // Size 38 with 5 units in stock
        39: 3, // Size 39 with 3 units in stock
        40: 7, // Size 40 with 7 units in stock
      },
      quantity: 1, // How many units of this item in the cart
    },
    {
      id: "2",
      title: "Blue Casual T-Shirt",
      mainImage: "https://tacco.s3.amazonaws.com/taccoImages/WhatsApp%20Image%202025-02-12%20at%209.58.40%20AM.jpeg",
      category: "Clothing",
      itemCode: "BC-98765",
      price: 2500.00,
      discount: 10,
      sizes: {
        "39": 10, // Size S with 10 units in stock
        "40": 8,  // Size M with 8 units in stock
        "41": 4,  // Size L with 4 units in stock
      },
      quantity: 2,
    },
    {
      id: "3",
      title: "Classic Denim Jeans",
      mainImage: "https://tacco.s3.amazonaws.com/taccoImages/WhatsApp%20Image%202025-02-12%20at%209.58.40%20AM.jpeg",
      category: "Clothing",
      itemCode: "CD-67890",
      price: 4000.00,
      discount: 15,
      sizes: {
        30: 12, // Size 30 with 12 units in stock
        32: 9,  // Size 32 with 9 units in stock
        34: 6,  // Size 34 with 6 units in stock
      },
      quantity: 1,
    }
      
    ]
  
  

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const myRef = useRef<HTMLDivElement | null>(null); // Ref for cart items display




  const [cartList, setCartList] = useState<CartItem[]>([]);

  // Function to load list from localStorage
  const loadFromLocalStorage = () => {

        setCartList(sampleCartItems)
    
    //   const savedList = localStorage.getItem('mycartList');
    //   console.log(savedList)
    //   if (savedList) {
    //     setCartList(JSON.parse(savedList));
    //   }
    };


    // Function to remove an item from the cart by its id
  const removeFromCart = (id: string) => {
    const updatedCart = cartList.filter(item => item.id !== id); // Filter out the item with the given id
    setCartList(updatedCart); // Update the state with the new cart list
    localStorage.setItem('myCartList', JSON.stringify(updatedCart)); // Update localStorage
  };

  // Load list from localStorage when component mounts
  useEffect(() => {
      loadFromLocalStorage();
    }, []);


  // Refs with specific types (for DOM elements like divs or spans)
  const myRef1 = useRef<HTMLDivElement | null>(null);
  const myRef2 = useRef<HTMLDivElement | null>(null);
  const myRef3 = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);



  useEffect(() => {
    if (cartList.length === 0) {
      if (myRef1.current) myRef1.current.style.display = "none";
      if (myRef2.current) myRef2.current.style.display = "none";
      if (myRef3.current) myRef3.current.style.display = "block";
    } else {
      if (myRef1.current) myRef1.current.style.display = "flex";
      if (myRef2.current) myRef2.current.style.display = "block";
      if (myRef3.current) myRef3.current.style.display = "none";
    }
  }, [cartList]); // Adding cart as a dependency for the effect




  // Close menu when route changes or on initial load
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        !(e.target as Element).closest(".mobile-menu") &&
        !(e.target as Element).closest(".hamburger-icon")
      ) {
        setIsMenuOpen(false);
      }

      if (
        !(e.target as Element).closest(".cart-sec")
      ) {
        const cartBox = document.querySelector(
            ".cart-box"
        ) as HTMLElement; // Casting as HTMLElement

        if (cartBox) {
            cartBox.classList.remove("cart-box-toggle");
        }
      }

      
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Update visibility of cart notification based on cartItems prop
  useEffect(() => {
    if (myRef.current) {
      if (cartList.length === 0) {
        myRef.current.style.display = "none";
      } else {
        myRef.current.style.display = "block";
      }
    }
  }, [cartList]);

  return (
    <React.Fragment>
      <div className="content-wrapper">
        <header>
          <div className="header-area">
            <div className="main-header header-sticky">
              <div className="container-fluid">
                <div className="row menu-wrapper align-items-center justify-content-between">

                  {/* Desktop Left Section (unchanged) */}
                  <div className="header-left d-flex align-items-center w-100">
                    <div className="logo">
                      <a href="index-2.html">
                        <img src={logo} alt="Logo" />
                      </a>
                    </div>
                    <div className="logo2">
                      <a href="index-2.html">
                        <img src={logo2} alt="Secondary Logo" />
                      </a>
                    </div>

                    <div className="d-flex justify-content-between w-100">
                            <div className="d-flex justify-content-between w-100 "
                                    style={{ padding: '0px 0px 0px 150px' }}>
                                <div className="main-menu d-none d-lg-block">
                                    <nav>
                                    <ul id="navigation">
                                        <li>
                                        <NavLink to={RouteName.MAIN}>Home</NavLink>
                                        </li>
                                        <li>
                                        <NavLink to={RouteName.PRODUCTS}>Products</NavLink>
                                        </li>
                                        <li>
                                        <NavLink to={RouteName.ABOUT}>About</NavLink>
                                        </li>
                                        <li>
                                        <NavLink to={RouteName.CONTACT}>Contact</NavLink>
                                        </li>
                                    </ul>
                                    </nav>
                                </div>

                                <div className="cart-sec"
                                        style={{ padding: '0px 50px 0px 0px' }}>
                                    <div
                                        className="cart-parent d-flex align-items-center "
                                        onClick={() => {
                                        const cartBox = document.querySelector(
                                            ".cart-box"
                                        ) as HTMLElement; // Casting as HTMLElement

                                        if (cartBox) {
                                            cartBox.classList.toggle("cart-box-toggle");
                                        }
                                        }}
                                    >
                                        <span ref={myRef} className="cart-notification ">
                                        {cartList.length}
                                        </span>
                                        <svg
                                        className="cart"
                                        width="25"
                                        height="25"
                                        xmlns="http://www.w3.org/2000/svg"
                                        >
                                        <path
                                            d="M20.925 3.641H3.863L3.61.816A.896.896 0 0 0 2.717 0H.897a.896.896 0 1 0 0 1.792h1l1.031 11.483c.073.828.52 1.726 1.291 2.336C2.83 17.385 4.099 20 6.359 20c1.875 0 3.197-1.87 2.554-3.642h4.905c-.642 1.77.677 3.642 2.555 3.642a2.72 2.72 0 0 0 2.717-2.717 2.72 2.72 0 0 0-2.717-2.717H6.365c-.681 0-1.274-.41-1.53-1.009l14.321-.842a.896.896 0 0 0 .817-.677l1.821-7.283a.897.897 0 0 0-.87-1.114ZM6.358 18.208a.926.926 0 0 1 0-1.85.926.926 0 0 1 0 1.85Zm10.015 0a.926.926 0 0 1 0-1.85.926.926 0 0 1 0 1.85Zm2.021-7.243-13.8.81-.57-6.341h15.753l-1.383 5.53Z"
                                            fill="#69707D"
                                            fillRule="nonzero"
                                        />
                                        </svg>
                                    </div>
                                    <div>
                                        <img className="header-img d-flex align-items-center" src={img9} alt="img" />
                                    </div>
                                </div>

                            </div>

                            <div className="d-flex  ">
                                <div>
                                    {/* Mobile Hamburger Icon */}
                                    <div className="d-block d-lg-none ">
                                        <button
                                            className="hamburger-icon"
                                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                                            aria-label="Toggle menu"
                                            aria-expanded={isMenuOpen}
                                            >
                                            <svg viewBox="0 0 100 80" width="30" height="30">
                                                <rect width="100" height="10" rx="5"></rect>
                                                <rect y="30" width="100" height="10" rx="5"></rect>
                                                <rect y="60" width="100" height="10" rx="5"></rect>
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Mobile Menu Overlay */}

                                    <div  className={`mobile-menu d-block d-lg-none ${isMenuOpen ? "open" : ""}`}> 
                                        <div>
                                            <nav>
                                            <ul>
                                                <li>
                                                <NavLink to={RouteName.MAIN} onClick={() => setIsMenuOpen(false)}>
                                                    Home
                                                </NavLink>
                                                </li>
                                                <li>
                                                <NavLink to={RouteName.PRODUCTS} onClick={() => setIsMenuOpen(false)}>
                                                    Products
                                                </NavLink>
                                                </li>
                                                <li>
                                                <NavLink to={RouteName.ABOUT} onClick={() => setIsMenuOpen(false)}>
                                                    About
                                                </NavLink>
                                                </li>
                                                <li>
                                                <NavLink to={RouteName.CONTACT} onClick={() => setIsMenuOpen(false)}>
                                                    Contact
                                                </NavLink>
                                                </li>
                                            </ul>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            </div>

                    </div>

                  </div>

                </div>
              </div>
            </div>
          </div>
        </header>


        {/* Cart element*/}
        <div ref={shadowRef} className="shadow "></div>
        <div className="cart-box ">
                                        
                <div className=" d-flex justify-content-between cart-para cart-heading">
                    <div className=""  style={{padding:"0px 15px 0px 6px"}}>
                        Cart
                        
                    </div>
                    <div style={{padding:"0px 15px 0px 0px"}}>
                       {cartList.length} - Items
                       
                    </div>
                </div>
                <hr className="cart-hr" />

                <p ref={myRef3} className="cart-para empty-para" style={{padding:"20px 0px 0px 0px"}}>
                Your cart is empty.
                </p>
                <div ref={myRef1} className="cart-item-div">
                    <div className="w-100">
                        {cartList.map((item: CartItem, index: number) => (
                            <div key={item.id} className="d-flex justify-content-between align-items-center w-100" style={{padding:"10px 3px 0px 3px"}}> {/* Add key to each item for efficient re-renders */}
                                <div className="d-flex" style={{padding:"0px 10px 0px 0px"}} >{index + 1}</div>
                                <div className="cart-item-col1">
                                    <img src={item.mainImage} className="thumbnail-image" style={{borderRadius:"5px"}} />
                                </div>
                                <div className="cart-item-col2 " style={{padding:"0px 0px 0px 10px"}}>
                                    <div className="cart-para">
                                        {item.title}
                                    </div>
                                    <div className="">
                                        {"Rs. "}{item.price} x {item.quantity}{" = "}
                                        <span className="item-amount" >  Rs. {(item.price && item.quantity ? item.price * item.quantity : 0).toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="cart-item-col3">
                                    <svg
                                    className="cart-del"
                                    onClick={() => {
                                        // Function to handle item removal, can call removeFromCart function here
                                        removeFromCart(item.id);
                                    }}
                                    width="14"
                                    height="16"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    >
                                    <defs>
                                        <path
                                        d="M0 2.625V1.75C0 1.334.334 1 .75 1h3.5l.294-.584A.741.741 0 0 1 5.213 0h3.571a.75.75 0 0 1 .672.416L9.75 1h3.5c.416 0 .75.334.75.75v.875a.376.376 0 0 1-.375.375H.375A.376.376 0 0 1 0 2.625Zm13 1.75V14.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 1 14.5V4.375C1 4.169 1.169 4 1.375 4h11.25c.206 0 .375.169.375.375ZM4.5 6.5c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Z"
                                        id="a"
                                        />
                                    </defs>
                                    <use fill="#C3CAD9" fillRule="nonzero" xlinkHref="#a" />
                                    </svg>
                                </div>
                                
                            </div>
                        ))}


                    </div>
                </div>
                <div ref={myRef2} className="checkout-div" style={{padding:"10px"}}>
                    <button className="checkout-btn"   onClick={() => window.open("./cart", "_blank")}>checkout</button>
                </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Header;
