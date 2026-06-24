import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateLeft,
  faCheck,
  faDownload,
  faReceipt,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import "./ReceiptView.css";

type ReceiptViewProps = {
  receiptId: string;
  customerEmail: string;
  customerName: string;
  planName: string;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: "card" | "apple-pay" | "klarna";
  onReset: () => void;
};

function getPaymentMethodLabel(method: "card" | "apple-pay" | "klarna") {
  if (method === "apple-pay") return "Apple Pay";
  if (method === "klarna") return "Klarna";
  return "Card";
}

export function ReceiptView({
  receiptId,
  customerEmail,
  customerName,
  planName,
  subtotal,
  tax,
  total,
  paymentMethod,
  onReset,
}: ReceiptViewProps) {
  return (
    <section className="receipt-view">
      <div className="receipt-success-icon">
        <FontAwesomeIcon icon={faCheck} />
      </div>

      <div className="receipt-heading">
        <span>
          <FontAwesomeIcon icon={faShieldHalved} />
          Payment successful
        </span>

        <h2>Your payment is complete</h2>

        <p>
          This is a demo receipt generated in test mode. No real payment was
          processed.
        </p>
      </div>

      <div className="receipt-card">
        <div className="receipt-card-header">
          <div>
            <span>Receipt</span>
            <strong>#{receiptId}</strong>
          </div>

          <div className="receipt-mini-icon">
            <FontAwesomeIcon icon={faReceipt} />
          </div>
        </div>

        <div className="receipt-lines">
          <div>
            <span>Product</span>
            <strong>{planName}</strong>
          </div>

          <div>
            <span>Customer</span>
            <strong>{customerName || "John Doe"}</strong>
          </div>

          <div>
            <span>Email</span>
            <strong>{customerEmail || "samuel@example.com"}</strong>
          </div>

          <div>
            <span>Payment method</span>
            <strong>{getPaymentMethodLabel(paymentMethod)}</strong>
          </div>
        </div>

        <div className="receipt-pricing">
          <div>
            <span>Subtotal</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>

          <div>
            <span>Tax</span>
            <strong>${tax.toFixed(2)}</strong>
          </div>

          <div className="receipt-total">
            <span>Total paid</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      <div className="receipt-actions">
        <button className="receipt-secondary-button" type="button">
          <FontAwesomeIcon icon={faDownload} />
          Download receipt
        </button>

        <button className="receipt-primary-button" type="button" onClick={onReset}>
          <FontAwesomeIcon icon={faArrowRotateLeft} />
          New payment
        </button>
      </div>
    </section>
  );
}