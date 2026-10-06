// All static content for the Contact page.

export const CONTACT_EMAIL = "sharptrax@yahoo.com";
export const CONTACT_PHONE_HREF = "tel:+919840122149";
export const CONTACT_PHONE_DISPLAY = "+91 98401 22149";

// Google Maps Exact Location Embed URL for Sharptrax Technologies
export const MAP_EMBED_URL =
  "https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Sharp%20Trax%20Technologies,%20166,%2011th%20Main%20Rd,%20SIDCO%20Industrial%20Estate,%20Thirumudivakkam,%20Chennai,%20Tamil%20Nadu%20600132&t=&z=16&ie=UTF8&iwloc=B&output=embed";

export const mapModalContent = {
  title: "Sharptrax Technologies",
  subtitle: "SIDCO Industrial Estate, Thirumudivakkam, Chennai",
};

export const mapPreviewContent = {
  hoverLabel: "Click to View Map",
  companyName: "Sharptrax",
  addressLines: [
    "166, 11th Main Rd, SIDCO Industrial Estate,",
    "Thirumudivakkam, Chennai,",
    "Tamil Nadu 600132",
  ],
};

export const headingContent = {
  eyebrow: "Contact Engineering",
  title: "Ready to automate your workflow?",
};

export const infoCardsContent = {
  phoneLabel: "Phone Support",
  emailLabel: "Email Us",
};

export const formContent = {
  nameLabel: "Full Name",
  namePlaceholder: "e.g. Rahul Sharma",
  emailLabel: "Email Address",
  emailPlaceholder: "name@company.com",
  phoneLabel: "Phone Number",
  phonePlaceholder: "10-digit number",
  detailsLabel: "Project Requirements",
  detailsPlaceholder: "Tell us about your machinery requirements...",
  submitLabel: "Submit Enquiry",
  sendingLabel: "Opening Mail Client...",
};

export const statusMessages = {
  success: "Please complete sending the email from your mail client. Thank you!",
  error: `Failed to open mail client. Please email us directly at ${CONTACT_EMAIL}.`,
};