// Single source of truth for all machines.
// Slugs are frozen, hand-written fields: never generate them from `name`.

export interface Product {
  slug: string;
  name: string;
  desc: string;
  features?: string[];
  imgs: string[];
  videos?: string[];
}

export interface Category {
  id: string;
  title: string;
  products: Product[];
}

export const categories: Category[] = [
  {
    id: "welding-automation",
    title: "Welding Automation",
    products: [
      {
        slug: "robotic-automation",
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
        slug: "plasma-transferred-arc-welding-system",
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
        slug: "welding-rotator",
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
        slug: "pull-through-welding-automation-system",
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
        slug: "mig-welding-system",
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
        slug: "tig-longitudinal-welding-spm",
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
        slug: "saw-submerged-arc-welding",
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
        slug: "column-and-boom",
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
        slug: "port-welding-machine-spm",
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
        slug: "head-and-tailstock-units",
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
        slug: "hydraulic-end-cap-welding-spm",
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
        slug: "tankweld-pro-automated-tank-welding-solution",
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
        slug: "robotic-gantry-automation",
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
        slug: "robotic-trolley-welding",
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
        slug: "material-tilter",
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
        slug: "welding-positioners",
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
        slug: "l-type-positioner",
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
        slug: "scissor-rollers",
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
        slug: "welding-turn-table",
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
        slug: "plasma-cnc-machine",
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
        slug: "torch-weaving-unit",
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
        slug: "avc-unit",
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
        slug: "laser-seam-tracking-unit",
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
        slug: "welding-torch",
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
        slug: "cross-slides",
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
        slug: "membrane-panel-welding-system",
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