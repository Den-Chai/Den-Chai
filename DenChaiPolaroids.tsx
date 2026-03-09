import { addPropertyControls, ControlType } from "framer"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { useState, useRef } from "react"

// ═══════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════

const CATEGORIES = [
    {
        id: "specials",
        label: "Specials",
        description:
            "Today's featured dishes — limited, seasonal, and always worth it.",
        image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=400&fit=crop",
        rotate: -12,
        translateX: -20,
    },
    {
        id: "appetizers",
        label: "Appetizers",
        description: "Light starters to begin your Northern Thai journey.",
        image: "https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400&h=400&fit=crop",
        rotate: 8,
        translateX: 30,
    },
    {
        id: "noodle soups",
        label: "Noodle Soups",
        description:
            "Rich, aromatic broths slow-cooked with Northern spices.",
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop",
        rotate: -5,
        translateX: -10,
    },
    {
        id: "noodles",
        label: "Noodles",
        description: "Wok-tossed and hand-crafted noodle dishes.",
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop",
        rotate: 15,
        translateX: 20,
    },
    {
        id: "fried rice",
        label: "Fried Rice",
        description:
            "Thai-style fried rice with bold flavors and fresh ingredients.",
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop",
        rotate: -8,
        translateX: -25,
    },
    {
        id: "curries",
        label: "Curries",
        description: "Fragrant, complex curries rooted in Lanna tradition.",
        image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=400&fit=crop",
        rotate: 6,
        translateX: 15,
    },
    {
        id: "asian entrees",
        label: "Asian Entrees",
        description: "Bold entrees drawing from across Southeast Asia.",
        image: "https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400&h=400&fit=crop",
        rotate: -14,
        translateX: -15,
    },
    {
        id: "salads",
        label: "Salads",
        description: "Fresh, vibrant salads with bright Thai dressings.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop",
        rotate: 10,
        translateX: 25,
    },
    {
        id: "sides",
        label: "Sides",
        description: "Perfect accompaniments to complete your meal.",
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop",
        rotate: -7,
        translateX: -20,
    },
    {
        id: "beverages",
        label: "Beverages",
        description: "Thai teas, fresh juices and house drinks.",
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop",
        rotate: 12,
        translateX: 10,
    },
]

// ═══════════════════════════════════════════════════════════════════════════
// POLAROID CARD
// ═══════════════════════════════════════════════════════════════════════════

function PolaroidCard({
    cat,
    index,
    selectedId,
    onSelect,
}: {
    cat: (typeof CATEGORIES)[0]
    index: number
    selectedId: string | null
    onSelect: (id: string) => void
}) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-60px" })
    const isSelected = selectedId === cat.id
    const isDeemphasized = selectedId !== null && !isSelected

    return (
        <motion.div
            ref={ref}
            className="polaroid-card"
            onClick={() => onSelect(cat.id)}
            initial={{ opacity: 0, y: -80, rotate: 0 }}
            animate={
                isInView
                    ? {
                          opacity: isDeemphasized ? 0.35 : 1,
                          y: 0,
                          rotate: cat.rotate,
                          x: cat.translateX,
                          scale: isSelected ? 1.06 : 1,
                      }
                    : { opacity: 0, y: -80, rotate: 0 }
            }
            transition={{
                type: "spring",
                damping: 12,
                stiffness: 100,
                delay: index * 0.12,
            }}
            whileTap={{ scale: 0.97 }}
            style={{
                position: "relative",
                marginTop: index === 0 ? 0 : -70,
                zIndex: isSelected ? 100 : index + 1,
                cursor: "pointer",
                width: 260,
                backgroundColor: "#FAF7F2",
                borderRadius: 4,
                padding: "14px",
                boxShadow: isSelected
                    ? "0 20px 60px rgba(0,0,0,0.65), 0 8px 20px rgba(0,0,0,0.45)"
                    : "0 4px 8px rgba(0,0,0,0.4), 0 16px 40px rgba(0,0,0,0.3)",
                userSelect: "none" as const,
                WebkitUserSelect: "none" as const,
            }}
        >
            {/* Photo */}
            <img
                src={cat.image}
                alt={cat.label}
                style={{
                    width: "100%",
                    aspectRatio: "1",
                    objectFit: "cover",
                    display: "block",
                    borderRadius: 2,
                    boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)",
                }}
            />

            {/* Handwritten Label */}
            <div
                style={{
                    position: "absolute",
                    top: 10,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    fontFamily: "'Caveat', cursive",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#FFFFFF",
                    textShadow: "0 1px 4px rgba(0,0,0,0.7), 0 0px 12px rgba(0,0,0,0.5)",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase" as const,
                    pointerEvents: "none",
                }}
            >
                {cat.label}
            </div>
        </motion.div>
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// MODAL
// ═══════════════════════════════════════════════════════════════════════════

