import CheckOutCoin from "../containers/Wallet/CheckoutCoin";
import Subscription from "../containers/Post/Subscription";
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
    {
        path: "/subscription",
        component: Subscription,
        layout: null
    },
    {
        path: "/checkoutCoin",
        component: CheckOutCoin,
        layout: null
    },
];

export default thanhToanRoutes;