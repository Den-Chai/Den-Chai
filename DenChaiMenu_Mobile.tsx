import * as React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion, useInView, AnimatePresence } from "framer-motion"
import {
    Menu,
    X,
    Home,
    Info,
    UtensilsCrossed,
    Calendar,
    PartyPopper,
    Phone,
    MapPin,
    ShoppingBag,
} from "lucide-react"

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

const CART_STORAGE_KEY = "denchai-cart"

interface CartItem {
    name: string
    price: string
    category: string
    description: string
    quantity: number
    specialInstructions?: string
}

interface MenuItem {
    name: string
    price: string
    category: string
    description: string
}

interface Category {
    id: string
    label: string
    bg: string | null
    filled: boolean
}

interface HeroSectionProps {
    logo?: string
    logoScale: number
    showHeroText: boolean
    logoSpacingTop: number
    logoSpacingBottom: number
    heroTitleSize: number
    heroSubtitleSize: number
    fontFamily: string
    isCanvas: boolean
}

interface NavigationBarProps {
    activeSection: string
    onCategoryClick: (categoryId: string) => void
    isCanvas: boolean
    navFontSize: number
    navPadding: number
    hamburgerSize: number
    hamburgerTop: number
    hamburgerRight: number
    menuPanelWidth: number
}

interface MenuSectionProps {
    category: Category
    menuItems: MenuItem[]
    onItemClick: (item: MenuItem) => void
    fontFamily: string
    isCanvas: boolean
    onSectionInView: (categoryId: string) => void
    sectionHeaderSize: number
    itemTitleSize: number
    itemDescSize: number
    boxPadding: number
}

interface ItemModalProps {
    item: MenuItem | null
    onClose: () => void
    isCanvas: boolean
    onAddToCart: (
        item: MenuItem,
        quantity: number,
        specialInstructions: string
    ) => void
}

