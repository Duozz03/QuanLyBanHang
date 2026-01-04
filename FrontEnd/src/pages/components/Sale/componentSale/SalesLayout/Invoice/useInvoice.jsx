import { useContext } from "react";
import { InvoiceContext } from "./InvoiceContext";

export const useInvoice = () => useContext(InvoiceContext);
