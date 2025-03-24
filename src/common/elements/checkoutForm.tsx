import React, { useState, FormEvent } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from "reactstrap";
import './checkoutForm.css';
import { Order,OrderItem } from "../../models/Order";
import { placeNewOrder } from "../../firebase/placeNewOrder";

// List of cities for auto-suggest
const citiesList = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"];

interface CheckoutModalProps {
  isOpen: boolean;
  toggle: () => void;
  newOrder: Order | undefined;

}

const CheckoutForm: React.FC<CheckoutModalProps> = ({ isOpen, toggle, newOrder  }) => {

  // States for form fields
  const [recipientName, setRecipientName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [contact1, setContact1] = useState<string>("");
  const [contact2, setContact2] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // To store error messages
  const [loading, setLoading] = useState<boolean>(false); // State for loading spinner

  if (!isOpen) {
    return null;  // If modal isn't open, don't render the content
  }

  console.log(newOrder?.orderItems);

  // Regex for validating Sri Lankan contact numbers
  const phoneNumberRegex = /^(?:\+94|0)(71|72|75|76|77|78|79|11|21|22|23|24|25|26|27|28|29|31|32|33|34|35|36|37|38|39|41|42|43|44|45|46|47|48|49|51|52|53|54|55|56|57|58|59|61|62|63|64|65|66|67|68|69|81|82|83|84|85|86|87|88|89|91|92|93|94|95|96|97|98|99)\d{7}$/;

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate contact numbers
    let validationErrors: { [key: string]: string } = {};

    if (!phoneNumberRegex.test(contact1)) {
      validationErrors.contact1 = "Invalid number";
    }
    if (contact2 && !phoneNumberRegex.test(contact2)) {
      validationErrors.contact2 = "Invalid number";
    }
    if (paymentMethod === "") {
      validationErrors.paymentMethod = "Select payment method";
    }

    // If there are validation errors, set them and don't submit the form
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const isConfirmed = window.confirm("Are you sure?");
    if (!isConfirmed) return; // If not confirmed, exit early


    if (newOrder) {
      // Assign form fields to newOrder
      newOrder.address = address ?? "";
      newOrder.city = city ?? "";
      newOrder.contact1 = contact1 ?? "";
      newOrder.contact2 = contact2 ?? "";
      newOrder.paymentMethod = paymentMethod ?? "";

      setLoading(true); // Set loading to true while processing the order

      try {
        // Place the new order and handle response
        const response = await placeNewOrder(newOrder);

        if (response.success) {
          // Handle success (e.g., show success message)
          alert("Order placed successfully!");
                    // Assuming the checkout was successful, call the onSubmit callback
  
         


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
      } finally {
        setLoading(false); // Reset loading state
      }
    }

    resetForm();
    toggle();
  };

  // Reset form fields
  const resetForm = () => {
    setRecipientName("");
    setAddress("");
    setCity("");
    setContact1("");
    setContact2("");
    setPaymentMethod("cash");
    setErrors({}); // Reset errors
  };


  return (
    <Modal className="checkout-modal" isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>Checkout</ModalHeader>

    {newOrder?.orderItems?.map((item: OrderItem, index: number) => (
        <div key={index} className="cart-item-div">
            <div className="w-100">
                <div key={index} className="d-flex justify-content-between align-items-center w-100" style={{padding:"10px 3px 0px 3px"}}> {/* Add key to each item for efficient re-renders */}
                    
                    <div className="d-flex" style={{padding:"0px 20px 0px 0px"}} >{index + 1}</div>
                    <div className="cart-item-col1">
                        <div>
                             <img src={item.mainImage} className="thumbnail-image" style={{borderRadius:"5px"}} />
                        </div>
                    </div>
                   
                    <div className="cart-item-col2 " style={{padding:"0px 0px 0px 10px"}}>
                        <div className="cart-para">
                            {item.title}
                        </div>
                        <div>
                            {item.sizes? Object.entries(item.sizes).map(([size, quantity]) => (
                                <div key={size} className="cart-para">
                                    <div>Size {size} &nbsp; | &nbsp; Qty: {quantity} </div>
                                </div>
                    
                            )): ""}
                        </div>
    
                    </div>   
                    <div className="d-flex justify-content-end align-items-start" style={{minWidth: "100px"}}>
                            Rs{" "}
                            {(Number(item.quantity) * Number(item.price) * ((100 - Number(item.discount)) / 100))
                            .toLocaleString(undefined, { 
                                minimumFractionDigits: 0, 
                                maximumFractionDigits: 0 
                            })}
                    </div>                       
                </div>
            </div>
        </div>
            ))}

        <div className="" style={{padding:"20px 20px 0px 20px", fontSize:"14px"}}>

            <div className="d-flex justify-content-between">
                <div>
                    Subtotal
                </div>
                <div>
                    Rs {(newOrder?.amount||0).toLocaleString(undefined, { 
                                minimumFractionDigits: 0, 
                                maximumFractionDigits: 0 })}
                </div>
            </div>
            <div className="d-flex justify-content-between">
                <div>
                    Delivery Charges 
                </div>
                <div>
                    {newOrder?.deliverCharges === 0 ? (
                        <span style={{ color: "green" }}>Free</span>
                    ) : (
                        `Rs ${(newOrder?.deliverCharges || 0).toLocaleString(undefined, { 
                        minimumFractionDigits: 0, 
                        maximumFractionDigits: 0 
                        })}`
                    )}
                </div>
            </div>
            <div className="d-flex justify-content-between" style={{fontWeight:"bold", paddingTop:"10px"}}>
                <div>
                    Total
                </div>
                <div>
                    Rs {((newOrder?.amount || 0) + (newOrder?.deliverCharges || 0)).toLocaleString(undefined, { 
                    minimumFractionDigits: 0, 
                    maximumFractionDigits: 0 })}

                </div>
            </div>
         

        </div>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          {/* Recipient Name */}
          <FormGroup className="margin-bottom">
            <Label for="recipient-name">
              Name <span className="required">*</span>
            </Label>
            <Input
              type="text"
              id="recipient-name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              required
              placeholder="Enter recipient's name"
            />
          </FormGroup>

          {/* Recipient Address */}
          <FormGroup className="margin-bottom">
            <Label for="address">
              Address <span className="required">*</span>
            </Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="Enter your shipping address"
              rows={3}
            />
          </FormGroup>

          {/* City Selection */}
          <FormGroup className="margin-bottom">
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
              {citiesList.map((cityOption, index) => (
                <option key={index} value={cityOption}>
                  {cityOption}
                </option>
              ))}
            </Input>
          </FormGroup>

          {/* Contact Numbers */}
          <div className="form-row">
            <FormGroup className="col-md-6 margin-bottom" style={{ paddingLeft: "0px" }}>
              <Label for="contact1">
                Contact Num 01 <span className="required">*</span>
              </Label>
              <Input
                type="tel"
                id="contact1"
                value={contact1}
                onChange={(e) => setContact1(e.target.value)}
                required
                placeholder="Enter number"
                invalid={!!errors.contact1} // Show validation error
              />
              {errors.contact1 && <div className="required">{errors.contact1}</div>}
            </FormGroup>

            <FormGroup className="col-md-6 margin-bottom" style={{ paddingRight: "0px" }}>
              <Label for="contact2">Contact Num 02 </Label>
              <Input
                type="tel"
                id="contact2"
                value={contact2}
                onChange={(e) => setContact2(e.target.value)}
                placeholder="Enter number"
                invalid={!!errors.contact2} // Show validation error
              />
              {errors.contact2 && <div className="required">{errors.contact2}</div>}
            </FormGroup>
          </div>

          {/* Payment Methods */}
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

          {/* Card Details */}
          {paymentMethod === "card" && (
            <div className="card-details">
              <div className="form-row">
                <FormGroup className="col-md-6">
                  <Label for="name">
                    Name on Card <span className="required">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    required
                    placeholder="Enter the name on the card"
                  />
                </FormGroup>

                <FormGroup className="col-md-6">
                  <Label for="card-number">
                    Card Number <span className="required">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="card-number"
                    required
                    placeholder="Enter your card number"
                  />
                </FormGroup>
              </div>

              <div className="form-row">
                <FormGroup className="col-md-4">
                  <Label for="expiry-date">
                    Expiry Date <span className="required">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="expiry-date"
                    required
                    placeholder="MM/YY"
                  />
                </FormGroup>

                <FormGroup className="col-md-4">
                  <Label for="cvv">
                    CVV <span className="required">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="cvv"
                    required
                    placeholder="Enter CVV"
                  />
                </FormGroup>
              </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <button className="custom-cancel-button"  onClick={toggle}>
            <span>Cancel</span>
          </button>
          <button type="submit" className="custom-confirm-button" >
            <span>Confirm</span>
          </button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default CheckoutForm;
