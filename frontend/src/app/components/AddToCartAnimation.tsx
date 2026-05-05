import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { ShoppingCart } from 'lucide-react';

interface AddToCartAnimationProps {
  show: boolean;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  productImage?: string;
  onComplete: () => void;
}

export function AddToCartAnimation({
  show,
  startPosition,
  endPosition,
  productImage,
  onComplete
}: AddToCartAnimationProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return createPortal(
    <AnimatePresence>
      {show && (
        <>
          {/* Flying Product Image/Icon */}
          <motion.div
            initial={{
              position: 'fixed',
              left: startPosition.x,
              top: startPosition.y,
              width: 60,
              height: 60,
              zIndex: 9999,
              opacity: 1,
              scale: 1,
            }}
            animate={{
              left: endPosition.x,
              top: endPosition.y,
              scale: 0.3,
              opacity: 0.8,
            }}
            exit={{
              scale: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.8,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
            onAnimationComplete={onComplete}
            className="pointer-events-none"
          >
            {productImage ? (
              <div className="w-full h-full rounded-lg overflow-hidden shadow-2xl border-2 border-primary bg-background">
                <img
                  src={productImage}
                  alt="Flying product"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-full rounded-full bg-primary flex items-center justify-center shadow-2xl">
                <ShoppingCart className="size-6 text-primary-foreground" />
              </div>
            )}
          </motion.div>

          {/* Success Pulse at Cart */}
          <motion.div
            initial={{
              position: 'fixed',
              left: endPosition.x + 30,
              top: endPosition.y + 30,
              width: 0,
              height: 0,
              zIndex: 9998,
              opacity: 0.6,
            }}
            animate={{
              width: 60,
              height: 60,
              left: endPosition.x,
              top: endPosition.y,
              opacity: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.7,
            }}
            className="pointer-events-none rounded-full border-2 border-primary"
          />
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}