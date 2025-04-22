import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/img/logo/logo.png";
import logo2 from "../assets/img/logo/logo2.png";
import { RouteName } from "../RouteName";
import { NavLink, useLocation } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

import { CartItem } from "../models/CartItem";
import { Product} from "../models/Products";

import img9 from "../assets/img/gallery/instra2.png";

import "./header.css";
import './index.css'

import { useAuth as clerkUseAuth, useUser as useUserClerk , SignInButton, UserButton } from "@clerk/clerk-react";
import { signInWithCustomToken, signOut as firebaseSignOut,onAuthStateChanged,User } from "firebase/auth";
import {auth} from "../firebase/firebaseConfig"
import { ClipLoader } from 'react-spinners'; // Import the spinner

import { UserDetails } from "../services/UserDetails";
import { UserCartDetails } from "../services/UserCartDetails";

import { useProductData } from '../context/DataContext';



interface DisplayCartItem {
  id?: any;
  title?: string;
  mainImage?: any;
  category?: string;
  itemCode?: string;
  price?: number;
  discount?: number; // Change float to number
  sizes?: { [size: number]: number }; // Store sizes with their stock
  quantity?: number
}


const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const myRef = useRef<HTMLDivElement | null>(null); // Ref for cart items display
  
  const [cartList, setCartList] = useState<DisplayCartItem[]>([]);

  const { productsList , loading } = useProductData();


// Destructuring the values returned from the `useAuth()` and `useUser()` hooks
// Cleark
  const { isLoaded:isLodedClerk, isSignedIn: isSignedInClerk, signOut:signOutClerk ,getToken} = clerkUseAuth() 
  const { user:userClerk} = useUserClerk() 

// Firebase
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null); // State can be a User or null
  const [firebaseLoading, setFirebaseLoading] = useState(true); // State to handle loading state

  useEffect(() => {
    // Set up an observer to listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user); // Set the user object when auth state changes
      setFirebaseLoading(false); // Turn off loading once we have the user data
    });

    // Cleanup observer on unmount
    return () => unsubscribe();
  }, []);


  useEffect(() => {
    const syncAuthState = async () => {

      if (!auth || !isLodedClerk || !firebaseLoading) return;

      if (isSignedInClerk) {
        try {
          // Get Clerk session token
          const token = await getToken({ template: 'integration_firebase' })

          if (token !== null) {
            try {
              const userCredential = await signInWithCustomToken(auth, token);
              if (userCredential){
                console.log("Firebase signed in:", userCredential.user.uid);
             
              }
            } catch (err) {
              console.error("Firebase sign-in error:", err);
            }
          } else {
            console.error("Token is null. Cannot sign in.");
          }
        } catch (err) {
          console.error("Firebase sign-in error:", err);
        }
      } else {
        // Sign out from Firebase when Clerk session ends
          if(firebaseUser){
            await firebaseSignOut(auth).then(() => {
              console.log("Firebase signed out");
            });
          }

      }
    };

    syncAuthState();
  }, [isSignedInClerk, userClerk, auth,firebaseUser]);



  useEffect(() => {
    const handleSignOut = async () => {
      if (!isSignedInClerk ) {
        await Promise.all([
          firebaseSignOut(auth)
        ]);
      }
    };
    handleSignOut();
  }, [isSignedInClerk, signOutClerk, auth]);




// Function to load list from localStorage
const loadCartData = async () => {
  try {
    // Assuming `UserCartDetails.getUserCartDetails()` retrieves data, possibly from localStorage or an API.
    const cartList:CartItem[] = await UserCartDetails.getUserCartDetails();
    
    if (cartList) {
      const displayCartList: DisplayCartItem[] = [];
      
      // Iterate over cart items and create the display cart items
      for (const item of cartList) {
        if (item.productId){
          const product = findProductById(item.productId);
          // Handle case when product is not found
          if (product) {
            const cartItem: DisplayCartItem = {
              id: product.productId,
              title: product.name,
              mainImage: product.mainImages[0], // Assuming the main image is at index 0
              category: product.category,
              itemCode: product.itemCode,
              price: product.price,
              discount: product.discount, // Discount in percentage
              sizes: item.sizes,
              quantity: item.quantity, // How many units of this item in the cart
            };
  
            // Push the constructed cartItem into the displayCartList
            displayCartList.push(cartItem);
          }
        } else {
          console.warn(`Product with id ${item.productId} not found.`);
        }
      }

      // Set the cart data to state
      setCartList(displayCartList);
    }
  } catch (error) {
    console.error('Error loading cart data:', error);
  }
};

