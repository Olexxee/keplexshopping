import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { verifyPayment } from "../../api/payment.api";
import { useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "../../utils/error";

type State = "loading" | "success" | "error";

export const PaymentCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<State>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const qc = useQueryClient();

  const reference = searchParams.get("reference");

  useEffect(() => {
    if (!reference) {
      setErrorMsg("No payment reference found.");
      setState("error");
      return;
    }

    verifyPayment(reference)
      .then(() => {
        // Invalidate orders so the list reflects the new paid order
        qc.invalidateQueries({ queryKey: ["orders"] });
        qc.invalidateQueries({ queryKey: ["cart"] });
        setState("success");
      })
      .catch((err) => {
        setErrorMsg(getErrorMessage(err));
        setState("error");
      });
  }, [reference]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 w-full max-w-md text-center">
        {state === "loading" && (
          <>
            <Loader size={40} className="mx-auto text-gray-400 animate-spin" />
            <h1 className="text-xl font-bold mt-5">Verifying payment...</h1>
            <p className="text-sm text-gray-400 mt-2">
              Please wait, do not close this page.
            </p>
          </>
        )}

        {state === "success" && (
          <>
            <CheckCircle size={40} className="mx-auto text-emerald-500" />
            <h1 className="text-xl font-bold mt-5">Payment successful</h1>
            <p className="text-sm text-gray-400 mt-2">
              Your order has been confirmed. You can track it in your orders.
            </p>
            <div className="flex flex-col gap-3 mt-8">
              <Link
                to="/orders"
                className="w-full bg-black text-white rounded-xl px-6 py-3 text-sm font-medium hover:bg-gray-800 transition"
              >
                View my orders
              </Link>
              <Link
                to="/shop"
                className="w-full border border-gray-200 rounded-xl px-6 py-3 text-sm font-medium hover:bg-gray-50 transition"
              >
                Continue shopping
              </Link>
            </div>
          </>
        )}

        {state === "error" && (
          <>
            <XCircle size={40} className="mx-auto text-red-400" />
            <h1 className="text-xl font-bold mt-5">Payment failed</h1>
            <p className="text-sm text-gray-400 mt-2">{errorMsg}</p>
            <div className="flex flex-col gap-3 mt-8">
              <Link
                to="/cart"
                className="w-full bg-black text-white rounded-xl px-6 py-3 text-sm font-medium hover:bg-gray-800 transition"
              >
                Back to cart
              </Link>
              <Link
                to="/orders"
                className="w-full border border-gray-200 rounded-xl px-6 py-3 text-sm font-medium hover:bg-gray-50 transition"
              >
                Check my orders
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
