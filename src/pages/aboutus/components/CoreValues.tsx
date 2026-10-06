import { coreValuesContent } from "../data/aboutContent";

export default function CoreValues() {
  return (
    <section className="bg-neutral-800 py-20 text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-16">
          {coreValuesContent.title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreValuesContent.items.map((item) => (
            <div
              key={item.title}
              className={`p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition${
                item.fullWidthOnTablet ? " sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <h3 className="text-xl font-bold mb-4 text-red-500">
                {item.title}
              </h3>
              <p className="text-sm text-gray-400">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}