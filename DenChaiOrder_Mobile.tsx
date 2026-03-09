import * as React from "react"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion, useInView, AnimatePresence } from "framer-motion"
import {
    ShoppingBag,
    Trash2,
    Plus,
    Minus,
    ArrowLeft,
    ChevronRight,
    CreditCard,
    User,
    Mail,
    Phone,
    Lock,
    Eye,
    EyeOff,
    Clock,
    MapPin,
    CheckCircle,
    AlertCircle,
    Gift,
    Utensils,
    ChefHat,
    FileText,
    Star,
    X,
    Home,
    Info,
    UtensilsCrossed,
    Calendar,
    PartyPopper,
    Menu,
    MessageSquare,
} from "lucide-react"

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface CartItem {
    name: string
    price: string
    category: string
    description: string
    quantity: number
    specialInstructions?: string
}

interface CartData {
    items: CartItem[]
    lastUpdated: string
}

interface CustomerInfo {
    firstName: string
    lastName: string
    email: string
    phone: string
    createAccount: boolean
    password: string
    confirmPassword: string
    specialInstructions: string
    pickupTime: string
}

interface OrderConfirmation {
    orderNumber: string
    estimatedTime: string
    items: CartItem[]
    subtotal: number
    tax: number
    total: number
    customer: CustomerInfo
}

type CheckoutStep = "cart" | "customer" | "payment" | "confirmation"

interface DenChaiOrderProps {
    logo?: string
    logoScale?: number
    logoSpacingTop?: number
    logoSpacingBottom?: number
    font?: { fontFamily: string }
    contentWidth?: number
    contentBottomPadding?: number
    taxRate?: number
    headerSize?: number
    subheaderSize?: number
    bodySize?: number
    smallSize?: number
    buttonHeight?: number
    buttonRadius?: number
    cardRadius?: number
    cardPadding?: number
    sectionSpacing?: number
    accentGlow?: boolean
    showAnimations?: boolean
    hamburgerSize?: number
    hamburgerTop?: number
    hamburgerRight?: number
    menuPanelWidth?: number
    restaurantName?: string
    restaurantAddress?: string
    restaurantPhone?: string
    estimatedPickupMin?: number
    estimatedPickupMax?: number
    progressBarHeight?: number
    inputHeight?: number
    inputRadius?: number
    showSpecialInstructions?: boolean
    maxItemQuantity?: number
    emptyCartMessage?: string
    confirmationTitle?: string
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const CART_STORAGE_KEY = "denchai-cart"

const colors = {
    chocolate: "#5C2B1F",
    terracotta: "#D35230",
    gold: "#DAA520",
    white: "#FFFFFF",
    cream: "#FFF8F0",
    warmGray: "#F5F0EB",
    lightBorder: "rgba(92, 43, 31, 0.1)",
    success: "#2D8A4E",
    successLight: "#E8F5EC",
    error: "#D32F2F",
    errorLight: "#FDECEA",
    inputBg: "#FDFBF9",
    shadow: "rgba(92, 43, 31, 0.08)",
    shadowMd: "rgba(92, 43, 31, 0.12)",
    shadowLg: "rgba(92, 43, 31, 0.18)",
    terracottaGlow: "rgba(211, 82, 48, 0.15)",
    goldGlow: "rgba(218, 165, 32, 0.2)",
}

const MOCK_CART: CartItem[] = [
    {
        name: "Khao Soi",
        price: "10",
        category: "noodle soups",
        description: "Rich, creamy coconut curry noodle soup",
        quantity: 2,
    },
    {
        name: "Pad Thai",
        price: "12",
        category: "noodles",
        description: "Rice noodles with egg, bean sprouts, peanuts",
        quantity: 1,
    },
    {
        name: "Spring Rolls",
        price: "8",
        category: "appetizers",
        description: "3 Rolls filled with glass noodles and vegetables",
        quantity: 1,
    },
    {
        name: "Thai Iced Tea",
        price: "4",
        category: "beverages",
        description: "Sweet and creamy Thai tea",
        quantity: 3,
    },
    {
        name: "Red Curry",
        price: "13",
        category: "curries",
        description: "Classic Thai red curry with vegetables",
        quantity: 1,
    },
]

// ═══════════════════════════════════════════════════════════════════════════
// HAMBURGER MENU (shared nav - matches menu page)
// ═══════════════════════════════════════════════════════════════════════════

const NAV_LINKS = [
    { label: "Home", href: "/", icon: Home },
    { label: "About", href: "/#about", icon: Info },
    { label: "Menu", href: "/#menu", icon: UtensilsCrossed },
    {
        label: "Private Events",
        href: "/#events",
        icon: PartyPopper,
    },
    { label: "Contact & Directions", href: "/#contact", icon: MapPin },
    { label: "My Order", href: "/#order", icon: ShoppingBag },
]

const HamburgerMenu: React.FC<{
    isCanvas: boolean
    size: number
    top: number
    right: number
    panelWidth: number
}> = ({ isCanvas, size, top, right, panelWidth }) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <>
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: isCanvas ? "absolute" : "fixed",
                    top: `${top}px`,
                    right: `${right}px`,
                    zIndex: 200,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "8px",
                }}
                whileTap={{ scale: 0.9 }}
            >
                {isOpen ? (
                    <X size={size} color={colors.white} strokeWidth={2.5} />
                ) : (
                    <Menu size={size} color={colors.white} strokeWidth={2.5} />
                )}
            </motion.button>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: isCanvas ? "absolute" : "fixed",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: "rgba(0,0,0,0.5)",
                                zIndex: 150,
                            }}
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 200,
                            }}
                            style={{
                                position: isCanvas ? "absolute" : "fixed",
                                top: 0,
                                right: 0,
                                bottom: 0,
                                width: `min(${panelWidth}px, 85vw)`,
                                backgroundColor: colors.chocolate,
                                zIndex: 160,
                                padding: "80px 24px 24px",
                                overflowY: "auto",
                                boxShadow: "-10px 0 40px rgba(0,0,0,0.3)",
                            }}
                        >
                            {NAV_LINKS.map((link, idx) => {
                                const IconComponent = link.icon
                                return (
                                    <motion.a
                                        key={link.label}
                                        href={isCanvas ? undefined : link.href}
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() =>
                                            !isCanvas && setIsOpen(false)
                                        }
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "16px",
                                            padding: "16px 12px",
                                            marginBottom: "8px",
                                            color: colors.white,
                                            textDecoration: "none",
                                            fontSize: "18px",
                                            fontWeight: "600",
                                            borderRadius: "12px",
                                            transition: "all 0.2s",
                                            cursor: "pointer",
                                        }}
                                        whileHover={{
                                            backgroundColor: colors.terracotta,
                                            x: 8,
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <IconComponent size={28} />
                                        <span>{link.label}</span>
                                    </motion.a>
                                )
                            })}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// TOP NAV BAR
// ═══════════════════════════════════════════════════════════════════════════

