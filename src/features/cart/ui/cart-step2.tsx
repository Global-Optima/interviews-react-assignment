import { zodResolver } from "@hookform/resolvers/zod";
import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useStepperContext } from "../../../shared/hooks/useStepperContext";
import { useCartForm } from "../hooks/use-cart-form";

const shippingSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .min(10, "Phone number must be at least 10 digits"),
  deliveryTimeSlot: z.enum(["morning", "afternoon", "evening"], {
    errorMap: () => ({ message: "Please select a delivery time slot" }),
  }),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

export const CartStep2 = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      fullName: "",
      address: "",
      city: "",
      postalCode: "",
      phone: "",
      deliveryTimeSlot: undefined,
    },
  });

  const { nextPage } = useStepperContext();
  const { setShipping } = useCartForm();

  const [isLoaded, setIsLoaded] = useState(false);

  const formData = watch();

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("storage_key_shipping_details");
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        reset(parsedData);
      } catch (error) {
        console.error("Failed to parse saved shipping details:", error);
      }
    }
    setIsLoaded(true);
  }, [reset]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(
        "storage_key_shipping_details",
        JSON.stringify(formData)
      );
    }
  }, [formData, isLoaded]);

  const onSubmit = (data: ShippingFormData) => {
    console.log("Form is valid:", data);
    setShipping(data);
    nextPage();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxHeight: "500px", overflowY: "auto", px: 1 }}
    >
      <Typography variant="h6" gutterBottom>
        Shipping Details
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 2 }}>
        <Controller
          name="fullName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Full Name"
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
              fullWidth
              required
            />
          )}
        />

        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Address"
              error={!!errors.address}
              helperText={errors.address?.message}
              fullWidth
              required
              multiline
              rows={2}
            />
          )}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="City"
                error={!!errors.city}
                helperText={errors.city?.message}
                fullWidth
                required
              />
            )}
          />

          <Controller
            name="postalCode"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Postal Code"
                error={!!errors.postalCode}
                helperText={errors.postalCode?.message}
                fullWidth
                required
              />
            )}
          />
        </Box>

        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Phone Number"
              error={!!errors.phone}
              helperText={errors.phone?.message}
              fullWidth
              required
              type="tel"
            />
          )}
        />

        <Controller
          name="deliveryTimeSlot"
          control={control}
          render={({ field }) => (
            <FormControl component="fieldset" error={!!errors.deliveryTimeSlot}>
              <FormLabel component="legend">Delivery Time Slot *</FormLabel>
              <RadioGroup {...field}>
                <FormControlLabel
                  value="morning"
                  control={<Radio />}
                  label="Morning (8:00 AM - 12:00 PM)"
                />
                <FormControlLabel
                  value="afternoon"
                  control={<Radio />}
                  label="Afternoon (12:00 PM - 5:00 PM)"
                />
                <FormControlLabel
                  value="evening"
                  control={<Radio />}
                  label="Evening (5:00 PM - 9:00 PM)"
                />
              </RadioGroup>
              {errors.deliveryTimeSlot && (
                <FormHelperText>
                  {errors.deliveryTimeSlot.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
      </Box>
      <Button
        variant="contained"
        color="primary"
        type="submit"
        sx={{ width: "100%" }}
      >
        Continue
      </Button>
    </Box>
  );
};
