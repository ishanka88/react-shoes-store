import React, { useState, useEffect } from "react";
import { Button, Modal, Form, FormFeedback, Input, UncontrolledTooltip, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';
import { Product } from "../models/Products";
import { toast } from "react-toastify";
import { AdminService } from "../services/AdminService";
import 'react-toastify/dist/ReactToastify.css';
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc , writeBatch, query, orderBy} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { CUSTOMERS, PRODUCTS, CONTACTUS } from "../dbUtils";
import Swal from "sweetalert2";
import { DragDropContext, Droppable, Draggable ,DropResult,DroppableProps} from 'react-beautiful-dnd';

import{db} from "../firebase/firebaseConfig"

// AWS S3 SDK setup
import AWS from 'aws-sdk';

// Initialize AWS S3
AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,  // Store in environment variables
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,  // Store in environment variables
    region: "us-east-1", // or your region
});

const s3 = new AWS.S3();



const generateItemCode = (): string => {
    const randomNumbers = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // Random three-digit number
    const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Random letter (A-Z)
    return `${randomLetter}${randomNumbers}`;
};


// Function to get the download URL for a file from S3
const getS3DownloadUrl = async (imageUrl: string): Promise<string> => {
  const params = {
    Bucket: 'tacco', // Replace with your S3 bucket name
    Key: `products/${imageUrl}`, // Path to the file (adjust according to your structure)
    Expires: 60 * 5, // Expiry time in seconds (e.g., 5 minutes)
  };

  try {
    // Get the signed URL for the S3 object
    const signedUrl = await s3.getSignedUrlPromise('getObject', params);
    console.log("S3 Download URL:", signedUrl);
    return signedUrl;
  } catch (error) {
    console.error("Error getting download URL from S3:", error);
    throw error;
  }
};


export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
    const [enabled, setEnabled] = useState(false);
  
    useEffect(() => {
      const animation = requestAnimationFrame(() => setEnabled(true));
  
      return () => {
        cancelAnimationFrame(animation);
        setEnabled(false);
      };
    }, []);
  
    if (!enabled) {
      return null;
    }
  
    return <Droppable {...props}>{children}</Droppable>;
  };

