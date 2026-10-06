import type { FormEvent, RefObject } from "react";
import { formContent } from "../data/contactContent";
import type { SubmitStatus } from "../hooks/useContactForm";
import { SpinnerIcon } from "./ContactIcons";
import EnquiryStatus from "./EnquiryStatus";

interface ContactFormProps {
  formRef: RefObject<HTMLFormElement | null>;
  isSending: boolean;
  submitStatus: SubmitStatus;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function ContactForm({ formRef, isSending, submitStatus, onSubmit }: ContactFormProps) {
  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-4 relative z-10 pb-2">

      <div>
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1 block">
          {formContent.nameLabel} <span className="text-red-500">*</span>
        </label>
        <input
          name="user_name"
          type="text"
          required
          placeholder={formContent.namePlaceholder}
          className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1 block">
            {formContent.emailLabel} <span className="text-red-500">*</span>
          </label>
          <input
            name="user_email"
            type="email"
            required
            placeholder={formContent.emailPlaceholder}
            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all shadow-sm"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1 block">
            {formContent.phoneLabel} <span className="text-red-500">*</span>
          </label>
          <input
            name="user_phone"
            type="tel"
            required
            pattern="[0-9]{10}"
            placeholder={formContent.phonePlaceholder}
            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all shadow-sm"
          />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1 block">
          {formContent.detailsLabel} <span className="text-red-500">*</span>
        </label>
        <textarea
          name="project_details"
          required
          rows={2}
          placeholder={formContent.detailsPlaceholder}
          className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all resize-none shadow-sm"
        ></textarea>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSending}
          className={`w-full py-3.5 rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-md flex justify-center items-center gap-3 ${
            isSending
              ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
              : "bg-gray-900 text-white hover:bg-red-600 active:scale-[0.98]"
          }`}
        >
          {isSending ? (
            <>
              <SpinnerIcon className="animate-spin h-4 w-4 text-gray-500" />
              {formContent.sendingLabel}
            </>
          ) : (
            formContent.submitLabel
          )}
        </button>
      </div>

      <EnquiryStatus status={submitStatus} />
    </form>
  );
}