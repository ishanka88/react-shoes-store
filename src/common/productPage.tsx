import React, { useEffect, useState,useRef,useCallback } from "react";

import img1 from "../assets/img/icon/services1.svg";
import img2 from "../assets/img/icon/services2.svg";
import img3 from "../assets/img/icon/services3.svg";
import img4 from "../assets/img/icon/services4.svg";


import sizechartImage1 from "../assets/img/sizeCharts/sizechart.jpeg";



import { motion } from "framer-motion";
import { Row, Col,Dropdown, DropdownToggle, DropdownMenu, DropdownItem ,Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, FormGroup, Label  } from "reactstrap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"; // Note the /fa6 suffix

import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, doc, getDoc, getDocs, query, where, and,orderBy } from 'firebase/firestore';

import { useLocation } from 'react-router-dom';
import { Product,Media } from "../models/Products";
import { CartItem} from "../models/CartItem";

import SizeChartTopUp from "./elements/sizeChartTopUp"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { UserCartDetails } from "../services/UserCartDetails";



import './productPage.css'
import './index.css'


// Example media imports
import image1 from "./productImages/productimage1.jpeg";
import image2 from "./productImages/productimage2.jpeg";
import image3 from "./productImages/image444.jpeg";
import image4 from "./productImages/image444.jpeg";
import image5 from "./productImages/image444.jpeg";
import image6 from "./productImages/image444.jpeg";
import image7 from "./productImages/productimage1.jpeg";
import image8 from "./productImages/productimage2.jpeg";
import image9 from "./productImages/productimage2.jpeg";
import image10 from "./productImages/productimage2.jpeg";
import { integer } from "aws-sdk/clients/cloudfront";
import { PRODUCTS } from "../dbUtils";
import { db } from "../firebase/firebaseConfig";

// import video1 from "./media/video1.mp4"




interface CustomDropdownProps {
  product: Product;
  onDataChange: (data: [boolean, number]) => void; // Function passed from parent to notify availability and size
}


