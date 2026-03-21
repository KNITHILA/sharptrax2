import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// --- TYPESCRIPT INTERFACES ---
interface Product {
  name: string;
  desc: string;
  features?: string[];
  imgs: string[];
  videos?: string[];
}

interface Category {
  id: string;
  title: string;
  products: Product[];
}

interface GalleryItem {
  url: string;
  name: string;
  categoryTitle: string;
  categoryId: string;
  productData: Product;
}

interface VideoItem {
  url: string;
  name: string;
  categoryTitle: string;
}

// --- DATA ---
const categories: Category[] = [
  {
    id: "welding-automation",
    title: "Welding Automation",
    products: [
      {
        name: "Robotic Automation",
        desc: "Robotic automation is at the core of Sharptrax Technologies’ advanced welding solutions. With cutting-edge robotic welding systems, we help industries achieve higher precision, efficiency, and productivity in their manufacturing processes. Sharptrax Technologies offers over 20 years of experience as a leader and innovator integrating automation and robotics for the welding industry.",
        features: [
          "Our robotic systems can be seamlessly integrated into existing production lines, ensuring minimal disruption and maximum efficiency.",
          "Robots deliver consistent weld quality, reducing errors and minimizing material wastage.",
        ],
        imgs: [
          "/servicemachines/welding automation/1/mac1.1.jpg",
          "/servicemachines/welding automation/1/mac1.2.jpg",
          "/servicemachines/welding automation/1/mac1.3.jpg",
          "/servicemachines/welding automation/1/mac1.4.jpg",
        ],
        videos: ["/servicemachines/welding automation/1/mac1.mp4"],
      },
      {
        name: "Plasma Transferred Arc Welding System",
        desc: "Plasma Transferred Arc (PTA) Welding is a highly advanced and precise welding process designed for hard-facing, cladding, and high-quality metal deposition. At Sharptrax Technologies, we specialize in PTA welding solutions that enhance the durability and performance of industrial components, reducing wear and tear in extreme working conditions.",
        features: [
          "The system enables high-precision metering of metallic powder, significantly reducing material waste and lowering overall costs compared to traditional welding methods.",
          "Designed for seamless integration into automated workflows, PTAW ensures consistent, high-quality hardfacing results with exceptional repeatability.",
        ],
        imgs: [
          "/servicemachines/welding automation/2/mac2.1.jpg",
        "/servicemachines/welding automation/2/mac2.2.jpg",
          "/servicemachines/welding automation/2/mac2.4.jpg",
        ],
        videos: ["/servicemachines/welding automation/2/mac2.mp4"],
      },
      {
        name: "Welding Rotator",
        desc: "At Sharptrax Technologies, our welding rotators are designed to enhance efficiency, precision, and safety in welding operations. These automated positioning systems help in rotating cylindrical workpieces, ensuring uniform welding and reduced manual effort.",
        features: [
          "Available in various weight load capacities ranging from 5 tonnes to 200 tonnes to suit heavy-duty industrial needs.",
          "Offers versatile variants including Self-centric Welding Rotators and Conventional Rotator systems.",
          "Highly adaptable design capable of accommodating vessel diameters ranging from 150 mm to 8000 mm.",
          "Fully customizable configurations available to meet specific project requirements and workshop layouts.",
        ],
        imgs: [
          "/servicemachines/welding automation/3/mac3.1.jpg",
          "/servicemachines/welding automation/3/mac3.2.jpg",
        "/servicemachines/welding automation/3/mac3.3.jpg",
        ],
        videos: ["https://www.youtube.com/embed/cBOZVaN1GsM?si=LuCX_UTH5Y9NGtGj"],
      },
      {
        name: "Pull-Through Welding Automation System",
        desc: "At Sharptrax Technologies, our Pull-Through Welding Automation System is designed to enhance productivity, consistency, and precision in welding applications. This advanced system automates the welding process for long and continuous workpieces, ensuring seamless joint quality and reduced manual intervention.",
        imgs: [
          "/servicemachines/welding automation/4/mac4.1.jpg",
          "/servicemachines/welding automation/4/mac4.2.jpg",
        "/servicemachines/welding automation/4/mac4.3.jpg",
        ],
        videos: ["https://www.youtube.com/embed/G5TqVsDJ62o?si=METj7Kg_ixayYyuS"],
      },
      {
        name: "MIG-Welding System",
        desc: "At Sharptrax Technologies, our MIG-Welding System is designed for high-speed, high-quality welding, making it ideal for industrial and manufacturing applications. Using Metal Inert Gas (MIG) welding, this system provides strong, precise, and efficient welds across various materials, including mild steel, stainless steel, and aluminum.",
        imgs: [
          "/servicemachines/welding automation/5/mac5.1.jpg",
          "/servicemachines/welding automation/5/mac5.2.jpg",          "/servicemachines/welding automation/5/mac5.4.jpg",
        ],
        videos: ["https://www.youtube.com/embed/Z9gzJC5pDxM?si=ww20AIUTtnhd93lq"],
      },
      {
        name: "TIG Longitudinal Welding SPM",
        desc: "At Sharptrax Technologies, our TIG-Linear Welding SPM (Special Purpose Machine) is designed for high-precision linear welding applications. This system utilizes Tungsten Inert Gas (TIG) welding, ensuring clean, strong, and defect-free welds with superior control and consistency. It is ideal for industries requiring fine, high-quality welding on long and straight workpieces.",
       imgs: [
          "/servicemachines/welding automation/6/mac6.2.jpg",
          "/servicemachines/welding automation/6/mac6.3.jpg",
       ],
        videos: ["https://www.youtube.com/embed/cwhK_j6G0Jk?si=U_lvArkXTWm9FX8j"],
      },
      {
        name: "SAW-Submerged Arc Welding",
        desc: "At Sharptrax Technologies, our Submerged Arc Welding (SAW) system is engineered for high-deposition, deep-penetration welding that ensures strong, defect-free welds with minimal spatter. SAW is widely used in industries that require high-strength, heavy-duty welding applications, such as shipbuilding, structural fabrication, and pipeline construction.",
        imgs: [
        "/servicemachines/welding automation/7/mac7.1.jpg",
          "/servicemachines/welding automation/7/mac7.4.jpg",
        ],
      },
      {
        name: "Column And Boom",
        desc: "At Sharptrax Technologies, we provide high-performance Column and Boom welding systems, designed to enhance precision, efficiency, and automation in welding processes. Our customized solutions cater to industries requiring high-quality, consistent, and automated welding operations for large structures and complex fabrication.",
        imgs: [
          "/servicemachines/welding automation/8/mac8.1.jpg",
        "/servicemachines/welding automation/8/mac8.2.jpg",
        ],
      },
      {
        name: "Port Welding Machine SPM",
        desc: "At Sharptrax Technologies, we specialize in providing customized Port Welding Machine SPM (Special Purpose Machine) designed for high-precision and efficient welding operations in various industries. Our SPM solutions ensure enhanced productivity, accuracy, and automation, reducing manual labor and operational costs.",
        features: [
          "Automated & High-Precision Welding – Ensures consistent weld quality and high accuracy with minimal human intervention.",
          "Custom-Built for Specific Applications – Provides tailored engineering solutions designed to meet unique and complex industrial requirements.",
        ],
        imgs: [
          "/servicemachines/welding automation/9/mac9.1.jpg",
         "/servicemachines/welding automation/9/mac9.3.jpg",
        ],
        videos: ["/servicemachines/welding automation/9/mac9.mp4"],
      },
      {
        name: "Head & Tailstock Units",
        desc: "Sharptrax offers very high quality Head & Tailstock Units, which can be used to hold various components for welding, customised solution is also available in Sharptrax.",
        features: [
          "Synchronized Vertical Adjustment – Features precise vertical height control synchronized across both Head & Tailstock units.",
          "High Payload Versatility – Available in various configurations to support load capacities ranging up to 50 tonnes.",
          "Robust Construction – Engineered with a solid frame designed specifically for superior weight balancing and durability.",
          "Precision Positioning – Motorized and Servo-driven options are available to ensure micron-level positioning accuracy.",
          "Economical Pipe Handling – Provides a practical and cost-effective solution for all industrial pipe holding requirements.",
          "Robotic Integration – Designed for seamless synchronization with external robots to create fully automated welding cells.",
          "High Operational Efficiency – Delivers a high strength-to-weight ratio ensuring efficient handling of heavy workpieces.",
        ],
        imgs: [
          "/servicemachines/welding automation/10/mac10.1.jpg",
          "/servicemachines/welding automation/10/mac10.2.jpg",
          "/servicemachines/welding automation/10/mac10.3.jpg",
          "/servicemachines/welding automation/10/mac10.4.jpg",
        ],
      },
      {
        name: "Hydraulic End Cap Welding SPM",
        desc: "The Hydraulic End Cap Welding SPM is a specialized machine designed for precise and efficient welding of end caps with hydraulic control. It ensures stable positioning, uniform weld quality, and enhanced productivity for industrial applications.",
        features: [
          "Advanced PLC Control – Utilizes a PLC-controlled weld sequence for precise automation and consistent weld bead quality.",
          "Integrated Steady Rest – Equipped with a steady rest to ensure stable support and ease of operation during loading and unloading.",
          "Flexible Diameter Capacity – Available in various sizes to accommodate workpiece diameters ranging from 50 mm to 300 mm.",
          "Heavy-Duty Construction – Features a solid, robust build optimized for superior weight balancing and vibration-free operation.",
          "Advanced PLC Control – Utilizes a PLC-controlled weld sequence for precise automation and consistent weld bead quality.",
          "Multi-Job Programming – Supports multi-program storage, allowing users to program and switch between different job specifications easily.",
        ],
        imgs: [
          "/servicemachines/welding automation/11/mac11.1.jpg",
          "/servicemachines/welding automation/11/mac11.2.jpg",        ],
      },
      {
        name: "TANKWELD-PRO Automated Tank Welding Solution",
        desc: "An ultra-high precision, ultra-heavy duty gantry-style automated welding system. Designed to seamlessly fuse thick metal tubes and end caps into airtight, high-integrity pressure vessels and storage tanks.",
        features: [
          "Automated Seam Tracking & Joint Sensing",
          "High-Deposition multi-process welding (MIG, TIG, Sub-Arc compatible)",
          "Consistent, defect-free weld quality with reduce spatter",
          "Significantly reduces manual operator labor and associated costs",
          "Multi-pass capability for thick-walled vessels with robust weld joint designs",
          "Tank Diameter Range: 300 mm to 2 m | Tank Length Range: 300 mm to 3 m",
          "Multi-Axis PLC Control with HMI Touch Interface",
        ],
        imgs: [
          "/servicemachines/pipe_vessel_welder/gantry_photo_1.png",
          "/servicemachines/pipe_vessel_welder/labeled_photo_1.png",
          "/servicemachines/pipe_vessel_welder/brochure_view_1.png",
        ],
        videos: [
         "/servicemachines/membrane/mac21.2.mp4",
        ],
      },
      {
        name: "Robotic Gantry Automation",
        desc: "Robotic Gantry Automation is a cornerstone of Sharptrax Technologies’ heavy-duty manufacturing solutions. By utilizing overhead gantry systems integrated with high-performance robotics, we provide expansive work envelopes and superior flexibility for large-scale welding and assembly tasks.",
        features: [
          "Overhead configurations maximize floor space and allow for handling large, heavy workpieces.",
          "Multi-axis gantry movement combined with robotic precision ensures consistent, high-quality welds.",
        ],
        imgs: [
          "/servicemachines/welding automation/12/mac12.1.jpg",
          "/servicemachines/welding automation/12/mac12.2.jpg",

        ],
      },
      {
        name: "Robotic Trolley Welding",
        desc: "Sharptrax Technologies’ Robotic Trolley Welding systems provide an agile solution for manufacturing environments requiring mobility and flexibility. By mounting robotic arms on synchronized automated trolleys, we enable the system to traverse linear tracks.",
        features: [
          "Linear track integration allows for a single robotic unit to service multiple welding fixtures.",
          "High-precision servo-driven trolleys ensure seamless synchronization.",
        ],
        imgs: [
          "/servicemachines/welding automation/13/mac13.1.jpg",
          "/servicemachines/welding automation/13/mac13.2.jpg",
        ],
      },
      {
        name: "Material Tilter",
        desc: "Sharptrax Technologies’ Material Tilters are engineered for high-stability tilting of heavy job components across diverse industrial applications. Built with a solid construction for optimal weight balancing.",
        features: [
          "Available in both motorized and hydraulic-based configurations.",
          "Advanced PLC and servo-controlled options available for high precision.",
        ],
        imgs: [
          "/servicemachines/welding automation/14/mac14.1.jpg",
         "/servicemachines/welding automation/14/mac14.3.jpg",
        ],
      },
    ],
  },
  {
    id: "welding-positioners",
    title: "Welding Positioners",
    products: [
      {
        name: "Welding Positioners",
        desc: "At Sharptrax Technologies, our welding positioners are designed to enhance efficiency, precision, and safety in welding operations. These advanced positioning systems allow welders to rotate and tilt workpieces into the optimal position.",
        features: [
          "Wide Load Capacity Range – Available from 50 kg to 20 tons.",
          "Adjustable Center of Gravity – Engineered for 75 mm to 300 mm ranges.",
        ],
       imgs: [
          "/servicemachines/welding positioners/1/pos1.2.jpg",
        "/servicemachines/welding positioners/1/pos1.3.jpg",
        ],
        videos: ["https://www.youtube.com/embed/o1akniqVvt0?si=mPwanL_oIURSJjcU"],
      },
      {
        name: "L-Type Positioner",
        desc: "Sharptrax offers extensive range of L type Positioners for manipulating various types of components, Servo/VFD driven for positioning the arms.",
        features: [
          "Full Rotational Range – Equipped with 360-degree rotation.",
          "Dual-Axis Servo Control – Powered by high-performance servo drives.",
        ],
        imgs: [
        "/servicemachines/welding positioners/2/pos2.2.jpg",
         "/servicemachines/welding positioners/2/pos2.4.jpg",
        ],
      },
      {
        name: "Scissor Rollers",
        desc: "Sharptrax offers very high quality Scissor Rollers, which can be used to hold your pipe as a support for your existing machines.",
        imgs: [
        "/servicemachines/welding positioners/3/pos3.2.jpg",
          "/servicemachines/welding positioners/3/pos3.3.jpg",
          "/servicemachines/welding positioners/3/pos3.4.jpg",
        ],
      },
      {
        name: "Welding Turn Table",
        desc: "We offer excellent quality range of Welding Positioners (Manipulators) that are made from quality raw material. Widely used in various industrial applications.",
        imgs: [
          "/servicemachines/welding positioners/4/pos4.1.jpg",
          "/servicemachines/welding positioners/4/pos4.2.jpg",
      ],
      },
    ],
  },
  {
    id: "cnc-cutting",
    title: "Plasma CNC Cutting Machine",
    products: [
      {
        name: "Plasma CNC Machine",
        desc: "At Sharptrax Technologies, we specialize in trading high-quality Plasma CNC Cutting Machines designed for precision cutting, high-speed performance, and superior efficiency.",
        features: [
          "High-Precision Cutting – Accurate cuts across various metal thicknesses.",
          "CNC-Controlled Automation – User-friendly programming interfaces.",
        ],
        imgs: [
          "/servicemachines/plasma cnc/mac1.1.jpg",
          "/servicemachines/plasma cnc/mac1.2.jpg",
          "/servicemachines/plasma cnc/mac1.3.jpg",
          "/servicemachines/plasma cnc/mac1.4.jpg",
        ],
      },
    ],
  },
  {
    id: "accessories",
    title: "Machine Accessories",
    products: [
      {
        name: "Torch Weaving Unit",
        desc: "At Sharptrax Technologies, our Torch Weaving Unit is designed to enhance welding precision by introducing a controlled weaving motion to the welding torch.",
        features: [
          "Precise Width Control – Offers a 0 – 40 mm weaving width.",
          "Advanced Linear Motion – Ball screw transmission for maximum durability.",
        ],
        imgs: [
         "/servicemachines/machine accessories/1/acc1.1.jpg",
          "/servicemachines/machine accessories/1/acc1.3.jpg",
          "/servicemachines/machine accessories/1/acc1.4.jpg",
        ],
      },
      {
        name: "AVC Unit",
        desc: "Automatic Voltage Controller (AVC) unit for TIG and Plasma welding process. Built with LM guideway slides and Servo Motors.",
        imgs: [
          "/servicemachines/machine accessories/2/acc2.1.jpg",
          "/servicemachines/machine accessories/2/acc2.2.jpg",
        ],
      },
      {
        name: "Laser Seam Tracking Unit",
        desc: "Our Laser Seam Tracking Unit enables tracking of almost all weld joints to avoid manual intervention. Compatible with all major robot brands.",
        features: [
          "Automatic Real-Time Detection – Adjusts to seam variations during operation.",
          "Precision Laser Guidance – Ensures the torch follows exact seam path.",
        ],
        imgs: [
          "/servicemachines/machine accessories/3/acc3.1.jpg",
          "/servicemachines/machine accessories/3/acc3.2.jpg",
          "/servicemachines/machine accessories/3/acc3.3.jpg",
          "/servicemachines/machine accessories/3/acc3.4.jpg",
        ],
      },
      {
        name: "Welding Torch",
        desc: "We manufacture high quality PTA (Plasma Transferred Arc) welding Torches for all your hardfacing/cladding applications.",
        imgs: [
          "/servicemachines/machine accessories/4/acc4.1.jpg",
          "/servicemachines/machine accessories/4/acc4.2.jpg",
          "/servicemachines/machine accessories/4/acc4.3.jpg",
        ],
      },
      {
        name: "Cross Slides",
        desc: "We manufacture cross slide Units for Torch manipulation using LM rails and lead screw combinations.",
        imgs: ["/servicemachines/machine accessories/5/acc5.1.jpg"],
      },
    ],
  },
  {
    id: "membrane-panel",
    title: "Membrane Panel Welding Machine",
    products: [
      {
        name: "Membrane Panel Welding System",
        desc: "Our state-of-the-art membrane panel welding line is designed to seamlessly fuse steel tubes and fin bars into high-quality, airtight membrane panels. Built with a robust, vibration-dampening frame, the system integrates advanced multi-head welding technology with heavy-duty material handling to maximize your production output.",
        imgs: [
          "/servicemachines/membrane/mac20.1.jpg", 
        ],
        videos: [
          "/servicemachines/membrane/mac21.2.mp4"
        ]
      },
    ],
  },
];

