import React from "react";
import ".././Styles/paymentsuccess.css";
import { Checkmark } from "react-checkmark";

function PaymentSuccess() {
  return (
    <div className="card">
      <Checkmark size="xxLarge" />
      <h1 className="center">Thank you.</h1>
      <h4 className="center">Your order has been placed successfully.</h4>
      <h4 className="center">
        We will immediately process your order and it will be delivered in 30 minutes.
      </h4>
    </div>
  );
}

export default PaymentSuccess;
