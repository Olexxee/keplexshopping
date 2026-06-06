import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { verifyPayment } from "../../api/payment.api";

export const PaymentCallbackPage = () => {
  const [params] = useSearchParams();

  const navigate = useNavigate();

  useEffect(() => {
    const reference = params.get("reference");

    if (!reference) {
      navigate("/orders");
      return;
    }

    const verify = async () => {
      try {
        await verifyPayment(reference);

        navigate("/orders");
      } catch {
        navigate("/orders");
      }
    };

    verify();
  }, []);

  return (
    <div className="flex justify-center py-20">
      <p>Verifying payment...</p>
    </div>
  );
};
