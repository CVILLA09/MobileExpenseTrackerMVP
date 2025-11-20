import { useState, useRef, useEffect } from "react";
import { motion, PanInfo, useMotionValue, useAnimation } from "motion/react";
import { Trash2, ArrowRight } from "lucide-react";
import { IndividualAccount } from "../App";

interface SwipeableAccountRowProps {
  account: IndividualAccount;
  onTap: (account: IndividualAccount) => void;
  onDelete: (account: IndividualAccount) => void;
}

const MIN_DISTANCE_TO_OPEN = 40; // px
const OPEN_X = -80; // px - width of delete button
const MAX_VERTICAL_OFFSET = 30; // px
const MIN_VELOCITY_FOR_FLING = 0.3; // px/ms
const ANIMATION_DURATION = 0.22; // seconds
const ANIMATION_EASING = [0.22, 0.9, 0.36, 1]; // cubic-bezier

export function SwipeableAccountRow({ account, onTap, onDelete }: SwipeableAccountRowProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const rowRef = useRef<HTMLDivElement>(null);

  // Close reveal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isRevealed && rowRef.current && !rowRef.current.contains(event.target as Node)) {
        closeReveal();
      }
    };

    if (isRevealed) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isRevealed]);

  const closeReveal = () => {
    controls.start({
      x: 0,
      transition: {
        duration: ANIMATION_DURATION,
        ease: ANIMATION_EASING
      }
    });
    setIsRevealed(false);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Prevent swipe if vertical offset is too large (likely scrolling)
    if (Math.abs(info.offset.y) > MAX_VERTICAL_OFFSET) {
      return;
    }

    // Only allow left swipe (negative x)
    if (info.offset.x > 0) {
      x.set(0);
      return;
    }

    // Limit drag to reveal area
    const newX = Math.max(info.offset.x, OPEN_X);
    x.set(newX);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);

    // Prevent swipe if vertical offset is too large
    if (Math.abs(info.offset.y) > MAX_VERTICAL_OFFSET) {
      closeReveal();
      return;
    }

    const velocity = info.velocity.x;
    const shouldOpen =
      info.offset.x < -MIN_DISTANCE_TO_OPEN ||
      (velocity < -MIN_VELOCITY_FOR_FLING * 1000 && info.offset.x < 0);

    if (shouldOpen) {
      controls.start({
        x: OPEN_X,
        transition: {
          duration: ANIMATION_DURATION,
          ease: ANIMATION_EASING
        }
      });
      setIsRevealed(true);
    } else {
      closeReveal();
    }
  };

  const handleTap = () => {
    // If revealed, close it first, then open modal
    if (isRevealed) {
      closeReveal();
      // Small delay to close reveal before opening modal
      setTimeout(() => onTap(account), 250);
    } else {
      onTap(account);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(account);
  };

  return (
    <div ref={rowRef} className="relative overflow-hidden">
      {/* Delete button background */}
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-destructive flex items-center justify-center">
        <button
          onClick={handleDelete}
          className="w-full h-full flex items-center justify-center text-white hover:bg-destructive/90 transition-colors"
          aria-label="Eliminar cuenta"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Account row */}
      <motion.div
        drag="x"
        dragConstraints={{ left: OPEN_X, right: 0 }}
        dragElastic={0}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
        className={`relative bg-card-custom ${isDragging ? "shadow-lg" : ""}`}
      >
        <button
          onClick={handleTap}
          className="w-full flex items-center gap-3 px-4 py-3 pl-14 hover:bg-surface/60 transition-colors"
          disabled={isDragging}
        >
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[14px] leading-[20px] text-text-primary truncate">
              {account.name}
            </p>
            {account.details && (
              <p className="text-[11px] leading-[16px] text-text-secondary mt-0.5">
                {account.details}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className="text-[14px] leading-[20px] text-text-primary"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              ${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <ArrowRight className="w-4 h-4 text-text-secondary" />
          </div>
        </button>
      </motion.div>
    </div>
  );
}
