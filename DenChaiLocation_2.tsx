import { addPropertyControls, ControlType } from "framer"
import { motion } from "framer-motion"

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface DenChaiLocationProps {
    mapImage?: string
    backgroundColor?: string
    mapWidth?: number
    mapMarginSides?: number
}

// ═══════════════════════════════════════════════════════════════════════════
// OPEN/CLOSED BADGE
// ═══════════════════════════════════════════════════════════════════════════

function OpenClosedBadge() {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const currentTime = hours * 60 + minutes
    const openTime = 11 * 60      // 11:00 AM
    const closeTime = 21 * 60     // 9:00 PM
    const isOpen = currentTime >= openTime && currentTime < closeTime
    const closingSoon = isOpen && currentTime >= closeTime - 30

    return (
        <div
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                backgroundColor: isOpen
                    ? closingSoon
                        ? "rgba(218,165,32,0.15)"
                        : "rgba(45,138,78,0.12)"
                    : "rgba(211,82,48,0.12)",
                border: `1px solid ${
                    isOpen
                        ? closingSoon
                            ? "rgba(218,165,32,0.4)"
                            : "rgba(45,138,78,0.35)"
                        : "rgba(211,82,48,0.35)"
                }`,
                borderRadius: 20,
                padding: "5px 12px",
                marginBottom: 20,
            }}
        >
            {/* Pulse dot */}
            <div
                style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    backgroundColor: isOpen
                        ? closingSoon ? "#DAA520" : "#2D8A4E"
                        : "#D35230",
                    boxShadow: isOpen
                        ? closingSoon
                            ? "0 0 0 2px rgba(218,165,32,0.3)"
                            : "0 0 0 2px rgba(45,138,78,0.3)"
                        : "0 0 0 2px rgba(211,82,48,0.3)",
                }}
            />
            <span
                style={{
                    fontFamily: "sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase" as const,
                    color: isOpen
                        ? closingSoon ? "#DAA520" : "#2D8A4E"
                        : "#D35230",
                }}
            >
                {isOpen
                    ? closingSoon ? "Closing Soon" : "Open Now"
                    : "Closed · Opens 11AM"}
            </span>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function DenChaiLocation(props: DenChaiLocationProps) {
    const {
        mapImage,
        backgroundColor = "#FAF6F0",
        mapWidth = 100,
        mapMarginSides = 0,
    } = props

    const GOOGLE_MAPS_URL =
        "https://www.google.com/maps/dir/?api=1&destination=253+Magnolia+St+Spartanburg+SC+29306"

    const PHONE_NUMBER = "4843749791"
    const PHONE_DISPLAY = "(484) 374-9791"

    return (
        <>
            <style>{`
                .location-map-wrapper:hover .map-overlay {
                    opacity: 1 !important;
                }
                .location-map-wrapper:active .map-overlay {
                    opacity: 1 !important;
                }
                .action-btn {
                    transition: transform 0.2s ease, box-shadow 0.2s ease !important;
                }
                .action-btn:hover {
                    transform: translateY(-2px) !important;
                }
                .action-btn:active {
                    transform: scale(0.97) !important;
                }
            `}</style>

            <section
                id="contact"
                style={{
                    width: "100%",
                    backgroundColor: backgroundColor,
                    paddingTop: 72,
                    paddingBottom: 80,
                    display: "flex",
                    flexDirection: "column" as const,
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: 1200,
                        paddingLeft: 24,
                        paddingRight: 24,
                        boxSizing: "border-box" as const,
                        display: "flex",
                        flexDirection: "column" as const,
                        gap: 0,
                    }}
                >
                    {/* ── Section Label ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        style={{
                            color: "#C8973A",
                            fontSize: 11,
                            letterSpacing: "0.4em",
                            fontWeight: 800,
                            textTransform: "uppercase" as const,
                            fontFamily: "sans-serif",
                            marginBottom: 8,
                        }}
                    >
                        Find Us
                    </motion.div>

                    {/* ── Section Title ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.06 }}
                        style={{
                            color: "#1A1A1A",
                            fontSize: 48,
                            fontWeight: 900,
                            letterSpacing: "-0.03em",
                            lineHeight: 1,
                            fontFamily: "sans-serif",
                            marginBottom: 32,
                        }}
                    >
                        COME IN.
                    </motion.div>

                    {/* ── MAP IMAGE ── */}
                    <motion.a
                        href={GOOGLE_MAPS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="location-map-wrapper"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, delay: 0.1 }}
                        style={{
                            display: "block",
                            width: `${mapWidth}%`,
                            marginLeft: `${mapMarginSides}px`,
                            marginRight: `${mapMarginSides}px`,
                            borderRadius: 16,
                            overflow: "hidden",
                            position: "relative",
                            boxShadow:
                                "0 8px 32px rgba(92,43,31,0.14), 0 2px 8px rgba(92,43,31,0.08)",
                            textDecoration: "none",
                            cursor: "pointer",
                            marginBottom: 32,
                        }}
                    >
                        {/* Map image or placeholder */}
                        {mapImage ? (
                            <img
                                src={mapImage}
                                alt="Den Chai location map"
                                style={{
                                    width: "100%",
                                    minHeight: "500px",
                                    maxHeight: "70vh",
                                    objectFit: "cover",
                                    display: "block",
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: "100%",
                                    minHeight: "500px",
                                    backgroundColor: "#E8E0D8",
                                    display: "flex",
                                    flexDirection: "column" as const,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 10,
                                }}
                            >
                                <div style={{ fontSize: 40 }}>🗺️</div>
                                <div
                                    style={{
                                        fontFamily: "sans-serif",
                                        fontSize: 13,
                                        color: "#5C2B1F",
                                        fontWeight: 600,
                                        letterSpacing: "0.05em",
                                        textTransform: "uppercase" as const,
                                        opacity: 0.6,
                                    }}
                                >
                                    Upload map image in sidebar
                                </div>
                            </div>
                        )}

                        {/* Hover overlay — "Open in Maps" */}
                        <div
                            className="map-overlay"
                            style={{
                                position: "absolute",
                                inset: 0,
                                backgroundColor: "rgba(44,24,16,0.55)",
                                backdropFilter: "blur(2px)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: 0,
                                transition: "opacity 0.25s ease",
                            }}
                        >
                            <div
                                style={{
                                    backgroundColor: "#C8973A",
                                    color: "#FDF8F2",
                                    fontFamily: "sans-serif",
                                    fontSize: 13,
                                    fontWeight: 700,
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase" as const,
                                    padding: "14px 28px",
                                    borderRadius: 8,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <span>📍</span>
                                Open in Google Maps
                            </div>
                        </div>
                    </motion.a>

                    {/* ── INFO CARD ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, delay: 0.18 }}
                        style={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: 16,
                            padding: "32px 28px",
                            boxShadow:
                                "0 4px 24px rgba(92,43,31,0.08), 0 1px 4px rgba(92,43,31,0.06)",
                            display: "flex",
                            flexDirection: "column" as const,
                            gap: 0,
                        }}
                    >
                        {/* Open/Closed badge */}
                        <OpenClosedBadge />

                        {/* Address block */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column" as const,
                                gap: 20,
                                marginBottom: 28,
                            }}
                        >
                            {/* Address */}
                            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                                <div
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: "50%",
                                        backgroundColor: "rgba(200,151,58,0.12)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        fontSize: 16,
                                        marginTop: 2,
                                    }}
                                >
                                    📍
                                </div>
                                <div>
                                    <div
                                        style={{
                                            fontFamily: "sans-serif",
                                            fontSize: 11,
                                            fontWeight: 700,
                                            letterSpacing: "0.12em",
                                            textTransform: "uppercase" as const,
                                            color: "#C8973A",
                                            marginBottom: 4,
                                        }}
                                    >
                                        Address
                                    </div>
                                    <div
                                        style={{
                                            fontFamily: "sans-serif",
                                            fontSize: 16,
                                            fontWeight: 600,
                                            color: "#1A1A1A",
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        253 Magnolia St
                                        <br />
                                        Spartanburg, SC 29306
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div
                                style={{
                                    height: 1,
                                    backgroundColor: "rgba(92,43,31,0.08)",
                                }}
                            />

                            {/* Phone */}
                            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                                <div
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: "50%",
                                        backgroundColor: "rgba(200,151,58,0.12)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        fontSize: 16,
                                        marginTop: 2,
                                    }}
                                >
                                    📞
                                </div>
                                <div>
                                    <div
                                        style={{
                                            fontFamily: "sans-serif",
                                            fontSize: 11,
                                            fontWeight: 700,
                                            letterSpacing: "0.12em",
                                            textTransform: "uppercase" as const,
                                            color: "#C8973A",
                                            marginBottom: 4,
                                        }}
                                    >
                                        Phone
                                    </div>
                                    <a
                                        href={`tel:${PHONE_NUMBER}`}
                                        style={{
                                            fontFamily: "sans-serif",
                                            fontSize: 16,
                                            fontWeight: 600,
                                            color: "#1A1A1A",
                                            textDecoration: "none",
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        {PHONE_DISPLAY}
                                    </a>
                                </div>
                            </div>

                            {/* Divider */}
                            <div
                                style={{
                                    height: 1,
                                    backgroundColor: "rgba(92,43,31,0.08)",
                                }}
                            />

                            {/* Hours */}
                            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                                <div
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: "50%",
                                        backgroundColor: "rgba(200,151,58,0.12)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        fontSize: 16,
                                        marginTop: 2,
                                    }}
                                >
                                    🕐
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div
                                        style={{
                                            fontFamily: "sans-serif",
                                            fontSize: 11,
                                            fontWeight: 700,
                                            letterSpacing: "0.12em",
                                            textTransform: "uppercase" as const,
                                            color: "#C8973A",
                                            marginBottom: 8,
                                        }}
                                    >
                                        Hours
                                    </div>
                                    {[
                                        { day: "Monday", hours: "11:00 AM – 9:00 PM" },
                                        { day: "Tuesday", hours: "11:00 AM – 9:00 PM" },
                                        { day: "Wednesday", hours: "11:00 AM – 9:00 PM" },
                                        { day: "Thursday", hours: "11:00 AM – 9:00 PM" },
                                        { day: "Friday", hours: "11:00 AM – 9:00 PM" },
                                        { day: "Saturday", hours: "11:00 AM – 9:00 PM" },
                                        { day: "Sunday", hours: "11:00 AM – 9:00 PM" },
                                    ].map((row) => {
                                        const dayIndex = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].indexOf(row.day)
                                        const isToday = new Date().getDay() === dayIndex
                                        return (
                                            <div
                                                key={row.day}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    paddingTop: 5,
                                                    paddingBottom: 5,
                                                    borderBottom: "1px solid rgba(92,43,31,0.05)",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontFamily: "sans-serif",
                                                        fontSize: 14,
                                                        fontWeight: isToday ? 700 : 400,
                                                        color: isToday ? "#5C2B1F" : "#666666",
                                                    }}
                                                >
                                                    {row.day}
                                                    {isToday && (
                                                        <span
                                                            style={{
                                                                fontSize: 10,
                                                                fontWeight: 700,
                                                                color: "#C8973A",
                                                                letterSpacing: "0.08em",
                                                                marginLeft: 6,
                                                                textTransform: "uppercase" as const,
                                                            }}
                                                        >
                                                            Today
                                                        </span>
                                                    )}
                                                </span>
                                                <span
                                                    style={{
                                                        fontFamily: "sans-serif",
                                                        fontSize: 14,
                                                        fontWeight: isToday ? 700 : 400,
                                                        color: isToday ? "#5C2B1F" : "#666666",
                                                    }}
                                                >
                                                    {row.hours}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* ── Action Buttons ── */}
                        <div
                            style={{
                                display: "flex",
                                gap: 12,
                                marginTop: 4,
                            }}
                        >
                            {/* Get Directions */}
                            <a
                                href={GOOGLE_MAPS_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="action-btn"
                                style={{
                                    flex: 1,
                                    backgroundColor: "#5C2B1F",
                                    color: "#FDF8F2",
                                    fontFamily: "sans-serif",
                                    fontSize: 13,
                                    fontWeight: 700,
                                    textTransform: "uppercase" as const,
                                    letterSpacing: "0.1em",
                                    padding: "16px 12px",
                                    borderRadius: 12,
                                    textAlign: "center" as const,
                                    textDecoration: "none",
                                    display: "block",
                                    boxShadow: "0 4px 16px rgba(92,43,31,0.25)",
                                }}
                            >
                                📍 Directions
                            </a>

                            {/* Call Us */}
                            <a
                                href={`tel:${PHONE_NUMBER}`}
                                className="action-btn"
                                style={{
                                    flex: 1,
                                    backgroundColor: "transparent",
                                    color: "#5C2B1F",
                                    fontFamily: "sans-serif",
                                    fontSize: 13,
                                    fontWeight: 700,
                                    textTransform: "uppercase" as const,
                                    letterSpacing: "0.1em",
                                    padding: "16px 12px",
                                    borderRadius: 12,
                                    textAlign: "center" as const,
                                    textDecoration: "none",
                                    display: "block",
                                    border: "2px solid #5C2B1F",
                                    boxSizing: "border-box" as const,
                                }}
                            >
                                📞 Call Us
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// PROPERTY CONTROLS
// ═══════════════════════════════════════════════════════════════════════════

addPropertyControls(DenChaiLocation, {
    mapImage: {
        type: ControlType.Image,
        title: "Map Image",
    },
    backgroundColor: {
        type: ControlType.Color,
        title: "Background Color",
        defaultValue: "#FAF6F0",
    },
    mapWidth: {
        type: ControlType.Number,
        title: "Map Width %",
        min: 80,
        max: 120,
        step: 1,
        defaultValue: 100,
        displayStepper: true,
    },
    mapMarginSides: {
        type: ControlType.Number,
        title: "Side Margins",
        min: -50,
        max: 100,
        step: 5,
        defaultValue: 0,
        displayStepper: true,
    },
})
