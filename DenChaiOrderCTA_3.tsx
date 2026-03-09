import { addPropertyControls, ControlType } from "framer"
import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATED COUNTER — counts up a number when in view
// ═══════════════════════════════════════════════════════════════════════════

function CountUp({
    target,
    suffix = "",
    duration = 1.8,
}: {
    target: number
    suffix?: string
    duration?: number
}) {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    useEffect(() => {
        if (!isInView) return
        let start = 0
        const step = target / (duration * 60)
        const timer = setInterval(() => {
            start += step
            if (start >= target) {
                setCount(target)
                clearInterval(timer)
            } else {
                setCount(Math.floor(start))
            }
        }, 1000 / 60)
        return () => clearInterval(timer)
    }, [isInView, target, duration])

    return (
        <span ref={ref}>
            {count}
            {suffix}
        </span>
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// FLOATING SPICE PARTICLE
// ═══════════════════════════════════════════════════════════════════════════

function SpiceParticle({
    emoji,
    style,
    delay,
}: {
    emoji: string
    style: React.CSSProperties
    delay: number
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -20 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{
                delay,
                type: "spring",
                damping: 14,
                stiffness: 120,
            }}
            style={{
                position: "absolute",
                fontSize: 28,
                pointerEvents: "none",
                userSelect: "none",
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
                ...style,
            }}
        >
            {emoji}
        </motion.div>
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN CTA COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function DenChaiOrderCTA({ copyrightSpacing = 20 }: { copyrightSpacing?: number }) {
    const [buttonPressed, setButtonPressed] = useState(false)

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');

                @keyframes grain {
                    0%, 100% { transform: translate(0, 0) }
                    10% { transform: translate(-2%, -3%) }
                    20% { transform: translate(3%, 2%) }
                    30% { transform: translate(-1%, 4%) }
                    40% { transform: translate(4%, -1%) }
                    50% { transform: translate(-3%, 3%) }
                    60% { transform: translate(2%, -4%) }
                    70% { transform: translate(-4%, 1%) }
                    80% { transform: translate(3%, -2%) }
                    90% { transform: translate(-2%, 4%) }
                }

                @keyframes pulse-ring {
                    0% { transform: scale(1); opacity: 0.6; }
                    100% { transform: scale(1.5); opacity: 0; }
                }

                @keyframes slow-drift {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-12px) rotate(3deg); }
                }

                .cta-order-btn {
                    position: relative;
                    overflow: hidden;
                }
                .cta-order-btn::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        105deg,
                        transparent 30%,
                        rgba(255,255,255,0.25) 50%,
                        transparent 70%
                    );
                    transform: translateX(-100%);
                    transition: transform 0s;
                }
                .cta-order-btn:hover::before {
                    transform: translateX(100%);
                    transition: transform 0.55s ease;
                }
                .cta-order-btn:active {
                    transform: scale(0.97) !important;
                }

                .drift {
                    animation: slow-drift 6s ease-in-out infinite;
                }
                .drift-2 {
                    animation: slow-drift 8s ease-in-out infinite reverse;
                }
                .drift-3 {
                    animation: slow-drift 5s ease-in-out infinite 1s;
                }
            `}</style>

            <section
                style={{
                    width: "100%",
                    backgroundColor: "#1A0A05",
                    position: "relative",
                    overflow: "hidden",
                    paddingTop: 100,
                    paddingBottom: 100,
                    display: "flex",
                    flexDirection: "column" as const,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {/* ── Grain texture overlay ── */}
                <div
                    style={{
                        position: "absolute",
                        inset: "-50%",
                        width: "200%",
                        height: "200%",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                        opacity: 0.045,
                        animation: "grain 0.5s steps(1) infinite",
                        pointerEvents: "none",
                        zIndex: 1,
                    }}
                />

                {/* ── Radial warm glow behind content ── */}
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "140%",
                        aspectRatio: "1",
                        background:
                            "radial-gradient(circle, rgba(92,43,31,0.55) 0%, transparent 70%)",
                        pointerEvents: "none",
                        zIndex: 1,
                    }}
                />

                {/* ── Floating spice emojis ── */}
                <SpiceParticle
                    emoji="🌶️"
                    delay={0.3}
                    style={{ top: "12%", left: "8%", fontSize: 32 }}
                />
                <SpiceParticle
                    emoji="🍜"
                    delay={0.5}
                    style={{ top: "18%", right: "10%", fontSize: 36 }}
                />
                <SpiceParticle
                    emoji="🌿"
                    delay={0.7}
                    style={{ bottom: "22%", left: "6%", fontSize: 28 }}
                />

                {/* ── Main content ── */}
                <div
                    style={{
                        position: "relative",
                        zIndex: 2,
                        width: "100%",
                        maxWidth: 560,
                        paddingLeft: 28,
                        paddingRight: 28,
                        boxSizing: "border-box" as const,
                        display: "flex",
                        flexDirection: "column" as const,
                        alignItems: "center",
                        textAlign: "center" as const,
                    }}
                >
                    {/* Gold label */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        style={{
                            color: "#C8973A",
                            fontSize: 11,
                            letterSpacing: "0.45em",
                            fontWeight: 800,
                            textTransform: "uppercase" as const,
                            fontFamily: "sans-serif",
                            marginBottom: 16,
                        }}
                    >
                        Ready in 15–25 Minutes
                    </motion.div>

                    {/* Main headline */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, delay: 0.08 }}
                        style={{
                            color: "#FDF8F2",
                            fontSize: 64,
                            fontWeight: 900,
                            letterSpacing: "-0.04em",
                            lineHeight: 0.92,
                            fontFamily: "sans-serif",
                            marginBottom: 8,
                        }}
                    >
                        SOMETHING
                        <br />
                        <span
                            style={{
                                color: "#C8973A",
                                fontFamily: "'Caveat', cursive",
                                fontSize: 76,
                                fontWeight: 700,
                                letterSpacing: "-0.02em",
                                lineHeight: 1,
                            }}
                        >
                            smells good.
                        </span>
                    </motion.div>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.18 }}
                        style={{
                            fontFamily: "sans-serif",
                            fontSize: 16,
                            lineHeight: 1.7,
                            color: "rgba(253,248,242,0.7)",
                            marginTop: 20,
                            marginBottom: 36,
                            maxWidth: 400,
                        }}
                    >
                        Fresh noodles made in-house daily. Every broth simmered
                        for hours. The recipes haven't changed — they've just found
                        a new home in Spartanburg.
                    </motion.p>

                    {/* ── Stats row ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.24 }}
                        style={{
                            display: "flex",
                            gap: 0,
                            width: "100%",
                            marginBottom: 44,
                            borderTop: "1px solid rgba(253,248,242,0.08)",
                            borderBottom: "1px solid rgba(253,248,242,0.08)",
                            paddingTop: 24,
                            paddingBottom: 24,
                        }}
                    >
                        {[
                            {
                                number: 50,
                                suffix: "+",
                                label: "Menu Items",
                            },
                            {
                                number: 25,
                                suffix: " min",
                                label: "Avg Pickup",
                            },
                            {
                                number: 100,
                                suffix: "%",
                                label: "Made Fresh",
                            },
                        ].map((stat, i) => (
                            <div
                                key={stat.label}
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    flexDirection: "column" as const,
                                    alignItems: "center",
                                    gap: 4,
                                    borderRight:
                                        i < 2
                                            ? "1px solid rgba(253,248,242,0.08)"
                                            : "none",
                                }}
                            >
                                <div
                                    style={{
                                        fontFamily: "sans-serif",
                                        fontSize: 32,
                                        fontWeight: 900,
                                        color: "#C8973A",
                                        letterSpacing: "-0.03em",
                                        lineHeight: 1,
                                    }}
                                >
                                    <CountUp
                                        target={stat.number}
                                        suffix={stat.suffix}
                                    />
                                </div>
                                <div
                                    style={{
                                        fontFamily: "sans-serif",
                                        fontSize: 11,
                                        fontWeight: 600,
                                        color: "rgba(253,248,242,0.45)",
                                        letterSpacing: "0.12em",
                                        textTransform: "uppercase" as const,
                                    }}
                                >
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* ── ORDER BUTTON ── */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                            delay: 0.3,
                            type: "spring",
                            damping: 16,
                            stiffness: 200,
                        }}
                        style={{ width: "100%", position: "relative" }}
                    >
                        {/* Pulse rings behind button */}
                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: "100%",
                                height: "100%",
                                borderRadius: 16,
                                border: "2px solid rgba(200,151,58,0.4)",
                                animation: "pulse-ring 2s ease-out infinite",
                                pointerEvents: "none",
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: "100%",
                                height: "100%",
                                borderRadius: 16,
                                border: "2px solid rgba(200,151,58,0.25)",
                                animation: "pulse-ring 2s ease-out infinite 0.5s",
                                pointerEvents: "none",
                            }}
                        />

                        <a
                            href="/den-chai-orders"
                            className="cta-order-btn"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 12,
                                width: "100%",
                                backgroundColor: "#C8973A",
                                color: "#1A0A05",
                                fontFamily: "sans-serif",
                                fontSize: 16,
                                fontWeight: 900,
                                textTransform: "uppercase" as const,
                                letterSpacing: "0.14em",
                                padding: "22px 32px",
                                borderRadius: 16,
                                textDecoration: "none",
                                boxSizing: "border-box" as const,
                                boxShadow:
                                    "0 8px 32px rgba(200,151,58,0.45), 0 2px 8px rgba(200,151,58,0.3)",
                                position: "relative",
                                zIndex: 1,
                            }}
                        >
                            Order Online Now
                            <span
                                style={{
                                    fontSize: 18,
                                    marginLeft: 4,
                                }}
                            >
                                →
                            </span>
                        </a>
                    </motion.div>

                    {/* Reassurance line below button */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        style={{
                            fontFamily: "sans-serif",
                            fontSize: 12,
                            color: "rgba(253,248,242,0.35)",
                            marginTop: 14,
                            letterSpacing: "0.06em",
                        }}
                    >
                        Pickup only · 253 Magnolia St, Spartanburg SC
                    </motion.div>
                </div>

                {/* Copyright notice - positioned absolutely at bottom */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    style={{
                        position: "absolute",
                        bottom: copyrightSpacing,
                        left: "50%",
                        transform: "translateX(-50%)",
                        fontFamily: "sans-serif",
                        fontSize: 11,
                        color: "rgba(253,248,242,0.25)",
                        letterSpacing: "0.04em",
                        zIndex: 3,
                        whiteSpace: "nowrap" as const,
                    }}
                >
                    © 2026 StageCraft Integrations - Den Chai
                </motion.div>
            </section>
        </>
    )
}

addPropertyControls(DenChaiOrderCTA, {
    copyrightSpacing: {
        type: ControlType.Number,
        title: "Copyright Bottom",
        defaultValue: 20,
        min: 0,
        max: 100,
        step: 2,
        displayStepper: true,
        description: "Distance from bottom edge",
    },
})
