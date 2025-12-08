import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Button,
    Stepper,
    Step,
    StepLabel,
    IconButton,
    useMediaQuery,
    useTheme,
    Slide,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { CheckoutProvider } from './CheckoutContext';
import { useCheckout } from './useCheckout';
import { CartReviewStep } from './CartReviewStep';
import { ShippingStep } from './ShippingStep';
import { PaymentStep } from './PaymentStep';
import { ConfirmationStep } from './ConfirmationStep';
import { CHECKOUT_STEPS, CartData, CartItem } from './types';
import { Cart, Product } from '../../types';

const SlideTransition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface CheckoutWizardProps {
    open: boolean;
    onClose: () => void;
    cart: Cart | null;
    onCartChange: (cart: Cart) => void;
}

interface ApiCartItem {
    product: Product;
    quantity: number;
}

function CheckoutWizardContent({ onClose }: { onClose: () => void }) {
    const {
        currentStep,
        goNext,
        goBack,
        canProceed,
        orderStatus,
        validateShipping,
        validatePayment,
    } = useCheckout();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleNext = () => {
        if (currentStep === 1) {
            if (!validateShipping()) return;
        } else if (currentStep === 2) {
            if (!validatePayment()) return;
        }
        goNext();
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <CartReviewStep />;
            case 1:
                return <ShippingStep />;
            case 2:
                return <PaymentStep />;
            case 3:
                return <ConfirmationStep />;
            default:
                return null;
        }
    };

    const isOrderComplete = orderStatus === 'success';
    const isOrderFailed = orderStatus === 'error';

    return (
        <>
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>Checkout</Box>
                <IconButton
                    aria-label="close checkout"
                    onClick={onClose}
                    sx={{ color: 'grey.500' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            {!isOrderComplete && !isOrderFailed && (
                <Box sx={{ px: { xs: 2, sm: 4 }, pb: 2 }}>
                    <Stepper
                        activeStep={currentStep}
                        alternativeLabel={!isMobile}
                        orientation={isMobile ? 'vertical' : 'horizontal'}
                        sx={{
                            '& .MuiStepLabel-label': {
                                fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }
                        }}
                    >
                        {CHECKOUT_STEPS.map((label, index) => (
                            <Step key={label} completed={index < currentStep}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
            )}

            <DialogContent dividers sx={{ minHeight: { xs: 400, sm: 450 }, p: { xs: 2, sm: 3 } }}>
                {renderStep()}
            </DialogContent>

            {!isOrderComplete && !isOrderFailed && currentStep < 3 && (
                <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
                    <Button
                        onClick={goBack}
                        disabled={currentStep === 0}
                        startIcon={<ArrowBackIcon />}
                        sx={{ visibility: currentStep === 0 ? 'hidden' : 'visible' }}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={!canProceed}
                        endIcon={<ArrowForwardIcon />}
                    >
                        {currentStep === 2 ? 'Review Order' : 'Continue'}
                    </Button>
                </DialogActions>
            )}
        </>
    );
}

export function CheckoutWizard({ open, onClose, cart, onCartChange }: CheckoutWizardProps) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const cartData: CartData | null = cart ? {
        items: cart.items.map((item: Product | ApiCartItem): CartItem => {
            if ('product' in item && 'quantity' in item) {
                const apiItem = item as ApiCartItem;
                return { product: apiItem.product, quantity: apiItem.quantity };
            }
            const productItem = item as Product;
            return { product: productItem, quantity: productItem.itemInCart || 1 };
        }),
        totalPrice: cart.totalPrice,
        totalItems: cart.totalItems,
    } : null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={fullScreen}
            maxWidth="md"
            fullWidth
            TransitionComponent={SlideTransition}
            aria-labelledby="checkout-dialog-title"
        >
            <CheckoutProvider
                initialCart={cartData}
                onCartChange={(data) => {
                    onCartChange({
                        items: data.items as unknown as Product[],
                        totalPrice: data.totalPrice,
                        totalItems: data.totalItems,
                    });
                }}
                onClose={onClose}
            >
                <CheckoutWizardContent onClose={onClose} />
            </CheckoutProvider>
        </Dialog>
    );
}

