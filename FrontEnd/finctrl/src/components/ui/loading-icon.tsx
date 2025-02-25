
import { motion } from "framer-motion"

export function LoadingIcon({ size = 24, color = "text-primary" }: { size?: number; color?: string }) {
  return (
    <div className="flex items-center justify-center" role="status">
      <motion.div
        className={`rounded-full border-4 border-t-transparent ${color}`}
        style={{
          width: size,
          height: size,
          borderTopColor: "transparent",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        aria-label="Loading"
      />
      <span className="sr-only">Loading...</span>
    </div>
  )
}
