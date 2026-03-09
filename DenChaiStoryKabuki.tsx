import { addPropertyControls, ControlType } from "framer"

/**
 * DEN CHAI STORY SECTION - KABUKI REIMAGINED V4
 * Ultimate robustness: No overlapping, strict spacing, massive localized impact.
 * Responsive fonts that work everywhere.
 */
export default function DenChaiStoryKabuki({
    mobileTopMargin = -20,
    topLabel = "Newest Destination",
    mainTitle = "SPARTANBURG\nSOUL.",
    leadText = "The Upstate's new home for the true, unfiltered flavors of Northern Thailand.",
    feature1Title = "DIRECT FROM CHIANG MAI",
    feature1Desc = "No Americanized filters. Just the bold, layered recipes of our home in Thailand.",
    feature2Title = "REAL PEOPLE. REAL THAI.",
    feature2Desc = "Every paste is pounded by hand. Every broth is slow-cooked. The way it's done in the village.",
    bottomLabel = "The Experience",
    philosophyTitle = "CRAFTING MEMORIES.",
    philosophyDesc = "A passage connecting the Upstate to the heart of the North.",
}) {
    return (
        <section id="about" className="dc-section" style={{...sectionStyle, marginTop: `${mobileTopMargin}px`}}>
            <div className="dc-container" style={containerStyle}>
                
                {/* TOP HEADER: Spartanburg Hero */}
                <div style={headerGroupStyle}>
                    <span style={labelStyle}>{topLabel}</span>
                    <h2 className="dc-main-title" style={mainTitleStyle}>
                        {mainTitle.split('\n').map((line, i) => (
                            <span key={i}>{line}{i < mainTitle.split('\n').length - 1 && <br/>}</span>
                        ))}
                    </h2>
                    <p className="dc-lead" style={leadStyle}>
                        {leadText}
                    </p>
                </div>

                {/* GRID CONTENT: Features & Philosophy */}
                <div className="dc-grid" style={gridStyle}>
                    
                    {/* Features Column */}
                    <div style={columnStyle}>
                        <div style={featureItemStyle}>
                            <h3 style={featureTitleStyle}>{feature1Title}</h3>
                            <p style={featureDescStyle}>{feature1Desc}</p>
                        </div>
                        <div style={featureItemStyle}>
                            <h3 style={featureTitleStyle}>{feature2Title}</h3>
                            <p style={featureDescStyle}>{feature2Desc}</p>
                        </div>
                    </div>

                    {/* Philosophy & Image Column */}
                    <div style={columnStyle}>
                        <div style={imageWrapperStyle}>
                            <img 
                                src="https://framerusercontent.com/images/05kM2O2XjJc2C9YWFKX72WseU.jpg" 
                                style={imageStyle} 
                                alt="Den Chai Spartanburg"
                            />
                        </div>
                        <div style={{ marginTop: '32px' }}>
                            <span style={labelStyle}>{bottomLabel}</span>
                            <h3 style={philosophyTitleStyle}>{philosophyTitle}</h3>
                            <p style={philosophyDescStyle}>{philosophyDesc}</p>
                        </div>
                    </div>

                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800;900&display=swap');

                .dc-section {
                    font-family: 'Inter', sans-serif;
                    padding: 140px 0;
                }

                .dc-container {
                    padding: 0 60px;
                }

                .dc-main-title {
                    font-size: 90px;
                    letter-spacing: -0.04em;
                }

                /* Large Desktop scaling */
                @media (min-width: 1200px) {
                    .dc-main-title { font-size: 110px !important; }
                }

                /* Mobile/Tablet Overrides */
                @media (max-width: 1000px) {
                    .dc-grid { 
                        flex-direction: column !important; 
                        gap: 60px !important;
                    }
                    .dc-main-title { font-size: 72px !important; }
                    .dc-container { padding: 0 32px !important; }
                }

                @media (max-width: 600px) {
                    .dc-main-title {
                        font-size: 36px !important;
                        letter-spacing: -0.03em !important;
                        margin-left: -8px !important;
                    }
                    .dc-lead { font-size: 20px !important; }
                    .dc-section { padding: 0 0 40px 0 !important; }
                    .dc-container { padding: 0 16px !important; }
                }
            `}</style>
        </section>
    )
}

const sectionStyle = {
    width: "100%",
    backgroundColor: "#FAF6F0",
    // padding moved to CSS for responsive control
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
}

const containerStyle = {
    width: "100%",
    maxWidth: "1200px",
    // padding moved to CSS for responsive control
    display: "flex",
    flexDirection: "column",
    gap: "80px",
    boxSizing: "border-box" as const,
}

const headerGroupStyle = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    textAlign: "left",
}

const labelStyle = {
    color: "#C8973A",
    textTransform: "uppercase",
    letterSpacing: "0.4em",
    fontWeight: "800",
    fontSize: "13px",
}

const mainTitleStyle = {
    color: "#1A1A1A",
    // fontSize and letterSpacing moved to CSS for responsive control
    lineHeight: "0.9",
    fontWeight: "900",
    margin: "8px 0 0 0",
}

const leadStyle = {
    color: "#444444",
    fontSize: "24px",
    lineHeight: "1.5",
    fontWeight: "500",
    margin: "12px 0 0 0",
    maxWidth: "700px",
}

const gridStyle = {
    display: "flex",
    gap: "80px",
    width: "100%",
}

const columnStyle = {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    gap: "48px",
}

const featureItemStyle = {
    borderLeft: "4px solid #C8973A",
    paddingLeft: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
}

const featureTitleStyle = {
    color: "#1A1A1A",
    fontSize: "20px",
    fontWeight: "800",
    margin: 0,
    letterSpacing: "0.05em",
}

const featureDescStyle = {
    color: "#666666",
    fontSize: "16px",
    lineHeight: "1.5",
    margin: 0,
}

const philosophyTitleStyle = {
    color: "#1A1A1A",
    fontSize: "32px",
    fontWeight: "800",
    margin: "8px 0 0 0",
    letterSpacing: "-0.02em",
}

const philosophyDescStyle = {
    color: "#666666",
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "12px 0 0 0",
}

const imageWrapperStyle = {
    width: "100%",
    aspectRatio: "1.4",
    borderRadius: "32px",
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
}

const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
}

addPropertyControls(DenChaiStoryKabuki, {
    mobileTopMargin: {
        type: ControlType.Number,
        title: "Top Gap",
        min: -100,
        max: 100,
        step: 1,
        defaultValue: -20,
        displayStepper: true,
    },
    topLabel: {
        type: ControlType.String,
        title: "Top Label",
        defaultValue: "Newest Destination",
    },
    mainTitle: {
        type: ControlType.String,
        title: "Main Title",
        defaultValue: "SPARTANBURG\nSOUL.",
        displayTextArea: true,
    },
    leadText: {
        type: ControlType.String,
        title: "Lead Text",
        defaultValue: "The Upstate's new home for the true, unfiltered flavors of Northern Thailand.",
        displayTextArea: true,
    },
    feature1Title: {
        type: ControlType.String,
        title: "Feature 1 Title",
        defaultValue: "DIRECT FROM CHIANG MAI",
    },
    feature1Desc: {
        type: ControlType.String,
        title: "Feature 1 Description",
        defaultValue: "No Americanized filters. Just the bold, layered recipes of our home in Thailand.",
        displayTextArea: true,
    },
    feature2Title: {
        type: ControlType.String,
        title: "Feature 2 Title",
        defaultValue: "REAL PEOPLE. REAL THAI.",
    },
    feature2Desc: {
        type: ControlType.String,
        title: "Feature 2 Description",
        defaultValue: "Every paste is pounded by hand. Every broth is slow-cooked. The way it's done in the village.",
        displayTextArea: true,
    },
    bottomLabel: {
        type: ControlType.String,
        title: "Bottom Label",
        defaultValue: "The Experience",
    },
    philosophyTitle: {
        type: ControlType.String,
        title: "Philosophy Title",
        defaultValue: "CRAFTING MEMORIES.",
    },
    philosophyDesc: {
        type: ControlType.String,
        title: "Philosophy Description",
        defaultValue: "A passage connecting the Upstate to the heart of the North.",
        displayTextArea: true,
    },
})


