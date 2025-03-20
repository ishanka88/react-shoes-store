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
} from "reactstrap";

import './checkoutForm.css';


// List of cities for auto-suggest
const citiesList = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"];

interface CheckoutModalProps {
  isOpen: boolean;
  toggle: () => void;

}

const CheckoutForm: React.FC<CheckoutModalProps> = ({ isOpen, toggle }) => {
  // States for form fields
  const [recipientName, setRecipientName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [contact1, setContact1] = useState<string>("");
  const [contact2, setContact2] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("none");
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // To store error messages

  // Regex for validating Sri Lankan contact numbers
  const phoneNumberRegex = /^(?:\+94|0)(71|72|75|76|77|78|79|11|21|22|23|24|25|26|27|28|29|31|32|33|34|35|36|37|38|39|41|42|43|44|45|46|47|48|49|51|52|53|54|55|56|57|58|59|61|62|63|64|65|66|67|68|69|81|82|83|84|85|86|87|88|89|91|92|93|94|95|96|97|98|99)\d{7}$/;

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validate contact numbers
    let validationErrors: { [key: string]: string } = {};
    if (!phoneNumberRegex.test(contact1)) {
      validationErrors.contact1 = "Invalid number";
      
    }
    if (contact2 && !phoneNumberRegex.test(contact2)) {
      validationErrors.contact2 = "Invalid number";
      
    }

    // If there are validation errors, set them and don't submit the form
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const isConfirmed = window.confirm("Are you sure?");
    if (!isConfirmed) return; // If not confirmed, exit early

    // If no validation errors, proceed with form submission
    alert(`Order placed successfully with the following details:
      Name: ${recipientName}
      Address: ${address}, ${city}
      Contact: ${contact1}, ${contact2}
      Payment: ${paymentMethod === "cash" ? "Cash on Delivery" : "Card Payment"}`);

    // Reset form and close modal
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
                placeholder="Enter primary contact num"
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
                placeholder="Enter alternate contact num"
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
              <option value="none">Select</option>
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