interface DenChaiMenuProps {
    logo?: string
    logoScale?: number
    showHeroText?: boolean
    logoSpacingTop?: number
    logoSpacingBottom?: number
    font?: { fontFamily: string }
    heroTitleSize?: number
    heroSubtitleSize?: number
    sectionHeaderSize?: number
    itemTitleSize?: number
    itemDescSize?: number
    contentWidth?: number
    boxPadding?: number
    navFontSize?: number
    navPadding?: number
    hamburgerSize?: number
    hamburgerTop?: number
    hamburgerRight?: number
    menuPanelWidth?: number
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const MENU_API_URL =
    "https://script.google.com/macros/s/AKfycbyk8Hjqop0qmThW0N1sGVIqOeeQ_L9-aG_SQF8_TQpWMWIpEbow2npwra_MaslASifL4g/exec"

const colors = {
    chocolate: "#5C2B1F",
    terracotta: "#D35230",
    gold: "#DAA520", // Rich goldenrod for Specials
    white: "#FFFFFF",
    cream: "#FFF8F0",
}

const CATEGORIES: Category[] = [
    {
        id: "specials",
        label: "Specials",
        bg: colors.gold,
        filled: true,
    },
    {
        id: "appetizers",
        label: "Appetizers",
        bg: colors.terracotta,
        filled: true,
    },
    {
        id: "noodle soups",
        label: "Noodle Soups",
        bg: colors.chocolate,
        filled: true,
    },
    { id: "noodles", label: "Noodles", bg: null, filled: false },
    { id: "fried rice", label: "Fried Rice", bg: null, filled: false },
    { id: "curries", label: "Curries", bg: colors.terracotta, filled: true },
    {
        id: "asian entrees",
        label: "Asian Entrees",
        bg: colors.chocolate,
        filled: true,
    },
    { id: "salads", label: "Salads", bg: null, filled: false },
    { id: "sides", label: "Sides", bg: null, filled: false },
    { id: "beverages", label: "Beverages", bg: null, filled: false },
]

const MOCK_ITEMS: MenuItem[] = [
    {
        name: "Special Dish 1",
        price: "15",
        category: "specials",
        description: "Today's featured specialty",
    },
    {
        name: "Spring Rolls",
        price: "8",
        category: "appetizers",
        description: "3 Rolls filled with glass noodles and vegetables",
    },
    {
        name: "Potstickers",
        price: "9",
        category: "appetizers",
        description: "6 Dumplings steamed then pan fried",
    },
    {
        name: "Khao Soi",
        price: "10",
        category: "noodle soups",
        description: "Rich, creamy and fragrant coconut curry noodle soup",
    },
    {
        name: "Pad Thai",
        price: "12",
        category: "noodles",
        description: "Rice noodles with egg, bean sprouts, peanuts",
    },
    {
        name: "Fried Rice",
        price: "11",
        category: "fried rice",
        description: "Thai style fried rice with vegetables",
    },
    {
        name: "Red Curry",
        price: "13",
        category: "curries",
        description: "Classic Thai red curry with vegetables",
    },
    {
        name: "Mongolian Beef",
        price: "14",
        category: "asian entrees",
        description: "Tender beef with scallions in savory sauce",
    },
    {
        name: "Papaya Salad",
        price: "9",
        category: "salads",
        description: "Fresh green papaya with spicy lime dressing",
    },
    {
        name: "Sticky Rice",
        price: "3",
        category: "sides",
        description: "Traditional Thai sticky rice",
    },
    {
        name: "Thai Iced Tea",
        price: "4",
        category: "beverages",
        description: "Sweet and creamy Thai tea",
    },
]

// ═══════════════════════════════════════════════════════════════════════════
// HERO SECTION COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const HeroSection: React.FC<HeroSectionProps> = ({
    logo,
    logoScale,
    showHeroText,
    logoSpacingTop,
    logoSpacingBottom,
    heroTitleSize,
    heroSubtitleSize,
    fontFamily,
    isCanvas,
}) => {
    const styles = {
        heroSection: {
            textAlign: "center" as const,
            paddingTop: `${logoSpacingTop}px`,
            paddingBottom: `${logoSpacingBottom}px`,
            paddingLeft: "20px",
            paddingRight: "20px",
            marginBottom: "8px",
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            justifyContent: "center",
        },
        logoContainer: {
            width: "100%",
            maxWidth: "300px",
            margin: "0 auto",
            marginBottom: showHeroText ? "20px" : "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        logoImage: {
            width: "100%",
            height: "auto",
            maxWidth: "100%",
            objectFit: "contain" as const,
            transform: `scale(${logoScale || 1})`,
        },
        heroTitle: {
            fontFamily: fontFamily,
            fontSize: `${heroTitleSize}px`,
            color: colors.chocolate,
            marginBottom: "12px",
            lineHeight: "1",
        },
        heroSubtitle: {
            fontSize: `${heroSubtitleSize}px`,
            color: colors.terracotta,
            fontWeight: "500",
            letterSpacing: "2px",
        },
    }

    return (
        <motion.div
            initial={{ opacity: 1, y: isCanvas ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={styles.heroSection}
        >
            {logo && (
                <motion.div
                    initial={{ opacity: 1, scale: isCanvas ? 1 : 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    style={styles.logoContainer}
                >
                    <img
                        src={logo}
                        style={styles.logoImage}
                        alt="Den Chai Logo"
                    />
                </motion.div>
            )}
            {showHeroText && (
                <>
                    <motion.h1
                        initial={{ opacity: 1, y: isCanvas ? 0 : 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        style={styles.heroTitle}
                    >
                        Den Chai
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        style={styles.heroSubtitle}
                    >
                        THAI RESTAURANT
                    </motion.p>
                </>
            )}
        </motion.div>
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// HAMBURGER MENU COMPONENT
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
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: "fixed",
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
                                position: "fixed",
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
                                position: "fixed",
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

const NavigationBar: React.FC<NavigationBarProps> = ({
    activeSection,
    onCategoryClick,
    isCanvas,
    navFontSize,
    navPadding,
    hamburgerSize,
    hamburgerTop,
    hamburgerRight,
    menuPanelWidth,
}) => {
    const styles = {
        nav: {
            position: "fixed" as const,
            top: 0,
            width: "100%",
            zIndex: 100,
            backgroundColor: colors.chocolate,
            padding: "12px 0",
            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
        },
        navInner: {
            maxWidth: "100%",
            margin: "0 auto",
            padding: "0 70px 0 12px",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            flexWrap: "wrap" as const,
            gap: "6px",
        },
    }

    return (
        <div style={{ position: "relative" }}>
            <motion.nav
                initial={{ y: isCanvas ? 0 : -50, opacity: 1 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, type: "spring" }}
                style={styles.nav}
            >
                <div style={styles.navInner}>
                    {CATEGORIES.map((cat) => {
                        const isActive = activeSection === cat.id
                        const isSpecials = cat.id === "specials"
                        return (
                            <motion.button
                                key={cat.id}
                                onClick={() => onCategoryClick(cat.id)}
                                style={{
                                    background: isActive
                                        ? isSpecials
                                            ? colors.gold
                                            : colors.terracotta
                                        : "transparent",
                                    border: "none",
                                    color: isActive
                                        ? colors.white
                                        : "rgba(255,255,255,0.75)",
                                    fontSize: `${navFontSize}px`,
                                    fontWeight: isSpecials ? "700" : "600",
                                    cursor: "pointer",
                                    padding: `${navPadding}px ${navPadding * 1.3}px`,
                                    minHeight: "40px",
                                    minWidth: "fit-content",
                                    borderRadius: "6px",
                                    transition: "all 0.2s",
                                    fontFamily: "sans-serif",
                                    textTransform: "uppercase" as const,
                                    whiteSpace: "nowrap" as const,
                                }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isSpecials ? "⭐ " : ""}
                                {cat.label}
                            </motion.button>
                        )
                    })}
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
// MENU SECTION COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const MenuSection: React.FC<MenuSectionProps> = React.memo(
    ({
        category,
        menuItems,
        onItemClick,
        fontFamily,
        isCanvas,
        onSectionInView,
        sectionHeaderSize,
        itemTitleSize,
        itemDescSize,
        boxPadding,
    }) => {
        const ref = useRef(null)
        const isInView = useInView(ref, {
            once: false,
            amount: 0.2,
            margin: "-80px",
        })

        useEffect(() => {
            if (isInView && !isCanvas) {
                onSectionInView(category.id)
            }
        }, [isInView, category.id, isCanvas, onSectionInView])

        const filtered = menuItems.filter(
            (i) =>
                i.category &&
                i.category.toLowerCase().trim() === category.id.toLowerCase()
        )

        if (filtered.length === 0) return null

        const isFilled = category.filled
        const isSpecials = category.id === "specials"
        const textColor = isFilled ? colors.white : colors.chocolate

        const styles = {
            section: {
                marginBottom: "40px",
                scrollMarginTop: "80px",
            },
            sectionFilled: {
                backgroundColor: category.bg || colors.terracotta,
                padding: `${boxPadding}px 20px`,
                borderRadius: "12px",
                boxShadow: isSpecials
                    ? "0 6px 30px rgba(218, 165, 32, 0.3)"
                    : "0 4px 20px rgba(0,0,0,0.08)",
            },
            sectionClean: {
                padding: "16px 0",
            },
            sectionHeader: {
                fontFamily: fontFamily,
                fontSize: `${sectionHeaderSize}px`,
                textAlign: "center" as const,
                marginBottom: "24px",
                lineHeight: "1.1",
            },
            item: {
                marginBottom: "20px",
                cursor: "pointer",
                padding: "16px 12px",
                borderRadius: "8px",
                transition: "all 0.2s",
            },
            itemTitle: {
                fontFamily: "sans-serif",
                fontWeight: "700" as const,
                textTransform: "uppercase" as const,
                fontSize: `${itemTitleSize}px`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
            },
            itemDesc: {
                fontFamily: "serif",
                fontSize: `${itemDescSize}px`,
                lineHeight: "1.5",
                opacity: 0.85,
            },
        }

        return (
            <motion.div
                ref={ref}
                id={`section-${category.id}`}
                initial={{ opacity: 1, y: isCanvas ? 0 : 30 }}
                animate={
                    isInView || isCanvas
                        ? { opacity: 1, y: 0 }
                        : { opacity: 1, y: 30 }
                }
                transition={{ duration: 0.5, type: "spring" }}
                style={{
                    ...styles.section,
                    ...(isFilled ? styles.sectionFilled : styles.sectionClean),
                }}
            >
                <motion.h2
                    initial={{ opacity: 1, scale: isCanvas ? 1 : 0.95 }}
                    animate={
                        isInView || isCanvas
                            ? { opacity: 1, scale: 1 }
                            : { opacity: 1, scale: 0.95 }
                    }
                    transition={{ delay: 0.1 }}
                    style={{ ...styles.sectionHeader, color: textColor }}
                >
                    {isSpecials ? "⭐ " : ""}
                    {category.label}
                </motion.h2>

                <motion.div
                    initial="hidden"
                    animate={isInView || isCanvas ? "visible" : "hidden"}
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.05 } },
                    }}
                >
                    {filtered.map((item, idx) => (
                        <motion.div
                            key={idx}
                            variants={{
                                hidden: { x: isCanvas ? 0 : -20, opacity: 1 },
                                visible: { x: 0, opacity: 1 },
                            }}
                            style={styles.item}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => !isCanvas && onItemClick(item)}
                        >
                            <div
                                style={{
                                    ...styles.itemTitle,
                                    color: textColor,
                                }}
                            >
                                <span>{item.name}</span>
                                <span style={{ fontWeight: "bold" }}>
                                    {item.price}
                                </span>
                            </div>
                            {item.description && (
                                <div
                                    style={{
                                        ...styles.itemDesc,
                                        color: isFilled
                                            ? "rgba(255,255,255,0.9)"
                                            : colors.chocolate,
                                    }}
                                >
                                    {item.description}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        )
    }
)

MenuSection.displayName = "MenuSection"

// ═══════════════════════════════════════════════════════════════════════════
// ITEM MODAL
// ═══════════════════════════════════════════════════════════════════════════

const ItemModal: React.FC<ItemModalProps> = ({
    item,
    onClose,
    isCanvas,
    onAddToCart,
}) => {
    if (!item || isCanvas) return null

    const [quantity, setQuantity] = useState(1)
    const [specialInstructions, setSpecialInstructions] = useState("")

    useEffect(() => {
        setQuantity(1)
        setSpecialInstructions("")
    }, [item])

    const handleAddToOrder = () => {
        onAddToCart(item, quantity, specialInstructions)
        onClose()
    }
    const styles = {
        modal: {
            position: "fixed" as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px 16px",
        },
        modalContent: {
            backgroundColor: colors.white,
            borderRadius: "16px",
            padding: "28px 24px",
            maxWidth: "90vw",
            width: "100%",
            maxHeight: "80vh",
            overflowY: "auto" as const,
        },
        buttonContainer: {
            display: "flex",
            flexDirection: "column" as const,
            gap: "12px",
            marginTop: "24px",
        },
        quantityControl: {
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginTop: "20px",
            marginBottom: "16px",
        },
        qtyButton: {
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: `1px solid ${colors.chocolate}`,
            backgroundColor: "white",
            color: colors.chocolate,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            cursor: "pointer",
        },
        input: {
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid #ddd",
            fontSize: "16px",
            fontFamily: "inherit",
            backgroundColor: "#F9F9F9",
            resize: "none" as const,
            height: "80px",
        },
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={styles.modal}
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.5, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.5, y: 50 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    style={styles.modalContent}
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2
                        style={{
                            color: colors.chocolate,
                            marginBottom: "12px",
                            fontSize: "24px",
                            lineHeight: "1.2",
                        }}
                    >
                        {item.name}
                    </h2>
                    <p
                        style={{
                            fontSize: "20px",
                            color: colors.terracotta,
                            fontWeight: "bold",
                            marginBottom: "16px",
                        }}
                    >
                        ${item.price}
                    </p>
                    <p
                        style={{
                            color: "#666",
                            lineHeight: "1.5",
                            fontSize: "16px",
                        }}
                    >
                        {item.description}
                    </p>

                    <div
                        style={{
                            borderTop: "1px solid #eee",
                            paddingTop: "20px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "16px",
                            }}
                        >
                            <span
                                style={{
                                    fontWeight: "bold",
                                    color: colors.chocolate,
                                }}
                            >
                                Quantity
                            </span>
                            <div style={styles.quantityControl}>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    style={styles.qtyButton}
                                    onClick={() =>
                                        setQuantity((q) => Math.max(1, q - 1))
                                    }
                                >
                                    -
                                </motion.button>
                                <span
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: "bold",
                                        width: "24px",
                                        textAlign: "center" as const,
                                    }}
                                >
                                    {quantity}
                                </span>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    style={styles.qtyButton}
                                    onClick={() =>
                                        setQuantity((q) => Math.min(99, q + 1))
                                    }
                                >
                                    +
                                </motion.button>
                            </div>
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontWeight: "bold",
                                    color: colors.chocolate,
                                    fontSize: "14px",
                                }}
                            >
                                Special Instructions (Optional)
                            </label>
                            <textarea
                                style={styles.input}
                                placeholder="E.g. No spicy, allergy info..."
                                value={specialInstructions}
                                onChange={(e) =>
                                    setSpecialInstructions(e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div style={styles.buttonContainer}>
                        <motion.button
                            whileHover={{
                                scale: 1.02,
                                boxShadow: "0 6px 24px rgba(211,82,48,0.4)",
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAddToOrder}
                            style={{
                                padding: "16px 40px",
                                backgroundColor: colors.terracotta,
                                color: colors.white,
                                border: "none",
                                borderRadius: "12px",
                                fontSize: "18px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                minHeight: "56px",
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "10px",
                            }}
                        >
                            <span>Add to Order</span>
                            <span style={{ opacity: 0.8 }}>—</span>
                            <span>
                                $
                                {(parseFloat(item.price) * quantity).toFixed(2)}
                            </span>
                        </motion.button>
                        <motion.button
                            whileHover={{
                                scale: 1.02,
                                backgroundColor: "#f0f0f0",
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onClose}
                            style={{
                                padding: "14px 40px",
                                backgroundColor: "transparent",
                                color: colors.chocolate,
                                border: `2px solid ${colors.chocolate}`,
                                borderRadius: "12px",
                                fontSize: "16px",
                                fontWeight: "600",
                                cursor: "pointer",
                                minHeight: "52px",
                                width: "100%",
                            }}
                        >
                            Close
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// LOADING COMPONENT - CENTERED v3
// ═══════════════════════════════════════════════════════════════════════════

const LoadingScreen = () => (
    <div
        style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: colors.cream,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}
    >
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "0 20px",
            }}
        >
            <motion.div
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                }}
                style={{
                    width: "40px",
                    height: "40px",
                    border: "3px solid #f3f3f3",
                    borderTop: `3px solid ${colors.terracotta}`,
                    borderRadius: "50%",
                    marginBottom: "16px",
                }}
            />
            <h3
                style={{
                    fontSize: "16px",
                    margin: 0,
                    textAlign: "center",
                    color: colors.chocolate,
                }}
            >
                Loading Menu...
            </h3>
        </motion.div>
    </div>
)

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface FloatingCartButtonProps {
    count: number
    onClick: () => void
    isCanvas: boolean
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({
    count,
    onClick,
    isCanvas,
}) => {
    if (count === 0 || isCanvas) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                style={{
                    position: "fixed",
                    bottom: "24px",
                    right: "24px",
                    zIndex: 900,
                }}
            >
                <motion.a
                    href="/den-chai-orders"
                    onClick={(e) => {
                        if (isCanvas) {
                            e.preventDefault()
                        } else {
                            console.log("🚀 [MENU PAGE] Navigating to orders, cart in localStorage:", localStorage.getItem(CART_STORAGE_KEY)?.substring(0, 100))
                        }
                    }}
                    style={{ textDecoration: "none" }}
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            backgroundColor: colors.chocolate,
                            color: "white",
                            border: "none",
                            borderRadius: "50px",
                            padding: "16px 24px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            boxShadow: "0 4px 20px rgba(92,43,31,0.3)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                        }}
                    >
                        <ShoppingBag size={24} />
                        <span>View Order</span>
                        <span
                            style={{
                                backgroundColor: colors.terracotta,
                                padding: "4px 10px",
                                borderRadius: "12px",
                                fontSize: "14px",
                            }}
                        >
                            {count}
                        </span>
                    </motion.button>
                </motion.a>
            </motion.div>
        </AnimatePresence>
    )
}

export default function DenChaiMenu(props: DenChaiMenuProps) {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
    const [activeSection, setActiveSection] = useState("specials")
    const [cartCount, setCartCount] = useState(0)

    const fontFamily = props.font?.fontFamily || "cursive"
    const isCanvas = RenderTarget.current() === RenderTarget.canvas

    // ── SEO: title, meta description, canonical, JSON-LD ──────────────────
    useEffect(() => {
        if (isCanvas) return
        document.title = "Menu | Den Chai Thai Restaurant | Spartanburg, SC"
        let desc = document.querySelector('meta[name="description"]')
        if (!desc) { desc = document.createElement("meta"); desc.setAttribute("name", "description"); document.head.appendChild(desc) }
        desc.setAttribute("content", "Explore Den Chai's full Thai menu — noodle soups, curries, fried rice, appetizers, beverages & more. Fresh, authentic flavors in Spartanburg, SC.")
        let can = document.querySelector('link[rel="canonical"]')
        if (!can) { can = document.createElement("link"); can.setAttribute("rel", "canonical"); document.head.appendChild(can) }
        can.setAttribute("href", "https://den-chai.com/menu")
        const existing = document.getElementById("den-chai-schema")
        if (existing) existing.remove()
        const s = document.createElement("script"); s.id = "den-chai-schema"; s.type = "application/ld+json"
        s.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "Restaurant", "@id": "https://den-chai.com", "name": "Den Chai", "url": "https://den-chai.com", "telephone": "+18643104048", "servesCuisine": "Thai", "priceRange": "$$", "hasMenu": "https://den-chai.com/menu", "address": { "@type": "PostalAddress", "streetAddress": "253 Magnolia Street", "addressLocality": "Spartanburg", "addressRegion": "SC", "postalCode": "29306", "addressCountry": "US" }, "openingHoursSpecification": [{ "@type": "OpeningHoursSpecification", "dayOfWeek": ["Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], "opens": "10:00", "closes": "22:00" }], "sameAs": ["https://share.google/JQVVLrr205YA2XVox"] })
        document.head.appendChild(s)
        return () => { const el = document.getElementById("den-chai-schema"); if (el) el.remove() }
    }, [isCanvas])

    useEffect(() => {
        const updateCartCount = () => {
            try {
                console.log("🔄 [MENU PAGE] Updating cart count...")
                const raw = localStorage.getItem(CART_STORAGE_KEY)
                if (raw) {
                    const data = JSON.parse(raw)
                    const count = data.items.reduce(
                        (sum: number, item: any) => sum + item.quantity,
                        0
                    )
                    console.log("📊 [MENU PAGE] Cart count updated:", count, "items")
                    setCartCount(count)
                } else {
                    console.log("📊 [MENU PAGE] No cart found, count = 0")
                    setCartCount(0)
                }
            } catch (e) {
                console.error("❌ [MENU PAGE] Error updating cart count:", e)
                setCartCount(0)
            }
        }

        console.log("🎬 [MENU PAGE] Setting up cart count listeners")
        updateCartCount()
        window.addEventListener("storage", updateCartCount)
        window.addEventListener("cart-updated", updateCartCount)

        return () => {
            window.removeEventListener("storage", updateCartCount)
            window.removeEventListener("cart-updated", updateCartCount)
        }
    }, [])

    const handleAddToCart = useCallback(
        (item: MenuItem, quantity: number, specialInstructions: string) => {
            try {
                console.log("🛒 [MENU PAGE] Adding to cart:", item.name, "x", quantity)
                const raw = localStorage.getItem(CART_STORAGE_KEY)
                console.log("📥 [MENU PAGE] Current cart in localStorage:", raw ? raw.substring(0, 100) + "..." : "EMPTY")
                const data = raw
                    ? JSON.parse(raw)
                    : { items: [], lastUpdated: new Date().toISOString() }

                const newItem: CartItem = {
                    name: item.name,
                    price: item.price,
                    category: item.category,
                    description: item.description,
                    quantity: quantity,
                    specialInstructions: specialInstructions,
                }

                const existingIndex = data.items.findIndex(
                    (i: CartItem) =>
                        i.name === newItem.name &&
                        i.specialInstructions === newItem.specialInstructions
                )

                if (existingIndex >= 0) {
                    console.log("📝 [MENU PAGE] Updating existing item quantity")
                    data.items[existingIndex].quantity += quantity
                } else {
                    console.log("➕ [MENU PAGE] Adding new item to cart")
                    data.items.push(newItem)
                }

                data.lastUpdated = new Date().toISOString()
                localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data))
                console.log("✅ [MENU PAGE] Cart saved! Total items:", data.items.length)
                console.log("💾 [MENU PAGE] Saved data:", JSON.stringify(data).substring(0, 150) + "...")
                window.dispatchEvent(new Event("cart-updated"))
            } catch (e) {
                console.error("❌ [MENU PAGE] Failed to add to cart:", e)
            }
        },
        []
    )

    useEffect(() => {
        if (isCanvas) {
            setMenuItems(MOCK_ITEMS)
            setLoading(false)
            return
        }

        const fetchMenu = async () => {
            try {
                setLoading(true)
                const response = await fetch(MENU_API_URL)
                if (!response.ok) throw new Error(`HTTP ${response.status}`)
                const data = await response.json()
                const items = (data.items || []).map((item: any) => ({
                    name: item.Title || item.name || "",
                    price: item.Price || item.price || "",
                    category: item.Category || item.category || "",
                    description: item.Description || item.description || "",
                }))
                setMenuItems(items)
                setError(null)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error")
            } finally {
                setLoading(false)
            }
        }
        fetchMenu()
    }, [isCanvas])

    const scrollToSection = useCallback((categoryId: string) => {
        setActiveSection(categoryId)
        const element = document.getElementById(`section-${categoryId}`)
        if (element) {
            const navHeight = 70
            const elementPosition =
                element.getBoundingClientRect().top + window.pageYOffset
            const offsetPosition = elementPosition - navHeight - 16
            window.scrollTo({ top: offsetPosition, behavior: "smooth" })
        }
    }, [])

    const handleSectionInView = useCallback((categoryId: string) => {
        setActiveSection(categoryId)
    }, [])

    const styles = {
        wrapper: {
            width: "100%",
            backgroundColor: colors.cream,
            minHeight: "100vh",
        },
        content: {
            maxWidth: `${props.contentWidth || 600}px`,
            margin: "0 auto",
            padding: "16px 16px",
        },
    }

    if (loading) {
        return <LoadingScreen />
    }

    if (error) {
        return (
            <div
                style={{
                    ...styles.wrapper,
                    padding: "60px 20px",
                    textAlign: "center",
                }}
            >
                <h3 style={{ color: colors.terracotta, fontSize: "18px" }}>
                    ⚠️ Unable to Load Menu
                </h3>
                <p style={{ fontSize: "14px" }}>{error}</p>
            </div>
        )
    }

    return (
        <>
            <div style={styles.wrapper}>
                <NavigationBar
                    activeSection={activeSection}
                    onCategoryClick={scrollToSection}
                    isCanvas={isCanvas}
                    navFontSize={props.navFontSize || 11}
                    navPadding={props.navPadding || 8}
                    hamburgerSize={props.hamburgerSize || 36}
                    hamburgerTop={props.hamburgerTop || 16}
                    hamburgerRight={props.hamburgerRight || 14}
                    menuPanelWidth={props.menuPanelWidth || 280}
                />

                <HeroSection
                    logo={props.logo}
                    logoScale={props.logoScale || 1}
                    showHeroText={props.showHeroText || false}
                    logoSpacingTop={props.logoSpacingTop || 70}
                    logoSpacingBottom={props.logoSpacingBottom || 10}
                    heroTitleSize={props.heroTitleSize || 48}
                    heroSubtitleSize={props.heroSubtitleSize || 16}
                    fontFamily={fontFamily}
                    isCanvas={isCanvas}
                />

                <div style={styles.content}>
                    {CATEGORIES.map((category) => (
                        <MenuSection
                            key={category.id}
                            category={category}
                            menuItems={menuItems}
                            onItemClick={setSelectedItem}
                            fontFamily={fontFamily}
                            isCanvas={isCanvas}
                            onSectionInView={handleSectionInView}
                            sectionHeaderSize={props.sectionHeaderSize || 36}
                            itemTitleSize={props.itemTitleSize || 16}
                            itemDescSize={props.itemDescSize || 14}
                            boxPadding={props.boxPadding || 24}
                        />
                    ))}
                </div>
            </div>

            <ItemModal
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
                isCanvas={isCanvas}
                onAddToCart={handleAddToCart}
            />
            <FloatingCartButton
                count={cartCount}
                onClick={() => (window.location.href = "/home-v2#order")}
                isCanvas={isCanvas}
            />
        </>
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// PROPERTY CONTROLS
// ═══════════════════════════════════════════════════════════════════════════

addPropertyControls(DenChaiMenu, {
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
    showHeroText: {
        type: ControlType.Boolean,
        title: "Show Hero Text",
        defaultValue: false,
    },
    logoSpacingTop: {
        type: ControlType.Number,
        title: "Logo Top Space",
        defaultValue: 70,
        min: 40,
        max: 120,
        step: 10,
        displayStepper: true,
    },
    logoSpacingBottom: {
        type: ControlType.Number,
        title: "Logo Bottom Space",
        defaultValue: 10,
        min: 0,
        max: 100,
        step: 5,
        displayStepper: true,
    },
    font: { type: ControlType.Font, title: "Header Font" },
    heroTitleSize: {
        type: ControlType.Number,
        title: "Hero Title Size",
        defaultValue: 48,
        min: 24,
        max: 80,
        step: 4,
        displayStepper: true,
    },
    heroSubtitleSize: {
        type: ControlType.Number,
        title: "Hero Subtitle Size",
        defaultValue: 16,
        min: 12,
        max: 28,
        step: 2,
        displayStepper: true,
    },
    sectionHeaderSize: {
        type: ControlType.Number,
        title: "Section Header Size",
        defaultValue: 36,
        min: 24,
        max: 60,
        step: 2,
        displayStepper: true,
    },
    itemTitleSize: {
        type: ControlType.Number,
        title: "Item Title Size",
        defaultValue: 16,
        min: 12,
        max: 24,
        step: 1,
        displayStepper: true,
    },
    itemDescSize: {
        type: ControlType.Number,
        title: "Item Description Size",
        defaultValue: 14,
        min: 11,
        max: 20,
        step: 1,
        displayStepper: true,
    },
    navFontSize: {
        type: ControlType.Number,
        title: "Nav Button Font Size",
        defaultValue: 11,
        min: 6,
        max: 18,
        step: 1,
        displayStepper: true,
    },
    navPadding: {
        type: ControlType.Number,
        title: "Nav Button Padding",
        defaultValue: 8,
        min: 2,
        max: 20,
        step: 1,
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
        title: "Hamburger Top Position",
        defaultValue: 16,
        min: 10,
        max: 40,
        step: 2,
        displayStepper: true,
    },
    hamburgerRight: {
        type: ControlType.Number,
        title: "Hamburger Right Position",
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
    contentWidth: {
        type: ControlType.Number,
        title: "Content Width",
        defaultValue: 600,
        min: 320,
        max: 800,
        step: 40,
        displayStepper: true,
    },
    boxPadding: {
        type: ControlType.Number,
        title: "Box Padding",
        defaultValue: 24,
        min: 16,
        max: 60,
        step: 4,
        displayStepper: true,
    },
})
