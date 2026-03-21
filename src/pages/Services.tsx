import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Send, Zap, PlayCircle, ArrowRight, X, ChevronRight, Settings2 } from "lucide-react";

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

interface RecommendedProduct extends Product {
  categoryId: string;
}

// --- ENHANCED DATA WITH FULL CONTENT ---
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
          "Advanced 6-axis articulation for complex geometric welding.",
          "Compatible with tactile seam tracking and laser vision systems."
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
          "Exceptional metallurgical bond with minimal dilution of the base material.",
          "Ideal for rebuilding worn components in mining, oil & gas, and power generation."
        ],
        imgs: [
          "/servicemachines/welding automation/2/mac2.1.jpg",
          "/servicemachines/welding automation/2/mac2.2.jpg",
          "/servicemachines/welding automation/2/mac2.3.jpg",
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
          "Polyurethane, solid steel, or rubber-lined wheels available based on workpiece requirements."
        ],
        imgs: [
          "/servicemachines/welding automation/3/mac3.1.jpg",
          "/servicemachines/welding automation/3/mac3.2.jpg",
          "/servicemachines/welding automation/3/mac3.3.jpg",
          "/servicemachines/welding automation/3/mac3.4.jpg",
        ],
        videos: ["https://www.youtube.com/embed/cBOZVaN1GsM?si=LuCX_UTH5Y9NGtGj"],
      },
      {
        name: "Pull-Through Welding Automation System",
        desc: "At Sharptrax Technologies, our Pull-Through Welding Automation System is designed to enhance productivity, consistency, and precision in welding applications. This advanced system automates the welding process for long and continuous workpieces, ensuring seamless joint quality and reduced manual intervention.",
        features: [
          "Continuous automated welding for long structural beams, pipes, and profiles.",
          "Automated clamping and pulling mechanism for seamless, continuous feeding.",
          "Synchronized twin-torch setup available for simultaneous double-sided welding.",
          "Adjustable speed controls integrated with a master PLC for absolute precision.",
          "Significantly reduces cycle times for high-volume linear production."
        ],
        imgs: [
          "/servicemachines/welding automation/4/mac4.1.jpg",
          "/servicemachines/welding automation/4/mac4.2.jpg",
          "/servicemachines/welding automation/4/mac4.3.jpg",
          "/servicemachines/welding automation/4/mac4.4.jpg",
        ],
        videos: ["https://www.youtube.com/embed/G5TqVsDJ62o?si=METj7Kg_ixayYyuS"],
      },
      {
        name: "MIG-Welding System",
        desc: "At Sharptrax Technologies, our MIG-Welding System is designed for high-speed, high-quality welding, making it ideal for industrial and manufacturing applications. Using Metal Inert Gas (MIG) welding, this system provides strong, precise, and efficient welds across various materials, including mild steel, stainless steel, and aluminum.",
        features: [
          "High-deposition rate suitable for heavy industrial fabrication.",
          "Advanced synergic control for optimal voltage and wire feed speed synchronization.",
          "Water-cooled torch options for continuous, high-amperage operations.",
          "Compatible with a wide range of shielding gases and wire alloys.",
          "Spatter-reduction technology minimizes post-weld cleanup time."
        ],
        imgs: [
          "/servicemachines/welding automation/5/mac5.1.jpg",
          "/servicemachines/welding automation/5/mac5.2.jpg",
          "/servicemachines/welding automation/5/mac5.3.jpg",
          "/servicemachines/welding automation/5/mac5.4.jpg",
        ],
        videos: ["https://www.youtube.com/embed/Z9gzJC5pDxM?si=ww20AIUTtnhd93lq"],
      },
      {
        name: "TIG Longitudinal Welding SPM",
        desc: "At Sharptrax Technologies, our TIG-Linear Welding SPM (Special Purpose Machine) is designed for high-precision linear welding applications. This system utilizes Tungsten Inert Gas (TIG) welding, ensuring clean, strong, and defect-free welds with superior control and consistency. It is ideal for industries requiring fine, high-quality welding on long and straight workpieces.",
        features: [
          "Precision linear guide rails for ultra-smooth, vibration-free torch travel.",
          "Pneumatic copper finger clamping for zero-distortion sheet holding.",
          "Integrated argon backing gas channel for oxidation-free root welds.",
          "Ideal for thin-gauge stainless steel, aerospace, and food-grade tanks.",
          "Touchscreen HMI for precise parameter input and weld sequencing."
        ],
        imgs: [
          "/servicemachines/welding automation/6/mac6.1.jpg",
          "/servicemachines/welding automation/6/mac6.2.jpg",
          "/servicemachines/welding automation/6/mac6.3.jpg",
          "/servicemachines/welding automation/6/mac6.4.jpg",
        ],
        videos: ["https://www.youtube.com/embed/cwhK_j6G0Jk?si=U_lvArkXTWm9FX8j"],
      },
      {
        name: "SAW-Submerged Arc Welding",
        desc: "At Sharptrax Technologies, our Submerged Arc Welding (SAW) system is engineered for high-deposition, deep-penetration welding that ensures strong, defect-free welds with minimal spatter. SAW is widely used in industries that require high-strength, heavy-duty welding applications, such as shipbuilding, structural fabrication, and pipeline construction.",
        features: [
          "Integrated flux hopper and automated flux recovery system to minimize waste.",
          "Extreme penetration depth, perfect for thick-plate joining and heavy vessels.",
          "Available in tractor-mounted or column & boom-mounted configurations.",
          "Zero UV radiation and minimal fume emission during operation, enhancing operator safety.",
          "Twin-wire capability for ultra-high deposition rates."
        ],
        imgs: [
          "/servicemachines/welding automation/7/mac7.1.jpg",
          "/servicemachines/welding automation/7/mac7.2.jpg",
          "/servicemachines/welding automation/7/mac7.3.jpg",
          "/servicemachines/welding automation/7/mac7.4.jpg",
        ],
      },
      {
        name: "Column And Boom",
        desc: "At Sharptrax Technologies, we provide high-performance Column and Boom welding systems, designed to enhance precision, efficiency, and automation in welding processes. Our customized solutions cater to industries requiring high-quality, consistent, and automated welding operations for large structures and complex fabrication.",
        features: [
          "Heavy-duty steel construction ensures minimal deflection even at maximum boom extension.",
          "Motorized 360-degree column rotation with locking mechanism.",
          "Variable speed boom extension via precision rack and pinion drive.",
          "Anti-fall safety mechanisms integrated onto the vertical lift axis.",
          "Seamlessly integrates with Rotators and Positioners for complete tank welding cells."
        ],
        imgs: [
          "/servicemachines/welding automation/8/mac8.1.jpg",
          "/servicemachines/welding automation/8/mac8.2.jpg",
          "/servicemachines/welding automation/8/mac8.3.jpg",
          "/servicemachines/welding automation/8/mac8.4.jpg",
        ],
      },
      {
        name: "Port Welding Machine SPM",
        desc: "At Sharptrax Technologies, we specialize in providing customized Port Welding Machine SPM (Special Purpose Machine) designed for high-precision and efficient welding operations in various industries. Our SPM solutions ensure enhanced productivity, accuracy, and automation, reducing manual labor and operational costs.",
        features: [
          "Automated & High-Precision Welding – Ensures consistent weld quality and high accuracy with minimal human intervention.",
          "Custom-Built for Specific Applications – Provides tailored engineering solutions designed to meet unique and complex industrial requirements.",
          "Integrated rotary chucks for exact alignment of ports and bosses.",
          "Programmable weld overlap to ensure leak-proof seals on pressure components."
        ],
        imgs: [
          "/servicemachines/welding automation/9/mac9.1.jpg",
          "/servicemachines/welding automation/9/mac9.2.jpg",
          "/servicemachines/welding automation/9/mac9.3.jpg",
          "/servicemachines/welding automation/9/mac9.4.jpg",
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
          "Multi-Job Programming – Supports multi-program storage, allowing users to program and switch between different job specifications easily.",
        ],
        imgs: [
          "/servicemachines/welding automation/11/mac11.1.jpg",
          "/servicemachines/welding automation/11/mac11.2.jpg",
          "/servicemachines/welding automation/11/mac11.3.jpg",
          "/servicemachines/welding automation/11/mac11.4.jpg",
        ],
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
          "/servicemachines/membrane/mac21.3.mp4",
        ],
      },
      {
        name: "Robotic Gantry Automation",
        desc: "Robotic Gantry Automation is a cornerstone of Sharptrax Technologies’ heavy-duty manufacturing solutions. By utilizing overhead gantry systems integrated with high-performance robotics, we provide expansive work envelopes and superior flexibility for large-scale welding and assembly tasks.",
        features: [
          "Overhead configurations maximize floor space and allow for handling large, heavy workpieces.",
          "Multi-axis gantry movement combined with robotic precision ensures consistent, high-quality welds.",
          "Custom span widths available to cover multiple workstations simultaneously.",
          "Heavy payload capacities to support large welding wire drums and dual torches."
        ],
        imgs: [
          "/servicemachines/welding automation/12/mac12.1.jpg",
          "/servicemachines/welding automation/12/mac12.2.jpg",
          "/servicemachines/welding automation/12/mac12.3.jpg",
          "/servicemachines/welding automation/12/mac12.4.jpg",
        ],
      },
      {
        name: "Robotic Trolley Welding",
        desc: "Sharptrax Technologies’ Robotic Trolley Welding systems provide an agile solution for manufacturing environments requiring mobility and flexibility. By mounting robotic arms on synchronized automated trolleys, we enable the system to traverse linear tracks.",
        features: [
          "Linear track integration allows for a single robotic unit to service multiple welding fixtures.",
          "High-precision servo-driven trolleys ensure seamless synchronization.",
          "Fully enclosed cable management tracks for safety and longevity.",
          "Ideal for welding long structures like bridge girders and ship panels."
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
          "Safely manipulates heavy plates and awkward sub-assemblies up to 90 degrees.",
          "Eliminates crane dependency and vastly improves operator safety."
        ],
        imgs: [
          "/servicemachines/welding automation/14/mac14.1.jpg",
          "/servicemachines/welding automation/14/mac14.2.jpg",
          "/servicemachines/welding automation/14/mac14.3.jpg",
          "/servicemachines/welding automation/14/mac14.4.jpg",
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
          "Variable speed rotation with bi-directional foot pedal control.",
          "Heavy-duty earthing mechanism to prevent damage to internal bearings."
        ],
        imgs: [
          "/servicemachines/welding positioners/1/pos1.1.jpg",
          "/servicemachines/welding positioners/1/pos1.2.jpg",
          "/servicemachines/welding positioners/1/pos1.3.jpg",
          "/servicemachines/welding positioners/1/pos1.4.jpg",
        ],
        videos: ["https://www.youtube.com/embed/o1akniqVvt0?si=mPwanL_oIURSJjcU"],
      },
      {
        name: "L-Type Positioner",
        desc: "Sharptrax offers extensive range of L type Positioners for manipulating various types of components, Servo/VFD driven for positioning the arms.",
        features: [
          "Full Rotational Range – Equipped with 360-degree rotation on both axes.",
          "Dual-Axis Servo Control – Powered by high-performance servo drives for exact positioning.",
          "Ergonomic access to complex joints, ideal for robotic integration cells.",
          "Robust base design to handle high-torque eccentric loads safely."
        ],
        imgs: [
          "/servicemachines/welding positioners/2/pos2.1.jpg",
          "/servicemachines/welding positioners/2/pos2.2.jpg",
          "/servicemachines/welding positioners/2/pos2.3.jpg",
          "/servicemachines/welding positioners/2/pos2.4.jpg",
        ],
      },
      {
        name: "Scissor Rollers",
        desc: "Sharptrax offers very high quality Scissor Rollers, which can be used to hold your pipe as a support for your existing machines.",
        features: [
          "Rapid height adjustment using a heavy-duty lead screw or hydraulic mechanism.",
          "Accommodates a vast range of pipe diameters without needing jaw changes.",
          "Polyurethane rollers protect the surface finish of stainless and alloy pipes.",
          "Highly mobile yet lockable for secure stationary support."
        ],
        imgs: [
          "/servicemachines/welding positioners/3/pos3.1.jpg",
          "/servicemachines/welding positioners/3/pos3.2.jpg",
          "/servicemachines/welding positioners/3/pos3.3.jpg",
          "/servicemachines/welding positioners/3/pos3.4.jpg",
        ],
      },
      {
        name: "Welding Turn Table",
        desc: "We offer excellent quality range of Welding Positioners (Manipulators) that are made from quality raw material. Widely used in various industrial applications.",
        features: [
          "Low-profile design allows for easy loading of heavy, flat workpieces.",
          "Machined faceplate with precise concentric slots for quick clamping.",
          "Shielded internal electronics protect against high-frequency welding interference.",
          "VFD (Variable Frequency Drive) integrated for ultra-smooth low-speed rotation."
        ],
        imgs: [
          "/servicemachines/welding positioners/4/pos4.1.jpg",
          "/servicemachines/welding positioners/4/pos4.2.jpg",
          "/servicemachines/welding positioners/4/pos4.3.jpg",
          "/servicemachines/welding positioners/4/pos4.4.jpg",
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
          "Automatic Torch Height Control (THC) ensures consistent cut quality over warped plates.",
          "Dual drive gantry system for high acceleration and tight cornering."
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
          "Adjustable dwell times at the edges to prevent undercut.",
          "Selectable weave patterns (pendulum, step, triangle) via digital controller."
        ],
        imgs: [
          "/servicemachines/machine accessories/1/acc1.1.jpg",
          "/servicemachines/machine accessories/1/acc1.2.jpg",
          "/servicemachines/machine accessories/1/acc1.3.jpg",
          "/servicemachines/machine accessories/1/acc1.4.jpg",
        ],
      },
      {
        name: "AVC Unit",
        desc: "Automatic Voltage Controller (AVC) unit for TIG and Plasma welding process. Built with LM guideway slides and Servo Motors.",
        features: [
          "Maintains consistent arc length by monitoring arc voltage in real-time.",
          "High-speed servo motor response compensates for out-of-round workpieces.",
          "Touch-retract function for automatic arc starting.",
          "Universal compatibility with standard TIG and Plasma power sources."
        ],
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
          "Immune to arc light, spatter, and high temperatures.",
          "Identifies gap width variations and adjusts weave width automatically."
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
        features: [
          "High-efficiency internal water cooling system prevents overheating during continuous duty.",
          "Optimized nozzle geometries for smooth powder feed and laminar shielding gas flow.",
          "Quick-change collet systems to reduce downtime.",
          "Customizable lengths for internal pipe cladding applications."
        ],
        imgs: [
          "/servicemachines/machine accessories/4/acc4.1.jpg",
          "/servicemachines/machine accessories/4/acc4.2.jpg",
          "/servicemachines/machine accessories/4/acc4.3.jpg",
        ],
      },
      {
        name: "Cross Slides",
        desc: "We manufacture cross slide Units for Torch manipulation using LM rails and lead screw combinations.",
        features: [
          "Micrometer-level adjustment dials for absolute precision positioning.",
          "Hardened linear motion (LM) guides guarantee zero play and smooth travel.",
          "Available in manual hand-wheel or motorized configurations.",
          "Compact and robust design to withstand harsh industrial environments."
        ],
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
        features: [
          "Simultaneous multi-torch welding dramatically increases panel production speed.",
          "Automated fin bar and tube feeding ensures perfect alignment.",
          "Integrated water-cooling prevents panel distortion during high-heat input.",
          "Advanced PLC interface allows for quick changeovers between tube sizes."
        ],
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

export default function Services() {
  const location = useLocation();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  
  // State for the active machine
  const [activeCat, setActiveCat] = useState<Category>(categories[0]);
  const [activeProd, setActiveProd] = useState<Product>(categories[0].products[0]);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([]);

  // Form / Modal State
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", details: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSending, setIsSending] = useState(false);

  // Lock background scroll when enquiry modal is open
  useEffect(() => {
    if (isEnquiryModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isEnquiryModalOpen]);

  // Read URL parameters on load and when they change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catIdParam = params.get("cat");
    const prodNameParam = params.get("prod");

    let currentCat = categories[0];
    let currentProd = categories[0].products[0];

    if (catIdParam && prodNameParam) {
      const foundCat = categories.find((c) => c.id === catIdParam);
      if (foundCat) {
        const foundProd = foundCat.products.find(
          (p) => p.name.toLowerCase() === prodNameParam.toLowerCase()
        );
        if (foundProd) {
          currentCat = foundCat;
          currentProd = foundProd;
        }
      }
    }

    setActiveCat(currentCat);
    setActiveProd(currentProd);
    setActiveImgIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Calculate Recommendations
    let recs: RecommendedProduct[] = currentCat.products
      .filter((p) => p.name !== currentProd.name)
      .map((p) => ({ ...p, categoryId: currentCat.id }));

    if (recs.length < 3) {
      const fallbackCat = categories.find(c => c.id === "welding-automation") || categories[0];
      const extraRecs = fallbackCat.products
        .filter((p) => p.name !== currentProd.name && !recs.find(r => r.name === p.name))
        .map((p) => ({ ...p, categoryId: fallbackCat.id }));
      recs = [...recs, ...extraRecs];
    }

    setRecommendedProducts(recs.slice(0, 3));
  }, [location.search]);

  const handleRecommendationClick = (categoryId: string, productName: string) => {
    navigate(`/services?cat=${categoryId}&prod=${encodeURIComponent(productName)}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};
    if (!formData.name.trim() || formData.name.trim().length < 3) newErrors.name = "Required (min 3 chars).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Valid email required.";
    if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = "10-digit number required.";
    if (!formData.details.trim() || formData.details.trim().length < 10) newErrors.details = "More details needed.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSending(true);

    emailjs.send(
      "service_67r7kfg",
      "template_xwnafxs",
      { 
        user_name: formData.name, 
        user_email: formData.email, 
        user_phone: formData.phone, 
        project_details: formData.details, 
        product_interest: activeProd.name 
      },
      "9bJ_hqjsB63RMeUH0"
    ).then(() => {
      alert("Enquiry Sent Successfully!");
      setFormData({ name: "", email: "", phone: "", details: "" });
      setErrors({});
      setIsEnquiryModalOpen(false); 
    }).catch(err => {
      console.error(err);
      alert("Failed to send. Please try again.");
    }).finally(() => setIsSending(false));
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] font-sans pb-20 selection:bg-red-100">
      <div className="h-20 w-full bg-white border-b border-gray-200"></div>

      {/* --- HERO BANNER --- */}
      {/* Lightened the dark slate color slightly for a softer touch */}
      <div className="bg-[#54626F] py-16 px-6 border-b-4 border-yellow-500 relative overflow-hidden">
        {/* Adjusted the subtle gradient overlay to match the newly softened background */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#3A4652] to-transparent opacity-50 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col relative z-10">
          <div className="flex items-center text-gray-100 text-sm mb-4 font-bold tracking-widest uppercase">
             <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate("/")}>Home</span>
             <ChevronRight size={14} className="mx-2" />
             <span className="hover:text-white cursor-pointer transition-colors">Services</span>
             <ChevronRight size={14} className="mx-2" />
             <span className="text-yellow-400">{activeCat.title}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight uppercase max-w-4xl">
            {activeProd.name}
          </h1>
        </div>
      </div>

      {/* --- SPLIT LAYOUT SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-12 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT: Media (Image + Thumbnails + Video) - STICKY ON DESKTOP */}
          <div className="lg:col-span-7 flex flex-col lg:sticky lg:top-28">
            {/* Main Image */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-center relative w-full h-[400px] md:h-[500px] shadow-sm group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImgIndex}
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={activeProd.imgs[activeImgIndex]}
                  alt={activeProd.name}
                  className="max-h-full w-auto object-contain transition-transform duration-700 group-hover:scale-105"
                />
              </AnimatePresence>
            </div>

            {/* Thumbnail Strip */}
            {activeProd.imgs.length > 1 && (
              <div className="flex gap-3 overflow-x-auto mt-4 pb-2 custom-scrollbar">
                {activeProd.imgs.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`flex-shrink-0 w-24 h-24 rounded-xl border-2 p-2 transition-all bg-white ${
                      activeImgIndex === idx ? "border-red-600 shadow-md ring-2 ring-red-100" : "border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-400"
                    }`}
                  >
                    <img src={img} className="w-full h-full object-contain" alt="thumbnail" />
                  </button>
                ))}
              </div>
            )}
            
            {/* Machine Videos */}
            {activeProd.videos && activeProd.videos.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-black uppercase text-gray-900 mb-6 flex items-center gap-2 tracking-tight">
                  <PlayCircle className="text-red-600" size={24} /> Video Demonstration
                </h3>
                <div className="grid gap-6">
                  {activeProd.videos.map((vid, idx) => (
                    // Updated video background to match the neutral gray header
                    <div key={idx} className="bg-neutral-800 rounded-2xl aspect-video relative shadow-md border border-gray-200 overflow-hidden">
                      {vid.includes("youtube.com") || vid.includes("youtu.be") ? (
                        <iframe
                          className="w-full h-full absolute inset-0 border-0"
                          src={vid}
                          title={`${activeProd.name} Video ${idx + 1}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <video controls className="w-full h-full absolute inset-0 object-cover" src={vid}>
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Product Information - SCROLLING ON DESKTOP */}
          <div className="lg:col-span-5 flex flex-col pt-2">
            
            {/* System Overview */}
            <div className="mb-10">
               <h3 className="text-2xl font-black text-gray-900 mb-4 pb-2 flex items-center gap-3 uppercase tracking-tight">
                 <Settings2 className="text-red-600" size={28} /> System Overview
               </h3>
               <p className="text-gray-600 text-lg leading-relaxed font-medium">
                 {activeProd.desc}
               </p>
            </div>

            {/* Key Features List */}
            {activeProd.features && (
              <div className="mb-12">
                <h3 className="text-2xl font-black text-gray-900 mb-6 pb-2 flex items-center gap-3 uppercase tracking-tight">
                  <Zap className="text-red-600" size={28} /> Specifications
                </h3>
                <ul className="space-y-4">
                  {activeProd.features.map((feature, i) => (
                    <li key={i} className="flex gap-4 items-start bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-red-300 transition-colors">
                      <CheckCircle2 className="text-red-600 shrink-0 mt-0.5" size={20} />
                      <span className="text-gray-700 font-medium leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Final CTA Button placed cleanly at the bottom */}
            <div className="mt-auto border-t border-gray-200 pt-8 pb-4">
               <h4 className="text-lg font-bold text-gray-500 mb-4 uppercase tracking-widest text-center">Interested in this system?</h4>
               <button 
                 onClick={() => setIsEnquiryModalOpen(true)}
                 className="w-full py-5 rounded-xl font-black uppercase tracking-widest transition-all shadow-xl shadow-red-600/20 text-base bg-red-600 text-white hover:bg-red-700 hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3"
               >
                 <Send size={20} /> Enquire Now
               </button>
            </div>

          </div>
        </div>
      </section>

      {/* --- RECOMMENDED MACHINES SECTION --- */}
      <section className="bg-white py-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-red-600 font-bold uppercase tracking-widest text-xs mb-1 block">Keep Exploring</span>
              <h3 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
                Related Systems
              </h3>
            </div>
            <span className="hidden md:flex text-sm font-bold text-red-600 cursor-pointer hover:text-red-700 transition-colors items-center gap-1" onClick={() => navigate("/gallery")}>
              View Full Catalog <ArrowRight size={16}/>
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendedProducts.map((prod, idx) => (
              <div 
                key={idx}
                onClick={() => handleRecommendationClick(prod.categoryId, prod.name)}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-xl hover:border-red-300 transition-all duration-300 flex flex-col"
              >
                <div className="h-56 w-full bg-gray-50 flex items-center justify-center p-6 border-b border-gray-100">
                  <img 
                    src={prod.imgs[0]} 
                    alt={prod.name} 
                    className="max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="font-black text-gray-900 text-lg uppercase leading-snug group-hover:text-red-600 transition-colors mb-4">
                    {prod.name}
                  </h4>
                  <div className="mt-auto flex items-center text-gray-400 font-bold text-xs uppercase tracking-widest group-hover:text-red-600 transition-colors">
                    Explore Specifications <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ENQUIRY MODAL POPUP --- */}
      <AnimatePresence>
        {isEnquiryModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-neutral-900/80 backdrop-blur-md"
            onClick={() => setIsEnquiryModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()} 
              className="bg-white w-full max-w-lg rounded-2xl p-6 md:p-10 shadow-2xl relative border-t-[6px] border-red-600"
            >
              <button 
                onClick={() => setIsEnquiryModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded-md flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>

              <h3 className="text-3xl font-black text-gray-900 mb-1 uppercase tracking-tight">Enquiry</h3>
              <p className="text-sm text-gray-500 mb-6 border-b border-gray-100 pb-4">
                Regarding: <strong className="text-red-600 font-bold">{activeProd.name}</strong>
              </p>
              
              <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                    className={`w-full bg-gray-50 border p-3.5 rounded-lg text-sm font-medium focus:outline-none transition-all ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-red-500 focus:bg-white'}`} />
                  {errors.name && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.name}</p>}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                      className={`w-full bg-gray-50 border p-3.5 rounded-lg text-sm font-medium focus:outline-none transition-all ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-red-500 focus:bg-white'}`} />
                    {errors.email && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                      className={`w-full bg-gray-50 border p-3.5 rounded-lg text-sm font-medium focus:outline-none transition-all ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-red-500 focus:bg-white'}`} />
                    {errors.phone && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.phone}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Requirements</label>
                  <textarea name="details" rows={4} value={formData.details} onChange={handleInputChange}
                    className={`w-full bg-gray-50 border p-3.5 rounded-lg text-sm font-medium focus:outline-none resize-none transition-all ${errors.details ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-red-500 focus:bg-white'}`}></textarea>
                  {errors.details && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.details}</p>}
                </div>
                
                <button type="submit" disabled={isSending}
                  className={`w-full py-4 mt-4 rounded-xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg text-sm ${isSending ? "bg-gray-400 text-white cursor-not-allowed" : "bg-black text-white hover:bg-red-600 active:scale-[0.98]"}`}>
                  <Send size={18} /> {isSending ? "Sending..." : "Submit Enquiry"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ef4444; }
      `}} />
    </div>
  );
}