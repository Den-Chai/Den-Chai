import { addPropertyControls, ControlType } from "framer"
import { motion, AnimatePresence, useInView, LayoutGroup } from "framer-motion"
import { useState, useRef } from "react"

const CATEGORIES = [
    { id: "specials", label: "Specials", description: "Today's featured dishes — limited, seasonal, and always worth it.", bg: "#5C2B1F", color: "#FDF8F2", accent: "#C8973A" },
    { id: "appetizers", label: "Appetizers", description: "Light starters to begin your Northern Thai journey.", bg: "#FFF8F0", color: "#1A1A1A", accent: "#D35230" },
    { id: "noodle soups", label: "Noodle Soups", description: "Rich, aromatic broths slow-cooked with Northern spices.", bg: "#5C2B1F", color: "#FDF8F2", accent: "#C8973A" },
    { id: "noodles", label: "Noodles", description: "Wok-tossed and hand-crafted noodle dishes.", bg: "#FFF8F0", color: "#1A1A1A", accent: "#D35230" },
    { id: "fried rice", label: "Fried Rice", description: "Thai-style fried rice with bold flavors and fresh ingredients.", bg: "#5C2B1F", color: "#FDF8F2", accent: "#C8973A" },
    { id: "curries", label: "Curries", description: "Fragrant, complex curries rooted in Lanna tradition.", bg: "#FFF8F0", color: "#1A1A1A", accent: "#D35230" },
    { id: "asian entrees", label: "Asian Entrees", description: "Bold entrees drawing from across Southeast Asia.", bg: "#5C2B1F", color: "#FDF8F2", accent: "#C8973A" },
    { id: "salads", label: "Salads", description: "Fresh, vibrant salads with bright Thai dressings.", bg: "#FFF8F0", color: "#1A1A1A", accent: "#D35230" },
    { id: "sides", label: "Sides", description: "Perfect accompaniments to complete your meal.", bg: "#5C2B1F", color: "#FDF8F2", accent: "#C8973A" },
    { id: "beverages", label: "Beverages", description: "Thai teas, fresh juices and house drinks.", bg: "#FFF8F0", color: "#1A1A1A", accent: "#D35230" },
]