const OrderNavBar: React.FC<{
    isCanvas: boolean
    hamburgerSize: number
    hamburgerTop: number
    hamburgerRight: number
    menuPanelWidth: number
    currentStep: CheckoutStep
    onBackToMenu: () => void
}> = ({
    isCanvas,
    hamburgerSize,
    hamburgerTop,
    hamburgerRight,
    menuPanelWidth,
    currentStep,
    onBackToMenu,
}) => {
    const stepLabels: Record<CheckoutStep, string> = {
        cart: "Your Order",
        customer: "Your Details",
        payment: "Payment",
        confirmation: "Confirmed!",
    }
    return (
        <div style={{ position: "relative" }}>
            <motion.nav
                initial={{ y: isCanvas ? 0 : -50, opacity: 1 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, type: "spring" }}
                style={{
                    position: isCanvas ? "absolute" : "fixed",
                    top: 0,
                    width: "100%",
                    zIndex: 100,
                    backgroundColor: colors.chocolate,
                    padding: "14px 0",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                }}
            >
                <div
                    style={{
                        maxWidth: "100%",
                        margin: "0 auto",
                        padding: "0 70px 0 12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >
                    <motion.button
                        onClick={onBackToMenu}
                        whileTap={{ scale: 0.9 }}
                        style={{
                            background: "rgba(255,255,255,0.1)",
                            border: "none",
                            color: colors.white,
                            cursor: "pointer",
                            padding: "8px",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <ArrowLeft size={20} />
                    </motion.button>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <ShoppingBag
                            size={20}
                            color={colors.gold}
                            strokeWidth={2}
                        />
                        <span
                            style={{
                                color: colors.white,
                                fontSize: "16px",
                                fontWeight: "700",
                                letterSpacing: "0.5px",
                                textTransform: "uppercase",
                            }}
                        >
                            {stepLabels[currentStep]}
                        </span>
                    </div>
                </div>
            </motion.nav>
            <HamburgerMenu
                isCanvas={isCanvas}
                size={hamburgerSize}
                top={hamburgerTop}
                right={hamburgerRight}
                panelWidth={menuPanelWidth}
            />
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// PROGRESS STEPPER
// ═══════════════════════════════════════════════════════════════════════════

const ProgressStepper: React.FC<{
    currentStep: CheckoutStep
    height: number
    showAnimations: boolean
}> = ({ currentStep, height, showAnimations }) => {
    const steps: { key: CheckoutStep; label: string; icon: React.FC<any> }[] = [
        { key: "cart", label: "Order", icon: ShoppingBag },
        { key: "customer", label: "Details", icon: User },
        { key: "payment", label: "Pay", icon: CreditCard },
        { key: "confirmation", label: "Done", icon: CheckCircle },
    ]
    const currentIdx = steps.findIndex((s) => s.key === currentStep)

    return (
        <motion.div
            initial={{ opacity: 0, y: showAnimations ? -10 : 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ padding: "20px 16px 16px", marginBottom: "8px" }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0px",
                    position: "relative",
                }}
            >
                {steps.map((step, idx) => {
                    const isCompleted = idx < currentIdx
                    const isCurrent = idx === currentIdx
                    const isPending = idx > currentIdx
                    const IconComp = step.icon
                    return (
                        <React.Fragment key={step.key}>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: "6px",
                                    minWidth: "60px",
                                }}
                            >
                                <motion.div
                                    initial={false}
                                    animate={{
                                        scale: isCurrent ? 1.1 : 1,
                                        backgroundColor: isCompleted
                                            ? colors.success
                                            : isCurrent
                                              ? colors.terracotta
                                              : colors.warmGray,
                                        boxShadow: isCurrent
                                            ? `0 4px 16px ${colors.terracottaGlow}`
                                            : isCompleted
                                              ? "0 2px 8px rgba(45,138,78,0.2)"
                                              : "none",
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                    }}
                                    style={{
                                        width: `${height}px`,
                                        height: `${height}px`,
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <IconComp
                                        size={height * 0.45}
                                        color={
                                            isPending
                                                ? "rgba(92,43,31,0.3)"
                                                : colors.white
                                        }
                                        strokeWidth={2.5}
                                    />
                                </motion.div>
                                <span
                                    style={{
                                        fontSize: "10px",
                                        fontWeight: isCurrent ? "700" : "500",
                                        color: isCurrent
                                            ? colors.terracotta
                                            : isCompleted
                                              ? colors.success
                                              : "rgba(92,43,31,0.35)",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px",
                                    }}
                                >
                                    {step.label}
                                </span>
                            </div>
                            {idx < steps.length - 1 && (
                                <div
                                    style={{
                                        flex: 1,
                                        height: "2px",
                                        backgroundColor: colors.warmGray,
                                        position: "relative",
                                        margin: "0 4px",
                                        marginBottom: "18px",
                                        borderRadius: "1px",
                                        overflow: "hidden",
                                    }}
                                >
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        animate={{
                                            width:
                                                idx < currentIdx
                                                    ? "100%"
                                                    : "0%",
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.1,
                                        }}
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            height: "100%",
                                            backgroundColor: colors.success,
                                            borderRadius: "1px",
                                        }}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    )
                })}
            </div>
        </motion.div>
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// CART HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function getCart(): CartItem[] {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY)
        console.log("📥 [ORDER PAGE] Loading cart from localStorage:", raw ? raw.substring(0, 100) + "..." : "EMPTY")
        if (!raw) {
            console.log("⚠️ [ORDER PAGE] No cart data found in localStorage")
            return []
        }
        const data: CartData = JSON.parse(raw)
        console.log("✅ [ORDER PAGE] Cart loaded successfully:", data.items.length, "items")
        return data.items || []
    } catch (e) {
        console.error("❌ [ORDER PAGE] Failed to load cart:", e)
        return []
    }
}

function saveCart(items: CartItem[]) {
    const data = { items, lastUpdated: new Date().toISOString() }
    console.log("💾 [ORDER PAGE] Saving cart to localStorage:", items.length, "items")
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data))
    console.log("✅ [ORDER PAGE] Cart saved successfully")
}

function clearCartStorage() {
    localStorage.removeItem(CART_STORAGE_KEY)
}

function parsePrice(price: string): number {
    return parseFloat(price.replace(/[^0-9.]/g, "")) || 0
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATED PRICE
// ═══════════════════════════════════════════════════════════════════════════

const AnimatedPrice: React.FC<{
    value: number
    size?: string
    color?: string
    weight?: string
}> = ({ value, size = "16px", color = colors.chocolate, weight = "700" }) => (
    <motion.span
        key={value.toFixed(2)}
        initial={{ opacity: 0.5, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        style={{
            fontSize: size,
            fontWeight: weight,
            color,
            fontVariantNumeric: "tabular-nums",
            fontFamily: "sans-serif",
        }}
    >
        ${value.toFixed(2)}
    </motion.span>
)

// ═══════════════════════════════════════════════════════════════════════════
// EMPTY CART VIEW
// ═══════════════════════════════════════════════════════════════════════════

const EmptyCartView: React.FC<{
    onBackToMenu: () => void
    fontFamily: string
    showAnimations: boolean
    message: string
}> = ({ onBackToMenu, fontFamily, showAnimations, message }) => (
    <motion.div
        initial={{ opacity: 0, y: showAnimations ? 30 : 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 24px",
            textAlign: "center",
            minHeight: "60vh",
        }}
    >
        <motion.div
            animate={
                showAnimations ? { y: [0, -8, 0], rotate: [0, -3, 3, 0] } : {}
            }
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${colors.warmGray}, ${colors.cream})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "28px",
                boxShadow: `0 8px 32px ${colors.shadow}`,
            }}
        >
            <ShoppingBag
                size={48}
                color={colors.terracotta}
                strokeWidth={1.5}
            />
        </motion.div>
        <h2
            style={{
                fontFamily,
                fontSize: "28px",
                color: colors.chocolate,
                marginBottom: "12px",
                lineHeight: "1.2",
            }}
        >
            {message}
        </h2>
        <p
            style={{
                fontSize: "15px",
                color: "rgba(92,43,31,0.5)",
                marginBottom: "36px",
                lineHeight: "1.6",
                maxWidth: "280px",
            }}
        >
            Browse our menu and add some delicious Thai dishes to get started.
        </p>
        <motion.button
            whileHover={{
                scale: 1.03,
                boxShadow: `0 8px 28px ${colors.terracottaGlow}`,
            }}
            whileTap={{ scale: 0.97 }}
            onClick={onBackToMenu}
            style={{
                padding: "16px 40px",
                backgroundColor: colors.terracotta,
                color: colors.white,
                border: "none",
                borderRadius: "14px",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
            }}
        >
            <UtensilsCrossed size={18} /> Browse Menu
        </motion.button>
    </motion.div>
)

// ═══════════════════════════════════════════════════════════════════════════
// CART ITEM ROW
// ═══════════════════════════════════════════════════════════════════════════

const CartItemRow: React.FC<{
    item: CartItem
    index: number
    onUpdateQuantity: (i: number, d: number) => void
    onRemove: (i: number) => void
    onUpdateInstructions: (i: number, s: string) => void
    showAnimations: boolean
    cardRadius: number
    cardPadding: number
    bodySize: number
    smallSize: number
    maxQuantity: number
    showSpecialInstructions: boolean
}> = ({
    item,
    index,
    onUpdateQuantity,
    onRemove,
    onUpdateInstructions,
    showAnimations,
    cardRadius,
    cardPadding,
    bodySize,
    smallSize,
    maxQuantity,
    showSpecialInstructions,
}) => {
    const [showNotes, setShowNotes] = useState(false)
    const [isRemoving, setIsRemoving] = useState(false)
    const lineTotal = parsePrice(item.price) * item.quantity

    const handleRemove = () => {
        setIsRemoving(true)
        setTimeout(() => onRemove(index), 300)
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: showAnimations ? -30 : 0 }}
            animate={{
                opacity: isRemoving ? 0 : 1,
                x: isRemoving ? 80 : 0,
                height: isRemoving ? 0 : "auto",
                marginBottom: isRemoving ? 0 : 12,
            }}
            exit={{ opacity: 0, x: 80, height: 0 }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: showAnimations ? index * 0.06 : 0,
            }}
            style={{
                backgroundColor: colors.white,
                borderRadius: `${cardRadius}px`,
                padding: `${cardPadding}px`,
                boxShadow: `0 2px 12px ${colors.shadow}`,
                border: `1px solid ${colors.lightBorder}`,
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                }}
            >
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Name + price */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "4px",
                        }}
                    >
                        <span
                            style={{
                                fontSize: `${bodySize}px`,
                                fontWeight: "700",
                                color: colors.chocolate,
                                textTransform: "uppercase",
                                fontFamily: "sans-serif",
                                letterSpacing: "0.3px",
                                lineHeight: "1.3",
                                flex: 1,
                                paddingRight: "8px",
                            }}
                        >
                            {item.name}
                        </span>
                        <AnimatedPrice
                            value={lineTotal}
                            size={`${bodySize}px`}
                            color={colors.terracotta}
                        />
                    </div>
                    <p
                        style={{
                            fontSize: `${smallSize}px`,
                            color: "rgba(92,43,31,0.5)",
                            lineHeight: "1.4",
                            margin: "0 0 12px 0",
                            fontFamily: "serif",
                        }}
                    >
                        {item.description}
                    </p>

                    {/* Quantity + actions */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        {/* Stepper */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: colors.warmGray,
                                borderRadius: "10px",
                                padding: "2px",
                            }}
                        >
                            <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => onUpdateQuantity(index, -1)}
                                disabled={item.quantity <= 1}
                                style={{
                                    width: "34px",
                                    height: "34px",
                                    borderRadius: "8px",
                                    border: "none",
                                    backgroundColor:
                                        item.quantity <= 1
                                            ? "transparent"
                                            : colors.white,
                                    color:
                                        item.quantity <= 1
                                            ? "rgba(92,43,31,0.2)"
                                            : colors.chocolate,
                                    cursor:
                                        item.quantity <= 1
                                            ? "default"
                                            : "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow:
                                        item.quantity <= 1
                                            ? "none"
                                            : `0 1px 3px ${colors.shadow}`,
                                    transition: "all 0.15s",
                                }}
                            >
                                <Minus size={14} strokeWidth={2.5} />
                            </motion.button>
                            <motion.span
                                key={item.quantity}
                                initial={{ scale: 1.3, opacity: 0.5 }}
                                animate={{ scale: 1, opacity: 1 }}
                                style={{
                                    minWidth: "36px",
                                    textAlign: "center",
                                    fontSize: `${bodySize}px`,
                                    fontWeight: "800",
                                    color: colors.chocolate,
                                    fontVariantNumeric: "tabular-nums",
                                }}
                            >
                                {item.quantity}
                            </motion.span>
                            <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => onUpdateQuantity(index, 1)}
                                disabled={item.quantity >= maxQuantity}
                                style={{
                                    width: "34px",
                                    height: "34px",
                                    borderRadius: "8px",
                                    border: "none",
                                    backgroundColor:
                                        item.quantity >= maxQuantity
                                            ? "transparent"
                                            : colors.white,
                                    color:
                                        item.quantity >= maxQuantity
                                            ? "rgba(92,43,31,0.2)"
                                            : colors.terracotta,
                                    cursor:
                                        item.quantity >= maxQuantity
                                            ? "default"
                                            : "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow:
                                        item.quantity >= maxQuantity
                                            ? "none"
                                            : `0 1px 3px ${colors.shadow}`,
                                    transition: "all 0.15s",
                                }}
                            >
                                <Plus size={14} strokeWidth={2.5} />
                            </motion.button>
                        </div>
                        {/* Actions */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                            }}
                        >
                            {showSpecialInstructions && (
                                <motion.button
                                    whileTap={{ scale: 0.85 }}
                                    onClick={() => setShowNotes(!showNotes)}
                                    style={{
                                        width: "34px",
                                        height: "34px",
                                        borderRadius: "8px",
                                        border: `1px solid ${item.specialInstructions ? colors.terracotta : colors.lightBorder}`,
                                        backgroundColor:
                                            item.specialInstructions
                                                ? colors.terracottaGlow
                                                : "transparent",
                                        color: item.specialInstructions
                                            ? colors.terracotta
                                            : "rgba(92,43,31,0.3)",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <MessageSquare size={14} strokeWidth={2} />
                                </motion.button>
                            )}
                            <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={handleRemove}
                                style={{
                                    width: "34px",
                                    height: "34px",
                                    borderRadius: "8px",
                                    border: "none",
                                    backgroundColor: colors.errorLight,
                                    color: colors.error,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Trash2 size={14} strokeWidth={2} />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Special instructions expand */}
            <AnimatePresence>
                {showNotes && showSpecialInstructions && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: "hidden" }}
                    >
                        <div
                            style={{
                                marginTop: "12px",
                                paddingTop: "12px",
                                borderTop: `1px dashed ${colors.lightBorder}`,
                            }}
                        >
                            <textarea
                                value={item.specialInstructions || ""}
                                onChange={(e) =>
                                    onUpdateInstructions(index, e.target.value)
                                }
                                placeholder="Special instructions (allergies, spice level, etc.)"
                                style={{
                                    width: "100%",
                                    minHeight: "60px",
                                    padding: "10px 12px",
                                    borderRadius: "8px",
                                    border: `1px solid ${colors.lightBorder}`,
                                    backgroundColor: colors.inputBg,
                                    fontSize: `${smallSize}px`,
                                    fontFamily: "sans-serif",
                                    color: colors.chocolate,
                                    resize: "vertical",
                                    outline: "none",
                                    boxSizing: "border-box",
                                    transition: "border-color 0.2s",
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor =
                                        colors.terracotta
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor =
                                        colors.lightBorder
                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// STICKY ORDER SUMMARY BAR
// ═══════════════════════════════════════════════════════════════════════════

const OrderSummaryBar: React.FC<{
    subtotal: number
    tax: number
    total: number
    itemCount: number
    onProceed: () => void
    buttonHeight: number
    buttonRadius: number
    accentGlow: boolean
    isCanvas: boolean
}> = ({
    subtotal,
    tax,
    total,
    itemCount,
    onProceed,
    buttonHeight,
    buttonRadius,
    accentGlow,
    isCanvas,
}) => (
    <motion.div
        initial={{ y: isCanvas ? 0 : 100, opacity: isCanvas ? 1 : 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        style={{
            position: isCanvas ? "absolute" : "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 90,
            background: `linear-gradient(to top, ${colors.cream} 85%, transparent)`,
            paddingTop: "20px",
        }}
    >
        <div
            style={{
                maxWidth: "600px",
                margin: "0 auto",
                padding: "0 16px 20px",
            }}
        >
            <div
                style={{
                    backgroundColor: colors.white,
                    borderRadius: "16px",
                    padding: "16px 20px",
                    boxShadow: `0 -4px 24px ${colors.shadowMd}`,
                    border: `1px solid ${colors.lightBorder}`,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                        fontSize: "13px",
                        color: "rgba(92,43,31,0.55)",
                    }}
                >
                    <span>
                        Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})
                    </span>
                    <AnimatedPrice
                        value={subtotal}
                        size="13px"
                        color="rgba(92,43,31,0.55)"
                        weight="600"
                    />
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "12px",
                        fontSize: "13px",
                        color: "rgba(92,43,31,0.55)",
                    }}
                >
                    <span>Tax</span>
                    <AnimatedPrice
                        value={tax}
                        size="13px"
                        color="rgba(92,43,31,0.55)"
                        weight="600"
                    />
                </div>
                <div
                    style={{
                        height: "1px",
                        background: `linear-gradient(to right, transparent, ${colors.lightBorder}, transparent)`,
                        marginBottom: "12px",
                    }}
                />
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontSize: "11px",
                                color: "rgba(92,43,31,0.4)",
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                                marginBottom: "2px",
                            }}
                        >
                            Total
                        </div>
                        <AnimatedPrice
                            value={total}
                            size="24px"
                            color={colors.chocolate}
                        />
                    </div>
                    <motion.button
                        whileHover={{
                            scale: 1.02,
                            boxShadow: accentGlow
                                ? `0 8px 28px ${colors.terracottaGlow}`
                                : undefined,
                        }}
                        whileTap={{ scale: 0.97 }}
                        onClick={onProceed}
                        style={{
                            height: `${buttonHeight}px`,
                            padding: "0 28px",
                            backgroundColor: colors.terracotta,
                            color: colors.white,
                            border: "none",
                            borderRadius: `${buttonRadius}px`,
                            fontSize: "15px",
                            fontWeight: "700",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            boxShadow: accentGlow
                                ? `0 4px 16px ${colors.terracottaGlow}`
                                : `0 2px 8px ${colors.shadow}`,
                        }}
                    >
                        Checkout <ChevronRight size={16} strokeWidth={3} />
                    </motion.button>
                </div>
            </div>
        </div>
    </motion.div>
)

