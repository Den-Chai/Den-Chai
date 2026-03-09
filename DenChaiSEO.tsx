import { useEffect } from "react"
import { addPropertyControls, ControlType } from "framer"

// ─── Business Constants ───────────────────────────────────────────────────────
const BUSINESS = {
    name: "Den Chai",
    description:
        "Authentic Thai restaurant in Spartanburg, SC. Fresh noodles made in-house daily. Every broth simmered for hours. Dine-in & online ordering.",
    url: "https://den-chai.com",
    telephone: "+18643104048",
    email: "",
    address: {
        street: "253 Magnolia Street",
        city: "Spartanburg",
        state: "SC",
        zip: "29306",
        country: "US",
    },
    geo: { lat: 34.9496, lng: -81.9321 },
    cuisine: "Thai",
    priceRange: "$$",
    sameAs: [
        "https://share.google/JQVVLrr205YA2XVox",
        // TODO: add Facebook/Instagram URLs when available
    ],
    hours: [
        {
            dayOfWeek: [
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ],
            opens: "10:00",
            closes: "22:00",
        },
    ],
}

// ─── Per-Page SEO Data ────────────────────────────────────────────────────────
const PAGE_META = {
    home: {
        title: "Den Chai | Authentic Thai Restaurant | Spartanburg, SC",
        description:
            "Den Chai is Spartanburg's authentic Thai dining experience. Fresh noodles made in-house daily, rich broths simmered for hours. Dine-in, takeout & online ordering. 253 Magnolia St.",
        canonical: "https://den-chai.com",
    },
    menu: {
        title: "Menu | Den Chai Thai Restaurant | Spartanburg, SC",
        description:
            "Explore Den Chai's full Thai menu — noodle soups, curries, fried rice, appetizers, beverages & more. Fresh, authentic flavors in the heart of Spartanburg.",
        canonical: "https://den-chai.com/menu",
    },
    orders: {
        title: "Order Online | Den Chai Thai Restaurant | Spartanburg, SC",
        description:
            "Order fresh Thai food online from Den Chai in Spartanburg, SC. Noodles, curries, fried rice & more ready for pickup.",
        canonical: "https://den-chai.com/den-chai-orders",
    },
}

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
    page: "home" | "menu" | "orders"
}

export default function DenChaiSEO({ page = "home" }: Props) {
    useEffect(() => {
        const meta = PAGE_META[page]

        // ── Page title ──────────────────────────────────────────────────────
        document.title = meta.title

        // ── Meta description ────────────────────────────────────────────────
        let desc = document.querySelector('meta[name="description"]')
        if (!desc) {
            desc = document.createElement("meta")
            desc.setAttribute("name", "description")
            document.head.appendChild(desc)
        }
        desc.setAttribute("content", meta.description)

        // ── Canonical ───────────────────────────────────────────────────────
        let canonical = document.querySelector('link[rel="canonical"]')
        if (!canonical) {
            canonical = document.createElement("link")
            canonical.setAttribute("rel", "canonical")
            document.head.appendChild(canonical)
        }
        canonical.setAttribute("href", meta.canonical)

        // ── JSON-LD Restaurant schema ───────────────────────────────────────
        const existing = document.getElementById("den-chai-schema")
        if (existing) existing.remove()

        const schema = document.createElement("script")
        schema.id = "den-chai-schema"
        schema.type = "application/ld+json"
        schema.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Restaurant",
            "@id": "https://den-chai.com",
            name: BUSINESS.name,
            description: BUSINESS.description,
            url: BUSINESS.url,
            telephone: BUSINESS.telephone,
            servesCuisine: BUSINESS.cuisine,
            priceRange: BUSINESS.priceRange,
            hasMenu: "https://den-chai.com/menu",
            address: {
                "@type": "PostalAddress",
                streetAddress: BUSINESS.address.street,
                addressLocality: BUSINESS.address.city,
                addressRegion: BUSINESS.address.state,
                postalCode: BUSINESS.address.zip,
                addressCountry: BUSINESS.address.country,
            },
            geo: {
                "@type": "GeoCoordinates",
                latitude: BUSINESS.geo.lat,
                longitude: BUSINESS.geo.lng,
            },
            openingHoursSpecification: BUSINESS.hours.map((h) => ({
                "@type": "OpeningHoursSpecification",
                dayOfWeek: h.dayOfWeek,
                opens: h.opens,
                closes: h.closes,
            })),
            sameAs: BUSINESS.sameAs,
        })
        document.head.appendChild(schema)

        return () => {
            const el = document.getElementById("den-chai-schema")
            if (el) el.remove()
        }
    }, [page])

    // Invisible — renders nothing in the page body
    return <div style={{ display: "none" }} />
}

addPropertyControls(DenChaiSEO, {
    page: {
        type: ControlType.Enum,
        title: "Page",
        options: ["home", "menu", "orders"],
        optionTitles: ["Home", "Menu", "Orders"],
        defaultValue: "home",
    },
})
