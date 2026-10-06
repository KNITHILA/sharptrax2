import { type FormEvent, useRef, useState } from "react";
import { buildMailtoUrl, readEnquiryFields } from "../utils/enquiryMail";

export type SubmitStatus = "idle" | "success" | "error";

const SUCCESS_DELAY_MS = 800;
const STATUS_RESET_DELAY_MS = 6000;

export function useContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

  // Email client redirect
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);
    setSubmitStatus("idle");

    if (!formRef.current) return;

    try {
      const fields = readEnquiryFields(formRef.current);

      // Trigger the default email client to open with the pre-filled data
      window.location.href = buildMailtoUrl(fields);

      // Simulate a quick success state to provide user feedback
      setTimeout(() => {
        setSubmitStatus("success");
        formRef.current?.reset();
        setIsSending(false);
        setTimeout(() => setSubmitStatus("idle"), STATUS_RESET_DELAY_MS);
      }, SUCCESS_DELAY_MS);
    } catch (error) {
      console.error("Error formatting email:", error);
      setSubmitStatus("error");
      setIsSending(false);
    }
  };

  return { formRef, isSending, submitStatus, handleSubmit };
}