// ═══════════════════════════════════════════════════════════════════════════
// STYLED INPUT
// ═══════════════════════════════════════════════════════════════════════════

const StyledInput: React.FC<{
    label: string
    value: string
    onChange: (v: string) => void
    type?: string
    placeholder?: string
    icon?: React.FC<any>
    required?: boolean
    error?: string
    inputHeight: number
    inputRadius: number
    bodySize: number
    smallSize: number
    autoComplete?: string
}> = ({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
    icon: IconComp,
    required,
    error,
    inputHeight,
    inputRadius,
    bodySize,
    smallSize,
    autoComplete,
}) => {
    const [focused, setFocused] = useState(false)
    const [showPw, setShowPw] = useState(false)
    const isPw = type === "password"
    const actualType = isPw && showPw ? "text" : type

    return (
        <div style={{ marginBottom: "16px" }}>
            <label
                style={{
                    display: "block",
                    fontSize: `${smallSize}px`,
                    fontWeight: "600",
                    color: error
                        ? colors.error
                        : focused
                          ? colors.terracotta
                          : colors.chocolate,
                    marginBottom: "6px",
                    letterSpacing: "0.3px",
                    transition: "color 0.2s",
                    fontFamily: "sans-serif",
                }}
            >
                {label}
                {required && (
                    <span
                        style={{ color: colors.terracotta, marginLeft: "3px" }}
                    >
                        *
                    </span>
                )}
            </label>
            <div style={{ position: "relative" }}>
                {IconComp && (
                    <div
                        style={{
                            position: "absolute",
                            left: "14px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: focused
                                ? colors.terracotta
                                : "rgba(92,43,31,0.3)",
                            transition: "color 0.2s",
                            pointerEvents: "none",
                        }}
                    >
                        <IconComp size={16} strokeWidth={2} />
                    </div>
                )}
                <input
                    type={actualType}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{
                        width: "100%",
                        height: `${inputHeight}px`,
                        padding: `0 ${isPw ? "44px" : "14px"} 0 ${IconComp ? "42px" : "14px"}`,
                        borderRadius: `${inputRadius}px`,
                        border: `2px solid ${error ? colors.error : focused ? colors.terracotta : colors.lightBorder}`,
                        backgroundColor: focused
                            ? colors.white
                            : colors.inputBg,
                        fontSize: `${bodySize}px`,
                        fontFamily: "sans-serif",
                        color: colors.chocolate,
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "all 0.2s",
                        boxShadow: focused
                            ? `0 0 0 3px ${colors.terracottaGlow}`
                            : "none",
                    }}
                />
                {isPw && (
                    <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => setShowPw(!showPw)}
                        type="button"
                        style={{
                            position: "absolute",
                            right: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "rgba(92,43,31,0.35)",
                            padding: "4px",
                            display: "flex",
                        }}
                    >
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </motion.button>
                )}
            </div>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        fontSize: `${smallSize - 1}px`,
                        color: colors.error,
                        marginTop: "4px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                    }}
                >
                    <AlertCircle size={12} />
                    {error}
                </motion.p>
            )}
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 1: CART VIEW
// ═══════════════════════════════════════════════════════════════════════════

