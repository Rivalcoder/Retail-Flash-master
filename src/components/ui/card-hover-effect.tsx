import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "motion/react"
import { useRef, useState } from "react"

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    icon?: React.ReactNode
    title: string
    description: string
    link?: string
  }[]
  className?: string
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredRect, setHoveredRect] = useState<{
    left: number
    top: number
    width: number
    height: number
  } | null>(null)

  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const handleMouseEnter = (idx: number) => {
    setHoveredIndex(idx)
    if (cardRefs.current[idx] && containerRef.current) {
      const cardRect = cardRefs.current[idx]!.getBoundingClientRect()
      const containerRect = containerRef.current.getBoundingClientRect()
      setHoveredRect({
        left: cardRect.left - containerRect.left,
        top: cardRect.top - containerRect.top,
        width: cardRect.width,
        height: cardRect.height,
      })
    }
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
    setHoveredRect(null)
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10 gap-2",
        className
      )}
    >
      <AnimatePresence>
        {hoveredRect && (
          <motion.span
            className="absolute bg-neutral-200 dark:bg-slate-800/[0.8] rounded-3xl z-0 will-change-transform"
            style={{
              left: hoveredRect.left,
              top: hoveredRect.top,
              width: hoveredRect.width,
              height: hoveredRect.height,
            }}
            layoutId="hoverBackground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
      {items.map((item, idx) => {
        const Wrapper = item.link ? "a" : "div"
        const refCallback = (el: HTMLDivElement | HTMLAnchorElement | null) => {
          cardRefs.current[idx] = el as HTMLDivElement | null
        }
        return (
          <Wrapper
            key={item.title + idx}
            href={item.link}
            className="relative group block p-2 h-full w-full z-10"
            onMouseEnter={() => handleMouseEnter(idx)}
            onMouseLeave={handleMouseLeave}
            ref={refCallback}
          >
            <Card>
              {item.icon && (
                <div className="mb-4 text-primary bg-primary/10 p-3 w-fit rounded-full shadow-md">
                  {item.icon}
                </div>
              )}
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </Card>
          </Wrapper>
        )
      })}
    </div>
  )
}

export const Card = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-white/80 dark:bg-black/30 border border-primary/10 dark:border-white/[0.2] relative z-20 backdrop-blur",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}

export const CardTitle = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <h4 className={cn("text-zinc-900 dark:text-zinc-100 font-bold tracking-wide mt-4", className)}>
      {children}
    </h4>
  )
}

export const CardDescription = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <p
      className={cn(
        "mt-4 text-zinc-700 dark:text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  )
}
