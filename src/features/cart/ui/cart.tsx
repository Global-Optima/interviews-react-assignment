import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Badge } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { StepperPage } from "../../../shared/model/types";
import { Stepper } from "../../../shared/ui/stepper";
import { useCart } from "../hooks/use-cart";
import { CartStep1 } from "./cart-step1";
import { CartStep2 } from "./cart-step2";
import { CartStep3 } from "./cart-step3";
import { CartStep4 } from "./cart-step4";

export default function Cart() {
  const { cart } = useCart();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const pages: StepperPage[] = [
    {
      id: "page1",
      label: "Page 1",
      content: (
        <CartStep1 />
      ),
    },
    {
      id: "page2",
      label: "Page 2",
      content: (
        <CartStep2 />
      ),
    },
    {
      id: "page3",
      label: "Page 3",
      content: (
        <CartStep3></CartStep3>
      ),
    },
    {
      id: "page4",
      label: "Page 4",
      content: (
        <CartStep4></CartStep4>
      ),
    },
  ];

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Badge
        badgeContent={cart?.totalItems || 0}
        color="secondary"
        onClick={handleOpen}
        style={{ cursor: "pointer" }}
      >
        <ShoppingCartIcon />
      </Badge>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} >
    
          <Stepper pages={pages} />
        </Box>
      </Modal>
    </>
  );
}
