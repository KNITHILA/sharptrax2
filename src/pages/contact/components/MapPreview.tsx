import { Fragment } from "react";
import {
  CONTACT_EMAIL,
  MAP_EMBED_URL,
  mapPreviewContent,
} from "../data/contactContent";
import { BuildingIcon, MailIcon, MapPinIcon } from "./ContactIcons";

interface MapPreviewProps {
  onOpen: () => void;
}

export default function MapPreview({ onOpen }: MapPreviewProps) {
  const { hoverLabel, companyName, addressLines } = mapPreviewContent;

  return (
    <div
      onClick={onOpen}
      className="w-full lg:w-5/12 relative min-h-[350px] lg:min-h-full bg-gray-100 cursor-pointer group overflow-hidden shrink-0"
    >
      <iframe
        src={MAP_EMBED_URL}
        className="absolute inset-0 w-full h-full pointer-events-none group-hover:scale-105 transition-all duration-[800ms]"
        style={{ border: 0 }}
      ></iframe>

      <div className="absolute inset-0 bg-red-600/0 group-hover:bg-black/10 transition-colors duration-500 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur px-5 py-2.5 rounded-full shadow-2xl font-bold text-red-600 text-sm translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2">
          <MapPinIcon className="w-4 h-4" />
          {hoverLabel}
        </div>
      </div>

      <div className="absolute bottom-5 left-5 right-5 md:bottom-8 md:left-8 md:right-8 bg-white/95 backdrop-blur-md p-5 md:p-6 rounded-2xl shadow-xl border border-white/50 transition-transform duration-500 group-hover:-translate-y-2">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center border border-red-100 shrink-0">
            <BuildingIcon className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-xl font-black text-gray-900 leading-none">{companyName}</h3>
        </div>

        <p className="text-gray-600 font-medium leading-snug text-sm mb-2">
          {addressLines.map((line, index) => (
            <Fragment key={line}>
              {line}
              {index < addressLines.length - 1 && <br />}
            </Fragment>
          ))}
        </p>
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-red-600 font-bold text-sm hover:text-red-700 transition-colors flex items-center gap-1.5">
          <MailIcon className="w-4 h-4" />
          {CONTACT_EMAIL}
        </a>
      </div>
    </div>
  );
}