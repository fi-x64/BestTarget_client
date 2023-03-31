import CheckOut from "../containers/Wallet/Checkout";
import PaymentResult from "../containers/Wallet/PaymentResult";
import WalletDashboard from "../containers/Wallet/WalletDashboard";

const thanhToanRoutes = [
    {
        path: "/walletDashboard",
        component: WalletDashboard,
        layout: null
    },
    {
        path: "/checkout",
        component: CheckOut,
        layout: null
    },
    {
        path: "/paymentResult",
        component: PaymentResult,
        layout: null
    },
];

export default thanhToanRoutes;