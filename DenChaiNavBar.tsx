import { addPropertyControls, ControlType } from "framer"
import { useState, useEffect } from "react"

export default function DenChaiNavBar(props) {
    const {
        logoSize = 44,
        logoImage = "https://framerusercontent.com/images/BSsOiz9ziU4XG67BW8b7DnS4Opo.svg?width=612&height=792",
        navbarColor = "rgba(100, 100, 100, 1)",
        navbarStartOpacity = 1,
        navbarScrollOpacity = 0,
        hamburgerColor = "rgba(140, 140, 140, 1)",
        hamburgerOpacity = 0.75,
    } = props
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            // Log for debugging
            // console.log("Scroll position:", window.scrollY);
            setIsScrolled(window.scrollY > 10)      
        }
        window.addEventListener("scroll", handleScroll)
        // Initial check
        handleScroll()
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navLinks = [
        { label: "Home", href: "/" },
        { label: "About", href: "/#about" },
        { label: "Menu", href: "/#menu" },
        { label: "Contact & Directions", href: "/#contact" },
        { label: "Private Events", href: "/#events" },
    ]

    return (
        <div style={{ width: "100%", height: "70px" }}>
            {/* Nav Bar */}
            <nav
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "70px",
                    // Use prop values for colors and opacity
                    backgroundColor: isScrolled
                        ? navbarColor.replace(/[\d.]+\)$/g, `${navbarScrollOpacity})`)
                        : navbarColor.replace(/[\d.]+\)$/g, `${navbarStartOpacity})`),
                    backdropFilter: isScrolled ? "none" : "blur(8px)",
                    WebkitBackdropFilter: isScrolled ? "none" : "blur(8px)",
                    borderBottom: isScrolled ? "none" : "1px solid rgba(255, 255, 255, 0.1)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingLeft: "32px",
                    paddingRight: "32px",
                    zIndex: 1000,
                }}
            >
                {/* Logo */}
                <a href="/" style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>    
                    <img
                        src={logoImage}
                        alt="Den Chai Logo"
                        style={{
                            height: `${logoSize}px`,
                            width: "auto",
                            display: "block",       
                        }}
                    />
                </a>

                {/* Desktop Nav Links */}
                <div
                    style={{
                        display: "flex",
                        gap: "32px",
                        alignItems: "center",       
                    }}
                    className="desktop-nav"
                >
                    {navLinks.map((link) => (       
                        <a
                            key={link.label}        
                            href={link.href}        
                            style={{
                                fontSize: "14px",   
                                fontWeight: 500,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                color: "#FDF8F2",   
                                textDecoration: "none",
                                opacity: 0.9,
                                transition: "opacity 0.2s ease"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = "0.9"}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Order Online Button (Desktop) */}
                <a
                    href="/#order"
                    className="desktop-order-btn"   
                    style={{
                        backgroundColor: "#C8973A", 
                        color: "#FDF8F2",
                        fontSize: "13px",
                        fontWeight: "bold",
                        textTransform: "uppercase", 
                        letterSpacing: "0.1em",    
                        padding: "12px 24px",       
                        borderRadius: "8px",        
                        textDecoration: "none",     
                        whiteSpace: "nowrap",
                        boxShadow: "0 4px 14px 0 rgba(200, 151, 58, 0.39)",
                    }}
                >
                    Order Online
                </a>

                {/* Hamburger Menu (Mobile) */}     
                <button
                    className="mobile-hamburger"    
                    onClick={() => setMobileMenuOpen(true)}
                    style={{
                        display: "none",
                        background: "none",
                        border: "none",
                        color: "#FDF8F2",
                        fontSize: "28px",
                        cursor: "pointer",
                        padding: "8px",
                        lineHeight: 1,
                    }}
                >
                    ☰
                </button>
            </nav>

            {/* Mobile Slide Panel */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    right: mobileMenuOpen ? 0 : "-100%",
                    width: "80vw",
                    maxWidth: "320px",
                    height: "100vh",
                    backgroundColor: hamburgerColor.replace(/[\d.]+\)$/g, `${hamburgerOpacity})`),
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    paddingTop: "80px",
                    paddingLeft: "32px",
                    paddingRight: "32px",
                    zIndex: 2000,
                    transition: "right 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "28px",
                    boxShadow: mobileMenuOpen ? "-10px 0 30px rgba(0,0,0,0.3)" : "none",
                }}
            >
                {/* Close Button */}
                <button
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                        position: "absolute",       
                        top: "24px",
                        right: "24px",
                        background: "none",
                        border: "none",
                        color: "#FDF8F2",
                        fontSize: "32px",
                        cursor: "pointer",
                        padding: "8px",
                    }}
                >
                    ✕
                </button>

                {/* Mobile Nav Links */}
                {navLinks.map((link) => (
                    <a
                        key={link.label}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                            fontSize: "20px",       
                            color: "#FDF8F2",       
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            textDecoration: "none", 
                            padding: "12px 0",       
                            borderBottom: "1px solid rgba(253, 248, 242, 0.1)",
                        }}
                    >
                        {link.label}
                    </a>
                ))}

                {/* Order Online Button (Mobile) */}
                <a
                    href="/#order"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                        backgroundColor: "#C8973A", 
                        color: "#FDF8F2",
                        fontSize: "14px",
                        textTransform: "uppercase", 
                        letterSpacing: "0.1em",     
                        padding: "16px 20px",       
                        borderRadius: "10px",        
                        textDecoration: "none",     
                        textAlign: "center",        
                        marginTop: "20px",
                        fontWeight: "bold",
                        boxShadow: "0 4px 14px 0 rgba(200, 151, 58, 0.39)",
                    }}
                >
                    Order Online
                </a>
            </div>

            {/* Overlay */}
            {mobileMenuOpen && (
                <div
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        zIndex: 1500,
                        backdropFilter: "blur(4px)",
                    }}
                />
            )}

            {/* Media Query Styles */}
            <style>{`
                @media (max-width: 900px) {
                    .desktop-nav,
                    .desktop-order-btn {
                        display: none !important;   
                    }
                    .mobile-hamburger {
                        display: block !important;  
                    }
                }
                @media (min-width: 901px) {
                    .mobile-hamburger {
                        display: none !important;   
                    }
                }
            `}</style>
        </div>
    )
}

addPropertyControls(DenChaiNavBar, {
    logoImage: {
        type: ControlType.Image,
        title: "Logo Upload",
    },
    logoSize: {
        type: ControlType.Number,
        title: "Logo Size",
        min: 20,
        max: 200,
        step: 1,
        defaultValue: 44,
        displayStepper: true,
    },
    navbarColor: {
        type: ControlType.Color,
        title: "Navbar Color",
        defaultValue: "rgba(100, 100, 100, 1)",
    },
    navbarStartOpacity: {
        type: ControlType.Number,
        title: "Start Opacity",
        min: 0,
        max: 1,
        step: 0.05,
        defaultValue: 1,
        displayStepper: true,
    },
    navbarScrollOpacity: {
        type: ControlType.Number,
        title: "Scroll Opacity",
        min: 0,
        max: 1,
        step: 0.05,
        defaultValue: 0,
        displayStepper: true,
    },
    hamburgerColor: {
        type: ControlType.Color,
        title: "Menu Color",
        defaultValue: "rgba(140, 140, 140, 1)",
    },
    hamburgerOpacity: {
        type: ControlType.Number,
        title: "Menu Opacity",
        min: 0,
        max: 1,
        step: 0.05,
        defaultValue: 0.75,
        displayStepper: true,
    },
})
