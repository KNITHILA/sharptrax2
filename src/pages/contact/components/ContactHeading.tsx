import { headingContent } from "../data/contactContent";

export default function ContactHeading() {
  return (
    <div className="relative z-10 mb-6">
      <span className="text-red-600 font-bold tracking-[0.2em] text-[10px] uppercase mb-1.5 block">
        {headingContent.eyebrow}
      </span>
      <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-tight">
        {headingContent.title}
      </h2>
    </div>
  );
}