export default function Gallery() {
  const navigate = useNavigate();

  // Extract all images for the Image Gallery
  const allGalleryItems: GalleryItem[] = categories.flatMap((category) =>
    category.products.flatMap((product) =>
      product.imgs.map((imgUrl) => ({
        url: imgUrl,
        name: product.name,
        categoryTitle: category.title,
        categoryId: category.id,
        productData: product, 
      }))
    )
  );

  // Extract all videos for the new Video Section
  const allVideoItems: VideoItem[] = categories.flatMap((category) =>
    category.products.flatMap((product) =>
      (product.videos || []).map((vidUrl) => ({
        url: vidUrl,
        name: product.name,
        categoryTitle: category.title,
      }))
    )
  );

  // Navigation handler
  const handleImageClick = (categoryId: string, productName: string) => {
    // Navigates to the exact same URL structure the Navbar uses to open the specific machine
    navigate(`/services?cat=${categoryId}&prod=${encodeURIComponent(productName)}`);
    window.scrollTo(0, 0); 
  };

  return (
    <div className="w-full min-h-screen bg-white pb-20 relative">
      {/* Spacer for Navbar */}
      <div className="h-20 md:h-32"></div>

      {/* --- IMAGE GALLERY HEADER --- */}
      <div className="w-full px-6 mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">
          GALLERY
        </h1>
        <div className="w-24 h-2 bg-red-600 mx-auto rounded-full mb-6"></div>
        <p className="text-gray-500 text-sm md:text-base max-w-3xl mx-auto uppercase tracking-widest font-medium">
          Showcasing our high-precision welding automation & industrial solutions
        </p>
      </div>

      {/* --- IMAGE GALLERY GRID --- */}
      <div className="w-full px-4 md:px-10 max-w-screen-2xl mx-auto mb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
          {allGalleryItems.map((item, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index % 10 * 0.05 }} 
              key={index} 
              className="group flex flex-col cursor-pointer"
              onClick={() => handleImageClick(item.categoryId, item.name)} 
            >
              {/* Responsive Image Container */}
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-sm bg-gray-50 border border-gray-200 transition-all duration-500 group-hover:border-red-500/50 group-hover:shadow-xl">
                <img
                  src={item.url}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Solid Color Overlay on Hover */}
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors duration-300 flex flex-col items-center justify-center p-4">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 font-bold tracking-widest text-xs border border-white/50 px-6 py-3 rounded-sm backdrop-blur-sm hover:bg-red-600 hover:border-red-600">
                    VIEW SPECIFICATIONS
                  </span>
                </div>
              </div>

              {/* Text Label Section */}
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
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- NEW VIDEO GALLERY SECTION --- */}
      {allVideoItems.length > 0 && (
        <div className="w-full bg-gray-50 py-24 border-t border-gray-200">
          
          <div className="w-full px-6 mb-16 text-center">
            <span className="text-red-600 font-bold tracking-widest text-xs uppercase mb-2 block">Our YouTube Channel & Media</span>
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
                  transition={{ duration: 0.5, delay: index % 3 * 0.1 }}
                  key={`vid-${index}`} 
                  className="flex flex-col bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-200 hover:shadow-xl hover:border-red-300 transition-all duration-300"
                >
                  {/* Video Player Box */}
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-900 shadow-inner">
                    {video.url.includes("youtube.com") || video.url.includes("youtu.be") ? (
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

                  {/* Video Labels */}
                  <div className="mt-6 flex flex-col items-center text-center">
                    <span className="text-[10px] text-red-600 font-bold uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full mb-3 inline-block">
                      {video.categoryTitle}
                    </span>
                    <h3 className="text-lg md:text-xl font-black text-gray-900 leading-tight">
                      {video.name}
                    </h3>
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