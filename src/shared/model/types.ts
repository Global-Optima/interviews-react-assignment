import { ReactNode } from "react";

export interface StepperPage {
  id: string;
  label: string;
  content: ReactNode;
}