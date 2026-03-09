import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useMemo } from "react"

const fallbackImages = [
    "https://framerusercontent.com/images/U4ZH2VbeJXCfEXJAsmZ4OXek0.png",
    "https://framerusercontent.com/images/mgbCXwXfJaforx0xL937YfIoP8.jpg",
    "https://framerusercontent.com/images/1mEZrKpVydNZGPmS4JusSFI9Po.jpg",
    "https://framerusercontent.com/images/o7ZyRxXZhcwrsjDwQFtnfXFpU7Y.png"
]

export default function DenChaiHeroSlider(props) {
    const { images = [], duration = 5 } = props
    const [index, setIndex] = useState(0)

    // Ensure we ALWAYS have an array of strings
    const activeImages = useMemo(() => {
        if (Array.isArray(images) && images.length > 0) return images
        return fallbackImages
    }, [images])

    // Detect canvas mode
    const isCanvas = RenderTarget.current() === RenderTarget.canvas

    // Handle slide rotation (only in preview/live)
    useEffect(() => {
        if (!isCanvas) {
            if (activeImages.length <= 1) return
            const timer = setInterval(() => {
                setIndex((prev) => (prev + 1) % activeImages.length)
            }, duration * 1000)
            return () => clearInterval(timer)
        }
    }, [activeImages, duration, isCanvas])

    const containerStyle = {
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#1a1a1a", // Dark grey background to ensure visibility
    }

    const textOverlayStyle = {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#FDF8F2",
        pointerEvents: "none",
        zIndex: 10,
        textAlign: "center",
        padding: "20px",
    }

    // CANVAS MODE: Show static preview (no animations)
    if (isCanvas) {
        return (
            <div style={containerStyle}>
                <img
                    src={activeImages[0]}
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        zIndex: 1,
                    }}
                    alt="Hero Slider Preview"
                />

                {/* Text Overlay */}
                <div style={textOverlayStyle}>
                    <h1 style={{
                        fontSize: "clamp(42px, 8vw, 90px)",
                        margin: 0,
                        fontWeight: "bold",
                        lineHeight: 1.1,
                        textShadow: "0 4px 15px rgba(0,0,0,0.5)"
                    }}>
                        Den Chai.
                    </h1>
                    <p style={{
                        fontSize: "clamp(16px, 2.5vw, 28px)",
                        margin: "15px 0 0 0",
                        opacity: 0.9,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        textShadow: "0 2px 8px rgba(0,0,0,0.5)"
                    }}>
                        Northern Thai Reimagined.
                    </p>
                </div>

                {/* Gradient Overlay */}
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.4))",
                    pointerEvents: "none",
                    zIndex: 5
                }} />
            </div>
        )
    }

    // PREVIEW/LIVE MODE: Show full animated slider
    return (
        <div style={containerStyle}>
            <AnimatePresence initial={false}>
                <motion.div
                    key={index}
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        zIndex: 1,
                    }}
                >
                    <img
                        src={activeImages[index]}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block"
                        }}
                    />
                </motion.div>
            </AnimatePresence>
            
            {/* Text Overlay */}
            <div style={textOverlayStyle}>
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    style={{ 
                        fontSize: "clamp(42px, 8vw, 90px)", 
                        margin: 0, 
                        fontWeight: "bold",
                        lineHeight: 1.1,
                        textShadow: "0 4px 15px rgba(0,0,0,0.5)"
                    }}
                >
                    Den Chai.
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    style={{ 
                        fontSize: "clamp(16px, 2.5vw, 28px)", 
                        margin: "15px 0 0 0", 
                        opacity: 0.9,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        textShadow: "0 2px 8px rgba(0,0,0,0.5)"
                    }}
                >
                    Northern Thai Reimagined.
                </motion.p>
            </div>

            {/* Gradient Overlay for contrast */}
            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.4))",
                pointerEvents: "none",
                zIndex: 5
            }} />
        </div>
    )
}

addPropertyControls(DenChaiHeroSlider, {
    images: {
        type: ControlType.Array,
        title: "Slide Images",
        defaultValue: fallbackImages,
        control: {
            type: ControlType.Image
        }
    },
    duration: {
        type: ControlType.Number,
        title: "Transition Speed (s)",
        min: 2,
        max: 20,
        defaultValue: 5,
        displayStepper: true,
    }
})
