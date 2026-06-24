import { useState } from "react";
import { ReceiptView } from "../ReceiptView/ReceiptView";
import { QuickPayOverlay } from "../QuickPayOverlay/QuickPayOverlay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple } from "@fortawesome/free-brands-svg-icons";
import {
  faCreditCard,
  faEnvelope,
  faLock,
  faSpinner,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import visaLogo from "../../assets/payment/visa.svg";
import mastercardLogo from "../../assets/payment/mastercard.svg";
import amexLogo from "../../assets/payment/amex.svg";
import klarnaLogo from "../../assets/payment/klarna.svg";

import "./PaymentForm.css";

type PaymentStatus = "idle" | "processing" | "success";
type PaymentMethod = "card" | "apple-pay" | "klarna";
type QuickPayMethod = Exclude<PaymentMethod, "card">;

type FormData = {
  email: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  name: string;
  country: string;
  zip: string;
};

type Errors = Partial<Record<keyof FormData, string>>;

const initialFormData: FormData = {
  email: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
  name: "",
  country: "United States",
  zip: "",
};

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);

  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
}

function validateForm(formData: FormData) {
  const errors: Errors = {};
  const cardDigits = formData.cardNumber.replace(/\D/g, "");

  if (!formData.email.includes("@")) {
    errors.email = "Enter a valid email.";
  }

  if (cardDigits.length !== 16) {
    errors.cardNumber = "Card number must be 16 digits.";
  }

  if (!formData.expiry.trim()) {
    errors.expiry = "Expiry is required.";
  }

  if (!formData.cvc.trim()) {
    errors.cvc = "CVC is required.";
  }

  if (!formData.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!formData.zip.trim()) {
    errors.zip = "ZIP is required.";
  }

  return errors;
}

