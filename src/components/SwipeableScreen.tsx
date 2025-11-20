import { ReactNode } from "react";
import { motion, PanInfo } from "motion/react";

interface SwipeableScreenProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  canSwipeLeft?: boolean;
  canSwipeRight?: boolean;
}

const SWIPE_THRESHOLD = 50; // Minimum distance in pixels to trigger swipe
const SWIPE_VELOCITY_THRESHOLD = 500; // Minimum velocity to trigger swipe

export function SwipeableScreen({
  children,
  onSwipeLeft,
  onSwipeRight,
  canSwipeLeft = true,
  canSwipeRight = true,
}: SwipeableScreenProps) {
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;

    // Check for swipe left (next screen)
    if (canSwipeLeft && (offset.x < -SWIPE_THRESHOLD || velocity.x < -SWIPE_VELOCITY_THRESHOLD)) {
      onSwipeLeft?.();
      return;
    }

    // Check for swipe right (previous screen)
    if (canSwipeRight && (offset.x > SWIPE_THRESHOLD || velocity.x > SWIPE_VELOCITY_THRESHOLD)) {
      onSwipeRight?.();
      return;
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      className="w-full h-full"
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      {children}
    </motion.div>
  );
}