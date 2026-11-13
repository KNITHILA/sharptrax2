import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCatalog } from "../context/CatalogContext";
import { serviceUrl } from "../lib/serviceUrls";
import { isYouTubeUrl } from "../lib/catalogUtils";

interface GalleryItem {
  url: string;
  name: string;
  slug: string;
  categoryTitle: string;
}

interface VideoItem {
  url: string;
  name: string;
  categoryTitle: string;
}

export default function Gallery() {
  const { categories } = useCatalog();

  const allGalleryItems: GalleryItem[] = categories.flatMap((category) =>
    category.products.flatMap((product) =>
      product.imgs.map((imgUrl) => ({
        url: imgUrl,
        name: product.name,
        slug: product.slug,
        categoryTitle: category.title,
      })),
    ),
  );

  const allVideoItems: VideoItem[] = categories.flatMap((category) =>
    category.products.flatMap((product) =>
      (product.videos || []).map((vidUrl) => ({
        url: vidUrl,
        name: product.name,
        categoryTitle: category.title,
      })),
    ),
  );

  return (
    <div className="w-full min-h-screen bg-white pb-20 relative">
      <div className="h-20 md:h-32"></div>

      {/* HEADER */}
      <div className="w-full px-6 mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">GALLERY</h1>
        <div className="w-24 h-2 bg-red-600 mx-auto rounded-full mb-6"></div>
        <p className="text-gray-500 text-sm md:text-base max-w-3xl mx-auto uppercase tracking-widest font-medium">
          Showcasing our high-precision welding automation & industrial solutions
        </p>
      </div>

      {/* IMAGE GRID */}
      <div className="w-full px-4 md:px-10 max-w-screen-2xl mx-auto mb-32">
        {allGalleryItems.length === 0 && (
          <p className="text-center text-gray-400 font-medium">No images to show yet.</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
          {allGalleryItems.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: (index % 10) * 0.05 }}
              key={`${item.slug}-${index}`}
              className="group flex flex-col cursor-pointer"
            >
              <Link to={serviceUrl(item.slug)} className="flex flex-col">
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-sm bg-gray-50 border border-gray-200 transition-all duration-500 group-hover:border-red-500/50 group-hover:shadow-xl">
                  <img
                    src={item.url}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors duration-300 flex flex-col items-center justify-center p-4">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 font-bold tracking-widest text-xs border border-white/50 px-6 py-3 rounded-sm backdrop-blur-sm hover:bg-red-600 hover:border-red-600">
                      VIEW SPECIFICATIONS
                    </span>
                  </div>
                </div>

                <div className="mt-4 px-2">
                  <h3 className="text-sm md:text-base font-black text-gray-900 uppercase tracking-tight leading-tight transition-colors duration-300 group-hover:text-red-600 truncate">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="h-px w-4 bg-gray-300 group-hover:bg-red-500 transition-colors"></span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest truncate">
                      {item.categoryTitle}
                    </span>
                    <span className="h-px w-3 bg-gray-300 group-hover:bg-red-500 transition-colors"></span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* VIDEO SECTION */}
      {allVideoItems.length > 0 && (
        <div className="w-full bg-gray-50 py-24 border-t border-gray-200">
          <div className="w-full px-6 mb-16 text-center">
            <span className="text-red-600 font-bold tracking-widest text-xs uppercase mb-2 block">
              Our YouTube Channel & Media
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
              MACHINE DEMONSTRATIONS
            </h2>
            <div className="w-24 h-1.5 bg-red-600 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto font-medium">
              Watch our high-precision automated systems in action and see the engineering quality firsthand.
            </p>
          </div>

          <div className="w-full px-4 md:px-10 max-w-screen-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12">
              {allVideoItems.map((video, index) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                  key={`vid-${index}`}
                  className="flex flex-col bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-200 hover:shadow-xl hover:border-red-300 transition-all duration-300"
                >
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-900 shadow-inner">
                    {isYouTubeUrl(video.url) ? (
                      <iframe
                        className="w-full h-full absolute inset-0 border-0"
                        src={video.url}
                        title={`${video.name} Demonstration`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <video controls className="w-full h-full absolute inset-0 object-cover" src={video.url}>
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>

                  <div className="mt-6 flex flex-col items-center text-center">
                    <span className="text-[10px] text-red-600 font-bold uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full mb-3 inline-block">
                      {video.categoryTitle}
                    </span>
                    <h3 className="text-lg md:text-xl font-black text-gray-900 leading-tight">{video.name}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}