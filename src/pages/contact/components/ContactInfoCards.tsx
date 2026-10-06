import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
  infoCardsContent,
} from "../data/contactContent";
import { MailIcon, PhoneIcon } from "./ContactIcons";

export default function ContactInfoCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 relative z-10">
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-red-200 transition-colors">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-600 shadow-sm shrink-0">
          <PhoneIcon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{infoCardsContent.phoneLabel}</p>
          <a href={CONTACT_PHONE_HREF} className="text-gray-900 text-sm font-bold hover:text-red-600 transition-colors block">
            {CONTACT_PHONE_DISPLAY}
          </a>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-red-200 transition-colors">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-600 shadow-sm shrink-0">
          <MailIcon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{infoCardsContent.emailLabel}</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-gray-900 text-sm font-bold hover:text-red-600 transition-colors block">
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </div>
  );
}