function PolaroidModal({
    cat,
    onClose,
}: {
    cat: (typeof CATEGORIES)[0]
    onClose: () => void
}) {
    return (
        <AnimatePresence>
            <>
                {/* Backdrop */}
                <motion.div
                    key="backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={onClose}
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(20,8,4,0.88)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        zIndex: 500,
                    }}
                />

                {/* Expanded Polaroid Panel */}
                <motion.div
                    key="modal"
                    initial={{
                        scale: 0.55,
                        opacity: 0,
                        rotate: cat.rotate,
                    }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                        rotate: 0,
                    }}
                    exit={{
                        scale: 0.5,
                        opacity: 0,
                        rotate: cat.rotate,
                    }}
                    transition={{
                        type: "spring",
                        damping: 22,
                        stiffness: 280,
                    }}
                    style={{
                        position: "fixed",
                        top: "8vh",
                        left: "5vw",
                        right: "5vw",
                        bottom: "8vh",
                        zIndex: 600,
                        borderRadius: 4,
                        backgroundColor: "#FAF7F2",
                        padding: "14px 14px 0 14px",
                        display: "flex",
                        flexDirection: "column" as const,
                        overflow: "hidden",
                        boxShadow:
                            "0 32px 80px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.35)",
                    }}
                >
                    {/* Close Button — floats above the modal top edge */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.25, type: "spring", damping: 16 }}
                        onClick={onClose}
                        style={{
                            position: "absolute",
                            top: -48,
                            right: 0,
                            backgroundColor: "rgba(250,247,242,0.18)",
                            border: "1px solid rgba(250,247,242,0.35)",
                            color: "#FDF8F2",
                            borderRadius: "50%",
                            width: 38,
                            height: 38,
                            fontSize: 18,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "sans-serif",
                        }}
                    >
                        ✕
                    </motion.button>

                    {/* Photo */}
                    <img
                        src={cat.image}
                        alt={cat.label}
                        style={{
                            width: "100%",
                            aspectRatio: "1.15",
                            objectFit: "cover",
                            borderRadius: 2,
                            flexShrink: 0,
                            display: "block",
                        }}
                    />

                    {/* Content area — the polaroid "bottom" */}
                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column" as const,
                            padding: "20px 10px 24px 10px",
                            overflow: "hidden",
                        }}
                    >
                        {/* Handwritten category name */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.18, duration: 0.4 }}
                            style={{
                                fontFamily: "'Caveat', cursive",
                                fontSize: 38,
                                fontWeight: 700,
                                color: "#2C1810",
                                textTransform: "uppercase" as const,
                                letterSpacing: "0.04em",
                                lineHeight: 1,
                            }}
                        >
                            {cat.label}
                        </motion.div>

                        {/* Gold accent line */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.26, duration: 0.4 }}
                            style={{
                                width: 44,
                                height: 3,
                                backgroundColor: "#C8973A",
                                borderRadius: 2,
                                marginTop: 10,
                                marginBottom: 12,
                                transformOrigin: "left",
                            }}
                        />

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.32, duration: 0.4 }}
                            style={{
                                fontFamily: "sans-serif",
                                fontSize: 15,
                                lineHeight: 1.65,
                                color: "#5C3D2E",
                                margin: 0,
                                flex: 1,
                            }}
                        >
                            {cat.description}
                        </motion.p>

                        {/* View Menu Button */}
                        <motion.a
                            href={`/menu-working-1#section-${cat.id}`}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.4 }}
                            style={{
                                display: "block",
                                width: "100%",
                                marginTop: 16,
                                backgroundColor: "#5C2B1F",
                                color: "#FDF8F2",
                                fontFamily: "sans-serif",
                                fontSize: 12,
                                fontWeight: 700,
                                textTransform: "uppercase" as const,
                                letterSpacing: "0.14em",
                                padding: "16px",
                                borderRadius: 3,
                                textAlign: "center" as const,
                                textDecoration: "none",
                                boxSizing: "border-box" as const,
                            }}
                        >
                            View Full Menu →
                        </motion.a>
                    </div>
                </motion.div>
            </>
        </AnimatePresence>
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function DenChaiPolaroids() {
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const selectedCat = CATEGORIES.find((c) => c.id === selectedId) ?? null

    return (
        <>
            {/* Google Font */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');

                @media (min-width: 768px) {
                    .polaroid-stack {
                        display: flex !important;
                        flex-wrap: wrap !important;
                        gap: 40px !important;
                        width: 680px !important;
                        justify-content: center !important;
                    }
                    .polaroid-card {
                        margin-top: 0 !important;
                        width: 200px !important;
                        transform: none !important;
                    }
                }
            `}</style>

            {/* Section */}
            <section
                id="menu"
                style={{
                    width: "100%",
                    backgroundColor: "#2C1810",
                    paddingTop: 80,
                    paddingBottom: 120,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Subtle texture overlay */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0.04,
                        backgroundImage:
                            "url('https://www.transparenttextures.com/patterns/asfalt-dark.png')",
                        pointerEvents: "none",
                    }}
                />

                {/* Header */}
                <div
                    style={{
                        width: "100%",
                        paddingLeft: 28,
                        paddingRight: 28,
                        marginBottom: 60,
                        boxSizing: "border-box",
                        position: "relative",
                        zIndex: 2,
                    }}
                >
                    <div
                        style={{
                            color: "#C8973A",
                            fontSize: 11,
                            letterSpacing: "0.4em",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            fontFamily: "sans-serif",
                        }}
                    >
                        Explore the Menu
                    </div>
                    <div
                        style={{
                            color: "#FDF8F2",
                            fontSize: 56,
                            fontWeight: 900,
                            letterSpacing: "-0.03em",
                            lineHeight: 1,
                            marginTop: 8,
                            fontFamily: "sans-serif",
                        }}
                    >
                        OUR MENU.
                    </div>
                </div>

                {/* Polaroid Stack */}
                <div
                    className="polaroid-stack"
                    style={{
                        width: 260,
                        margin: "0 auto",
                        position: "relative",
                        zIndex: 2,
                        paddingBottom: 40,
                    }}
                >
                    {CATEGORIES.map((cat, index) => (
                        <PolaroidCard
                            key={cat.id}
                            cat={cat}
                            index={index}
                            selectedId={selectedId}
                            onSelect={setSelectedId}
                        />
                    ))}
                </div>
            </section>

            {/* Modal — rendered outside section so it can be fixed full screen */}
            <AnimatePresence>
                {selectedId && selectedCat && (
                    <PolaroidModal
                        key={selectedId}
                        cat={selectedCat}
                        onClose={() => setSelectedId(null)}
                    />
                )}
            </AnimatePresence>
        </>
    )
}

addPropertyControls(DenChaiPolaroids, {})
