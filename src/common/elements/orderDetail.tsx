import React from "react";
import "./orderDetail.css";
import { Order, OrderItem } from "../../models/Order";
import { DAMAGED, DATA_CHANGED, DELIVERED, DISPATCHED, HOLD, NEW_ORDER, PICKUP, PROCESSING, REARRANGE, RESCHEDULE, RETURN, RETURN_COMPLETE, RETURN_PENDING, RETURN_TRANSFER, TRANSFER, WAITING,CANCELLED } from "../../utils/parcelsStatus";
import { useProductData } from "../../context/DataContext";




export default function OrderDetail({ order }: { order: Order | null }) {
    const total = order?.fullAmount || 0;
    const items: OrderItem[] = (order?.orderItems || []).slice().reverse();
    const { productsList , loading } = useProductData();
    

    function renderStatusUI(status: string) {
      switch (status) {
        case NEW_ORDER:
          return (
            <span className="order-status" style={{ color: '#3B82F6', backgroundColor: '#DBEAFE' }}>
              Waiting
            </span>
          );
    
        case WAITING:
          return (
            <span className="order-status" style={{ color: '#F59E0B', backgroundColor: '#FEF3C7' }}>
              Processing
            </span>
          );
    
        case PROCESSING:
          return (
            <span className="order-status" style={{ color: '#6366F1', backgroundColor: '#E0E7FF' }}>
              Processing
            </span>
          );
    
        case DISPATCHED:
          return (
            <span className="order-status" style={{ color: '#0EA5E9', backgroundColor: '#E0F2FE' }}>
              Dispatched
            </span>
          );
    
        case PICKUP:
          return (
            <span className="order-status" style={{ color: '#06B6D4', backgroundColor: '#CFFAFE' }}>
              Pickup
            </span>
          );
    
        case TRANSFER:
          return (
            <span className="order-status" style={{ color: '#8B5CF6', backgroundColor: '#EDE9FE' }}>
              Transfer
            </span>
          );
    
        case DATA_CHANGED:
          return (
            <span className="order-status" style={{ color: '#F97316', backgroundColor: '#FFEDD5' }}>
              Data Changed
            </span>
          );
    
        case HOLD:
          return (
            <span className="order-status" style={{ color: '#B45309', backgroundColor: '#FEF3C7' }}>
              Hold
            </span>
          );
    
        case RESCHEDULE:
          return (
            <span className="order-status" style={{ color: '#059669', backgroundColor: '#D1FAE5' }}>
              Reschedule
            </span>
          );
    
        case REARRANGE:
          return (
            <span className="order-status" style={{ color: '#0D9488', backgroundColor: '#CCFBF1' }}>
              Rearrange
            </span>
          );
    
        case RETURN:
          return (
            <span className="order-status" style={{ color: '#F43F5E', backgroundColor: '#FFE4E6' }}>
              Return
            </span>
          );
    
        case RETURN_TRANSFER:
          return (
            <span className="order-status" style={{ color: '#E11D48', backgroundColor: '#FECDD3' }}>
              Return
            </span>
          );
    
        case RETURN_COMPLETE:
          return (
            <span className="order-status" style={{ color: '#EC4899', backgroundColor: '#FCE7F3' }}>
              Return
            </span>
          );
    
        case RETURN_PENDING:
          return (
            <span className="order-status" style={{ color: '#DB2777', backgroundColor: '#FBCFE8' }}>
              Return
            </span>
          );
    
        case DAMAGED:
          return (
            <span className="order-status" style={{ color: '#B91C1C', backgroundColor: '#FECACA' }}>
              Damaged
            </span>
          );
    
        case DELIVERED:
          return (
            <span className="order-status" style={{ color: '#2B8A3E', backgroundColor: '#D3F9D8' }}>
              Delivered
            </span>
          );
    
        case CANCELLED:
          return (
            <span className="order-status" style={{ color: '#EF4444', backgroundColor: '#FECACA' }}>
              Cancelled
            </span>
          );
    
        default:
          return (
            <span className="order-status" style={{ color: '#6B7280', backgroundColor: '#E5E7EB' }}>
              {status}
            </span>
          );
      }
    }
    
    
    

  return (
    <div className="order-detail-container" style={{width:"100%"}}>
      <h1 className="order-title">Order ID: #{order?.orderId}</h1>

      <div className="order-card" style={{width:"100%"}}>
        <div>
          <div className="order-header">
            <div className="order-id">Tracking No: {order?.tracking}</div>
            <div className="order-status">
              {renderStatusUI(order?.status || '')}  
            </div>
          </div>

        </div>

        <div className="order-shipment">
          <div className="shipment-progress">
            <p className="label">From :</p>
            <p>TACCO, Ambalangoda.</p>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <p className="label">To: {order?.city}</p>
          </div>
          <div>
            <p className="label">Estimated Arrival</p>
            <p>9 July 2024</p>
          </div>
          <div>
            <p className="label">Delivered in</p>
            <p>5 Days</p>
          </div>
        </div>

        <div className="order-info">
          <div>
            <p className="label">Contact for fast delivery</p>
            <p>Tracking No: {order?.tracking}</p>
            <p>Fardar Express Domestic (PVT) LTD</p>
            <p>{order?.trackingLocation} Branch </p>
            <p>Contact: Branch </p>
          </div>
          <div>
            <p className="label">Order Date :</p>
            <p>{order?.createdAt?.toDate().toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
       
        </div>

        <div className="items-section">
          <h2 className="section-title">Items</h2>
          <div className="items-grid">
            {items.map((item, i) => (
              <div key={i} className="item-card">
                <img
                  src={productsList.find(p => p.productId === item.productId)?.mainImages[0] || '/placeholder.jpg'}
                  alt={item.title}
                  className="item-image"
                />
                <p className="item-name">{item.title}</p>
                <div className="d-flex align-item-center justify-content-center" style={{marginBottom:"10px", gap:"5px"}}>
                    <div className="d-flex align-item-center ">
                      <span className="item-price">
                        Rs.&nbsp;
                        {item?.price && item?.discount !== undefined
                          ? (Number(item.price)).toLocaleString(undefined, { 
                              minimumFractionDigits: 0, 
                              maximumFractionDigits: 0 
                            })
                          : "N/A"}
                      </span>
                    </div>
                    <div className="d-flex  justify-content-start align-item-center " >
                      {item.discount===0? "":<span className="discount hero-subHeading " style={{margin:"0px"}}>&nbsp;{item.discount}%</span>}

                    </div>
                </div>
                {Object.entries(item.sizes || {}).map(([size, quantity], i) => (
                  <p key={i} className="item-size">Size: {size} (Quantity: {quantity})</p>
                ))}


              </div>
            ))}
          </div>
        </div>

        <div className="order-summary " style={{width:"100%"}}>
          <h2 className="section-title">Order Summary</h2>
          <ul className="summary-list">
            {items.map((item, i) => (
              <li key={i} className="summary-item">
                <span>{item.title}</span>
                <span>
                {item.quantity?.toLocaleString()} X Rs {((item.price || 0) * ((100 - Number(item.discount || 0)) / 100)).toLocaleString(undefined, { 
                              minimumFractionDigits: 2, 
                              maximumFractionDigits: 2 
                            }) }
                </span>

              </li>
            ))}
          </ul>
          <div className="summary-total">
            <span>Total</span>
            <span>Rs {total.toLocaleString(undefined, { 
                              minimumFractionDigits: 2, 
                              maximumFractionDigits: 2 
                            })}</span>
          </div>
        </div>

        <div className="order-actions">
          <button className="btn-outline">Contact Seller</button>
          <button className="btn-primary">Invoice</button>
        </div>
      </div>
    </div>
  );
}