export function PaymentForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [receiptId, setReceiptId] = useState("PP-2026-001");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [quickPayMethod, setQuickPayMethod] = useState<QuickPayMethod | null>(null);

  const subtotal = 8.45;
  const tax = 4.75;
  const total = subtotal + tax;

  function updateField(field: keyof FormData, value: string) {
    let nextValue = value;

    if (field === "cardNumber") {
      nextValue = formatCardNumber(value);
    }

    if (field === "expiry") {
      nextValue = formatExpiry(value);
    }

    if (field === "cvc") {
      nextValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setFormData((current) => ({
      ...current,
      [field]: nextValue,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  function resetPayment() {
    setFormData(initialFormData);
    setErrors({});
    setStatus("idle");
  }

  function completeFakePayment(method: PaymentMethod, delay = 1200) {
    setPaymentMethod(method);
    setStatus("processing");

    window.setTimeout(() => {
      const randomReceiptNumber = Math.floor(100000 + Math.random() * 900000);
      setReceiptId(`PP-${randomReceiptNumber}`);
      setStatus("success");
    }, delay);
  }

  function startQuickPay(method: QuickPayMethod) {
    setPaymentMethod(method);
    setQuickPayMethod(method);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    completeFakePayment("card");
  }

  return (
    <section className="payment-shell">
      <div className="payment-card">
        {status === "success" ? (
          <ReceiptView
            receiptId={receiptId}
            customerEmail={formData.email}
            customerName={formData.name}
            planName="Digital Product Pro"
            subtotal={subtotal}
            tax={tax}
            total={total}
            paymentMethod={paymentMethod}
            onReset={resetPayment}
          />
        ) : (
          <>
            <div className="product-preview">
              <div className="product-art">
                <div className="product-cube cube-one" />
                <div className="product-cube cube-two" />
                <div className="product-cube cube-three" />
              </div>

              <div className="product-info">
                <span>Netflix Subscription | 1 Month</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
            </div>

            <div className="quick-pay-desktop">
              <button
                className="quick-pay-logo-btn apple-pay-logo-btn"
                type="button"
                aria-label="Apple Pay"
                onClick={() => startQuickPay("apple-pay")}
              >
                <span className="apple-pay-mark">
                  <FontAwesomeIcon icon={faApple} />
                  <span>Pay</span>
                </span>
              </button>

              <button
                className="quick-pay-logo-btn klarna-logo-btn"
                type="button"
                aria-label="Klarna"
                onClick={() => startQuickPay("klarna")}
              >
                <img src={klarnaLogo} alt="Klarna" />
              </button>
            </div>

            <div className="quick-pay-mobile">
              <button className="quick-pay-full-btn apple-pay-full-btn" type="button">
                <span className="apple-pay-mark">
                  <FontAwesomeIcon icon={faApple} />
                  <span>Pay</span>
                </span>
                <span className="quick-pay-label">Pay with Apple Pay</span>
              </button>

              <button className="quick-pay-full-btn klarna-full-btn" type="button">
                <img src={klarnaLogo} alt="" aria-hidden="true" />
                <span className="quick-pay-label">Pay using Klarna</span>
              </button>
            </div>

            <div className="payment-divider">
              <span />
              <p>Or pay with card</p>
              <span />
            </div>

            <form className="payment-form" onSubmit={handleSubmit}>
              <label className="payment-field">
                <span>
                  <FontAwesomeIcon icon={faEnvelope} />
                  Email
                </span>

                <input
                  type="email"
                  placeholder="samuel@example.com"
                  value={formData.email}
                  onChange={(event) => updateField("email", event.target.value)}
                />

                {errors.email && <small>{errors.email}</small>}
              </label>

              <div className="payment-field">
                <span>
                  <FontAwesomeIcon icon={faCreditCard} />
                  Card information
                </span>

                <div className="card-input-group">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="1234 1234 1234 1234"
                    maxLength={19}
                    value={formData.cardNumber}
                    onChange={(event) => updateField("cardNumber", event.target.value)}
                  />

                  <div className="card-brand-row">
                    <img src={visaLogo} alt="Visa" />
                    <img src={mastercardLogo} alt="Mastercard" />
                    <img src={amexLogo} alt="American Express" />
                  </div>

                  <div className="split-inputs">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="MM / YY"
                      maxLength={7}
                      value={formData.expiry}
                      onChange={(event) => updateField("expiry", event.target.value)}
                    />

                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="CVC"
                      maxLength={4}
                      value={formData.cvc}
                      onChange={(event) => updateField("cvc", event.target.value)}
                    />
                  </div>
                </div>

                {(errors.cardNumber || errors.expiry || errors.cvc) && (
                  <small>{errors.cardNumber || errors.expiry || errors.cvc}</small>
                )}
              </div>

              <label className="payment-field">
                <span>
                  <FontAwesomeIcon icon={faUser} />
                  Name on card
                </span>

                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(event) => updateField("name", event.target.value)}
                />

                {errors.name && <small>{errors.name}</small>}
              </label>

              <div className="payment-field">
                <span>Country or region</span>

                <div className="country-group">
                  <select
                    value={formData.country}
                    onChange={(event) => updateField("country", event.target.value)}
                  >
                    <option>United States</option>
                    <option>Sweden</option>
                    <option>United Kingdom</option>
                    <option>Germany</option>
                    <option>Norway</option>
                    <option>Denmark</option>
                  </select>

                  <input
                    type="text"
                    placeholder="ZIP"
                    value={formData.zip}
                    onChange={(event) => updateField("zip", event.target.value)}
                  />
                </div>

                {errors.zip && <small>{errors.zip}</small>}
              </div>

              <div className="total-row">
                <span>Total</span>
                <strong>${total.toFixed(2)}</strong>
              </div>

              <button
                className="submit-payment-button"
                type="submit"
                disabled={status === "processing"}
              >
                {status === "processing" ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    Processing...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faLock} />
                    Pay ${total.toFixed(2)}
                  </>
                )}
              </button>
            </form>

            <p className="payment-note">
              Demo checkout only. This form does not process real payments.
            </p>
          </>
        )}
      </div>

      <QuickPayOverlay
        method={quickPayMethod}
        onClose={() => setQuickPayMethod(null)}
        onComplete={(method) => {
          setQuickPayMethod(null);
          completeFakePayment(method, 350);
        }}
      />
    </section>
  );
}