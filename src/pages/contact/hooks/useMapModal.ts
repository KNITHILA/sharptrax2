import { useEffect, useState } from "react";

export function useMapModal() {
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Lock body scroll when map modal is open
  useEffect(() => {
    if (isMapOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isMapOpen]);

  const openMap = () => setIsMapOpen(true);
  const closeMap = () => setIsMapOpen(false);

  return { isMapOpen, openMap, closeMap };
}