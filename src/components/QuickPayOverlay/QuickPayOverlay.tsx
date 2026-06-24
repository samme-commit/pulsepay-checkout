import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple } from "@fortawesome/free-brands-svg-icons";
import {
  faCamera,
  faCheck,
  faQrcode,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import klarnaLogo from "../../assets/payment/klarna.svg";
import "./QuickPayOverlay.css";

type QuickPayMethod = "apple-pay" | "klarna";

type QuickPayOverlayProps = {
  method: QuickPayMethod | null;
  onClose: () => void;
  onComplete: (method: QuickPayMethod) => void;
};

const activeQrCells = new Set([
  0, 1, 2, 4, 6,
  7, 10, 12, 13,
  14, 16, 17, 20,
  21, 22, 24, 26, 27,
  29, 31, 32, 34,
  35, 37, 39, 40, 41,
  43, 45, 46, 48,
]);

export function QuickPayOverlay({
  method,
  onClose,
  onComplete,
}: QuickPayOverlayProps) {
  const [isFlashing, setIsFlashing] = useState(false);

  const qrCells = useMemo(() => Array.from({ length: 49 }), []);

  useEffect(() => {
    if (!method) return;

    setIsFlashing(false);

    const flashTimer = window.setTimeout(() => {
      setIsFlashing(true);
    }, 1700);

    const completeTimer = window.setTimeout(() => {
      onComplete(method);
    }, 2350);

    return () => {
      window.clearTimeout(flashTimer);
      window.clearTimeout(completeTimer);
    };
  }, [method, onComplete]);

  if (!method) return null;

  const isApplePay = method === "apple-pay";

  return (
    <div className="quickpay-backdrop" onClick={onClose}>
      <article
        className={`quickpay-modal ${isFlashing ? "is-flashing" : ""}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button className="quickpay-close" type="button" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <div className="quickpay-brand">
          {isApplePay ? (
            <div className="quickpay-apple">
              <FontAwesomeIcon icon={faApple} />
              <span>Pay</span>
            </div>
          ) : (
            <img src={klarnaLogo} alt="Klarna" />
          )}
        </div>

        <div className="quickpay-copy">
          <span>
            <FontAwesomeIcon icon={faQrcode} />
            Secure quick checkout
          </span>

          <h2>
            {isApplePay ? "Confirm with Apple Pay" : "Approve with Klarna"}
          </h2>

          <p>
            Scan the code to simulate a secure payment approval. This is a
            portfolio demo only.
          </p>
        </div>

        <div className="quickpay-scan-stage">
          <div className="quickpay-corners" />

          <div className="quickpay-qr">
            {qrCells.map((_, index) => (
              <span
                key={index}
                className={activeQrCells.has(index) ? "is-active" : ""}
              />
            ))}
          </div>

          <div className="quickpay-scan-line" />
          <div className="quickpay-flash" />
        </div>

        <div className="quickpay-status">
          {isFlashing ? (
            <>
              <FontAwesomeIcon icon={faCheck} />
              Payment approved
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faCamera} />
              Waiting for scan...
            </>
          )}
        </div>
      </article>
    </div>
  );
}