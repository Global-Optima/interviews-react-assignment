import { useCartForm } from "../hooks/use-cart-form";

export const CartStep4 = () => {
    const {shipping, payment} = useCartForm()

    console.log('Shipping:', shipping);
    console.log('Payment:', payment);

    return <div>Order Confirmation Step</div>;
}