const CustomDropdown: React.FC<CustomDropdownProps>= ({product,onDataChange}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number>(0);


  const toggle = () => setDropdownOpen((prevState) => !prevState);

  // Example availability function for size 39
  useEffect(() => {
    const isSizeAvailable = () => {
      const availableSizes = product.sizes; // Example list of available sizes
      // Check if availableSizes is defined and the size is available
      if (availableSizes && availableSizes[selectedOption] === 0) {
        onDataChange([false,selectedOption]);
        return false; // Size is available
        
      }
      onDataChange([true,selectedOption]);
      return true; // Size is unavailable
    };
    isSizeAvailable(); // Call the function to check size availability
  }, [selectedOption]); 

  return (
 
        <Dropdown  isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle caret  className="size-toggle">
            {selectedOption===0? "Select":`${selectedOption}`}
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={() => setSelectedOption(0)}>Select</DropdownItem>
            <DropdownItem onClick={() => setSelectedOption(39)}>39</DropdownItem>
            <DropdownItem divider />
            <DropdownItem onClick={() => setSelectedOption(40)}>40</DropdownItem>
            <DropdownItem divider />
            <DropdownItem onClick={() => setSelectedOption(41)}>41</DropdownItem>
            <DropdownItem divider />
            <DropdownItem onClick={() => setSelectedOption(42)}>42</DropdownItem>
            <DropdownItem divider />
            <DropdownItem onClick={() => setSelectedOption(43)}>43</DropdownItem>
            <DropdownItem onClick={() => setSelectedOption(44)}>44</DropdownItem>
            <DropdownItem onClick={() => setSelectedOption(45)}>45</DropdownItem>
          </DropdownMenu>
        </Dropdown>
   
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
            justifyContent: "start",
            alignItems: "center",
            padding: "0px",
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
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0px",
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




/////////////////////////////////////////////////////////////////////////////////////////////////////////////

const ProductPage: React.FC = () => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const location = useLocation();
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [currentChunk, setCurrentChunk] = useState(0);
    const itemsPerPage = 5;
    const [childData, setChildData] = useState<[boolean, number]>(); // State to hold data from the child

    const [items, setItems] = useState<number>(0);



    const productMedia: Media[] = [];

    

    if (product?.mainImages.length >0){
      for (const image of product?.mainImages) {
          productMedia.push({ src: image, type: "image" })
      }
    }
    if (product?.galleryImages.length >0){
      for (const image of product?.galleryImages) {
          productMedia.push({ src: image, type: "image" })
      }
    }

    if (product?.videos.length >0){
      for (const video of product?.videos) {
          productMedia.push({ src: video, type: "video" })
      }
    }


    const imageVariants = {
      exit: { opacity: 0, y: 20, scale: 0.98, transition: { duration: 0.4 } },
      enter: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
    };

    // Pagination handlers
    const handleNextChunk = () => {
      
      if (currentChunk==Math.floor(productMedia.length/itemsPerPage)){
        setCurrentChunk(0);
      }else{
        setCurrentChunk(prev => Math.floor((prev + itemsPerPage)/itemsPerPage));
      }
    };

    const handlePrevChunk = () => {
      if (currentChunk==0){
        setCurrentChunk(prev => Math.floor(productMedia.length/itemsPerPage));
      }else{
        setCurrentChunk(prev => Math.floor(Math.max(prev - itemsPerPage, 0))/itemsPerPage);
      }
    };

    const visibleThumbnails = productMedia.slice(currentChunk*itemsPerPage, (currentChunk*itemsPerPage )+ itemsPerPage);



    const handlePrevious = () => {
      setCurrentMediaIndex((prev) => {
        // Calculate the new index
        let nextIndex = prev === 0 ? productMedia.length - 1 : prev - 1;
    
        const newChunk = Math.floor(nextIndex / itemsPerPage);

        // Update chunk if needed
        if (newChunk !== currentChunk) {
          setCurrentChunk(newChunk);
        }
    
        return nextIndex;
      });
    };
    


    const handleNext = () => {
      setCurrentMediaIndex((prev) => {
        let nextIndex = prev === productMedia.length-1 ? 0 : prev + 1;
    
        const newChunk = Math.floor(nextIndex / itemsPerPage);
        // Update chunk if needed
        if (newChunk !== currentChunk) {
          setCurrentChunk(newChunk);
        }
        
        return nextIndex;
      });
    };

    useEffect(() => {
      const fetchProduct = async () => {
        try{
          const urlParams = new URLSearchParams(location.search);
          const productId = urlParams.get('id');
          
          
          if (productId) {
            try {
              const productRef = doc(db, PRODUCTS, productId);
              const docSnap = await getDoc(productRef);
              
              if (docSnap.exists()) {
                const product = docSnap.data() as Product;
              
                // Add the document ID to the product data
                const productWithId = {
                  productId: docSnap.id,  // Add document ID here
                  ...product,      // Spread the rest of the product data
                };
              
                // Set the product state with the product data including the ID
                setProduct(productWithId);
              }
              
            } catch (error) {
              console.error('Error fetching product:', error);
            }
          }
        } catch (error) {
            console.error('Error fetching product:', error);
            setLoading(false);
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }, [location.search]);

    if (loading){
      return(
        <React.Fragment>
               
                <div className="d-flex justify-content-center" style={{padding:"50px"}}>Loading .....</div>
                
        </React.Fragment>
      ) 
    }

    if (!product){
      return(
  
        <React.Fragment>
                <div className="d-flex justify-content-center" style={{padding:"50px"}}>Product not found.</div>
            </React.Fragment>
      ) 
    }



    const toggleModal = (): void => {
      setModalOpen(!modalOpen);
    };




    // Function to update the state with data from the child
    const handleDataFromChild = ([isAvailable, size]: [boolean, number]) => {

      setChildData([isAvailable, size]); // Update parent state with availability and selected size
    };


    // Function to update the state with data from the child
    const addToCart =async (): Promise<void> => {
      if (items === 0) {
        alert("Please select the size and quantity");
        return; // Early exit if no items to add
      }
      
      try {
        // Fetch the cart asynchronously
        const genaratedCode = product.genaratedCode;
        const quantity = items
        const selectedSize = childData?.[1]
        
        if (!selectedSize|| !genaratedCode){
            alert("Plese select a product with size")
            return;
        }

        const cartList: CartItem[] = await UserCartDetails.getUserCartDetails();  // Get the cart asynchronously

        if (cartList) {

          let itemExists = false;
          // Find the index of the item in the cart by genaratedCode (one pass loop)
          const itemIndex = cartList.findIndex(item => item.genaratedCode === product.genaratedCode);

          if (itemIndex !== -1) {
            // If the item exists, we update it in place
            const existingItem :CartItem = cartList[itemIndex];

            if (!existingItem.sizes) {
              existingItem.sizes = {};  // Initialize sizes if not exists
            }

            // Check and update the size
            if (existingItem.sizes[selectedSize as unknown as number]) {
              // If size exists, update its quantity
              existingItem.sizes[selectedSize as unknown as number] += quantity;
            } else {
              // If size doesn't exist, add it to the sizes object
              existingItem.sizes[selectedSize as unknown as number] = quantity;
            }

            if(existingItem.quantity){
              existingItem.quantity += quantity;
            }else{
              existingItem.quantity = quantity;
            }

            itemExists = true;
          }

          // If the item doesn't exist, add it as a new item
            // If the item doesn't exist, add it as a new item

          if (!itemExists) {
            const newCartItem:CartItem= {
              productId: product.productId,
              itemCode: product.itemCode,
              quantity: items,
              sizes: { [childData?.[1] as unknown as number]: quantity }// Assuming childData is an array and you want to store the second item
            };
            cartList.push(newCartItem); // Add new item to the cart
          }

          // Store the updated cart back (to localStorage or Firestore)
          const updateCart = await UserCartDetails.addUserCartDetails(cartList); // Await the result

          if (updateCart) {
            alert("Added to cart!");
            window.location.reload();
          } else {
            alert("There was an issue while adding to the cart.");
          }

          // Optionally, you could store it in Firestore as well if needed
          // await UserCartDetails.setUserCartDetails(cartList);  // Update Firestore if necessary
        } else {
          alert("No cart data found.");
        }
      } catch (error) {
        console.error("Error adding item to cart:", error);
        alert("An error occurred while updating the cart.");
      }
    };


    return (

              <React.Fragment>
                  <div className="content-wrapper ">
                      <main>

                          <div className="slider-area">
                              <div className="slider-active">
                                  <div className="single-slider hero-overly2  slider-height2 d-flex align-items-center slider-bg2">
                                      <div className="container">
                                          <div className="row">
                                              <div className="col-xl-6 col-lg-8 col-md-8">
                                                  <div className="hero__caption hero__caption2">
                                                      <h1 data-animation="fadeInUp" data-delay=".4s">CODE : {product.itemCode}</h1>
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

                          <div className="d-flex justify-content-center gap-3" style={{marginTop:"50px" , marginBottom:"50px"}}>

                            <div className="product-page " style={ { margin:"5px"}}>

                            {/* Main Content */}
                                <div className="media-container " >
                                  <Row className="d-flex justify-content-center"style={{gap:"20px"}}>
                                    <Col xl={5} lg={5} md={9} sm={9}  xs={10} className="mb-5 mb-lg-0">
                                      <div className="media-viewer">
                                        <div className="media-wrapper">
                                          <motion.div
                                            key={currentMediaIndex}
                                            initial="exit"
                                            animate="enter"
                                            exit="exit"
                                            variants={imageVariants}
                                          >

                                          {productMedia[currentMediaIndex].type === "video" ? (
                                            <video controls className="main-media">
                                              <source 
                                                src={productMedia[currentMediaIndex].src} 
                                                type="video/mp4" 
                                              />
                                            </video>
                                          ) : (
                                            <img 
                                              src={productMedia[currentMediaIndex].src} 
                                              alt="Main product view" 
                                              className="main-media"
                                              
                                            />
                                          )}
                                        </motion.div>
                                        {/* Navigation Arrows */}
                                  
                                        <button 
                                          className="nav-arrow prev-arrow"
                                          onClick={handlePrevious}
                                          aria-label="Previous media"
                                        >
                                          <FontAwesomeIcon icon={faChevronLeft} />
                                        </button>
                                        <button 
                                          className="nav-arrow next-arrow"
                                          onClick={handleNext}
                                          aria-label="Next media"
                                        >
                                          <FontAwesomeIcon icon={faChevronRight} />
                                        </button>
                                      </div>

                                        
                                      <div className="thumbnail-navigation">
                                    
                                        
                                        <div className="thumbnail-grid">
                                          {visibleThumbnails.map((media, index) => {
                                            const globalIndex = currentChunk*itemsPerPage + index;
                                            return (
                                              <div
                                                key={globalIndex}
                                                className={`thumbnail ${globalIndex === currentMediaIndex ? 'active' : ''}`}
                                                onClick={() => setCurrentMediaIndex(globalIndex)}
                                              >
                                                {media.type === "video" ? (
                                                  <div className="video-thumbnail" style={{borderRadius:"10px"}}>
                                                    <span className="play-icon">▶</span>
                                                  </div>
                                                ) : (
                                                  <img 
                                                    src={media.src} 
                                                    alt={`Thumbnail ${globalIndex + 1}`} 
                                                    className="thumbnail-image"
                                                    style={{borderRadius:"10px"}}
                                                  />
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>

                                              {/* Navigation Arrows */}
                                  
                                        <button 
                                          className="nav-arrow prev-arrow thumbnail-arrow"
                                          onClick={handlePrevChunk}
                                          aria-label="Previous media"
                                        >
                                          <FontAwesomeIcon icon={faChevronLeft} />
                                        
                                        </button>
                                        <button 
                                          className="nav-arrow next-arrow thumbnail-arrow"
                                          onClick={handleNextChunk}
                                          aria-label="Next media"
                                        >
                                          <FontAwesomeIcon icon={faChevronRight} />
                                        </button>

                                      </div>
                                      </div>
                                    </Col>



                                    {/* Product Details Column */}
                                    <Col xl={5} lg={5} md={9} sm={10}  xs={10} className="roduct-details">
                                          <Row>
                                              <Col >
                                              
                                                <div className="col2-wrapper w-100 justify-content-start">
                                                  <h4 className="hero-subHeading">SNEAKER COMPANY</h4>
                                                  <h1 className="main-heading w-100">Comfort and Style Combined: The Perfect Everyday Shoe</h1>

                                                  {/* <p className="hero-para">{product.description} </p> */}
                                                  <p className="hero-para">A versatile, stylish shoe designed for comfort and durability. Features a breathable upper, cushioned sole for support, and a trendy design that complements both casual and semi-formal outfits, perfect for daily wear. </p>
                                                  <div className="d-flex align-item-center">
                                                    <div className="d-flex align-item-center ">
                                                      <span className="dollar">
                                                        Rs.&nbsp;
                                                        {product?.price && product?.discount !== undefined
                                                          ? (Number(product.price) * ((100 - Number(product.discount)) / 100)).toLocaleString(undefined, { 
                                                              minimumFractionDigits: 2, 
                                                              maximumFractionDigits: 2 
                                                            })
                                                          : "N/A"}
                                                      </span>
                                                    </div>
                                                    <div className="d-flex  justify-content-start align-item-center " >
                                                      {product.discount===0? "":<span className="discount hero-subHeading " style={{margin:"0px"}}>&nbsp;{product.discount}%</span>}

                                                    </div>
                                                  </div>
                                                  {product.discount!==0?
                                                    <>
                                                      <div className="d-flex justify-content-start" >
                                                          <del className="discount2 hero-para ">Rs. {product.price?.toLocaleString(undefined, { 
                                                                minimumFractionDigits: 2, 
                                                                maximumFractionDigits: 2 
                                                              })}</del>
                                                      </div>
                                                    </>
                                                  
                                                    :
                                                    ""
                                                  }
                                                  <div className="size-component" style={{ marginTop: product.discount!==0 ? "0px" : "15px"}}>
                                                    <Row>
                                                        <Col xxl={7} xl={7} lg={7} md={5} sm={8} xs={10}>
                                                            <SizesComponent product={product}/>
                                                        </Col>
                                                    </Row>
                                                  </div>

                                                  </div>
                                                    <h4 className="hero-para "  style={{ margin: "20px 0px 6px 0px" ,display:"flex",alignItems:"center", gap:"10px"}} >
                                                      <div>
                                                        <span>Size : </span>
                                                      </div>
                                                      <div>
                                                          <span><CustomDropdown product={product} onDataChange={handleDataFromChild}/></span>
                                                      </div>
                                                      
                                                      <div className="d-flex align-item-center" >
                                                          <span className={childData?.[0]? 'hidden':'out-of-stock'} >Out of Stock</span>
                                                      </div>
                                                          
                                
                                                    </h4>
                                                  <div>
                                  
      
                                                  <div  className= {childData?.[0]? `cart2-sec `:` disabled cart2-sec `} style={{ marginTop: "25px" }} >
                                                    <div className="cart2-col cart2-col1">
                                                      <span
                                                        className="minus"
                                                        onClick={() => {
                                                          if(childData?.[1]){
                                                            let count = items - 1;
                                                            if (count < 1) {
                                                              count = 0;
                                                            }
                                                            setItems(count);
                                                          }else{
                                                            alert("Please select a size")
                                                          }
                                                        }}
                                                      ></span>

                                                      <span className="cart2-values">
                                                        {items}
                                                      </span>

                                                      <svg
                                                        onClick={() => {
                                                          if(childData?.[1]){
                                                            let count = items;
                                                            const max  = product.sizes?.[childData?.[1]]|| 0;
                                                            if (items >= max) {
                                                              count = max
                                                              alert("Maximum available quantity reached")
                                                            }else{
                                                              count +=1
                                                            }
                                                            setItems(count);
                                                          }else{
                                                            alert("Please select a size")
                                                          }
                                                        }}
                                                        className="plus"
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
                                                    <div className="cart2-col cart2-col2">
                                                      <button
                                                        className="cart2-btn"
                                                        onClick ={addToCart}
                                                        
                                                      >
                                                        <svg
                                                          className="cart2-main"
                                                          width="22"
                                                          height="20"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                          <path
                                                            d="M20.925 3.641H3.863L3.61.816A.896.896 0 0 0 2.717 0H.897a.896.896 0 1 0 0 1.792h1l1.031 11.483c.073.828.52 1.726 1.291 2.336C2.83 17.385 4.099 20 6.359 20c1.875 0 3.197-1.87 2.554-3.642h4.905c-.642 1.77.677 3.642 2.555 3.642a2.72 2.72 0 0 0 2.717-2.717 2.72 2.72 0 0 0-2.717-2.717H6.365c-.681 0-1.274-.41-1.53-1.009l14.321-.842a.896.896 0 0 0 .817-.677l1.821-7.283a.897.897 0 0 0-.87-1.114ZM6.358 18.208a.926.926 0 0 1 0-1.85.926.926 0 0 1 0 1.85Zm10.015 0a.926.926 0 0 1 0-1.85.926.926 0 0 1 0 1.85Zm2.021-7.243-13.8.81-.57-6.341h15.753l-1.383 5.53Z"
                                                            fill="#FFFFFF"
                                                            fillRule="nonzero"
                                                          />
                                                        </svg>
                                                        <span className="cart2-text">
                                                          Add to cart
                                                        </span>
                                                      </button>
                                                    </div>
                                                  </div>
                                                  <div>
                                                    <span onClick={toggleModal} className="size-chart"  >
                                                      Size chart.
                                                    </span>
                                                    <SizeChartTopUp isOpen={modalOpen} toggle={toggleModal} imageUrl={sizechartImage1} />
                                                  </div>
                                                  <div className="product-details-headline ">
                                                      <h4 className="font-style-heading">Product details :</h4>
                                                  </div>
                                                  <div>
                                                    <Row>
                                                      {product.productDetails && (
                                                        <>
                                                          {/* Column for Feature Names */}
                                                          <Col className="product-details-feature">
                                                            {Object.keys(product.productDetails).map((key, index) => (
                                                              <div key={index}>
                                                                <span>{key}</span>
                                                              </div>
                                                            ))}
                                                          </Col>

                                                          {/* Column for Feature Values */}
                                                          <Col className="product-details-detail">
                                                            {Object.values(product.productDetails).map((value, index) => (
                                                              <div key={index}>
                                                                <span>{value}</span>
                                                              </div>
                                                            ))}
                                                          </Col>
                                                        </>
                                                      )}
                                                    </Row>
                                                  </div>
                                                </div>
                                              </Col>
                                          </Row>
                                  
                                    </Col>
                                  </Row>
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