const AddProducts: React.FC = () => {
    const [modal_center, setModalCenter] = React.useState(false);
    const [itemCode, setItemCode] = useState<string>(generateItemCode());
    const [mainImageFiles, setMainImageFiles] = useState<FileList | null>(null);
    const [galleryImageFiles, setGalleryImageFiles] = useState<FileList | null>(null);
    const [product, setProduct] = useState<Product>({} as Product);
    const [products, setProducts] = useState<Product[]>([]);
    const [sizes, setSizes] = useState({
        sizesList: { 39: 0, 40: 0, 41: 0, 42: 0, 43: 0, 44: 0, 45: 0 }, // Initialize sizes
        // other fields
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editedProduct, setEditedProduct] = useState<Product | null>(null);
    const colorOptions = [
        { value: '#FF0000', label: 'Red' },
        { value: '#00FF00', label: 'Green' },
        { value: '#0000FF', label: 'Blue' },
        { value: '#FFFF00', label: 'Yellow' },
        { value: '#FF00FF', label: 'Magenta' },
        { value: '#00FFFF', label: 'Cyan' },
        { value: '#000000', label: 'Black' },
        { value: '#FFFFFF', label: 'White' },
        // Add more color options as needed
    ];
    function togCenterReview() {
        setModalCenter(!modal_center);
    }

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setMainImageFiles(e.target.files);
        }
    };
    const handleGalleryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setGalleryImageFiles(e.target.files);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true); // Set loading to true while fetching data
        try {
            // Create a query to get products ordered by 'displayOrder'
            const productsQuery = query(collection(db, 'Products'), orderBy('displayOrder'));
    
            const querySnapshot = await getDocs(productsQuery); // Get the documents based on the query
            const fetchedProducts: Product[] = [];
    
            querySnapshot.forEach((doc) => {
                const productData = doc.data();
                const mainImages: string[] = [];
                
                // Assuming mainImages is an array, you can process it like this:
                if (productData.mainImages && Array.isArray(productData.mainImages)) {
                    mainImages.push(...productData.mainImages);
                }
    
                // Add the product data to the list of fetched products
                fetchedProducts.push({
                    id: doc.id,
                    ...productData,
                    mainImages,
                });
            });
    
            // Set the fetched products into state
            setProducts(fetchedProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false); // Set loading to false after fetching is complete

        }
    };
    



    const addProduct = async () => {

        let sumOfStock=0;

        if (!product?.category) {
            Swal.fire({
                icon: "error",
                title: "Product category required",
                confirmButtonColor: "#FD7F00",
            });
            setIsSubmitButtonDisabled(false)
            return
        } else if (!product?.description) {
            Swal.fire({
                icon: "error",
                title: "Product description required",
                confirmButtonColor: "#FD7F00",
            });
            setIsSubmitButtonDisabled(false)
            return

        } else if (!product?.price) {
            Swal.fire({
                icon: "error",
                title: "Product price required",
                confirmButtonColor: "#FD7F00",
            });
            setIsSubmitButtonDisabled(false)
            return
        } else if (product?.discount !== 0 && !product?.discount) {
                Swal.fire({
                    icon: "error",
                    title: "Product discout required.If dont then enter 0",
                    confirmButtonColor: "#FD7F00",
                });
                setIsSubmitButtonDisabled(false)
                return

        } else if (!product?.itemCode) {
            Swal.fire({
                icon: "error",
                title: "Product title required",
                confirmButtonColor: "#FD7F00",
            });
            setIsSubmitButtonDisabled(false)
            return
        
        } else if (!sizes) {
            Swal.fire({
                icon: "error",
                title: "size error",
                confirmButtonColor: "#FD7F00",
            });
            setIsSubmitButtonDisabled(false)
            return
        
        } else if (sizes) {
            const allSizeifsAreZero = Object.values(sizes.sizesList).every(value => value === 0);
            if (allSizeifsAreZero) {
                Swal.fire({
                    icon: "error",
                    title: "Add Sizes",
                    confirmButtonColor: "#FD7F00",
                });
                setIsSubmitButtonDisabled(false)
                return
            } else {
                 // Calculate the total stock (sum of non-zero values)
                sumOfStock = Object.values(sizes.sizesList)
                .filter(value => value > 0) // Filter out zero stock values
                .reduce((total, currentValue) => total + currentValue, 0); // Sum the remaining values
                
            }
        }


                
        if (mainImageFiles ===null|| mainImageFiles.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Main Images required",
                confirmButtonColor: "#FD7F00",
            });
            setIsSubmitButtonDisabled(false)
            return
        
        } else if (!galleryImageFiles || galleryImageFiles.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Gallery Images required",
                confirmButtonColor: "#FD7F00",
                
            });
            setIsSubmitButtonDisabled(false)
            return

        } else {
            const mainImageUrls: string[] = [];
            const galleryImageUrls: string[] = [];
            if (mainImageFiles) {
                for (let i = 0; i < mainImageFiles.length; i++) {
                  const file = mainImageFiles[i];
            
                  // Create a unique key for each file, or use the file name
                  const s3Key = `taccoImages/${file.name}`;
            
                  const params = {
                    Bucket: 'tacco', // Replace with your bucket name
                    Key: s3Key,  // The file path in the S3 bucket
                    Body: file,  // The actual file content
                    ContentType: file.type,  // File type (MIME type)
                  };
            
                  try {
                    console.log("Uploading to S3...");
            
                    // Upload the file to S3
                    const uploadResult = await s3.upload(params).promise();
                    console.log("Upload successful", uploadResult);
            
                    // Push the S3 URL (or other metadata) to imageUrls
                    mainImageUrls.push(uploadResult.Location);
                  } catch (error) {
                    console.error("Error uploading file to S3", error);
                  }
                }
              }

              if (galleryImageFiles) {
                for (let i = 0; i < galleryImageFiles.length; i++) {
                 
                  const file = galleryImageFiles[i];
            
                  // Create a unique key for each file, or use the file name
                  const s3Key = `taccoImages/${file.name}`;
            
                  const params = {
                    Bucket: 'tacco', // Replace with your bucket name
                    Key: s3Key,  // The file path in the S3 bucket
                    Body: file,  // The actual file content
                    ContentType: file.type,  // File type (MIME type)
                  };
            
                  try {
                    console.log("Uploading to S3...");
            
                    // Upload the file to S3
                    const uploadResult = await s3.upload(params).promise();
                    console.log("Upload successful", uploadResult);
            
                    // Push the S3 URL (or other metadata) to imageUrls
                    galleryImageUrls.push(uploadResult.Location);
                  } catch (error) {
                    console.error("Error uploading file to S3", error);
                  }
                }
              }


            const updatedProduct: Product = {
                category: product?.category,
                description: product?.description,
                genaratedCode: itemCode,
                price: product?.price,
                discount: product?.discount,
                rating: 0,
                stock: sumOfStock,
                itemCode: product?.itemCode,
                mainImages: mainImageUrls,
                galleryImages: galleryImageUrls,
                sizes:sizes.sizesList,

            }


            AdminService.addProduct(updatedProduct).then(res => {
                setIsSubmitButtonDisabled(false)
                setModalCenter(false);
                window.location.reload(); 
            });

            
        }
        setIsSubmitButtonDisabled(false)
    }

    const deleteProduct = async (itemCode: any) => {
        // Ask for confirmation
        const confirmed = window.confirm("Are you sure you want to Delete this product?");
        
        if (confirmed) {
          try {
            console.log("itemCode", itemCode);
            
            // Proceed with the deletion
            await deleteDoc(doc(db, PRODUCTS, itemCode));
            fetchProducts(); // Refresh product list after deletion
          } catch (error) {
            console.error("Error deleting product: ", error);
          }
        } else {
          console.log("Product deletion was cancelled");
        }
      };
      

    const openEditModal = (product: Product) => {
        setIsButtonDisabled(false)
        setEditedProduct(product);
        setEditModalOpen(true);
    };

    const updateProduct = async (updatedProductId: any) => {
          
        const updatedProduct: any = {
            description: editedProduct?.description,
            price: editedProduct?.price,
            rating: 0,
            stock: editedProduct?.stock,
            title: editedProduct?.itemCode,
            discount: editedProduct?.discount,
            sizes: editedProduct?.sizes,

        }
        try {
            await updateDoc(doc(db, PRODUCTS, updatedProductId), updatedProduct);
            setEditModalOpen(false);
            fetchProducts(); // Refresh product list after update
        } catch (error) {
            console.error("Error updating product: ", error);
        }
    };

    const updateStock = async (editedProduct: Product) => {
 
        try {
            let newStock = 0;
            for (let size in editedProduct?.sizes) {
              const numericSize = parseInt(size, 10); // Convert the size string to an integer 
              // Access the numeric value for the current size and add it to newStock
              newStock += editedProduct?.sizes[numericSize]; // Use the integer value for size
            }
            editedProduct.stock = newStock
            return
        } catch (error) {
            console.error("Error updating product: ", error);
        }
    };

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);


    const [isSaveProductOrderDisabled, setIsSaveProductOrderDisabled] = useState(true);
    
    // Handle when the user finishes a drag operation
    const handleDragEnd = (result:DropResult) => {
        const { source, destination } = result;

        setIsSaveProductOrderDisabled(false)

        if (!destination) return; // Dropped outside of the droppable area

        // Reorder the products array based on the drag result
        const reorderedProducts = Array.from(products);
        const [removed] = reorderedProducts.splice(source.index, 1);
        reorderedProducts.splice(destination.index, 0, removed);

        // Update displayOrder for each product
        reorderedProducts.forEach((product, index) => {
        product.displayOrder = index + 1; // New display order
        });

        // Update the state with the reordered products
        setProducts(reorderedProducts);
    };


    const saveProductOrder = async (reorderedProducts: Product[]) => {
        try {
          
          const batch = writeBatch(db); // Use batch for atomic updates
      
          reorderedProducts.forEach((product) => {
            const productRef = doc(db, 'Products', product.id!); // 'products' collection, itemCode as the document ID
            batch.update(productRef, { displayOrder: product.displayOrder });
          });
      
          await batch.commit();
          alert('Products saved successfully');
        } catch (error) {
          console.error('Error saving products to Firestore:', error);
          alert('Error saving products');
        }
      };

    const saveDragList = () => {
        // Save the updated product order to Firestore
        saveProductOrder(products);
        setIsSaveProductOrderDisabled(true)
      };


    return (
        <React.Fragment>
            <div className="content-wrapper ">
                <main>
                    <div className="container">
                        <div className="row row--30">
                            <div className="col-lg-12">
                                <div className="course-sidebar-3 sidebar-top-position">
                                    <Row>
                                    <Col xl={12}>

                                        <div className="flex " style={{ gap: '5px' , padding:'20px',justifyContent: 'flex-end'}}>
                                            <button hidden={isSaveProductOrderDisabled} 
                                                    type="button" name="save-draglist-button"
                                                    className="edit-button" 
                                                    onClick={() => saveDragList()}>Save</button>
                                            <button type="button" 
                                                    style={{ backgroundColor: "green"}} 
                                                    className="edit-button" 
                                                    onClick={() => togCenterReview()}>Create Product</button>
                                        </div>
                                    
                                    </Col>

                                        
                                    </Row>
                                    <div style={{ paddingBottom: '100px' }} className="edu-course-widget widget-course-summery" >
                                        <h2 className="acc mb-4 pl-2 mt-5">Products</h2>

                                        {products !== undefined && products.length > 0 ? (
                                            <>
                                                <DragDropContext onDragEnd={handleDragEnd}>
                                                <StrictModeDroppable droppableId="droppable">
                                                    {(provided) => (
                                                    <table className="table" {...provided.droppableProps} ref={provided.innerRef}>
                                                        <thead>
                                                        <tr>
                                                            <th>Position</th>
                                                            <th>Title</th>
                                                            <th>Category</th>
                                                            <th>Item Code</th>
                                                            <th>Description</th>
                                                            <th>Price</th>
                                                            <th>Discount</th>
                                                            <th>Stock</th>
                                                            <th>Images</th>
                                                            <th>Action</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {products.map((product, index) => (
                                                            <Draggable key={product.id as any} draggableId={product.id as any} index={index}>
                                                                {(provided) => (
                                                                    <tr
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    style={{
                                                                        ...provided.draggableProps.style,
                                                                        cursor: 'move',
                                                                    }}
                                                                    >
                                                                    <td style={{ fontWeight: 'bold' }}>
                                                                        {product.displayOrder}
                                                                    </td>
                                                                    <td>{product.itemCode}</td>
                                                                    <td>{product.category}</td>
                                                                    <td>{product.genaratedCode}</td>
                                                                    <td>{product.description}</td>
                                                                    <td>Rs.{product.price}</td>
                                                                    <td>{product.discount} %</td>
                                                                    <td>{product.stock}</td>
                                                                    <td>
                                                                        <img
                                                                        src={product.mainImages[0]}
                                                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                                        alt={product.itemCode}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <div className="flex">
                                                                            <button type="button"
                                                                                    className="delete-button" onClick={() => deleteProduct(product.id)}>Delete</button>
                                                                            <button type="button"
                                                                                    className="edit-button" onClick={() => openEditModal(product)}>Edit</button>
                                                                        </div>
                                                                    </td>
                                                                    </tr>
                                                            )}
                                                            </Draggable>
                                                        ))}
                                                        </tbody>
                                                    </table>
                                                    )}
                                                </StrictModeDroppable>
                                                </DragDropContext>

                                            </>
                                        ) : (
                                            loading ? (
                                                <div className="loading-text">Loading...</div>
                                            ) : (
                                                <div>No Products Available</div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>


                            <Modal isOpen={modal_center}
                                toggle={() => {
                                    togCenterReview();
                                }} centered >
                                <div className="modal-header">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setModalCenter(false);
                                        }}
                                        className="close"
                                        data-dismiss="modal"
                                        aria-label="Close"
                                        style={{
                                            fontSize: '4rem',  // Increases the font size of the "×"
                                            color: 'red',  // White "×" symbol
                                       
                                        }}
                                    >
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <h4 className="title mb-30 mt-10">Add Products:</h4>
                                    <div>
                                        <form className="form-contact">
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <select className="form-control f-14" onChange={(e) => setProduct({ ...product, category: e.target.value })}>
                                                        <option selected>Select Category...</option>
                                                        <option value="shoes">SHOES</option>
                                                        {/* <option value="table">Table</option>
                                                        <option value="chair">Chair</option>
                                                        <option value="bed">Bed</option>
                                                        <option value="lightning">Lightning</option>
                                                        <option value="decore">Decore</option> */}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <div className="form-group">
                                                    <input className="form-control" name="title" id="title" type="text"
                                                        onChange={(e) => setProduct({ ...product, itemCode: e.target.value })}
                                                        placeholder="Enter CODE" />
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <div className="form-group">
                                                    <span>ADD Main Images</span>
                                                    <input type="file" id="mainImages" name="mainImages" multiple onChange={handleMainImageChange} />
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <span>ADD Gallary Images</span>
                                                <div className="form-group">
                                                    <input type="file" id="galaryImages" name="galaryImages" multiple onChange={handleGalleryImageChange} />
                                                </div>
                                            </div>

                                            {/* <div className="col-12">
                                                <label>Color:</label>
                                                <div>
                                                    {colorOptions.map(colorOption => (
                                                        <div
                                                            key={colorOption.value}
                                                            style={{
                                                                backgroundColor: colorOption.value,
                                                                width: '30px',
                                                                height: '30px',
                                                                borderRadius: '50%',
                                                                display: 'inline-block',
                                                                margin: '5px',
                                                                cursor: 'pointer',
                                                                border: (product.color && product.color.includes(colorOption.label)) ? '2px solid #333' : 'none'
                                                            }}
                                                            onClick={() => handleColorChange(colorOption.label)}
                                                        />
                                                    ))}
                                                </div>
                                            </div> */}

                                            <div className="col-12">
                                                <div className="form-group">
                                                    <input className="form-control valid" name="description" id="description" type="text"
                                                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                                                        placeholder="Enter description" />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <input className="form-control valid" name="itemCode" id="itemCode" type="text" value={itemCode} disabled
                                                        onChange={(e) => setProduct({ ...product, genaratedCode: e.target.value })}
                                                        placeholder="itemCode" />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <input className="form-control" name="price" id="price" type="number"
                                                        onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
                                                        placeholder="Enter price" />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <input className="form-control" name="discount" id="discount" type="number"  min={0} max={100}
                                                        onChange={(e) => setProduct({ ...product, discount: parseFloat(e.target.value) })}
                                                        placeholder="Enter discount in %" />
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <div className="form-group">
                                                    <label>Stock for Sizes (39 to 45)</label>
                                                    <div className="d-flex justify-content-between">

                                                        {/* Size 39 */}
                                                        <div className="text-center"  style={{ padding: "5px" }}>
                                                            <label >39</label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                name="size39"
                                                                defaultValue={0} // Default value for the first-time entry
                                                                min={0}
                                                                onChange={(e) => setSizes({ 
                                                                    ...product, 
                                                                    sizesList: { ...sizes.sizesList, 39: parseInt(e.target.value) } 
                                                                })}
                                                            />
                                                        </div>

                                                        {/* Size 40 */}
                                                        <div className="text-center"  style={{ padding: "5px" }}>
                                                            <label>40</label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                name="size40"
                                                                defaultValue={0} // Default value for the first-time entry
                                                                min={0}
                                                                onChange={(e) => setSizes({ 
                                                                    ...product, 
                                                                    sizesList: { ...sizes.sizesList, 40: parseInt(e.target.value) } 
                                                                })}
                                                            />
                                                        </div>

                                                        {/* Size 41 */}
                                                        <div className="text-center"  style={{ padding: "5px" }}>
                                                            <label>41</label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                name="size41"
                                                                defaultValue={0} // Default value for the first-time entry
                                                                min={0}
                                                                onChange={(e) => setSizes({ 
                                                                    ...product, 
                                                                    sizesList: { ...sizes.sizesList, 41: parseInt(e.target.value) } 
                                                                })}
                                                            />
                                                        </div>

                                                        {/* Size 42 */}
                                                        <div className="text-center"  style={{ padding: "5px" }}>
                                                            <label>42</label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                name="size42"
                                                                defaultValue={0} // Default value for the first-time entry
                                                                min={0}
                                                                onChange={(e) => setSizes({ 
                                                                    ...product, 
                                                                    sizesList: { ...sizes.sizesList, 42: parseInt(e.target.value) } 
                                                                })}
                                                            />
                                                        </div>

                                                        {/* Size 43 */}
                                                        <div className="text-center"  style={{ padding: "5px" }}>
                                                            <label>43</label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                name="size43"
                                                                defaultValue={0} // Default value for the first-time entry
                                                                min={0}
                                                                onChange={(e) => setSizes({ 
                                                                    ...product, 
                                                                    sizesList: { ...sizes.sizesList, 43: parseInt(e.target.value) } 
                                                                })}
                                                            />
                                                        </div>

                                                        {/* Size 44 */}
                                                        <div className="text-center"  style={{ padding: "5px" }}>
                                                            <label>44</label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                name="size44"
                                                                defaultValue={0} // Default value for the first-time entry
                                                                min={0}
                                                                onChange={(e) => setSizes({ 
                                                                    ...product, 
                                                                    sizesList: { ...sizes.sizesList, 44: parseInt(e.target.value) } 
                                                                })}
                                                            />
                                                        </div>

                                                        {/* Size 45 */}
                                                        <div className="text-center"  style={{ padding: "5px" }}>
                                                            <label>45</label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                name="size45"
                                                                defaultValue={0} // Default value for the first-time entry
                                                                min={0}
                                                                onChange={(e) => setSizes({ 
                                                                    ...product, 
                                                                    sizesList: { ...sizes.sizesList, 45: parseInt(e.target.value) } 
                                                                })}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </form>
                                    </div>
                                    <Row>
                                        <Col xl={12}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsSubmitButtonDisabled(true)
                                                    addProduct();
                                                }}
                                                className="btn colorchangeLog leadMargin edu-btn float-right btn-medium mb-20"
                                                disabled={isSubmitButtonDisabled}
                                            >
                                                <div>Submit</div>
                                            </button>
                                        </Col>
                                    </Row>
                                </div>
                            </Modal>

                            <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)}>
                                <div className="modal-header">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditModalOpen(false);
                                    }}
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"

                                    style={{
                                        fontSize: '4rem',  // Increases the font size of the "×"
                                        color: 'red',  // White "×" symbol
                                   
                                    }}
                                    >
                                    <span>&times;</span>  {/* The "×" symbol */}
                                    </button>

                                </div>
                                <div className="modal-body">
                                    <h4 className="title mb-30 mt-10">Update Product:</h4>
                                    <div>
                                        <form className="form-contact">
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <label >Title</label>
                                                    <input className="form-control" name="title" id="title" type="text"
                                                        defaultValue={editedProduct?.itemCode || ""}
                                                        onChange={(e) => setEditedProduct({ ...editedProduct, itemCode: e.target.value })}
                                                        placeholder="Enter title" />
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <div className="form-group">
                                                    <label >Description</label>
                                                    <input className="form-control valid" name="description" id="description" type="text"
                                                        defaultValue={editedProduct?.description || ""}
                                                        onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                                                        placeholder="Enter description" />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <label >Price</label>
                                                    <input className="form-control" name="price" id="price" type="number"
                                                        defaultValue={editedProduct?.price || ""}
                                                        onChange={(e) => setEditedProduct({ ...editedProduct, price: parseFloat(e.target.value) })}
                                                        placeholder="Enter price" />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <label >Discount</label>
                                                    <input className="form-control" name="discount" id="discount" type="number"
                                                        defaultValue={editedProduct?.discount || ""}
                                                        onChange={(e) => setEditedProduct({ ...editedProduct, discount: parseFloat(e.target.value) })}
                                                        placeholder="Enter discount in %" />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                    <label>Stock for Sizes (39 to 45) - {editedProduct?.stock || ""}</label>
                                                    <div className="d-flex justify-content-between">

                                                        {/* Size 39 */}
                                                        <div className="text-center"  style={{ padding: "5px" }}>
                                                            <label >39</label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                defaultValue={editedProduct?.sizes?.[39] || 0} // Default value for the first-time entry
                                                                onChange={(e) => {
                                                                    const newSize = parseFloat(e.target.value);
                                                                    const updatedProduct = {
                                                                      ...editedProduct,
                                                                      sizes: {
                                                                        ...editedProduct?.sizes,
                                                                        [39]: newSize
                                                                      }
                                                                    };
                                                                    setEditedProduct(updatedProduct);
                                                                  
                                                                    // Null check before calling updateStock
                                                                    if (updatedProduct) {
                                                                      updateStock(updatedProduct); // Now it's safe to call updateStock with updatedProduct
                                                                    }
                                                                  }}
                                                                  
                                                                />
                                                        </div>

                                                        {/* Size 40 */}
                                                        <div className="text-center"  style={{ padding: "5px" }}>
                                                            <label >40</label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                defaultValue={editedProduct?.sizes?.[40] || 0} // Default value for the first-time entry
                                                                min={0}
                                                                onChange={(e) => {
                                                                    const newSize = parseFloat(e.target.value);
                                                                    const updatedProduct = {
                                                                      ...editedProduct,
                                                                      sizes: {
                                                                        ...editedProduct?.sizes,
                                                                        [40]: newSize
                                                                      }
                                                                    };
                                                                    setEditedProduct(updatedProduct);
                                                                  
                                                                    // Null check before calling updateStock
                                                                    if (updatedProduct) {
                                                                      updateStock(updatedProduct); // Now it's safe to call updateStock with updatedProduct
                                                                    }
                                                                  }}
                                                                  
                                                                />
                                                        </div>

                                                        {/* Size 41 */}
                                                        <div className="text-center"  style={{ padding: "5px" }}>
                                                            <label>41</label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                name="size41"
                                                                defaultValue={editedProduct?.sizes?.[41]|| 0} // Default value for the first-time entry
                                                                min={0}
                                                                onChange={(e) => {
                                                                    const newSize = parseFloat(e.target.value);
                                                                    const updatedProduct = {
                                                                      ...editedProduct,
                                                                      sizes: {
                                                                        ...editedProduct?.sizes,
                                                                        [41]: newSize
                                                                      }
                                                                    };
                                                                    setEditedProduct(updatedProduct);
                                                                  
                                                                    // Null check before calling updateStock
                                                                    if (updatedProduct) {
                                                                      updateStock(updatedProduct); // Now it's safe to call updateStock with updatedProduct
                                                                    }
                                                                  }}
                                                            />
                                                        </div>

                                                        {/* Size 42 */}
                                                        <div className="text-center"  style={{ padding: "5px" }}>
                                                            <label>42</label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                name="size42"
                                                                defaultValue={editedProduct?.sizes?.[42]|| 0} // Default value for the first-time entry
                                                                min={0}
                                                                onChange={(e) => {
                                                                    const newSize = parseFloat(e.target.value);
                                                                    const updatedProduct = {
                                                                      ...editedProduct,
                                                                      sizes: {
                                                                        ...editedProduct?.sizes,
                                                                        [42]: newSize
                                                                      }
                                                                    };
                                                                    setEditedProduct(updatedProduct);
                                                                  
                                                                    // Null check before calling updateStock
                                                                    if (updatedProduct) {
                                                                      updateStock(updatedProduct); // Now it's safe to call updateStock with updatedProduct
                                                                    }
                                                                  }}
                                                            />
                                                        </div>

                                                        {/* Size 43 */}
                                                        <div className="text-center"  style={{ padding: "5px" }}>
                                                            <label>43</label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                name="size43"
                                                                defaultValue={editedProduct?.sizes?.[43]|| 0} // Default value for the first-time entry
                                                                min={0}
                                                                onChange={(e) => {
                                                                    const newSize = parseFloat(e.target.value);
                                                                    const updatedProduct = {
                                                                      ...editedProduct,
                                                                      sizes: {
                                                                        ...editedProduct?.sizes,
                                                                        [43]: newSize
                                                                      }
                                                                    };
                                                                    setEditedProduct(updatedProduct);
                                                                  
                                                                    // Null check before calling updateStock
                                                                    if (updatedProduct) {
                                                                      updateStock(updatedProduct); // Now it's safe to call updateStock with updatedProduct
                                                                    }
                                                                  }}
                                                            />
                                                        </div>

                                                        {/* Size 44 */}
                                                        <div className="text-center"  style={{ padding: "5px" }}>
                                                            <label>44</label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                name="size44"
                                                                defaultValue={editedProduct?.sizes?.[44]|| 0} // Default value for the first-time entry
                                                                min={0}
                                                                onChange={(e) => {
                                                                    const newSize = parseFloat(e.target.value);
                                                                    const updatedProduct = {
                                                                      ...editedProduct,
                                                                      sizes: {
                                                                        ...editedProduct?.sizes,
                                                                        [44]: newSize
                                                                      }
                                                                    };
                                                                    setEditedProduct(updatedProduct);
                                                                  
                                                                    // Null check before calling updateStock
                                                                    if (updatedProduct) {
                                                                      updateStock(updatedProduct); // Now it's safe to call updateStock with updatedProduct
                                                                    }
                                                                  }}
                                                            />
                                                        </div>

                                                        {/* Size 45 */}
                                                        <div className="text-center"  style={{ padding: "5px" }}>
                                                            <label>45</label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                name="size45"
                                                                defaultValue={editedProduct?.sizes?.[45]|| 0} // Default value for the first-time entry
                                                                min={0}
                                                                onChange={(e) => {
                                                                    const newSize = parseFloat(e.target.value);
                                                                    const updatedProduct = {
                                                                      ...editedProduct,
                                                                      sizes: {
                                                                        ...editedProduct?.sizes,
                                                                        [45]: newSize
                                                                      }
                                                                    };
                                                                    setEditedProduct(updatedProduct);
                                                                  
                                                                    // Null check before calling updateStock
                                                                    if (updatedProduct) {
                                                                      updateStock(updatedProduct); // Now it's safe to call updateStock with updatedProduct
                                                                    }
                                                                    
                                                                  }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                        </form>
                                    </div>
                                    <Row>
                                        <Col xl={12}>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    setIsButtonDisabled(true); // Disable the button immediately after click
                                                    
                                                    // Call updateStock with the existing editedProduct
                                                    if (editedProduct) {
                                                        updateStock(editedProduct); // Safe to call updateStock
                                                    }
                                                  
                                                    // Call updateProduct with editedProduct?.id
                                                    if (editedProduct?.id) {
                                                      updateProduct(editedProduct.id); // Safe to call updateProduct with the editedProduct id
                                                    }
                                                  }}
                                                disabled={isButtonDisabled}
                                                  
                                                className="btn colorchangeLog leadMargin edu-btn float-right btn-medium mb-20"
                                                
                                            >
                                                <div>Update</div>
                                            </button>
                                        </Col>
                                    </Row>
                                </div>
                            </Modal>
                        </div>
                    </div>
                </main >
            </div >

        </React.Fragment >
    );
};

export default AddProducts;

