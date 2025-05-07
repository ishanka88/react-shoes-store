import React, { useState, ChangeEvent, FormEvent, useEffect , useRef} from "react";
import "./addNewOrder.css";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { cities } from "../utils/cities";

import { DataProvider, useProductData } from '../context/DataContext';
import { Product } from "../models/Products";
import { CartItem } from "../models/CartItem";
import { Order, OrderItem } from "../models/Order";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { hover } from "framer-motion";
import { Pointer } from "lucide-react";
import { getLastManualOrderId } from "../firebase/systemDocument";
import { Button, ToggleButton } from "react-bootstrap";
import { each } from "jquery";
import { DELIVERYCHARGE } from "../utils/deliveryCharge";
import { NEW_ORDER } from "../utils/parcelsStatus";
import { placeNewOrder } from "../firebase/placeNewOrder";

type FormErrors = {
  contact1?: string;
  contact2?: string;
  address?: string;
};

const AddNewOrder: React.FC = () => {
    const [recipientName, setRecipientName] = useState("");
    const [addressLine1, setAddressLine1] = useState("");
    const [addressLine2, setAddressLine2] = useState("");
    const [addressLine3, setAddressLine3] = useState("");
    const [city, setCity] = useState("");
    const [contact1, setContact1] = useState("");
    const [contact2, setContact2] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [errors, setErrors] = useState<FormErrors>({});
    const [rawPasteText, setRawPasteText] = useState("");
    const [pastedList, setPastedList] = useState<string[]>([]);
    const [focusedField, setFocusedField] = useState<"name" | "address1" |"address2" |"address3" | "contact1" |"contact2"| null>(null);

    const [subCategories, setSubCategories] = useState<string[]>([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");

    const [itemCodes, setItemCodes] = useState<string[]>([]);
    const [selectedItemCode, setSelectedItemCode] = useState<string>("");


    const { productsList , loading,refetchProducts } = useProductData();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const [selectedSize, setSelectedSize] = useState<number>(0);
    const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

    const [orderId, setOrderId] = useState<number>(0);
    const [total, setTotall] = useState(0);
    const [subTotal, setSubTotall] = useState(0);
    const [isFreeDeliverySelected, setIsFreeDeliverySelected] = useState<boolean>(false);


    // Function to reset all form values to their default state
    const resetForm = () => {
        setRecipientName("");
        setAddressLine1("");
        setAddressLine2("");
        setAddressLine3("");
        setCity("");
        setContact1("");
        setContact2("");
        setPaymentMethod("cash");
        setErrors({});
        setRawPasteText("");
        setPastedList([]);
        setFocusedField(null);
        setSelectedSubCategory("");
        setItemCodes([]);
        setSelectedItemCode("");
        setSelectedProduct(null);
        setSelectedSize(0);
        setSelectedQuantity(1);
        setOrderItems([]);
        setOrderId(0);
        setTotall(0);
        setSubTotall(0);
        setIsFreeDeliverySelected(false);

        fetchLastOrderId();
    };


    // Regex for validating Sri Lankan contact numbers
    const phoneNumberRegex = /^(?:\+94|0)(71|72|75|76|77|78|79|11|21|22|23|24|25|26|27|28|29|31|32|33|34|35|36|37|38|39|41|42|43|44|45|46|47|48|49|51|52|53|54|55|56|57|58|59|61|62|63|64|65|66|67|68|69|81|82|83|84|85|86|87|88|89|91|92|93|94|95|96|97|98|99)\d{7}$/;


    const fetchLastOrderId = async () => {
        const lastOrderId = await getLastManualOrderId();
        if (lastOrderId) {
          setOrderId(lastOrderId+1)
        }
      };

    useEffect(() => {
        fetchLastOrderId();
      }, []);
    
    useEffect(() => {
        const subTotal = orderItems.reduce((acc, item) => {
            const price = Number(item.price);
            const discount = Number(item.discount);
            const quantity = Number(item.quantity);
            const subtotal = price * quantity * ((100 - discount) / 100);
            return acc + subtotal;
        }, 0);
        
        setSubTotall(subTotal);
    }, [orderItems]);

    useEffect(() => {
        let deliverCharge = 0;
        if(!isFreeDeliverySelected && orderItems.length >0){
            deliverCharge = DELIVERYCHARGE
        }
        
        setTotall(subTotal + deliverCharge);
    }, [subTotal,isFreeDeliverySelected]);

    
      

    useEffect(() => {
        const lines = rawPasteText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
        setPastedList(lines);

    }, [rawPasteText]);

    useEffect(() => {
        // Extract unique subCategories, filter out undefined values, and sort alphabetically
        const uniqueSubCategories = Array.from(
        new Set(
            productsList
            .map((product) => product.subCategory)
            .filter((subCategory): subCategory is string => subCategory !== undefined) // Type guard to ensure only strings
        )
        ).sort(); // Sort alphabetically
        
        // Set the unique subCategories into the state
        setSubCategories(uniqueSubCategories);
    }, [productsList]);

    useEffect(() => {
        // Filter item codes based on the selected subcategory
        if (selectedSubCategory) {
        const filteredItemCodes = productsList
            .filter((product) => product.subCategory === selectedSubCategory)
            .map((product) => product.itemCode)
            .filter((itemCode): itemCode is string => itemCode !== undefined);

        setItemCodes(filteredItemCodes);
        }
    }, [selectedSubCategory]);

    useEffect(() => {
  
        if (selectedItemCode) {
            setSelectedSize(0)
            setSelectedQuantity(1)
            const updateSelectedProduct = productsList.find(
                (product) => product.itemCode === selectedItemCode
            );

            
            if (updateSelectedProduct) {
                setSelectedProduct(updateSelectedProduct); // Set as a single object, not an array
            }
        }


      }, [selectedItemCode]);

      

    

    const validate = (): FormErrors => {
        const newErrors: FormErrors = {};
        if (!phoneNumberRegex.test(contact1)) {
        newErrors.contact1 = "Enter a valid 10-digit number";
        }
        if (contact2 && !phoneNumberRegex.test(contact2)) {
        newErrors.contact2 = "Enter a valid 10-digit number";
        }
        if (!addressLine1.trim()) {
        newErrors.address = "Address is required";
        }
        return newErrors;
    };

    const getCombinedAddress = () => {
        return [addressLine1, addressLine2, addressLine3]
        .filter(line => line.trim())
        .join(", ");
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
        }
        setErrors({});
        alert(`Form submitted successfully!\nAddress: ${getCombinedAddress()}`);
    };

    const handleDropdownSelect = (value: string) => {
        switch (focusedField) {
            case "name":
                setRecipientName(value);
                break;
            case "address1":
                setAddressLine1(value);
                break;
            case "address2":
                setAddressLine2(value);
                break;
            case "address3":
                setAddressLine3(value);
                break;
            case "contact1":
                setContact1(value);
                break;
            case "contact2":
                setContact2(value);
                break;
        }
        setPastedList((prev) => prev.filter((item) => item !== value));
        setFocusedField(null);
    };


    const QuantitySelector: React.FC<{quantity?: number ,stock?: number , onValueChange?: (value: number) => void}> = ({ quantity=1,stock=1, onValueChange }) => {
        
        if(quantity>stock){
            onValueChange?.(stock);
        }
        const increase = () => {
          if(quantity>= stock){
            onValueChange?.(stock);
            alert("Maximum stock reached")

          }else{
              const newQty = quantity + 1;
              onValueChange?.(newQty);
          }
        };
      
        const decrease = () => {
          if (quantity > 1) {
            const newQty = quantity - 1;
            onValueChange?.(newQty);
          }
        };
      
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={decrease} className="btn btn-sm btn-outline-secondary">−</button>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => {
                const value = Math.max(1, parseInt(e.target.value) || 1);
                onValueChange?.(value);
              }}
              style={{ width: '50px', textAlign: 'center' }}
            />
            <button onClick={increase} className="btn btn-sm btn-outline-secondary">+</button>
          </div>
        );
      };


    

    const SizesSelectionComponent: React.FC<{ product: Product |null , selectedItemCode:string|null , onValueChange: (value: number) => void}> = ({ product ,selectedItemCode ,onValueChange}) => {

        const divs = [];

        if(!product || !selectedItemCode){
            return null
        }
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
                <div key={size}  >
                    <Label for={`size-${size}`}>
                        <div
                            className="text-start"
                            
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
                                cursor: "pointer"
                                
                                
                            }}
                        >
                            {size} {/* Display size */}
                        </div>
                    </Label>
                    <div >
                        <input
                            type="radio"
                            id={`size-${size}`}
                            name="product-size"
                            value={size}
                            checked={selectedSize?.toString() === size}
                            onChange={() => onValueChange(Number(size))}
                            disabled={quantity === 0}
                            style={{opacity: quantity === 0 ? "0" :"1", cursor: "pointer"}}

                        />
          
                    </div>
                </div>
                    

                
            );
            }
    
            return (
            <div>
                <div
                    className="text-center"
                    style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    padding: "10px 0px 10px 0px",
                    }}
                >
                    {divs} {/* Render the divs array */}
                </div>
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


    const handleValueChange = (value: number) => {
        setSelectedSize(value); // You "receive" the returned value here
      };

    const handleQuantityValueChange = (value: number) => {
        setSelectedQuantity(value); // You "receive" the returned value here
      };

    
    const addOrderItem = () => {

        if (!selectedProduct || !selectedSize || !selectedQuantity) return;
      
        setOrderItems(prev => {
          const existingItemIndex = prev.findIndex(item => item.productId === selectedProduct.productId);
      
          if (existingItemIndex !== -1) {
            const updatedItems = [...prev];
            const existingItem = { ...updatedItems[existingItemIndex] };
            
            existingItem.quantity = (existingItem.quantity || 0) - (existingItem.sizes?.[selectedSize] || 0) + selectedQuantity;
      
            existingItem.sizes = {
              ...existingItem.sizes,
              [selectedSize]:  selectedQuantity,
            };
      
      
            updatedItems[existingItemIndex] = existingItem;
            return updatedItems;
        } else {
            
            const newItem: OrderItem = {
              id: orderItems.length + 1,
              productId: selectedProduct.productId,
              itemCode: selectedProduct.itemCode || '',
              price: selectedProduct.price ?? 0,
              discount: selectedProduct.discount ?? 0,
              quantity: selectedQuantity,
              sizes: {
                [selectedSize]: selectedQuantity,
              },
            };
            return [...prev, newItem];
          }
        });
    };

    const removeOrderItem = (idToRemove: number) => {
        setOrderItems(prevItems => prevItems.filter(item => item.id !== idToRemove));
      };

    const toggleFreeDelivery = () => {
        setIsFreeDeliverySelected(!isFreeDeliverySelected);
      };

    const confirmOrder = async (e: FormEvent) => {
        e.preventDefault();

        const newOrder: Order = {
            // Similarly, handle tracking logic
            orderId: orderId,
            tracking: "",
            orderItems: orderItems,
            fullAmount: total,
            deliverCharges: isFreeDeliverySelected? DELIVERYCHARGE : 0,
            createdUserId: "TACCO",
            name : recipientName ?? "",
            address : addressLine1 + (addressLine2 ? ", " + addressLine2 : "") + (addressLine3 ? ", " + addressLine3 + "." : "."),
            city : city ?? "",
            contact1 : contact1 ?? "",
            contact2 : contact2 ?? "",
            paymentMethod : paymentMethod ?? "",
    
        };
        const isConfirmed = window.confirm("Are you sure?");
        if (!isConfirmed) return; // If not confirmed, exit early

        try {
            // Place the new order and handle response
            const response = await placeNewOrder(newOrder,false); // false- manuall orders

            if (response.success) {
                // Handle success (e.g., show success message)
                alert("Order placed successfully!");
                resetForm()
                refetchProducts()

            } else {
                if ('error' in response) {
                // This block is executed when `response` has the `error` property (i.e., the order failed)
                alert(`Error placing order: ${response.error}`);
                } else {
                // This block is executed when `response` has the `orderId` property (i.e., the order was successful)
                alert(`Order placed successfully! Your order ID is: ${response.orderId}`);
                }
            }
        } catch (error) {
            console.error("Error placing order:", error);
            alert("An unexpected error occurred while placing your order.");


      };
    }
     
      

      

  return (
    
    <Container className="container">
        <h2>New Order Details</h2>
        <Form onSubmit={handleSubmit}>
            <Row >
                <Col style={{paddingBottom:"25px"}}>
                    {/* Paste List Input */}
                    <FormGroup>
                    <Label for="paste-list">Paste Lines</Label>
                    <div style={{ position: "relative" }}>
                        <Input
                        id="paste-list"
                        type="textarea"
                        value={rawPasteText}
                        onChange={(e) => setRawPasteText(e.target.value)}
                        placeholder="Paste or type multiple lines here..."
                        rows={5}
                        style={{
                            fontSize: "14px",
                            lineHeight: "20px",
                            fontFamily: "monospace",
                            resize: "vertical",
                            minHeight: "150px",
                            maxHeight: "250px",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                        }}
                        />
                        <div style={{ marginTop: "0.5rem", display: "flex", gap: "10px" }}>
                        <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            style={{backgroundColor:"#007bff"}}
                            onClick={() => {
                            navigator.clipboard.readText().then((text) => {
                                setRawPasteText(text);
                            });
                            }}
                        >
                            Paste
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            style={{backgroundColor: "#b92106"}}
                            onClick={() => setRawPasteText("")}
                        >
                            Clear
                        </button>
                        </div>
                    </div>
                    </FormGroup>

                    <div className="d-flex justify-content-between">

                        <div style={{padding:"0px 20px 10px 0px"}}>
                            
                            <Label for="orderId"><strong>Order ID</strong></Label>
                            <Input
                                type="number"
                                id="exampleText"
                                placeholder="Enter order ID..."
                                value={orderId}
                                min={1}
                                step={1}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    // Allow empty string (for clearing input), or positive integers only
                                    if (value === "" || (/^\d+$/.test(value) && Number(value) > 0)) {
                                    setOrderId(Number(value));
                                    }
                                }}
                                style={{width:"100px", fontWeight:"bold"}}
                            />
                        </div>
                        <div style={{paddingBottom:"10px"}}>
                            
                            <Label for="totall"><strong>Total Amount</strong></Label>
                            <div className="d-flex align-items-center">
                                <div><strong>Rs.&nbsp;</strong></div>

                                <div>
                                <Input
                                    type="text"
                                    id="totall"
                                    placeholder="Enter total..."
                                    value={total}
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        // Allow empty string or positive number with up to 2 decimal places
                                        if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
                                        setTotall(Number(value)); // keep as string for better input experience
                                        }
                                    }}
                                    style={{ minWidth: "100px", fontWeight: "bold" }}
                                    />

                                </div>
                            </div>
             
                        </div>

                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' ,padding:"10px 0px"}}>
                        <Label for="freeDeliverySwitch" style={{ marginRight: '10px', color:"green", fontWeight:"bold", cursor:"pointer"}}>Free Delivery</Label>
                        
                        <Input
                            type="switch"
                            id="freeDeliverySwitch"
                            name="freeDeliverySwitch"
                            label={isFreeDeliverySelected ? 'YES' : 'NO'}
                            checked={isFreeDeliverySelected}
                            onChange={toggleFreeDelivery}
                            style={{ cursor: 'pointer' }}
                            inline
                        />
                        
                        <span style={{ marginLeft: '10px' }}>
                            {isFreeDeliverySelected ? <span style={{color:"Blue" , fontWeight:"bold"}}>YES</span> : <span style={{color:"red"}}>NO</span> }
                        </span>
                    </div>

                    <div className="">
                        <div className="item-selection ">
                            {/* Sub Category Dropdown */}
                            <div>
                                <div>
                                <Label for="sub-category"> <strong>Category :</strong> </Label>
                                </div>
                                <div>
                                <select
                                    id="paste-category"
                                    value={selectedSubCategory}
                                    onChange={(e) => {
                                        setSelectedSubCategory(e.target.value);
                                        setSelectedItemCode("");
                                      }}
                                >
                                    <option value="">Category</option>
                                    {subCategories.map((category, index) => (
                                    <option key={index} value={category}>
                                        {category}
                                    </option>
                                    ))}
                                </select>
                                </div>
                            </div>

                            {/* Item Code Dropdown */}
                            <div>
                                <div>
                                <Label for="item-code"><strong>Item Code :</strong></Label>
                                </div>
                                <div>
                                <select 
                                    id="item-code"
                                    onChange={(e) => setSelectedItemCode(e.target.value)}
                                    value={selectedItemCode}

                                    >
                                    <option value="">Item code</option>
                                    {itemCodes.map((code, index) => (
                                    <option key={index} value={code}>
                                        {code}
                                    </option>
                                    ))}
                                </select>
                                </div>
                            </div>
                        </div>

                        {/* Sizes */}
                        <div style={{marginTop:"20px"}}>
                            <label><strong>Select Shoe Size:</strong></label>
                            {selectedProduct && (
                                <SizesSelectionComponent product={selectedProduct} selectedItemCode={selectedItemCode} onValueChange={handleValueChange}/>
                            )}


                            {selectedSize >0 && selectedItemCode && (

                                <div className="d-flex justify-content-between">
                                    <div>
                                        <span>Qty : <QuantitySelector quantity={selectedQuantity} stock={selectedProduct?.sizes?.[selectedSize] || 0} onValueChange={handleQuantityValueChange}/></span>
                                    </div>
                                    <div>
                                        <button className="btn btn-primary" onClick={addOrderItem}>
                                            Add Item
                                        </button>
                                    </div>

                                </div>

                            )}



                            

                            {/* <div style={{ display: "flex", gap: "15px", marginTop: "0px", flexWrap: "wrap" }}>
                                {shoeSizes.map((size) => (
                                <label key={size} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                    <input
                                    type="radio"
                                    name="shoe-size"
                                    value={size}
                                    checked={selectedSize === size}
                                    onChange={() => setSelectedSize(size)}
                                    />
                                    {size}
                                </label>
                                ))}
                            </div> */}
                        </div>
                    </div>
                    <div style={{marginTop:"20px"}}>
                        {orderItems.map((item, index) => (
                            <div key={item.id || index} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>

                                <div className="d-flex justify-content-between">
                                    <div>
                                        <ul>
                                            {Object.entries(item.sizes ?? {}).map(([size, qty]) => (
                                            
                                            <li key={size}>  
                                                 <strong>{item.itemCode} </strong>Size {size} ( {qty} )
                                            </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="d-flex align-items-center ">
                                        <FontAwesomeIcon color="red" cursor="pointer" icon={faTrash} onClick={() => removeOrderItem(item.id )}/>
                                            
                                        {/* <FaTrash className="d-flex align-items-center delete-button " onClick={() => removeItem(item.id)} /> */}
                                    </div>
                                </div>

                            </div>
                            ))}
                    </div>


                    

                </Col>

                <Col>

                    {/* Name with dropdown */}
                    <FormGroup>
                        <Label for="recipient-name">
                            Name <span className="required">*</span>
                        </Label>
                        <Input
                            type="text"
                            id="recipient-name"
                            value={recipientName}
                            onFocus={() => setFocusedField("name")}
                            onBlur={() => setTimeout(() => setFocusedField(null), 150)}
                            onChange={(e) => setRecipientName(e.target.value)}
                            required
                            placeholder="Enter recipient's name"
                            autoComplete="off"
                        />
                        {focusedField === "name" && pastedList.length > 0 && (
                            <ListGroup className="dropdown-list">
                            {pastedList.map((item, i) => (
                                <ListGroupItem 
                                key={i} 
                                onMouseDown={() => handleDropdownSelect(item)}
                                style={{ cursor: "pointer" }}
                                >
                                {item}
                                </ListGroupItem>
                            ))}
                            </ListGroup>
                        )}
                    </FormGroup>
                    

                    {/* Address Lines */}
                    <FormGroup >
                        <Label for="address1">
                            ADDRESS <span className="required">*</span>
                        </Label>
            
                        <div>
                            <div>
                                <Input
                                    type="text"
                                    id="address1"
                                    value={addressLine1}
                                    onFocus={() => setFocusedField("address1")}
                                    onBlur={() => setTimeout(() => setFocusedField(null), 150)}
                                    onChange={(e) => setAddressLine1(e.target.value)}
                                    required
                                    placeholder="Line 1"
                                    autoComplete="off"
                                />
                                {errors.address && <div className="required">{errors.address}</div>}
                                {focusedField === "address1" && pastedList.length > 0 && (
                                    <ListGroup className="dropdown-list">
                                    {pastedList.map((item, i) => (
                                        <ListGroupItem 
                                        key={i} 
                                        onMouseDown={() => handleDropdownSelect(item)}
                                        style={{ cursor: "pointer" }}
                                        >
                                        {item}
                                        </ListGroupItem>
                                    ))}
                                    </ListGroup>
                                )}

                            </div>

                            <div style={{ paddingTop: "10px" }}>
                                <Input
                                    type="text"
                                    id="address2"
                                    value={addressLine2}
                                    onFocus={() => setFocusedField("address2")}
                                    onChange={(e) => setAddressLine2(e.target.value)}
                                    onBlur={() => setTimeout(() => setFocusedField(null), 150)}
                                    placeholder="Line 2"
                                    autoComplete="off"
                                />
                                    {focusedField === "address2" && pastedList.length > 0 && (
                                    <ListGroup className="dropdown-list">
                                    {pastedList.map((item, i) => (
                                        <ListGroupItem 
                                        key={i} 
                                        onMouseDown={() => handleDropdownSelect(item)}
                                        style={{ cursor: "pointer" }}
                                        >
                                        {item}
                                        </ListGroupItem>
                                    ))}
                                    </ListGroup>
                                )}
                            </div>
                            <div style={{ paddingTop: "10px" }}>
                                <Input
                                    type="text"
                                    id="address3"
                                    value={addressLine3}
                                    onFocus={() => setFocusedField("address3")}
                                    onChange={(e) => setAddressLine3(e.target.value)}
                                    onBlur={() => setTimeout(() => setFocusedField(null), 150)}
                                    placeholder="Line 3"
                                    autoComplete="off"
                                />
                                
                                {focusedField === "address3" && pastedList.length > 0 && (
                                    <ListGroup className="dropdown-list">
                                    {pastedList.map((item, i) => (
                                        <ListGroupItem 
                                        key={i} 
                                        onMouseDown={() => handleDropdownSelect(item)}
                                        style={{ cursor: "pointer" }}
                                        >
                                        {item}
                                        </ListGroupItem>
                                    ))}
                                    </ListGroup>
                                )}
                            </div>
                        </div>
                    </FormGroup>

                    {/* City */}
                    <FormGroup>
                        <Label for="city">
                            City <span className="required">*</span>
                        </Label>
                        <Input
                            type="select"
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                        >
                            <option value="">Select a city</option>
                            {cities.map((cityOption, index) => (
                            <option key={index} value={cityOption}>
                                {cityOption}
                            </option>
                            ))}
                        </Input>
                    </FormGroup>

                    {/* Contact Numbers */}
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                            <Label for="contact1">
                                Contact Num 01 <span className="required">*</span>
                            </Label>
                            <Input
                                type="tel"
                                id="contact1"
                                value={contact1}
                                onFocus={() => setFocusedField("contact1")}
                                onBlur={() => setTimeout(() => setFocusedField(null), 150)}
                                onChange={(e) => setContact1(e.target.value)}
                                required
                                placeholder="Enter number"
                                invalid={!!errors.contact1}
                                autoComplete="off"
                            />
                            {errors.contact1 && <div className="required">{errors.contact1}</div>}
                            {focusedField === "contact1" && pastedList.length > 0 && (
                                <ListGroup className="dropdown-list">
                                {pastedList.map((item, i) => (
                                    <ListGroupItem 
                                    key={i} 
                                    onMouseDown={() => handleDropdownSelect(item)}
                                    style={{ cursor: "pointer" }}
                                    >
                                    {item}
                                    </ListGroupItem>
                                ))}
                                </ListGroup>
                            )}
                            </FormGroup>
                        </Col>

                        <Col md={6}>
                            <FormGroup>
                            <Label for="contact2">Contact Num 02</Label>
                            <Input
                                type="tel"
                                id="contact2"
                                value={contact2}
                                onFocus={() => setFocusedField("contact2")}
                                onChange={(e) => setContact2(e.target.value)}
                                onBlur={() => setTimeout(() => setFocusedField(null), 150)}
                                placeholder="Enter number"
                                invalid={!!errors.contact2}
                                autoComplete="off"
                            />
                            {errors.contact2 && <div className="required">{errors.contact2}</div>}
                            {focusedField === "contact2" && pastedList.length > 0 && (
                                <ListGroup className="dropdown-list">
                                {pastedList.map((item, i) => (
                                    <ListGroupItem 
                                    key={i} 
                                    onMouseDown={() => handleDropdownSelect(item)}
                                    style={{ cursor: "pointer" }}
                                    >
                                    {item}
                                    </ListGroupItem>
                                ))}
                                </ListGroup>
                            )}
                            </FormGroup>
                        </Col>
                    </Row>
    
                    {/* Payment Method */}
                    <FormGroup>
                        <Label for="payment-method">
                            Payment Method <span className="required">*</span>
                        </Label>
                        <Input
                            type="select"
                            id="payment-method"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            required
                        >
                            <option value="">Select</option>
                            <option value="cash">Cash on Delivery</option>
                            {/* <option value="card">Card Payment</option> */}
                        </Input>
                    </FormGroup>

                    <div style={{paddingBottom:"10px"}}>
                            
                            <Label for="totall"><strong>Total Amount</strong></Label>
                            <div className="d-flex align-items-center">
                                <div><strong>Rs.&nbsp;</strong></div>

                                <div>
                                <Input
                                    type="text"
                                    id="totall"
                                    placeholder="Enter total..."
                                    value={total}
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        // Allow empty string or positive number with up to 2 decimal places
                                        if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
                                        setTotall(Number(value)); // keep as string for better input experience
                                        }
                                    }}
                                    style={{ minWidth: "100px", fontWeight: "bold" }}
                                    />

                                </div>
                            </div>
             
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' ,padding:"10px 0px"}}>
                        <Label for="freeDeliverySwitch" style={{ marginRight: '10px', color:"green", fontWeight:"bold", cursor:"pointer"}}>Free Delivery</Label>
                        
                        <Input
                            type="switch"
                            id="freeDeliverySwitch"
                            name="freeDeliverySwitch"
                            label={isFreeDeliverySelected ? 'YES' : 'NO'}
                            checked={isFreeDeliverySelected}
                            onChange={toggleFreeDelivery}
                            style={{ cursor: 'pointer' }}
                            inline
                        />
                        
                        <span style={{ marginLeft: '10px' }}>
                            {isFreeDeliverySelected ? <span style={{color:"Blue" , fontWeight:"bold"}}>YES</span> : <span style={{color:"red"}}>NO</span> }
                        </span>
                    </div>

                    {/* Submit */}
                    <div className="d-flex justify-content-between mt-4">
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            onClick={confirmOrder}
                            >
                            Confirm
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={resetForm}
                        >
                            Cancel
                        </button>
                    </div>
                   
                </Col>
            </Row>
        </Form>

    </Container>
  );
};

export default AddNewOrder;