import { PaymentForm } from "./components/PaymentForm/PaymentForm";
import "./App.css";
import "./index.css";

export default function App() {
  return (
    <main className="checkout-page">
      <div className="gradient-floor" />
      <PaymentForm />
    </main>
  );
}