// Function to find a product by its ID
const findProductById = (id: string): Product | undefined => {
  // Find the product in the product list by ID
  const product = productsList.find((product) => product.productId === id);
  return product; // This can be undefined if not found
};



  //   // Function to remove an item from the cart by its id
  // const removeFromCart = (id: string) => {
  //   const updatedCart = cartList.filter(item => item.id !== id); // Filter out the item with the given id
  //   setCartList(updatedCart); // Update the state with the new cart list

  //   if(!isSignedInClerk){
  //     localStorage.setItem('myCartList', JSON.stringify(updatedCart)); // Update localStorage
  //   }else{

  //   }
  // };


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

  useEffect(() => {
    if(!loading){
      loadCartData()
    }
  }, [loading]);



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

                                <div className="cart-sec remove-small "
                                     style={{ padding: '0px 50px 0px 0px' }}>
                                    <div
                                        className="cart-parent d-flex align-items-center "
                                        onClick={() => {
                                          loadCartData();
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
                                      {!isLodedClerk ? ( 
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '25px' }}>
                                        <ClipLoader size={25} color={"#36d7b7"} loading={true} />
                                        </div>
                                      ):(
                                          <nav>
                                            <ul style={{ display: "flex", listStyleType: "none" }}>
                                              <li style={{ marginRight: "15px" }}>
                                                {/* Show SignInButton when the user is signed out */}
                                                {isSignedInClerk ? (
                                                  <div>
                                                    <UserButton
                                                      appearance={{
                                                        elements: {
                                                          formButtonPrimary: {
                                                            width: '50px',
                                                            height: '50px',
                                                            fontSize: '24px', // Optional, increase text size inside the button
                                                          },
                                                        },
                                                      }}
                                                    />
                                                  </div>
                                                ) : (
                                                  <SignInButton>Sign In</SignInButton>
                                                )}
                                              </li>
                                            </ul>
                                          </nav>
                                      )}
                                        {/* <img className="header-img d-flex align-items-center" src={img9} alt="img" /> */}
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
                                            <div>
                                                <div className="cart-sec d-flex justify-element-between w-100"
                                                      style={{ padding: '0px 50px 0px 0px' }}>
                                                      <div
                                                          className="cart-parent d-flex align-items-center "
                                                          onClick={() => {

                                                          loadCartData();
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
                                                        {!isLodedClerk ? ( 
                                                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '25px' }}>
                                                          <ClipLoader size={25} color={"#36d7b7"} loading={true} />
                                                          </div>
                                                        ):(
                                                            <nav>
                                                              <ul style={{ display: "flex", listStyleType: "none" }}>
                                                                <li style={{ marginRight: "15px" }}>
                                                                  {/* Show SignInButton when the user is signed out */}
                                                                  {isSignedInClerk ? (
                                                                    <div>
                                                                      <UserButton
                                                                        appearance={{
                                                                          elements: {
                                                                            formButtonPrimary: {
                                                                              width: '50px',
                                                                              height: '50px',
                                                                              fontSize: '24px', // Optional, increase text size inside the button
                                                                            },
                                                                          },
                                                                        }}
                                                                      />
                                                                    </div>
                                                              ) : (
                                                                    <SignInButton >Sign In</SignInButton>
                                                                  )}
                                                                </li>
                                                              </ul>
                                                            </nav>
                                                        )}
                                                          {/* <img className="header-img d-flex align-items-center" src={img9} alt="img" /> */}
                                                      </div>
                                                  </div>
                                            </div>
                                          
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
                        {cartList.map((item: DisplayCartItem, index: number) => (
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