const CartView: React.FC<{
    cartItems: CartItem[]
    onUpdateQuantity: (i: number, d: number) => void
    onRemove: (i: number) => void
    onUpdateInstructions: (i: number, s: string) => void
    onClearCart: () => void
    onProceed: () => void
    onBackToMenu: () => void
    subtotal: number
    tax: number
    total: number
    fontFamily: string
    showAnimations: boolean
    cardRadius: number
    cardPadding: number
    bodySize: number
    smallSize: number
    subheaderSize: number
    buttonHeight: number
    buttonRadius: number
    accentGlow: boolean
    maxQuantity: number
    showSpecialInstructions: boolean
    sectionSpacing: number
    emptyCartMessage: string
    isCanvas: boolean
}> = (props) => {
    const {
        cartItems,
        onUpdateQuantity,
        onRemove,
        onUpdateInstructions,
        onClearCart,
        onProceed,
        onBackToMenu,
        subtotal,
        tax,
        total,
        fontFamily,
        showAnimations,
        cardRadius,
        cardPadding,
        bodySize,
        smallSize,
        subheaderSize,
        buttonHeight,
        buttonRadius,
        accentGlow,
        maxQuantity,
        showSpecialInstructions,
        sectionSpacing,
        emptyCartMessage,
    } = props
    const totalItemCount = cartItems.reduce((s, i) => s + i.quantity, 0)

    if (cartItems.length === 0)
        return (
            <EmptyCartView
                onBackToMenu={onBackToMenu}
                fontFamily={fontFamily}
                showAnimations={showAnimations}
                message={emptyCartMessage}
            />
        )

    return (
        <div style={{ paddingBottom: "200px" }}>
            <motion.div
                initial={{ opacity: 0, y: showAnimations ? 10 : 0 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: `${sectionSpacing}px`,
                }}
            >
                <div>
                    <h2
                        style={{
                            fontFamily,
                            fontSize: `${subheaderSize}px`,
                            color: colors.chocolate,
                            margin: 0,
                            lineHeight: "1.2",
                        }}
                    >
                        Your Bag
                    </h2>
                    <p
                        style={{
                            fontSize: `${smallSize}px`,
                            color: "rgba(92,43,31,0.45)",
                            margin: "4px 0 0 0",
                        }}
                    >
                        {totalItemCount} item{totalItemCount !== 1 ? "s" : ""} ·
                        Pickup order
                    </p>
                </div>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={onClearCart}
                    style={{
                        padding: "8px 14px",
                        backgroundColor: colors.errorLight,
                        color: colors.error,
                        border: "none",
                        borderRadius: "8px",
                        fontSize: `${smallSize}px`,
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                    }}
                >
                    <Trash2 size={13} /> Clear
                </motion.button>
            </motion.div>

            <AnimatePresence mode="popLayout">
                {cartItems.map((item, idx) => (
                    <CartItemRow
                        key={`${item.name}-${idx}`}
                        item={item}
                        index={idx}
                        onUpdateQuantity={onUpdateQuantity}
                        onRemove={onRemove}
                        onUpdateInstructions={onUpdateInstructions}
                        showAnimations={showAnimations}
                        cardRadius={cardRadius}
                        cardPadding={cardPadding}
                        bodySize={bodySize}
                        smallSize={smallSize}
                        maxQuantity={maxQuantity}
                        showSpecialInstructions={showSpecialInstructions}
                    />
                ))}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                    textAlign: "center",
                    marginTop: `${sectionSpacing}px`,
                }}
            >
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onBackToMenu}
                    style={{
                        padding: "12px 28px",
                        backgroundColor: "transparent",
                        color: colors.terracotta,
                        border: `2px dashed ${colors.terracotta}`,
                        borderRadius: `${buttonRadius}px`,
                        fontSize: `${bodySize}px`,
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <Plus size={16} /> Add More Items
                </motion.button>
            </motion.div>

            <OrderSummaryBar
                subtotal={subtotal}
                tax={tax}
                total={total}
                itemCount={totalItemCount}
                onProceed={onProceed}
                buttonHeight={buttonHeight}
                buttonRadius={buttonRadius}
                accentGlow={accentGlow}
                isCanvas={props.isCanvas}
            />
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 2: CUSTOMER DETAILS VIEW
// ═══════════════════════════════════════════════════════════════════════════

const CustomerView: React.FC<{
    customer: CustomerInfo
    onUpdateCustomer: (u: Partial<CustomerInfo>) => void
    onProceed: () => void
    onBack: () => void
    errors: Record<string, string>
    fontFamily: string
    showAnimations: boolean
    cardRadius: number
    cardPadding: number
    bodySize: number
    smallSize: number
    subheaderSize: number
    buttonHeight: number
    buttonRadius: number
    inputHeight: number
    inputRadius: number
    accentGlow: boolean
    sectionSpacing: number
    estimatedPickupMin: number
    estimatedPickupMax: number
    total: number
}> = (props) => {
    const {
        customer,
        onUpdateCustomer,
        onProceed,
        onBack,
        errors,
        fontFamily,
        showAnimations,
        cardRadius,
        cardPadding,
        bodySize,
        smallSize,
        subheaderSize,
        buttonHeight,
        buttonRadius,
        inputHeight,
        inputRadius,
        accentGlow,
        sectionSpacing,
        estimatedPickupMin,
        estimatedPickupMax,
    } = props

    return (
        <motion.div
            initial={{ opacity: 0, x: showAnimations ? 40 : 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            style={{ paddingBottom: "40px" }}
        >
            {/* Pickup banner */}
            <motion.div
                initial={{ opacity: 0, y: showAnimations ? -10 : 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                    background: `linear-gradient(135deg, ${colors.chocolate}, #7A3F2D)`,
                    borderRadius: `${cardRadius}px`,
                    padding: `${cardPadding}px`,
                    marginBottom: `${sectionSpacing}px`,
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    boxShadow: `0 4px 20px ${colors.shadowMd}`,
                }}
            >
                <div
                    style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        backgroundColor: "rgba(255,255,255,0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <Clock size={22} color={colors.gold} />
                </div>
                <div>
                    <div
                        style={{
                            color: colors.white,
                            fontSize: `${bodySize}px`,
                            fontWeight: "700",
                            marginBottom: "2px",
                        }}
                    >
                        Pickup Order
                    </div>
                    <div
                        style={{
                            color: "rgba(255,255,255,0.7)",
                            fontSize: `${smallSize}px`,
                        }}
                    >
                        Estimated {estimatedPickupMin}–{estimatedPickupMax} min
                        after payment
                    </div>
                </div>
            </motion.div>

            {/* Contact info */}
            <motion.div
                initial={{ opacity: 0, y: showAnimations ? 15 : 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                style={{
                    backgroundColor: colors.white,
                    borderRadius: `${cardRadius}px`,
                    padding: `${cardPadding + 4}px`,
                    marginBottom: `${sectionSpacing}px`,
                    boxShadow: `0 2px 12px ${colors.shadow}`,
                    border: `1px solid ${colors.lightBorder}`,
                }}
            >
                <h3
                    style={{
                        fontFamily,
                        fontSize: `${subheaderSize - 4}px`,
                        color: colors.chocolate,
                        margin: "0 0 18px 0",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    <User size={20} color={colors.terracotta} strokeWidth={2} />{" "}
                    Contact Information
                </h3>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "0 12px",
                    }}
                >
                    <StyledInput
                        label="First Name"
                        value={customer.firstName}
                        onChange={(v) => onUpdateCustomer({ firstName: v })}
                        icon={User}
                        required
                        error={errors.firstName}
                        inputHeight={inputHeight}
                        inputRadius={inputRadius}
                        bodySize={bodySize}
                        smallSize={smallSize}
                        placeholder="John"
                        autoComplete="given-name"
                    />
                    <StyledInput
                        label="Last Name"
                        value={customer.lastName}
                        onChange={(v) => onUpdateCustomer({ lastName: v })}
                        required
                        error={errors.lastName}
                        inputHeight={inputHeight}
                        inputRadius={inputRadius}
                        bodySize={bodySize}
                        smallSize={smallSize}
                        placeholder="Doe"
                        autoComplete="family-name"
                    />
                </div>
                <StyledInput
                    label="Email"
                    value={customer.email}
                    onChange={(v) => onUpdateCustomer({ email: v })}
                    type="email"
                    icon={Mail}
                    required
                    error={errors.email}
                    inputHeight={inputHeight}
                    inputRadius={inputRadius}
                    bodySize={bodySize}
                    smallSize={smallSize}
                    placeholder="you@email.com"
                    autoComplete="email"
                />
                <StyledInput
                    label="Phone"
                    value={customer.phone}
                    onChange={(v) => onUpdateCustomer({ phone: v })}
                    type="tel"
                    icon={Phone}
                    required
                    error={errors.phone}
                    inputHeight={inputHeight}
                    inputRadius={inputRadius}
                    bodySize={bodySize}
                    smallSize={smallSize}
                    placeholder="(555) 123-4567"
                    autoComplete="tel"
                />
            </motion.div>

            {/* Create account toggle */}
            <motion.div
                initial={{ opacity: 0, y: showAnimations ? 15 : 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                style={{
                    backgroundColor: colors.white,
                    borderRadius: `${cardRadius}px`,
                    padding: `${cardPadding + 4}px`,
                    marginBottom: `${sectionSpacing}px`,
                    boxShadow: `0 2px 12px ${colors.shadow}`,
                    border: `1px solid ${colors.lightBorder}`,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: customer.createAccount ? "16px" : "0",
                    }}
                >
                    <div>
                        <h3
                            style={{
                                fontFamily,
                                fontSize: `${subheaderSize - 4}px`,
                                color: colors.chocolate,
                                margin: "0 0 4px 0",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                            }}
                        >
                            <Gift
                                size={20}
                                color={colors.gold}
                                strokeWidth={2}
                            />{" "}
                            Create Account
                        </h3>
                        <p
                            style={{
                                fontSize: `${smallSize}px`,
                                color: "rgba(92,43,31,0.45)",
                                margin: 0,
                            }}
                        >
                            Save info for faster checkout & rewards
                        </p>
                    </div>
                    <motion.button
                        onClick={() =>
                            onUpdateCustomer({
                                createAccount: !customer.createAccount,
                            })
                        }
                        style={{
                            width: "52px",
                            height: "30px",
                            borderRadius: "15px",
                            border: "none",
                            padding: "3px",
                            cursor: "pointer",
                            backgroundColor: customer.createAccount
                                ? colors.terracotta
                                : colors.warmGray,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: customer.createAccount
                                ? "flex-end"
                                : "flex-start",
                            transition: "background-color 0.2s",
                            flexShrink: 0,
                        }}
                    >
                        <motion.div
                            layout
                            transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                            }}
                            style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "12px",
                                backgroundColor: colors.white,
                                boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                            }}
                        />
                    </motion.button>
                </div>
                <AnimatePresence>
                    {customer.createAccount && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            style={{ overflow: "hidden" }}
                        >
                            <div
                                style={{
                                    paddingTop: "12px",
                                    borderTop: `1px solid ${colors.lightBorder}`,
                                }}
                            >
                                <StyledInput
                                    label="Password"
                                    value={customer.password}
                                    onChange={(v) =>
                                        onUpdateCustomer({ password: v })
                                    }
                                    type="password"
                                    icon={Lock}
                                    required
                                    error={errors.password}
                                    inputHeight={inputHeight}
                                    inputRadius={inputRadius}
                                    bodySize={bodySize}
                                    smallSize={smallSize}
                                    placeholder="Min 8 characters"
                                    autoComplete="new-password"
                                />
                                <StyledInput
                                    label="Confirm Password"
                                    value={customer.confirmPassword}
                                    onChange={(v) =>
                                        onUpdateCustomer({ confirmPassword: v })
                                    }
                                    type="password"
                                    icon={Lock}
                                    required
                                    error={errors.confirmPassword}
                                    inputHeight={inputHeight}
                                    inputRadius={inputRadius}
                                    bodySize={bodySize}
                                    smallSize={smallSize}
                                    placeholder="Re-enter password"
                                    autoComplete="new-password"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Order notes */}
            <motion.div
                initial={{ opacity: 0, y: showAnimations ? 15 : 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                    backgroundColor: colors.white,
                    borderRadius: `${cardRadius}px`,
                    padding: `${cardPadding + 4}px`,
                    marginBottom: `${sectionSpacing + 8}px`,
                    boxShadow: `0 2px 12px ${colors.shadow}`,
                    border: `1px solid ${colors.lightBorder}`,
                }}
            >
                <h3
                    style={{
                        fontFamily,
                        fontSize: `${subheaderSize - 4}px`,
                        color: colors.chocolate,
                        margin: "0 0 12px 0",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    <ChefHat
                        size={20}
                        color={colors.terracotta}
                        strokeWidth={2}
                    />{" "}
                    Order Notes
                </h3>
                <textarea
                    value={customer.specialInstructions}
                    onChange={(e) =>
                        onUpdateCustomer({
                            specialInstructions: e.target.value,
                        })
                    }
                    placeholder="Any allergies, dietary needs, or special requests for the kitchen..."
                    style={{
                        width: "100%",
                        minHeight: "80px",
                        padding: "12px 14px",
                        borderRadius: `${inputRadius}px`,
                        border: `2px solid ${colors.lightBorder}`,
                        backgroundColor: colors.inputBg,
                        fontSize: `${bodySize}px`,
                        fontFamily: "sans-serif",
                        color: colors.chocolate,
                        resize: "vertical",
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "all 0.2s",
                        lineHeight: "1.5",
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = colors.terracotta
                        e.target.style.boxShadow = `0 0 0 3px ${colors.terracottaGlow}`
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = colors.lightBorder
                        e.target.style.boxShadow = "none"
                    }}
                />
            </motion.div>

            {/* Nav buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={onBack}
                    style={{
                        height: `${buttonHeight}px`,
                        padding: "0 20px",
                        backgroundColor: "transparent",
                        color: colors.chocolate,
                        border: `2px solid ${colors.lightBorder}`,
                        borderRadius: `${buttonRadius}px`,
                        fontSize: `${bodySize}px`,
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                    }}
                >
                    <ArrowLeft size={16} /> Back
                </motion.button>
                <motion.button
                    whileHover={{
                        scale: 1.02,
                        boxShadow: accentGlow
                            ? `0 8px 28px ${colors.terracottaGlow}`
                            : undefined,
                    }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onProceed}
                    style={{
                        flex: 1,
                        height: `${buttonHeight}px`,
                        padding: "0 24px",
                        backgroundColor: colors.terracotta,
                        color: colors.white,
                        border: "none",
                        borderRadius: `${buttonRadius}px`,
                        fontSize: `${bodySize + 1}px`,
                        fontWeight: "700",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        boxShadow: accentGlow
                            ? `0 4px 16px ${colors.terracottaGlow}`
                            : `0 2px 8px ${colors.shadow}`,
                    }}
                >
                    Continue to Payment{" "}
                    <ChevronRight size={16} strokeWidth={3} />
                </motion.button>
            </div>
        </motion.div>
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 3: PAYMENT VIEW (Square SDK ready)
// ═══════════════════════════════════════════════════════════════════════════

const PaymentView: React.FC<{
    cartItems: CartItem[]
    subtotal: number
    tax: number
    total: number
    customer: CustomerInfo
    onPlaceOrder: () => void
    onBack: () => void
    isProcessing: boolean
    fontFamily: string
    showAnimations: boolean
    cardRadius: number
    cardPadding: number
    bodySize: number
    smallSize: number
    subheaderSize: number
    buttonHeight: number
    buttonRadius: number
    inputHeight: number
    inputRadius: number
    accentGlow: boolean
    sectionSpacing: number
}> = (props) => {
    const {
        cartItems,
        subtotal,
        tax,
        total,
        onPlaceOrder,
        onBack,
        isProcessing,
        fontFamily,
        showAnimations,
        cardRadius,
        cardPadding,
        bodySize,
        smallSize,
        subheaderSize,
        buttonHeight,
        buttonRadius,
        inputHeight,
        inputRadius,
        accentGlow,
        sectionSpacing,
    } = props
    const [cardNumber, setCardNumber] = useState("")
    const [expiry, setExpiry] = useState("")
    const [cvv, setCvv] = useState("")
    const [zip, setZip] = useState("")
    const [cardErrors, setCardErrors] = useState<Record<string, string>>({})

    const fmtCard = (v: string) =>
        v
            .replace(/\D/g, "")
            .slice(0, 16)
            .replace(/(.{4})/g, "$1 ")
            .trim()
    const fmtExp = (v: string) => {
        const d = v.replace(/\D/g, "").slice(0, 4)
        return d.length > 2 ? d.slice(0, 2) + " / " + d.slice(2) : d
    }

    const handlePlace = () => {
        const errs: Record<string, string> = {}
        if (cardNumber.replace(/\s/g, "").length < 16)
            errs.cardNumber = "Enter a valid card number"
        if (expiry.replace(/\D/g, "").length < 4)
            errs.expiry = "Enter a valid date"
        if (cvv.length < 3) errs.cvv = "Invalid CVV"
        if (zip.length < 5) errs.zip = "Invalid zip"
        setCardErrors(errs)
        if (Object.keys(errs).length === 0) onPlaceOrder()
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: showAnimations ? 40 : 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            style={{ paddingBottom: "40px" }}
        >
            {/* Order summary card */}
            <motion.div
                initial={{ opacity: 0, y: showAnimations ? -10 : 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                    background: `linear-gradient(135deg, ${colors.chocolate}, #7A3F2D)`,
                    borderRadius: `${cardRadius}px`,
                    padding: `${cardPadding}px`,
                    marginBottom: `${sectionSpacing}px`,
                    boxShadow: `0 4px 20px ${colors.shadowMd}`,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "12px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <FileText
                            size={20}
                            color={colors.gold}
                            strokeWidth={2}
                        />
                        <span
                            style={{
                                color: colors.white,
                                fontSize: `${bodySize}px`,
                                fontWeight: "700",
                            }}
                        >
                            Order Summary
                        </span>
                    </div>
                    <span
                        style={{
                            color: colors.gold,
                            fontSize: `${smallSize}px`,
                            fontWeight: "600",
                        }}
                    >
                        {cartItems.reduce((s, i) => s + i.quantity, 0)} items
                    </span>
                </div>
                {cartItems.map((item, idx) => (
                    <div
                        key={idx}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "6px 0",
                            borderTop:
                                idx === 0
                                    ? "1px solid rgba(255,255,255,0.1)"
                                    : "none",
                            color: "rgba(255,255,255,0.75)",
                            fontSize: `${smallSize}px`,
                        }}
                    >
                        <span>
                            {item.quantity}× {item.name}
                        </span>
                        <span style={{ fontVariantNumeric: "tabular-nums" }}>
                            $
                            {(parsePrice(item.price) * item.quantity).toFixed(
                                2
                            )}
                        </span>
                    </div>
                ))}
                <div
                    style={{
                        borderTop: "1px solid rgba(255,255,255,0.15)",
                        marginTop: "8px",
                        paddingTop: "10px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "4px",
                        }}
                    >
                        <span
                            style={{
                                color: "rgba(255,255,255,0.6)",
                                fontSize: `${smallSize}px`,
                            }}
                        >
                            Subtotal
                        </span>
                        <span
                            style={{
                                color: colors.white,
                                fontSize: `${smallSize}px`,
                                fontWeight: "600",
                                fontVariantNumeric: "tabular-nums",
                            }}
                        >
                            ${subtotal.toFixed(2)}
                        </span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "8px",
                        }}
                    >
                        <span
                            style={{
                                color: "rgba(255,255,255,0.6)",
                                fontSize: `${smallSize}px`,
                            }}
                        >
                            Tax
                        </span>
                        <span
                            style={{
                                color: colors.white,
                                fontSize: `${smallSize}px`,
                                fontWeight: "600",
                                fontVariantNumeric: "tabular-nums",
                            }}
                        >
                            ${tax.toFixed(2)}
                        </span>
                    </div>
                    <div
                        style={{
                            borderTop: "1px solid rgba(255,255,255,0.2)",
                            paddingTop: "10px",
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <span
                            style={{
                                color: colors.gold,
                                fontSize: `${bodySize + 2}px`,
                                fontWeight: "800",
                            }}
                        >
                            Total
                        </span>
                        <span
                            style={{
                                color: colors.gold,
                                fontSize: `${bodySize + 2}px`,
                                fontWeight: "800",
                                fontVariantNumeric: "tabular-nums",
                            }}
                        >
                            ${total.toFixed(2)}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Card form — SQUARE SDK INTEGRATION POINT: Replace inputs with <div id="card-container"> and call payments.card().attach('#card-container') */}
            <motion.div
                initial={{ opacity: 0, y: showAnimations ? 15 : 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                    backgroundColor: colors.white,
                    borderRadius: `${cardRadius}px`,
                    padding: `${cardPadding + 4}px`,
                    marginBottom: `${sectionSpacing}px`,
                    boxShadow: `0 2px 12px ${colors.shadow}`,
                    border: `1px solid ${colors.lightBorder}`,
                }}
            >
                <h3
                    style={{
                        fontFamily,
                        fontSize: `${subheaderSize - 4}px`,
                        color: colors.chocolate,
                        margin: "0 0 6px 0",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    <CreditCard
                        size={20}
                        color={colors.terracotta}
                        strokeWidth={2}
                    />{" "}
                    Payment Details
                </h3>
                <p
                    style={{
                        fontSize: `${smallSize - 1}px`,
                        color: "rgba(92,43,31,0.4)",
                        margin: "0 0 18px 0",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                    }}
                >
                    <Lock size={11} /> Secured with Square — your card info is
                    encrypted
                </p>
                <div id="card-container">
                    <StyledInput
                        label="Card Number"
                        value={cardNumber}
                        onChange={(v) => setCardNumber(fmtCard(v))}
                        icon={CreditCard}
                        error={cardErrors.cardNumber}
                        inputHeight={inputHeight}
                        inputRadius={inputRadius}
                        bodySize={bodySize}
                        smallSize={smallSize}
                        placeholder="1234 5678 9012 3456"
                        autoComplete="cc-number"
                    />
                </div>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "0 12px",
                    }}
                >
                    <StyledInput
                        label="Expiry"
                        value={expiry}
                        onChange={(v) => setExpiry(fmtExp(v))}
                        error={cardErrors.expiry}
                        inputHeight={inputHeight}
                        inputRadius={inputRadius}
                        bodySize={bodySize}
                        smallSize={smallSize}
                        placeholder="MM / YY"
                        autoComplete="cc-exp"
                    />
                    <StyledInput
                        label="CVV"
                        value={cvv}
                        onChange={(v) =>
                            setCvv(v.replace(/\D/g, "").slice(0, 4))
                        }
                        error={cardErrors.cvv}
                        inputHeight={inputHeight}
                        inputRadius={inputRadius}
                        bodySize={bodySize}
                        smallSize={smallSize}
                        placeholder="123"
                        autoComplete="cc-csc"
                    />
                </div>
                <StyledInput
                    label="Billing Zip Code"
                    value={zip}
                    onChange={(v) => setZip(v.replace(/\D/g, "").slice(0, 5))}
                    icon={MapPin}
                    error={cardErrors.zip}
                    inputHeight={inputHeight}
                    inputRadius={inputRadius}
                    bodySize={bodySize}
                    smallSize={smallSize}
                    placeholder="12345"
                    autoComplete="postal-code"
                />
            </motion.div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={onBack}
                    disabled={isProcessing}
                    style={{
                        height: `${buttonHeight}px`,
                        padding: "0 20px",
                        backgroundColor: "transparent",
                        color: colors.chocolate,
                        border: `2px solid ${colors.lightBorder}`,
                        borderRadius: `${buttonRadius}px`,
                        fontSize: `${bodySize}px`,
                        fontWeight: "600",
                        cursor: isProcessing ? "default" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        opacity: isProcessing ? 0.4 : 1,
                    }}
                >
                    <ArrowLeft size={16} /> Back
                </motion.button>
                <motion.button
                    whileHover={isProcessing ? {} : { scale: 1.02 }}
                    whileTap={isProcessing ? {} : { scale: 0.97 }}
                    onClick={handlePlace}
                    disabled={isProcessing}
                    style={{
                        flex: 1,
                        height: `${buttonHeight + 4}px`,
                        padding: "0 24px",
                        background: isProcessing
                            ? `linear-gradient(135deg, ${colors.chocolate}, #7A3F2D)`
                            : `linear-gradient(135deg, ${colors.terracotta}, #E8603E)`,
                        color: colors.white,
                        border: "none",
                        borderRadius: `${buttonRadius}px`,
                        fontSize: `${bodySize + 2}px`,
                        fontWeight: "800",
                        cursor: isProcessing ? "default" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        boxShadow: accentGlow
                            ? `0 6px 24px ${colors.terracottaGlow}`
                            : `0 2px 8px ${colors.shadow}`,
                    }}
                >
                    {isProcessing ? (
                        <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                style={{
                                    width: "18px",
                                    height: "18px",
                                    border: "2px solid rgba(255,255,255,0.3)",
                                    borderTop: "2px solid white",
                                    borderRadius: "50%",
                                }}
                            />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Lock size={16} strokeWidth={2.5} />
                            Place Order — ${total.toFixed(2)}
                        </>
                    )}
                </motion.button>
            </div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "16px",
                    marginTop: "20px",
                    padding: "12px 0",
                }}
            >
                {[
                    "🔒 SSL Encrypted",
                    "💳 Square Secure",
                    "✓ PCI Compliant",
                ].map((b) => (
                    <span
                        key={b}
                        style={{
                            fontSize: "10px",
                            color: "rgba(92,43,31,0.35)",
                            fontWeight: "500",
                            letterSpacing: "0.3px",
                        }}
                    >
                        {b}
                    </span>
                ))}
            </motion.div>
        </motion.div>
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 4: CONFIRMATION VIEW
// ═══════════════════════════════════════════════════════════════════════════

const ConfirmationView: React.FC<{
    confirmation: OrderConfirmation
    onBackToMenu: () => void
    fontFamily: string
    showAnimations: boolean
    cardRadius: number
    cardPadding: number
    bodySize: number
    smallSize: number
    headerSize: number
    subheaderSize: number
    buttonHeight: number
    buttonRadius: number
    accentGlow: boolean
    sectionSpacing: number
    confirmationTitle: string
    restaurantAddress: string
    restaurantPhone: string
    logo?: string
    logoScale: number
}> = (props) => {
    const {
        confirmation,
        onBackToMenu,
        fontFamily,
        showAnimations,
        cardRadius,
        cardPadding,
        bodySize,
        smallSize,
        headerSize,
        subheaderSize,
        buttonHeight,
        buttonRadius,
        accentGlow,
        sectionSpacing,
        confirmationTitle,
        restaurantAddress,
        restaurantPhone,
        logo,
        logoScale,
    } = props

    return (
        <motion.div
            initial={{ opacity: 0, scale: showAnimations ? 0.95 : 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            style={{ paddingBottom: "40px", textAlign: "center" }}
        >
            {/* Success circle */}
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2,
                }}
                style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${colors.success}, #3AA85E)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                    boxShadow: "0 8px 32px rgba(45,138,78,0.25)",
                }}
            >
                <CheckCircle size={48} color={colors.white} strokeWidth={2} />
            </motion.div>

            {/* Floating sparkles */}
            <div
                style={{
                    position: "relative",
                    height: "0",
                    marginBottom: "8px",
                }}
            >
                <motion.div
                    animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ position: "absolute", top: "-40px", left: "25%" }}
                >
                    <Star size={16} color={colors.gold} />
                </motion.div>
                <motion.div
                    animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
                    style={{ position: "absolute", top: "-30px", right: "30%" }}
                >
                    <Star size={12} color={colors.terracotta} />
                </motion.div>
            </div>

            <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{
                    fontFamily,
                    fontSize: `${headerSize}px`,
                    color: colors.chocolate,
                    margin: "0 0 8px 0",
                    lineHeight: "1.2",
                }}
            >
                {confirmationTitle}
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{
                    fontSize: `${bodySize}px`,
                    color: "rgba(92,43,31,0.55)",
                    margin: "0 0 28px 0",
                }}
            >
                Your order is being prepared with care
            </motion.p>

            {/* Order number card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                style={{
                    background: `linear-gradient(135deg, ${colors.chocolate}, #7A3F2D)`,
                    borderRadius: `${cardRadius}px`,
                    padding: `${cardPadding + 8}px`,
                    marginBottom: `${sectionSpacing}px`,
                    boxShadow: `0 6px 28px ${colors.shadowLg}`,
                    textAlign: "center",
                }}
            >
                <div
                    style={{
                        fontSize: `${smallSize}px`,
                        color: "rgba(255,255,255,0.5)",
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        marginBottom: "8px",
                    }}
                >
                    Order Number
                </div>
                <div
                    style={{
                        fontSize: `${headerSize - 4}px`,
                        fontWeight: "900",
                        color: colors.gold,
                        fontFamily: "monospace",
                        letterSpacing: "4px",
                        marginBottom: "16px",
                    }}
                >
                    {confirmation.orderNumber}
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        color: "rgba(255,255,255,0.7)",
                        fontSize: `${bodySize}px`,
                    }}
                >
                    <Clock size={16} color={colors.gold} />
                    <span>
                        Estimated pickup:{" "}
                        <strong style={{ color: colors.white }}>
                            {confirmation.estimatedTime}
                        </strong>
                    </span>
                </div>
            </motion.div>

            {/* Items recap */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                style={{
                    backgroundColor: colors.white,
                    borderRadius: `${cardRadius}px`,
                    padding: `${cardPadding}px`,
                    marginBottom: `${sectionSpacing}px`,
                    boxShadow: `0 2px 12px ${colors.shadow}`,
                    border: `1px solid ${colors.lightBorder}`,
                    textAlign: "left",
                }}
            >
                <h3
                    style={{
                        fontFamily,
                        fontSize: `${subheaderSize - 4}px`,
                        color: colors.chocolate,
                        margin: "0 0 14px 0",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    <FileText size={18} color={colors.terracotta} /> Order
                    Details
                </h3>
                {confirmation.items.map((item, idx) => (
                    <div
                        key={idx}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "8px 0",
                            borderBottom:
                                idx < confirmation.items.length - 1
                                    ? `1px solid ${colors.lightBorder}`
                                    : "none",
                            fontSize: `${bodySize}px`,
                        }}
                    >
                        <span style={{ color: colors.chocolate }}>
                            {item.quantity}× {item.name}
                        </span>
                        <span
                            style={{
                                color: colors.terracotta,
                                fontWeight: "600",
                                fontVariantNumeric: "tabular-nums",
                            }}
                        >
                            $
                            {(parsePrice(item.price) * item.quantity).toFixed(
                                2
                            )}
                        </span>
                    </div>
                ))}
                <div
                    style={{
                        borderTop: `2px solid ${colors.lightBorder}`,
                        marginTop: "8px",
                        paddingTop: "12px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "4px",
                            fontSize: `${smallSize}px`,
                            color: "rgba(92,43,31,0.5)",
                        }}
                    >
                        <span>Subtotal</span>
                        <span>${confirmation.subtotal.toFixed(2)}</span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "8px",
                            fontSize: `${smallSize}px`,
                            color: "rgba(92,43,31,0.5)",
                        }}
                    >
                        <span>Tax</span>
                        <span>${confirmation.tax.toFixed(2)}</span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: `${bodySize + 2}px`,
                            fontWeight: "800",
                        }}
                    >
                        <span style={{ color: colors.chocolate }}>
                            Total Paid
                        </span>
                        <span style={{ color: colors.terracotta }}>
                            ${confirmation.total.toFixed(2)}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Pickup info */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                style={{
                    backgroundColor: colors.successLight,
                    borderRadius: `${cardRadius}px`,
                    padding: `${cardPadding}px`,
                    marginBottom: `${sectionSpacing}px`,
                    border: `1px solid rgba(45,138,78,0.15)`,
                    textAlign: "left",
                }}
            >
                <h3
                    style={{
                        fontFamily,
                        fontSize: `${subheaderSize - 4}px`,
                        color: colors.success,
                        margin: "0 0 10px 0",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    <MapPin size={18} color={colors.success} /> Pickup Location
                </h3>
                <p
                    style={{
                        fontSize: `${bodySize}px`,
                        color: colors.chocolate,
                        margin: "0 0 4px 0",
                        fontWeight: "600",
                    }}
                >
                    Den Chai Thai Restaurant
                </p>
                <p
                    style={{
                        fontSize: `${smallSize}px`,
                        color: "rgba(92,43,31,0.6)",
                        margin: "0 0 2px 0",
                    }}
                >
                    {restaurantAddress}
                </p>
                <p
                    style={{
                        fontSize: `${smallSize}px`,
                        color: "rgba(92,43,31,0.6)",
                        margin: 0,
                    }}
                >
                    {restaurantPhone}
                </p>
            </motion.div>

            {/* Email confirmation notice */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                style={{
                    padding: "12px 16px",
                    borderRadius: "10px",
                    backgroundColor: colors.warmGray,
                    marginBottom: `${sectionSpacing + 8}px`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                }}
            >
                <Mail size={14} color="rgba(92,43,31,0.4)" />
                <span
                    style={{
                        fontSize: `${smallSize}px`,
                        color: "rgba(92,43,31,0.5)",
                    }}
                >
                    Confirmation sent to{" "}
                    <strong style={{ color: colors.chocolate }}>
                        {confirmation.customer.email}
                    </strong>
                </span>
            </motion.div>

            {/* Logo watermark */}
            {logo && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "20px",
                    }}
                >
                    <img
                        src={logo}
                        alt="Den Chai"
                        style={{
                            width: "80px",
                            height: "auto",
                            objectFit: "contain",
                            transform: `scale(${logoScale})`,
                            opacity: 0.4,
                        }}
                    />
                </motion.div>
            )}

            {/* Back to menu */}
            <motion.button
                whileHover={{
                    scale: 1.03,
                    boxShadow: accentGlow
                        ? `0 8px 28px ${colors.terracottaGlow}`
                        : undefined,
                }}
                whileTap={{ scale: 0.97 }}
                onClick={onBackToMenu}
                style={{
                    padding: "16px 40px",
                    backgroundColor: colors.terracotta,
                    color: colors.white,
                    border: "none",
                    borderRadius: `${buttonRadius}px`,
                    fontSize: `${bodySize + 1}px`,
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    boxShadow: accentGlow
                        ? `0 4px 16px ${colors.terracottaGlow}`
                        : `0 2px 8px ${colors.shadow}`,
                }}
            >
                <UtensilsCrossed size={18} /> Back to Menu
            </motion.button>
        </motion.div>
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function DenChaiOrder(props: DenChaiOrderProps) {
    const isCanvas = RenderTarget.current() === RenderTarget.canvas

    // ── SEO: title, meta description, canonical, JSON-LD ──────────────────
    useEffect(() => {
        if (isCanvas) return
        document.title = "Order Online | Den Chai Thai Restaurant | Spartanburg, SC"
        let desc = document.querySelector('meta[name="description"]')
        if (!desc) { desc = document.createElement("meta"); desc.setAttribute("name", "description"); document.head.appendChild(desc) }
        desc.setAttribute("content", "Order fresh Thai food online from Den Chai in Spartanburg, SC. Noodles, curries, fried rice & more ready for pickup.")
        let can = document.querySelector('link[rel="canonical"]')
        if (!can) { can = document.createElement("link"); can.setAttribute("rel", "canonical"); document.head.appendChild(can) }
        can.setAttribute("href", "https://den-chai.com/den-chai-orders")
        const existing = document.getElementById("den-chai-schema")
        if (existing) existing.remove()
        const s = document.createElement("script"); s.id = "den-chai-schema"; s.type = "application/ld+json"
        s.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "Restaurant", "@id": "https://den-chai.com", "name": "Den Chai", "url": "https://den-chai.com", "telephone": "+18643104048", "servesCuisine": "Thai", "priceRange": "$$", "hasMenu": "https://den-chai.com/menu", "address": { "@type": "PostalAddress", "streetAddress": "253 Magnolia Street", "addressLocality": "Spartanburg", "addressRegion": "SC", "postalCode": "29306", "addressCountry": "US" }, "openingHoursSpecification": [{ "@type": "OpeningHoursSpecification", "dayOfWeek": ["Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], "opens": "10:00", "closes": "22:00" }], "sameAs": ["https://share.google/JQVVLrr205YA2XVox"] })
        document.head.appendChild(s)
        return () => { const el = document.getElementById("den-chai-schema"); if (el) el.remove() }
    }, [isCanvas])

    const fontFamily = props.font?.fontFamily || "cursive"

    const taxRate = (props.taxRate ?? 8.25) / 100
    const contentWidth = props.contentWidth ?? 600
    const headerSize = props.headerSize ?? 32
    const subheaderSize = props.subheaderSize ?? 22
    const bodySize = props.bodySize ?? 15
    const smallSize = props.smallSize ?? 13
    const buttonHeight = props.buttonHeight ?? 52
    const buttonRadius = props.buttonRadius ?? 14
    const cardRadius = props.cardRadius ?? 14
    const cardPadding = props.cardPadding ?? 18
    const sectionSpacing = props.sectionSpacing ?? 20
    const accentGlow = props.accentGlow ?? true
    const showAnimations = props.showAnimations ?? true
    const hamburgerSize = props.hamburgerSize ?? 36
    const hamburgerTop = props.hamburgerTop ?? 16
    const hamburgerRight = props.hamburgerRight ?? 14
    const menuPanelWidth = props.menuPanelWidth ?? 280
    const estimatedPickupMin = props.estimatedPickupMin ?? 15
    const estimatedPickupMax = props.estimatedPickupMax ?? 25
    const progressBarHeight = props.progressBarHeight ?? 38
    const inputHeight = props.inputHeight ?? 48
    const inputRadius = props.inputRadius ?? 10
    const showSpecialInstructions = props.showSpecialInstructions ?? true
    const maxItemQuantity = props.maxItemQuantity ?? 20
    const emptyCartMessage = props.emptyCartMessage ?? "Your bag is empty"
    const confirmationTitle = props.confirmationTitle ?? "Order Confirmed!"
    const restaurantAddress =
        props.restaurantAddress ?? "123 Main St, Your City, ST 12345"
    const restaurantPhone = props.restaurantPhone ?? "(555) 123-4567"
    const logoScale = props.logoScale ?? 1

    const [currentStep, setCurrentStep] = useState<CheckoutStep>("cart")
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [customer, setCustomer] = useState<CustomerInfo>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        createAccount: false,
        password: "",
        confirmPassword: "",
        specialInstructions: "",
        pickupTime: "",
    })
    const [customerErrors, setCustomerErrors] = useState<
        Record<string, string>
    >({})
    const [isProcessing, setIsProcessing] = useState(false)
    const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(
        null
    )

    useEffect(() => {
        try {
            console.log("🎬 [ORDER PAGE] Initializing cart, isCanvas:", isCanvas)
            if (isCanvas) {
                console.log("🎨 [ORDER PAGE] Canvas mode - using MOCK_CART")
                setCartItems(MOCK_CART)
            } else {
                console.log("🌐 [ORDER PAGE] Live mode - loading from localStorage")
                const loadedCart = getCart()
                console.log("📦 [ORDER PAGE] Cart initialized with", loadedCart.length, "items")
                setCartItems(loadedCart)
            }
        } catch (error) {
            console.error("❌ [ORDER PAGE] Error initializing cart:", error)
            const errorMessage = error instanceof Error ? error.message : String(error)
            alert("Error loading cart: " + errorMessage)
            setCartItems([])
        }
    }, [isCanvas])

    useEffect(() => {
        if (!isCanvas && currentStep === "cart") saveCart(cartItems)
    }, [cartItems, isCanvas, currentStep])

    const subtotal = useMemo(
        () =>
            cartItems.reduce((s, i) => s + parsePrice(i.price) * i.quantity, 0),
        [cartItems]
    )
    const tax = useMemo(() => subtotal * taxRate, [subtotal, taxRate])
    const total = useMemo(() => subtotal + tax, [subtotal, tax])

    const handleUpdateQuantity = useCallback(
        (index: number, delta: number) => {
            setCartItems((prev) =>
                prev.map((item, i) =>
                    i === index
                        ? {
                              ...item,
                              quantity: Math.max(
                                  1,
                                  Math.min(
                                      maxItemQuantity,
                                      item.quantity + delta
                                  )
                              ),
                          }
                        : item
                )
            )
        },
        [maxItemQuantity]
    )

    const handleRemove = useCallback((index: number) => {
        setCartItems((prev) => prev.filter((_, i) => i !== index))
    }, [])

    const handleUpdateInstructions = useCallback(
        (index: number, instructions: string) => {
            setCartItems((prev) =>
                prev.map((item, i) =>
                    i === index
                        ? { ...item, specialInstructions: instructions }
                        : item
                )
            )
        },
        []
    )

    const handleClearCart = useCallback(() => {
        setCartItems([])
        if (!isCanvas) clearCartStorage()
    }, [isCanvas])

    const handleUpdateCustomer = useCallback(
        (updates: Partial<CustomerInfo>) => {
            setCustomer((prev) => ({ ...prev, ...updates }))
            const cleared = { ...customerErrors }
            Object.keys(updates).forEach((k) => {
                delete cleared[k]
            })
            setCustomerErrors(cleared)
        },
        [customerErrors]
    )

    const validateCustomer = (): boolean => {
        const errs: Record<string, string> = {}
        if (!customer.firstName.trim()) errs.firstName = "Required"
        if (!customer.lastName.trim()) errs.lastName = "Required"
        if (!customer.email.trim()) errs.email = "Required"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email))
            errs.email = "Invalid email"
        if (!customer.phone.trim()) errs.phone = "Required"
        else if (customer.phone.replace(/\D/g, "").length < 10)
            errs.phone = "Enter a valid phone"
        if (customer.createAccount) {
            if (!customer.password) errs.password = "Required"
            else if (customer.password.length < 8)
                errs.password = "Min 8 characters"
            if (customer.password !== customer.confirmPassword)
                errs.confirmPassword = "Passwords don't match"
        }
        setCustomerErrors(errs)
        return Object.keys(errs).length === 0
    }

    const navigateToMenu = () => {
        if (!isCanvas) {
            console.log("🔙 [ORDER PAGE] Navigating back to menu at /menu-working-1")
            window.location.href = "/menu-working-1"
        }
    }

    const proceedFromCart = () => {
        if (cartItems.length > 0) {
            setCurrentStep("customer")
            if (!isCanvas) window.scrollTo({ top: 0, behavior: "smooth" })
        }
    }

    const proceedFromCustomer = () => {
        if (validateCustomer()) {
            setCurrentStep("payment")
            if (!isCanvas) window.scrollTo({ top: 0, behavior: "smooth" })
        }
    }

    // ┌─────────────────────────────────────────────────────────────────┐
    // │  SQUARE SDK INTEGRATION POINT                                  │
    // │  Replace this mock timeout with:                               │
    // │  1. card.tokenize() to get payment token                       │
    // │  2. POST token + order to your backend                         │
    // │  3. Backend calls Square CreatePayment + CreateOrder APIs      │
    // │  4. Backend calls Square CreateCustomer if createAccount       │
    // │  5. Return order confirmation to frontend                      │
    // └─────────────────────────────────────────────────────────────────┘
    const handlePlaceOrder = () => {
        setIsProcessing(true)
        setTimeout(() => {
            const orderNum =
                "DC-" + Math.random().toString(36).substring(2, 8).toUpperCase()
            const pickupTime = new Date(
                Date.now() + estimatedPickupMin * 60 * 1000
            )
            const timeStr = pickupTime.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
            })
            setConfirmation({
                orderNumber: orderNum,
                estimatedTime: timeStr,
                items: [...cartItems],
                subtotal,
                tax,
                total,
                customer: { ...customer },
            })
            setIsProcessing(false)
            setCurrentStep("confirmation")
            if (!isCanvas) {
                clearCartStorage()
                window.scrollTo({ top: 0, behavior: "smooth" })
            }
        }, 2500)
    }

    return (
        <div
            style={{
                width: "100vw",
                maxWidth: "100vw",
                backgroundColor: colors.cream,
                minHeight: "100vh",
                height: "auto",
                position: "relative",
                overflowX: "hidden",
                overflowY: "auto",
                boxSizing: "border-box",
                margin: 0,
                padding: 0,
            }}
        >
            <OrderNavBar
                isCanvas={isCanvas}
                hamburgerSize={hamburgerSize}
                hamburgerTop={hamburgerTop}
                hamburgerRight={hamburgerRight}
                menuPanelWidth={menuPanelWidth}
                currentStep={currentStep}
                onBackToMenu={navigateToMenu}
            />

            {props.logo && (
                <motion.div
                    initial={{ opacity: 1, y: isCanvas ? 0 : 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{
                        textAlign: "center",
                        paddingTop: `${props.logoSpacingTop ?? 70}px`,
                        paddingBottom: `${props.logoSpacingBottom ?? 10}px`,
                    }}
                >
                    <img
                        src={props.logo}
                        alt="Den Chai Logo"
                        style={{
                            maxWidth: "200px",
                            height: "auto",
                            objectFit: "contain",
                            transform: `scale(${logoScale})`,
                        }}
                    />
                </motion.div>
            )}

            <div
                style={{
                    maxWidth: `${contentWidth}px`,
                    margin: "0 auto",
                    padding: props.logo
                        ? `0 16px ${props.contentBottomPadding ?? 200}px`
                        : `80px 16px ${props.contentBottomPadding ?? 200}px`,
                    boxSizing: "border-box",
                    width: "100%",
                }}
            >
                <ProgressStepper
                    currentStep={currentStep}
                    height={progressBarHeight}
                    showAnimations={showAnimations}
                />

                {currentStep === "cart" && (
                    <CartView
                        cartItems={cartItems}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemove}
                        onUpdateInstructions={handleUpdateInstructions}
                        onClearCart={handleClearCart}
                        onProceed={proceedFromCart}
                        onBackToMenu={navigateToMenu}
                        subtotal={subtotal}
                        tax={tax}
                        total={total}
                        fontFamily={fontFamily}
                        showAnimations={showAnimations}
                        cardRadius={cardRadius}
                        cardPadding={cardPadding}
                        bodySize={bodySize}
                        smallSize={smallSize}
                        subheaderSize={subheaderSize}
                        buttonHeight={buttonHeight}
                        buttonRadius={buttonRadius}
                        accentGlow={accentGlow}
                        maxQuantity={maxItemQuantity}
                        showSpecialInstructions={showSpecialInstructions}
                        sectionSpacing={sectionSpacing}
                        emptyCartMessage={emptyCartMessage}
                        isCanvas={isCanvas}
                    />
                )}

                {currentStep === "customer" && (
                    <CustomerView
                        customer={customer}
                        onUpdateCustomer={handleUpdateCustomer}
                        onProceed={proceedFromCustomer}
                        onBack={() => setCurrentStep("cart")}
                        errors={customerErrors}
                        fontFamily={fontFamily}
                        showAnimations={showAnimations}
                        cardRadius={cardRadius}
                        cardPadding={cardPadding}
                        bodySize={bodySize}
                        smallSize={smallSize}
                        subheaderSize={subheaderSize}
                        buttonHeight={buttonHeight}
                        buttonRadius={buttonRadius}
                        inputHeight={inputHeight}
                        inputRadius={inputRadius}
                        accentGlow={accentGlow}
                        sectionSpacing={sectionSpacing}
                        estimatedPickupMin={estimatedPickupMin}
                        estimatedPickupMax={estimatedPickupMax}
                        total={total}
                    />
                )}

                {currentStep === "payment" && (
                    <PaymentView
                        cartItems={cartItems}
                        subtotal={subtotal}
                        tax={tax}
                        total={total}
                        customer={customer}
                        onPlaceOrder={handlePlaceOrder}
                        onBack={() => setCurrentStep("customer")}
                        isProcessing={isProcessing}
                        fontFamily={fontFamily}
                        showAnimations={showAnimations}
                        cardRadius={cardRadius}
                        cardPadding={cardPadding}
                        bodySize={bodySize}
                        smallSize={smallSize}
                        subheaderSize={subheaderSize}
                        buttonHeight={buttonHeight}
                        buttonRadius={buttonRadius}
                        inputHeight={inputHeight}
                        inputRadius={inputRadius}
                        accentGlow={accentGlow}
                        sectionSpacing={sectionSpacing}
                    />
                )}

                {currentStep === "confirmation" && confirmation && (
                    <ConfirmationView
                        confirmation={confirmation}
                        onBackToMenu={navigateToMenu}
                        fontFamily={fontFamily}
                        showAnimations={showAnimations}
                        cardRadius={cardRadius}
                        cardPadding={cardPadding}
                        bodySize={bodySize}
                        smallSize={smallSize}
                        headerSize={headerSize}
                        subheaderSize={subheaderSize}
                        buttonHeight={buttonHeight}
                        buttonRadius={buttonRadius}
                        accentGlow={accentGlow}
                        sectionSpacing={sectionSpacing}
                        confirmationTitle={confirmationTitle}
                        restaurantAddress={restaurantAddress}
                        restaurantPhone={restaurantPhone}
                        logo={props.logo}
                        logoScale={logoScale}
                    />
                )}
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// PROPERTY CONTROLS
// ═══════════════════════════════════════════════════════════════════════════

addPropertyControls(DenChaiOrder, {
    logo: { type: ControlType.Image, title: "Logo" },
    logoScale: {
        type: ControlType.Number,
        title: "Logo Scale",
        defaultValue: 1,
        min: 0.5,
        max: 4,
        step: 0.1,
        displayStepper: true,
    },
    logoSpacingTop: {
        type: ControlType.Number,
        title: "Logo Top Space",
        defaultValue: 70,
        min: 40,
        max: 120,
        step: 5,
        displayStepper: true,
    },
    logoSpacingBottom: {
        type: ControlType.Number,
        title: "Logo Bottom Space",
        defaultValue: 10,
        min: 0,
        max: 60,
        step: 5,
        displayStepper: true,
    },
    font: { type: ControlType.Font, title: "Header Font" },
    contentWidth: {
        type: ControlType.Number,
        title: "Content Width",
        defaultValue: 600,
        min: 320,
        max: 800,
        step: 40,
        displayStepper: true,
    },
    contentBottomPadding: {
        type: ControlType.Number,
        title: "Bottom Padding",
        defaultValue: 200,
        min: 100,
        max: 400,
        step: 20,
        displayStepper: true,
        description: "Space for fixed footer",
    },
    taxRate: {
        type: ControlType.Number,
        title: "Tax Rate (%)",
        defaultValue: 8.25,
        min: 0,
        max: 20,
        step: 0.25,
        displayStepper: true,
    },
    headerSize: {
        type: ControlType.Number,
        title: "Header Font Size",
        defaultValue: 32,
        min: 20,
        max: 52,
        step: 2,
        displayStepper: true,
    },
    subheaderSize: {
        type: ControlType.Number,
        title: "Subheader Font Size",
        defaultValue: 22,
        min: 16,
        max: 36,
        step: 2,
        displayStepper: true,
    },
    bodySize: {
        type: ControlType.Number,
        title: "Body Font Size",
        defaultValue: 15,
        min: 12,
        max: 20,
        step: 1,
        displayStepper: true,
    },
    smallSize: {
        type: ControlType.Number,
        title: "Small Font Size",
        defaultValue: 13,
        min: 10,
        max: 16,
        step: 1,
        displayStepper: true,
    },
    buttonHeight: {
        type: ControlType.Number,
        title: "Button Height",
        defaultValue: 52,
        min: 40,
        max: 64,
        step: 2,
        displayStepper: true,
    },
    buttonRadius: {
        type: ControlType.Number,
        title: "Button Radius",
        defaultValue: 14,
        min: 4,
        max: 24,
        step: 2,
        displayStepper: true,
    },
    cardRadius: {
        type: ControlType.Number,
        title: "Card Radius",
        defaultValue: 14,
        min: 4,
        max: 24,
        step: 2,
        displayStepper: true,
    },
    cardPadding: {
        type: ControlType.Number,
        title: "Card Padding",
        defaultValue: 18,
        min: 10,
        max: 32,
        step: 2,
        displayStepper: true,
    },
    sectionSpacing: {
        type: ControlType.Number,
        title: "Section Spacing",
        defaultValue: 20,
        min: 8,
        max: 40,
        step: 4,
        displayStepper: true,
    },
    inputHeight: {
        type: ControlType.Number,
        title: "Input Height",
        defaultValue: 48,
        min: 36,
        max: 60,
        step: 2,
        displayStepper: true,
    },
    inputRadius: {
        type: ControlType.Number,
        title: "Input Radius",
        defaultValue: 10,
        min: 4,
        max: 20,
        step: 2,
        displayStepper: true,
    },
    progressBarHeight: {
        type: ControlType.Number,
        title: "Progress Step Size",
        defaultValue: 38,
        min: 28,
        max: 52,
        step: 2,
        displayStepper: true,
    },
    accentGlow: {
        type: ControlType.Boolean,
        title: "Accent Glow Effects",
        defaultValue: true,
    },
    showAnimations: {
        type: ControlType.Boolean,
        title: "Show Animations",
        defaultValue: true,
    },
    showSpecialInstructions: {
        type: ControlType.Boolean,
        title: "Per-Item Notes",
        defaultValue: true,
    },
    maxItemQuantity: {
        type: ControlType.Number,
        title: "Max Item Qty",
        defaultValue: 20,
        min: 5,
        max: 99,
        step: 5,
        displayStepper: true,
    },
    hamburgerSize: {
        type: ControlType.Number,
        title: "Hamburger Icon Size",
        defaultValue: 36,
        min: 28,
        max: 48,
        step: 4,
        displayStepper: true,
    },
    hamburgerTop: {
        type: ControlType.Number,
        title: "Hamburger Top Pos",
        defaultValue: 16,
        min: 10,
        max: 40,
        step: 2,
        displayStepper: true,
    },
    hamburgerRight: {
        type: ControlType.Number,
        title: "Hamburger Right Pos",
        defaultValue: 14,
        min: 10,
        max: 40,
        step: 2,
        displayStepper: true,
    },
    menuPanelWidth: {
        type: ControlType.Number,
        title: "Menu Panel Width",
        defaultValue: 280,
        min: 220,
        max: 400,
        step: 20,
        displayStepper: true,
    },
    estimatedPickupMin: {
        type: ControlType.Number,
        title: "Est. Pickup Min (min)",
        defaultValue: 15,
        min: 5,
        max: 45,
        step: 5,
        displayStepper: true,
    },
    estimatedPickupMax: {
        type: ControlType.Number,
        title: "Est. Pickup Max (min)",
        defaultValue: 25,
        min: 10,
        max: 60,
        step: 5,
        displayStepper: true,
    },
    restaurantName: {
        type: ControlType.String,
        title: "Restaurant Name",
        defaultValue: "Den Chai Thai Restaurant",
    },
    restaurantAddress: {
        type: ControlType.String,
        title: "Restaurant Address",
        defaultValue: "123 Main St, Your City, ST 12345",
    },
    restaurantPhone: {
        type: ControlType.String,
        title: "Restaurant Phone",
        defaultValue: "(555) 123-4567",
    },
    emptyCartMessage: {
        type: ControlType.String,
        title: "Empty Cart Message",
        defaultValue: "Your bag is empty",
    },
    confirmationTitle: {
        type: ControlType.String,
        title: "Confirmation Title",
        defaultValue: "Order Confirmed!",
    },
})
