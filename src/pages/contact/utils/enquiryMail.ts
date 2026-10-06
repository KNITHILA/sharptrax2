import { CONTACT_EMAIL } from "../data/contactContent";

export interface EnquiryFields {
  name: string;
  email: string;
  phone: string;
  details: string;
}

/** Reads the enquiry values from the form element. */
export function readEnquiryFields(form: HTMLFormElement): EnquiryFields {
  const formData = new FormData(form);
  return {
    name: formData.get("user_name") as string,
    email: formData.get("user_email") as string,
    phone: formData.get("user_phone") as string,
    details: formData.get("project_details") as string,
  };
}

/** Builds the pre-filled mailto: link (same subject/body as before). */
export function buildMailtoUrl({ name, email, phone, details }: EnquiryFields): string {
  // Construct the email subject and body
  const subject = encodeURIComponent(`New Machinery Enquiry from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nProject Requirements:\n${details}`
  );

  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}