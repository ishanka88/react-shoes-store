import React, { useState, useEffect } from "react";
import { Product } from "../models/Products";
import { Card, CardBody, Col, Form, Input, Label, Container, Nav, NavItem, NavLink, Row, TabContent, Modal, TabPane } from "reactstrap";
import { toast } from "react-toastify";
import { AdminService } from "../services/AdminService";
import 'react-toastify/dist/ReactToastify.css';
import { getFirestore, collection, doc, updateDoc, getDocs,getDoc, addDoc, query, where ,Timestamp} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import Swal from "sweetalert2";
import { Notification, Order, OrderItem } from "../models/Order";
import { ORDERS, PRODUCTS,SYSTEM} from "../dbUtils";

import{db} from "../firebase/firebaseConfig"
import "./orders.css"
import { sendParcelData } from "../curiorService/placeOrder";
import { CANCELLED, DELIVERED, DISPATCHED, NEW_ORDER, RESCHEDULE, RETURN, WAITING } from "../utils/parcelsStatus";
import { updateOrderStatus ,updateOrderStatusAndTrackingNo} from "../services/UpdateOrderDetails";
import { spawn } from "child_process";



const classNames = require("classnames");



interface UserWithOrders {
    userId: string;
    orderIds: number[];
  }


const Orders: React.FC = () => {
    const [modal_center, setModalCenter] = React.useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [verticalActiveTabWithIcon, setverticalActiveTabWithIcon] = useState("1");

    
    const [selectedOption, setSelectedOption] = useState<string>('7'); // Default to 7 days
    const [customDate, setCustomDate] = useState<string>(''); // For custom date input
    const [startDate, setStartDate] = useState<Date>(new Date());

    const [multipleOrders, setMultipleOrders] = useState<UserWithOrders[]>([]);


    const [statusCounts, setStatusCounts] = useState<{ [key: string]: number }>({
        newOrder: 0,
        waiting: 0,
        dispatched: 0,
        reschedule: 0,
        completed: 0,
        return: 0,
        cancelled: 0,
      });
    
    const statusKeyMap: { [key: string]: keyof typeof statusCounts } = {
        'New Order': 'newOrder',
      
        'Waiting': 'waiting',
      
        'Dispatched': 'dispatched',
        'Processing': 'dispatched',
        'Pickup': 'dispatched',
        'Transfer': 'dispatched',
        'Data Changed': 'dispatched',
        'Hold': 'dispatched',
      
        'Reschedule': 'reschedule',
        'Rearrange': 'reschedule',
      
        'Return': 'return',
        'Return Pending': 'return',
        'Return Transfer': 'return',
        'Return Complete': 'return',
        'Damaged': 'return',
      
        'Delivered': 'completed',
      
        'Cancelled': 'cancelled',
    };

    // Define the valid order statuses
    type OrderStatus = 
    | 'New Order'
    | 'Waiting'
    | 'Dispatched'
    | 'Processing'
    | 'Pickup'
    | 'Transfer'
    | 'Data Changed'
    | 'Hold'
    | 'Reschedule'
    | 'Rearrange'
    | 'Return'
    | 'Return Pending'
    | 'Return Transfer'
    | 'Return Complete'
    | 'Damaged'
    | 'Delivered'
    | 'Cancelled';

    // Define the valid group keys (used for UI categories)
    type GroupKey = 
    | 'New Order'
    | 'Waiting'
    | 'Dispatched'
    | 'Reschedule'
    | 'Return'
    | 'Delivered'
    | 'Cancelled';


    // Status to Group mapping
    const statusGroups: Record<OrderStatus, GroupKey> = {
        'New Order': 'New Order',

        'Waiting': 'Waiting',

        'Dispatched': 'Dispatched',
        'Processing': 'Dispatched',
        'Pickup': 'Dispatched',
        'Transfer': 'Dispatched',
        'Data Changed': 'Dispatched',
        'Hold': 'Dispatched',

        'Reschedule': 'Reschedule',
        'Rearrange': 'Reschedule',

        'Return': 'Return',
        'Return Pending': 'Return',
        'Return Transfer': 'Return',
        'Return Complete': 'Return',
        'Damaged': 'Return',

        'Delivered': 'Delivered',
        'Cancelled': 'Cancelled',
    };
  

      
      

    // Tab data (for easy iteration)
    const tabData = [
        { id: "1", label: "New Order", status:NEW_ORDER, count: statusCounts.newOrder || 0, color: "blue" },
        { id: "2", label: "Waiting", status:WAITING, count: statusCounts.waiting || 0, color: "green" },
        { id: "3", label: "Dispatched",status:DISPATCHED,  count: statusCounts.dispatched || 0, color: "green" },
        { id: "4", label: "Reshedule",status:RESCHEDULE,  count: statusCounts.reschedule || 0, color: "red" },
        { id: "5", label: "Completed", status:DELIVERED, count: statusCounts.completed || 0, color: "green" },
        { id: "6", label: "Return", status:RETURN, count: statusCounts.return|| 0, color: "red" },
        { id: "7", label: "Cancelled", status:CANCELLED,  count: statusCounts.cancelled || 0, color: "green" },
    ];


    const toggleVerticalIcon = (tab: any) => {
        if (verticalActiveTabWithIcon != tab) {
            setverticalActiveTabWithIcon(tab);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);  // Start loading
        try {
            const startDateTimestamp = Timestamp.fromDate(startDate);
    
            const shoeOrdersQuery = query(
                collection(db, 'Orders'),
                where('createdAt', '>=', startDateTimestamp)
            );
    
            const shoeProductsSnapshot = await getDocs(shoeOrdersQuery);
    
            const fetchedProducts: Order[] = shoeProductsSnapshot.docs.map(doc => doc.data() as Order);
    
            setOrders(fetchedProducts);  // Update the orders with fetched data
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);  // Stop loading
        }
    };
    
    
    
    // Function to calculate the date based on selected option
    const calculateDate = (option: string, custom: string) => {
        const currentDate = new Date(); // Get the current date
        
        // If the selected option is 'custom', use the custom date entered
        if (option === 'custom' && custom) {
            return new Date(custom);
        }
        
        // Add days based on the selected option
        if (option === '7') {
            currentDate.setDate(currentDate.getDate() - 7); // Add 7 days
        } else if (option === '14') {
            currentDate.setDate(currentDate.getDate() - 14); // Add 14 days
        } else if (option === '21') {
            currentDate.setDate(currentDate.getDate() - 21); // Add 21 days
        } else if (option === '30') {
            currentDate.setDate(currentDate.getDate() - 30); // Add 30 days
        }
        
        return currentDate; // Return the date as a formatted string
    };
    
    useEffect(() => {
        const newStartDate = calculateDate(selectedOption, customDate);
        setStartDate(newStartDate);  // Update startDate first
        
    }, [selectedOption , customDate]);
    
    useEffect(() => {
        if (startDate) {  // Only fetch products if startDate is defined
            fetchProducts();
        }
    }, [startDate]);  // Trigger fetching whenever startDate changes

    

    useEffect(() => {
        const counts: typeof statusCounts = {
          newOrder: 0,
          waiting: 0,
          dispatched: 0,
          reschedule: 0,
          completed: 0,
          return: 0,
          cancelled: 0,
        };
      
        orders.forEach(order => {
          const rawStatus = order.status || 'unknown';
          const key = statusKeyMap[rawStatus];
      
          if (key) {
            counts[key]++;
          }
        });
      
        setStatusCounts(counts);
        const usersWithMultipleOrders = getUsersWithMultipleOrders(orders);
        setMultipleOrders(usersWithMultipleOrders); // Update the state
      }, [orders]);
      

    
    // Handle change in the predefined date option
    const handlePredefinedDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value);
        setCustomDate(''); // Clear custom date when a predefined option is selected
    };
    
    // Handle custom date input change
    const handleCustomDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCustomDate(event.target.value);
    };



    // Example of usage:
    const handleConfirmOrder = async (order:Order) => {
        const confirmed = window.confirm("Are you sure, you want to ADD this order?");

        if (confirmed) {
            if (!order.orderId || !order.orderItems||!order.name||!order.contact1||!order.city||!order.fullAmount ||!order.address){
                alert("Error - Invalid OrderId")
                return
            }
            let newOrderTracking=0
            try {
                const systemRef = doc(db, SYSTEM, "order_counter");
                const systemDoc = await getDoc(systemRef);
                const lastOrderTracking = systemDoc.exists() ? systemDoc.data().lastOrderTracking : 0;
                const finalTracking = systemDoc.exists() ? systemDoc.data().finalTracking : 0;

                if(lastOrderTracking===0 || finalTracking===0){
                    alert("Error - Tracking numbers are zero")
                    return
                }
               
                if (lastOrderTracking >= finalTracking){
                    alert("Error - Tracking numbers are exeed the limit")
                    return
                }else{
                  newOrderTracking = lastOrderTracking + 1;
                }


            } catch (error: unknown) {
                console.error("Error placing order:", error);
            
                if (error instanceof Error) {
                  return { success: false, error: error.message };
                }
            
                return { success: false, error: "An unknown error occurred" };
              }

            let description = ""
            for (const item of order.orderItems) {
                // Check if the product has sizes and quantities
                if (item.sizes) {
                    
                    for (const [size, qty] of Object.entries(item.sizes)) {
                        const itemDetails = `${description? ", ":""}${item.itemCode}-Size ${size}${qty>1? `(${qty})`:""}`
                        description +=itemDetails
                    }
                }
    
            }

            if (newOrderTracking===0){
                alert("Error - Tracking number is zeoro, it can't be")
                return
            }
            if (description===""){
                alert("Error - Description is empty, it can't be")
                return
            }


            // Proceed with adding the order
            const parcelData = {
                waybill_id: newOrderTracking.toString(),
                order_id: order.orderId.toString(),
                parcel_weight: '1',
                parcel_description: description,
                recipient_name: order.name,
                recipient_contact_1: order.contact1,
                recipient_contact_2: order.contact2 ||'',
                recipient_address: order.address,
                recipient_city: order.city,
                amount: order.fullAmount.toString(),
                exchange: '0',
              };

              console.log(parcelData)

              const responce = await sendParcelData(
                parcelData.waybill_id,
                parcelData.order_id,
                parcelData.parcel_weight,
                parcelData.parcel_description,
                parcelData.recipient_name,
                parcelData.recipient_contact_1,
                parcelData.recipient_contact_2,
                parcelData.recipient_address,
                parcelData.recipient_city,
                parcelData.amount,
                parcelData.exchange
              )

              if (responce) {
                 const statusChanged =updateOrderStatusAndTrackingNo (order.orderId,WAITING,newOrderTracking.toString())
                 .toString()
                if(! statusChanged){
                    alert(" Error : Parcel Status did not changed to \"WAITING\" !\n but order is successfully placed");
                }else{
                    setOrders((prevOrders) =>
                        prevOrders.map((o) =>
                            o.orderId === order.orderId ? { ...o, tracking: "newOrderTracking" } : o
                        )
                    );
                }

                // Any other success actions (e.g., reset form, navigate, etc.)
              } else {
                console.warn("Parcel sending failed.");
                // Optional: UI response or fallback
              }

        } else {
            // User cancelled the action
            console.log("Order not added.");
        }
    };


    // Update product stock after deleting an order
    const updateProductStock = async (orderItems: OrderItem[]): Promise<boolean> => {
        for (const item of orderItems) {
            if (item.productId) {
                // Get the product reference from Firestore
                const productRef = doc(db, PRODUCTS, item.productId);

                try {
                    // Get the current product data
                    const productSnapshot = await getDoc(productRef);

                    if (productSnapshot.exists()) {
                        const productData = productSnapshot.data() as Product;

                        let totalStock = productData.stock || 0; // Use 0 if no stock field exists
                        console.log(`Current stock for product ${item.productId}: ${totalStock}`);

                        // Check if the product has sizes and quantities
                        if (item.sizes) {
                            for (const [size, qty] of Object.entries(item.sizes)) {
                                const sizeNumber = parseInt(size);
                                totalStock += qty; // Add quantity back to total stock

                                // Ensure the sizes object exists
                                if (!productData.sizes) {
                                    productData.sizes = {};
                                }

                                // Increase the stock for the specific size
                                productData.sizes[sizeNumber] = (productData.sizes[sizeNumber] || 0) + qty;
                            }
                        }

                        // Update the product document with the new stock data
                        await updateDoc(productRef, {
                            sizes: productData.sizes,
                            stock: totalStock,
                        });

                        console.log(`Updated stock for product ${item.productId}: ${totalStock}`);
                    } else {
                        console.error(`Product not found for ID: ${item.productId}`);
                        return false; // Product not found
                    }
                } catch (error) {
                    console.error("Error updating product stock:", error);
                    return false; // Error occurred during the process
                }
            }
        }
        return true; // All stock updates completed successfully
    };

    // Delete order and update stock
    const handleDeleteOrder = async (order: Order) => {
        try {

            const confirmed = window.confirm("Are you sure you want to delete this order?");
            if (confirmed) {
                if (order.orderId){
                    const orderId = order.orderId
                    // Await the response from the async updateOrderStatus function
                    const response = await updateOrderStatus(orderId, CANCELLED);
                    // Get the order reference and delete the order
                            // Check if the response is true (success)
                    if (!response) {
                        alert(`Failed to cancel order with ID ${orderId}.`);
                        return
                    } 
                    // Update the local state with the new order status
                    setOrders((prevOrders) =>
                        prevOrders.map((o) =>
                            o.orderId === orderId ? { ...o, status: CANCELLED } : o
                        )
                    );

                    // Update the product stock before deleting the order
                    if (order.orderItems) {
                       const status = await updateProductStock(order.orderItems);
                       if (status){
                           alert(`Order with ID ${orderId} and its items have been deleted.`);
                       } else{
                           alert(`Error - Product size quantities did not updated while deleting`);

                       }
                    }else{
                        alert ("Error : Order items not availble in the order")
                    }
            
                }else{
                    alert("Error - Invalid Order Id");
                }
            }
  
        } catch (error) {
            alert(`Error deleting order: ${error}`);
            console.error("Error deleting order:", error);
        }
    };


    // Function to find users with multiple orders and their order IDs
    const getUsersWithMultipleOrders = (orders: Order[]): UserWithOrders[] => {
        const userOrderMap = new Map<string, number[]>();
      
        // Filter and group orders that have NEW_ORDER status
        for (const order of orders) {
          if (
            order.status === NEW_ORDER &&
            order.createdUserId && order.createdUserId!=="TACCO" &&
            typeof order.orderId === 'number'
          ) {
            const { createdUserId, orderId } = order;
      
            if (!userOrderMap.has(createdUserId)) {
              userOrderMap.set(createdUserId, []);
            }
      
            userOrderMap.get(createdUserId)!.push(orderId);
          }
        }
      
        // Extract users with more than one NEW_ORDER
        return Array.from(userOrderMap.entries())
          .filter(([, orderIds]) => orderIds.length > 1)
          .map(([userId, orderIds]) => ({ userId, orderIds }));
      };

    
    const formatUserId = (id?: string | number) => {
        if (!id) return '';
        const str = id.toString();
        return str.length > 8 ? `${str.slice(0, 4)}...${str.slice(-4)}` : str;
    };


    

    const TabPaneContent = ({ tabId, label, color, orders, status }: { tabId: string, label: string, color: string, orders: Order[], status: string }) => (
        <TabPane tabId={tabId}>
            <div className="row">
                {statusCounts[statusKeyMap[status]] > 0 ? (
                    <div className="table-responsive">
                        <table className="table cart-table">
                            <thead>
                                <tr>
                                    {multipleOrders.length>0 && status ===NEW_ORDER? <th scope="col"style={{color:"red"}} >Same User</th>: ""}
                                    <th scope="col">OrderId</th>
                                    <th scope="col">Tracking</th>
                                    <th scope="col">Items</th>
                                    <th scope="col">Total</th>
                                    <th scope="col">Details</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.filter(order => statusGroups[order.status as OrderStatus] === status).map(order => (
                                    <tr key={order.orderId}>
                                        {(() => {
                                            // Declare inside an IIFE (Immediately Invoked Function Expression)
                                            if (multipleOrders.length > 0 && status === NEW_ORDER) {
                                                const matched = multipleOrders.find(
                                                    multiple => multiple.userId === order.createdUserId
                                                );
                                                if (matched) {
                                                    return (
                                                    <>
                                                        <td style={{ color: "red" , fontWeight:"bold"}}>
                                                            <div>
                                                                {formatUserId(order.createdUserId)}
                                                            </div>

                                                            <div>
                                                                {matched.orderIds.map((id, i) => (
                                                                <div key={i} style={{color:"blue"}}>{id.toString()}</div>
                                                                ))}
                                                            </div>

                                                        </td>

                                                                                                        </>
                                                    );
                                                } else {
                                                
                                                    return (
                                                    <>
                                                        <td style={{ color: "green", fontWeight:"bold" }}>GENUINE</td>
                                                        
                                                    </>
                                                    );
                                                }
                                            } 
                                        })()}

                                        <td> <strong>{order.orderId?.toString()}</strong></td>
                                        <td>
                                            <div>
                                                <strong>{order.tracking?.toString()|| "N/A"}</strong>
                                            </div>
                                            <div>
                                                <strong style={{fontSize:"14px"}}>{order.fromWebsite? "Website":"Facebook"}</strong>
                                            </div>
                                        
                                            
                                        </td>
                                        <td>
                                            {order.orderItems?.map((item: OrderItem, itemIndex: number) => (
                                                Object.entries(item.sizes || {}).map(([size, quantity], sizeIndex) => (
                                                    quantity !== 0 ? (
                                                        <React.Fragment key={`${itemIndex}-${sizeIndex}`}>
                                                            <tr>
                                                                <td>{item.itemCode || "-"}</td>
                                                                <td>Size {size}</td>
                                                                <td>Qty: {quantity}</td>
                                                                <td>
                                                                    Rs. {item.price && item.discount !== undefined
                                                                        ? (Number(item.price) * ((100 - Number(item.discount)) / 100)).toLocaleString(undefined, {
                                                                            minimumFractionDigits: 0,
                                                                            maximumFractionDigits: 0,
                                                                        })
                                                                        : "N/A"}
                                                                </td>
                                                            </tr>
                                                        </React.Fragment>
                                                    ) : null
                                                ))
                                            ))}
                                        </td>
                                        <td>
                                            <strong> Rs. {order.fullAmount?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong> 
                                        </td>
                                        <td>
                                            <div>{order.name}</div>
                                            <div>{order.address}</div>
                                            <div>City - {order.city}</div>
                                            <div>
                                                {order.contact1 && (
                                                    <a href={`tel:${order.contact1.toString()}`} style={{ color: 'blue' }}>
                                                        {order.contact1.toString()}
                                                    </a>
                                                )}
                                            </div>
                                            <div>
                                                {order.contact2 && (
                                                    <a href={`tel:${order.contact2.toString()}`} style={{ color: 'blue' }}>
                                                        {order.contact2.toString()}
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            {status ===NEW_ORDER? (
                                                <div >
                                                    <button type="submit" className="custom-confirm-button" onClick={() => handleConfirmOrder(order)} >
                                                        <span>Confirm</span>
                                                    </button>
                                                    <button className="custom-cancel-button" onClick={() => handleDeleteOrder(order)}>
                                                        <span>Delete</span>
                                                    </button>
                                                </div>

                                            ):(
                                                ""
                                            )
                                            
                                        
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : loading ? (
                    <div className="loading-text">Loading...</div>
                ) : (
                    <div>No Orders Available</div>
                )}
            </div>
        </TabPane>
    );
    
    
    
    return (
        <React.Fragment>
            <div className="content-wrapper ">
                <main>
               
                    <div className="container">
                        <div className="row row--30  mb-3 mt-10">
                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="d-flex justify-content-between">
                                        <div className="container mt-10 mb-3" style={{padding:"0px"}}>
                                            <h3>Select a Date Range</h3>
                                            <Row>
                                                <Col md={4}>
                                                <Form>
                                                    <Input
                                                        type="select"
                                                        name="dateOption"
                                                        id="dateOption"
                                                        value={selectedOption}
                                                        onChange={handlePredefinedDateChange} 
                                                    >
                                                    <option value="7"> 7 Days</option>
                                                    <option value="14">14 Days</option>
                                                    <option value="21">21 Days</option>
                                                    <option value="30">30 Days</option>
                                                    <option value="custom">Custom Date</option>
                                                    </Input>
                                                </Form>
                                                </Col>

                                                {/* Custom Date Input */}
                                                {selectedOption === 'custom' && (
                                                <Col md={4}>
                                                    <Form>
                                                    <Input
                                                        type="date"
                                                        name="customDate"
                                                        id="customDate"
                                                        value={customDate}
                                                        onChange={handleCustomDateChange}
                                                    />
                                                    </Form>
                                                </Col>
                                                )}
                                                <Col md={4} className="align-items-center">
                                                    <div>
                                                        <h4>Selected From Date:</h4>
                                                    </div>
                                                    <div>
                                                        <h4>{startDate.toDateString()}</h4>
                                                    </div>
                                                </Col>
                                            </Row>

                                        </div>
                                  
                                    </div>

                                    <div className="properties__button text-center">
                                        <div className="d-flex" style={{paddingBottom:"10px", fontWeight:"bold"}}>
                                            Total Orders - {orders.length}
                                        </div>
                                        <nav>
                                            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                                {tabData.map((tab) => (
                                                    <a
                                                        key={tab.id}
                                                        className={classNames({
                                                            "nav-item nav-link": true,
                                                            active: verticalActiveTabWithIcon === tab.id,
                                                        })}
                                                        onClick={() => toggleVerticalIcon(tab.id)}
                                                    >
                                                        <div style={{ color: tab.color }}>
                                                            {tab.label}
                                                        </div>
                                                        <div style={{ color: tab.color }}>
                                                            {tab.count === 0 ? "" : `(${tab.count})`}
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        </nav>
                                    </div>

                                </div>
                            </div>
                        

                            <div className="col-lg-12  mb-3 mt-20">
                                <div className="course-sidebar-3 sidebar-top-position">
                                    <div className="edu-course-widget widget-course-summery ">

                                        <TabContent activeTab={verticalActiveTabWithIcon} className="text-muted mt-4 mt-xl-0 w-100">
                                            {tabData.map((tab) => (
                                                <TabPaneContent
                                                    key={tab.id}
                                                    tabId={tab.id}
                                                    label={tab.label}
                                                    color={tab.color}
                                                    orders={orders}
                                                    status={tab.status}
                                                />
                                            ))}
                                        </TabContent>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main >
            </div >

        </React.Fragment >
    );
};

export default Orders;