export default function DenChaiMenuCategories() {
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const selectedCategory = CATEGORIES.find(c => c.id === selectedId) ?? null

    return (
        <section style={sectionStyle}>
            {/* Section Header */}
            <div style={headerWrapperStyle}>
                <div style={labelStyle}>EXPLORE THE MENU</div>
                <h2 style={titleStyle}>OUR MENU.</h2>
            </div>

            {/* Category Cards */}
            <LayoutGroup>
                <div style={cardListStyle}>
                    {CATEGORIES.map((cat, index) => (
                        <CategoryCard
                            key={cat.id}
                            category={cat}
                            index={index}
                            isSelected={selectedId === cat.id}
                            onClick={() => setSelectedId(cat.id)}
                        />
                    ))}
                </div>

                {/* Expanded Modal */}
                <AnimatePresence>
                    {selectedId && selectedCategory && (
                        <>
                            {/* Overlay */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                style={overlayStyle}
                                onClick={() => setSelectedId(null)}
                            />

                            {/* Expanded Card */}
                            <motion.div
                                layoutId={`card-${selectedId}`}
                                style={{
                                    ...expandedCardStyle,
                                    backgroundColor: selectedCategory.bg,
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <motion.div layoutId={`card-content-${selectedId}`}>
                                    {/* Accent Line */}
                                    <div style={{
                                        width: "60px",
                                        height: "4px",
                                        backgroundColor: selectedCategory.accent,
                                    }} />

                                    {/* Label */}
                                    <h3 style={{
                                        fontSize: "42px",
                                        fontWeight: "900",
                                        color: selectedCategory.color,
                                        marginTop: "20px",
                                        marginBottom: "16px",
                                        lineHeight: 1,
                                    }}>
                                        {selectedCategory.label}
                                    </h3>

                                    {/* Description */}
                                    <p style={{
                                        fontSize: "18px",
                                        color: selectedCategory.color,
                                        opacity: 0.85,
                                        lineHeight: 1.5,
                                        marginBottom: "32px",
                                    }}>
                                        {selectedCategory.description}
                                    </p>

                                    {/* View Menu Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{
                                            backgroundColor: selectedCategory.accent,
                                            color: selectedCategory.bg === "#5C2B1F" ? "#1A1A1A" : "#FDF8F2",
                                            border: "none",
                                            padding: "16px 32px",
                                            fontSize: "15px",
                                            fontWeight: "800",
                                            borderRadius: "12px",
                                            cursor: "pointer",
                                            letterSpacing: "0.05em",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        View Full Menu →
                                    </motion.button>

                                    {/* Close Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setSelectedId(null)}
                                        style={{
                                            position: "absolute",
                                            top: "24px",
                                            right: "24px",
                                            backgroundColor: "transparent",
                                            border: "none",
                                            color: selectedCategory.color,
                                            fontSize: "32px",
                                            cursor: "pointer",
                                            lineHeight: 1,
                                            padding: "8px",
                                        }}
                                    >
                                        ×
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </LayoutGroup>
        </section>
    )
}

function CategoryCard({ category, index, isSelected, onClick }: {
    category: typeof CATEGORIES[0]
    index: number
    isSelected: boolean
    onClick: () => void
}) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })

    const cardStyle = {
        ...baseCardStyle,
        backgroundColor: category.bg,
    }

    return (
        <div ref={ref}>
            <motion.div
                layoutId={`card-${category.id}`}
                onClick={onClick}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{
                    opacity: isSelected ? 0 : (isInView ? 1 : 0),
                    y: isInView ? 0 : 50,
                }}
                transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    delay: index * 0.08,
                }}
                style={cardStyle}
            >
                <motion.div layoutId={`card-content-${category.id}`} style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                }}>
                    {/* Accent Line */}
                    <div style={{
                        width: "24px",
                        height: "2px",
                        backgroundColor: category.accent,
                        marginBottom: "8px",
                    }} />

                    {/* Label */}
                    <div style={{
                        fontSize: "13px",
                        fontWeight: "800",
                        color: category.color,
                        lineHeight: 1.2,
                        textTransform: "uppercase" as const,
                        letterSpacing: "0.02em",
                    }}>
                        {category.label}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}

const sectionStyle = {
    backgroundColor: "#FAF6F0",
    width: "100%",
    paddingTop: "60px",
    paddingBottom: "60px",
    overflow: "hidden",
    position: "relative" as const,
}

const headerWrapperStyle = {
    paddingLeft: "20px",
    paddingRight: "20px",
    marginBottom: "24px",
}

const labelStyle = {
    color: "#C8973A",
    fontSize: "11px",
    letterSpacing: "0.4em",
    fontWeight: "800",
    textTransform: "uppercase" as const,
}

const titleStyle = {
    color: "#1A1A1A",
    fontSize: "42px",
    fontWeight: "900",
    letterSpacing: "-0.03em",
    lineHeight: 1,
    marginTop: "8px",
    marginBottom: 0,
}

const cardListStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    padding: "0 20px",
}

const baseCardStyle = {
    borderRadius: "12px",
    padding: "16px 12px",
    boxShadow: "0 4px 12px rgba(92,43,31,0.15), 0 2px 4px rgba(92,43,31,0.1)",
    cursor: "pointer",
    position: "relative" as const,
    aspectRatio: "1",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center" as const,
}

const overlayStyle = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(6px)",
    zIndex: 900,
}

const expandedCardStyle = {
    position: "fixed" as const,
    top: "50%",
    left: "50%",
    width: "calc(100% - 48px)",
    maxWidth: "500px",
    borderRadius: "24px",
    padding: "40px",
    boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
    zIndex: 901,
    transform: "translate(-50%, -50%)",
}

addPropertyControls(DenChaiMenuCategories, {})
