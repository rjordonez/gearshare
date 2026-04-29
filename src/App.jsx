import { useEffect, useMemo, useState } from 'react'
import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { usePostHog } from '@posthog/react'
import './App.css'

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  {
    label: 'How GearShare Works',
    to: '/how-gearshare-works',
    children: [
      { label: 'For Renters', to: '/for-renters' },
      { label: 'For Owners', to: '/for-owners' },
      { label: 'Insurance Agreement', to: '/insurance-agreement' },
    ],
  },
  {
    label: 'Browse/Rent',
    to: '/browse-rent',
    children: [
      { label: 'All Categories', to: '/browse-rent/all-categories' },
      { label: 'Film & Video', to: '/browse-rent/all-categories/film-video' },
      { label: 'Streaming & Audio', to: '/browse-rent/all-categories/streaming-audio' },
      { label: 'Photography', to: '/browse-rent/all-categories/photography' },
      { label: 'Theater', to: '/browse-rent/all-categories/theater' },
      { label: 'Art/Creative Tools', to: '/browse-rent/all-categories/art-creative-tools' },
    ],
  },
  { label: 'Recommendations', to: '/recommendations' },
]

const BANNER_TITLES = {
  '/': 'GearShare',
  '/how-gearshare-works': 'How GearShare Works',
  '/for-renters': 'For Renters',
  '/for-owners': 'For Owners',
  '/insurance-agreement': 'Insurance Agreement',
  '/browse-rent': 'Browse / Rent',
  '/browse-rent/all-categories': 'All Categories',
  '/browse-rent/all-categories/film-video': 'Film & Video',
  '/browse-rent/all-categories/streaming-audio': 'Streaming & Audio',
  '/browse-rent/all-categories/photography': 'Photography',
  '/browse-rent/all-categories/theater': 'Theater',
  '/browse-rent/all-categories/art-creative-tools': 'Art / Creative Tools',
  '/recommendations': 'Recommendations',
}

const CATEGORY_SLUG_TO_LABEL = {
  'all-categories': 'All Categories',
  'film-video': 'Film & Video',
  'streaming-audio': 'Streaming & Audio',
  photography: 'Photography',
  theater: 'Theater',
  'art-creative-tools': 'Art / Creative Tools',
}

const emphasizeText = (text) => {
  const parts = text.split(/(Gear)/g)

  return parts.map((part, index) =>
    part === 'Gear' ? (
      <span key={`${part}-${index}`} className="accent-word">
        {part}
      </span>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    ),
  )
}

const LISTINGS = [
  {
    id: 'sony-fx3',
    name: 'SONY FX3',
    yearsOld: 3,
    blurb: '3 year old Sony FX3, up to quality',
    quality: 'up to quality',
    pricePerDay: 90,
    category: 'film-video',
    imageSrc: '/sonyfx.png',
    tags: ['camera', 'cinema', 'video', 'low-light', 'fullframe'],
    skill: 'intermediate',
  },
  {
    id: 'np-fz100-battery',
    name: 'NP-FZ100 Battery and Three Slot Charger, 3-Pack',
    yearsOld: 1,
    blurb: '1 year old charger and battery, up to quality',
    quality: 'up to quality',
    pricePerDay: 15,
    category: 'film-video',
    imageSrc: '/np-fz100.png',
    tags: ['accessory', 'battery', 'power'],
    skill: 'beginner',
  },
  {
    id: 'elgato-4k60',
    name: 'Elgato 4K60 Pro capture card',
    yearsOld: 1,
    blurb: '1 year old Elgato 4K60, up to quality',
    quality: 'up to quality',
    pricePerDay: 30,
    category: 'streaming-audio',
    imageSrc: '/elgato.jpg',
    tags: ['streaming', 'capture', 'console', 'pc'],
    skill: 'intermediate',
  },
  {
    id: 'profoto-b10',
    name: 'Profoto B10',
    yearsOld: 1,
    blurb: '1 year old Profoto B10, up to quality',
    quality: 'up to quality',
    pricePerDay: 200,
    category: 'photography',
    imageSrc: '/profotob10.jpg',
    tags: ['lighting', 'strobe', 'portrait', 'studio'],
    skill: 'advanced',
  },
  {
    id: 'shure-sm7b',
    name: 'Shure SM7B',
    yearsOld: 0.5,
    blurb: '0.5 year old Shure audio microphone, up to quality',
    quality: 'up to quality',
    pricePerDay: 10,
    category: 'streaming-audio',
    imageSrc: '/shuresm7b.jpg',
    tags: ['microphone', 'podcast', 'broadcast', 'vocals'],
    skill: 'beginner',
  },
  {
    id: 'canon-rf24-70',
    name: 'Canon RF 24-70mm f/2.8, 70-200mm f/2.8',
    yearsOld: 1,
    blurb: '1 year old Canon RF lens kit, up to quality',
    quality: 'up to quality',
    pricePerDay: 100,
    category: 'photography',
    imageSrc: null,
    tags: ['lens', 'zoom', 'portrait', 'event'],
    skill: 'intermediate',
  },
  {
    id: 'qsc-k-speakers',
    name: 'QSC K series powered speakers',
    yearsOld: 4,
    blurb: '4 year old QSC K Series Speakers, up to quality',
    quality: 'up to quality',
    pricePerDay: 120,
    category: 'streaming-audio',
    imageSrc: null,
    tags: ['speakers', 'pa', 'live', 'event'],
    skill: 'intermediate',
  },
  {
    id: 'airbrush-kit',
    name: 'Airbrush kit',
    yearsOld: 1,
    blurb: '1 year old airbrush kit, up to quality',
    quality: 'up to quality',
    pricePerDay: 25,
    category: 'art-creative-tools',
    imageSrc: null,
    tags: ['painting', 'art', 'illustration'],
    skill: 'beginner',
  },
  {
    id: 'dji-rs3-pro',
    name: 'DJI RS3 Pro Gimbal',
    yearsOld: 1,
    blurb: '1 year old DJI RS3 Pro stabilizer, up to quality',
    quality: 'up to quality',
    pricePerDay: 45,
    category: 'film-video',
    imageSrc: null,
    tags: ['gimbal', 'stabilizer', 'video', 'cinema'],
    skill: 'intermediate',
  },
  {
    id: 'aputure-600d',
    name: 'Aputure LS 600d Pro',
    yearsOld: 2,
    blurb: '2 year old 600W daylight LED, up to quality',
    quality: 'up to quality',
    pricePerDay: 75,
    category: 'film-video',
    imageSrc: null,
    tags: ['lighting', 'led', 'daylight', 'studio', 'video'],
    skill: 'advanced',
  },
  {
    id: 'rode-wireless-go',
    name: 'Rode Wireless GO II',
    yearsOld: 1,
    blurb: '1 year old wireless lavalier kit, up to quality',
    quality: 'up to quality',
    pricePerDay: 12,
    category: 'film-video',
    imageSrc: null,
    tags: ['microphone', 'wireless', 'video', 'interview'],
    skill: 'beginner',
  },
  {
    id: 'sony-a7iv',
    name: 'Sony A7 IV Mirrorless',
    yearsOld: 2,
    blurb: '2 year old Sony A7 IV body, up to quality',
    quality: 'up to quality',
    pricePerDay: 65,
    category: 'photography',
    imageSrc: null,
    tags: ['camera', 'mirrorless', 'fullframe', 'photo', 'video', 'hybrid'],
    skill: 'intermediate',
  },
  {
    id: 'godox-ad200',
    name: 'Godox AD200 Pro Strobe',
    yearsOld: 1,
    blurb: '1 year old portable 200Ws strobe, up to quality',
    quality: 'up to quality',
    pricePerDay: 30,
    category: 'photography',
    imageSrc: null,
    tags: ['lighting', 'strobe', 'portrait', 'travel'],
    skill: 'intermediate',
  },
  {
    id: 'dji-mavic-3',
    name: 'DJI Mavic 3 Pro Drone',
    yearsOld: 1,
    blurb: '1 year old DJI Mavic 3 Pro, up to quality',
    quality: 'up to quality',
    pricePerDay: 110,
    category: 'film-video',
    imageSrc: null,
    tags: ['drone', 'aerial', 'video', 'photo'],
    skill: 'advanced',
  },
  {
    id: 'gopro-hero12',
    name: 'GoPro Hero 12 Black',
    yearsOld: 1,
    blurb: '1 year old GoPro Hero 12 Black, up to quality',
    quality: 'up to quality',
    pricePerDay: 18,
    category: 'film-video',
    imageSrc: null,
    tags: ['action', 'camera', 'video', 'travel'],
    skill: 'beginner',
  },
  {
    id: 'mbox-studio',
    name: 'Avid MBOX Studio Audio Interface',
    yearsOld: 2,
    blurb: '2 year old desktop audio interface, up to quality',
    quality: 'up to quality',
    pricePerDay: 22,
    category: 'streaming-audio',
    imageSrc: null,
    tags: ['interface', 'recording', 'studio', 'podcast'],
    skill: 'intermediate',
  },
  {
    id: 'sm58-pair',
    name: 'Shure SM58 (pair)',
    yearsOld: 5,
    blurb: '5 year old SM58 vocal mics, up to quality',
    quality: 'up to quality',
    pricePerDay: 8,
    category: 'streaming-audio',
    imageSrc: null,
    tags: ['microphone', 'live', 'vocals', 'event'],
    skill: 'beginner',
  },
  {
    id: 'ableton-push3',
    name: 'Ableton Push 3 Standalone',
    yearsOld: 1,
    blurb: '1 year old Push 3 standalone, up to quality',
    quality: 'up to quality',
    pricePerDay: 35,
    category: 'streaming-audio',
    imageSrc: null,
    tags: ['production', 'controller', 'music', 'beats'],
    skill: 'intermediate',
  },
  {
    id: 'fresnel-1k',
    name: 'Mole-Richardson 1K Fresnel',
    yearsOld: 6,
    blurb: '6 year old tungsten 1K fresnel, up to quality',
    quality: 'up to quality',
    pricePerDay: 40,
    category: 'theater',
    imageSrc: null,
    tags: ['lighting', 'stage', 'tungsten', 'theater'],
    skill: 'intermediate',
  },
  {
    id: 'chauvet-intimidator',
    name: 'Chauvet Intimidator Spot 360 (pair)',
    yearsOld: 3,
    blurb: '3 year old moving head spot pair, up to quality',
    quality: 'up to quality',
    pricePerDay: 55,
    category: 'theater',
    imageSrc: null,
    tags: ['lighting', 'stage', 'movinghead', 'live', 'theater'],
    skill: 'advanced',
  },
  {
    id: 'fog-machine',
    name: 'Antari Z-1520 RGB Fog Machine',
    yearsOld: 2,
    blurb: '2 year old fog machine with DMX, up to quality',
    quality: 'up to quality',
    pricePerDay: 20,
    category: 'theater',
    imageSrc: null,
    tags: ['effects', 'stage', 'theater', 'live'],
    skill: 'beginner',
  },
  {
    id: 'wireless-shure-qlxd',
    name: 'Shure QLX-D Wireless Mic System (4-pack)',
    yearsOld: 3,
    blurb: '3 year old wireless mic kit, up to quality',
    quality: 'up to quality',
    pricePerDay: 90,
    category: 'theater',
    imageSrc: null,
    tags: ['microphone', 'wireless', 'theater', 'live'],
    skill: 'advanced',
  },
  {
    id: 'wacom-cintiq',
    name: 'Wacom Cintiq Pro 24',
    yearsOld: 2,
    blurb: '2 year old pen display, up to quality',
    quality: 'up to quality',
    pricePerDay: 40,
    category: 'art-creative-tools',
    imageSrc: null,
    tags: ['illustration', 'digital', 'tablet', 'art'],
    skill: 'intermediate',
  },
  {
    id: 'pottery-wheel',
    name: 'Shimpo VL-Whisper Pottery Wheel',
    yearsOld: 4,
    blurb: '4 year old pottery wheel, up to quality',
    quality: 'up to quality',
    pricePerDay: 28,
    category: 'art-creative-tools',
    imageSrc: null,
    tags: ['ceramics', 'pottery', 'art'],
    skill: 'beginner',
  },
  {
    id: 'silhouette-cameo',
    name: 'Silhouette Cameo 5 Cutter',
    yearsOld: 1,
    blurb: '1 year old craft cutter, up to quality',
    quality: 'up to quality',
    pricePerDay: 14,
    category: 'art-creative-tools',
    imageSrc: null,
    tags: ['craft', 'cutter', 'design'],
    skill: 'beginner',
  },
  {
    id: 'epson-p900',
    name: 'Epson SureColor P900 17" Printer',
    yearsOld: 2,
    blurb: '2 year old fine art printer, up to quality',
    quality: 'up to quality',
    pricePerDay: 50,
    category: 'art-creative-tools',
    imageSrc: null,
    tags: ['printer', 'photo', 'art', 'fineart'],
    skill: 'advanced',
  },
  {
    id: 'fuji-xt5',
    name: 'Fujifilm X-T5 + 16-55 f/2.8',
    yearsOld: 1,
    blurb: '1 year old X-T5 with zoom, up to quality',
    quality: 'up to quality',
    pricePerDay: 55,
    category: 'photography',
    imageSrc: null,
    tags: ['camera', 'mirrorless', 'aps-c', 'street', 'travel'],
    skill: 'intermediate',
  },
  {
    id: 'manfrotto-tripod',
    name: 'Manfrotto 504X + 645 Fast Tripod',
    yearsOld: 2,
    blurb: '2 year old fluid head tripod, up to quality',
    quality: 'up to quality',
    pricePerDay: 18,
    category: 'film-video',
    imageSrc: null,
    tags: ['tripod', 'support', 'video'],
    skill: 'beginner',
  },
]

function formatYearsOld(value) {
  if (value === 0) return '0 years old'
  if (Number.isInteger(value)) return `${value} year${value === 1 ? '' : 's'} old`
  return `${value} year old`
}

function MarketplacePage({ heading, category }) {
  const filtered =
    category === 'all-categories' ? LISTINGS : LISTINGS.filter((l) => l.category === category)

  return (
    <div className="market-page">
      <div className="market-heading">
        <h1 className="market-h1">{heading}</h1>
      </div>

      <div className="market-grid">
        {filtered.map((item) => (
          <article key={item.id} className="listing-card">
            {item.imageSrc ? (
              <img className="listing-image" src={item.imageSrc} alt={item.name} />
            ) : (
              <div className="listing-image listing-image--placeholder" aria-hidden="true">
                {item.name.split(' ')[0]}
              </div>
            )}
            <h2 className="listing-title">{item.name}</h2>
            <p className="listing-blurb">{item.blurb}</p>
            <div className="listing-footer">
              <div className="listing-price">
                ${item.pricePerDay}
                <span className="per-day"> Per day</span>
              </div>
              <button type="button" className="rent-btn">
                Rent
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function ApplicationPage({ title, intro, fields }) {
  return (
    <section className="application-page">
      <div className="application-copy">
        <h1 className="application-title">{title}</h1>
        <p className="application-intro">{intro}</p>
      </div>

      <form className="application-form">
        {fields.map((field) => (
          <label key={field.name} className="form-field">
            <span>{field.label}</span>
            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                rows={5}
                placeholder={field.placeholder}
                className="form-input form-textarea"
              />
            ) : (
              <input
                type={field.type || 'text'}
                name={field.name}
                placeholder={field.placeholder}
                className="form-input"
              />
            )}
          </label>
        ))}

        <button type="submit" className="application-submit">
          Submit Application
        </button>
      </form>
    </section>
  )
}

const FEATURED_IDS = ['sony-fx3', 'profoto-b10', 'shure-sm7b', 'dji-mavic-3']

const TESTIMONIALS = [
  {
    quote: 'Rented a Sony FX3 for a weekend shoot for less than half what the rental house quoted. Owner was a film student two blocks away.',
    name: 'Maya R.',
    role: 'Director, USC SCA',
  },
  {
    quote: 'My lighting kit pays for itself now. I list it when I\'m not on set and the bookings cover my own rentals.',
    name: 'Daniel K.',
    role: 'DP & Owner',
  },
  {
    quote: 'The recommendation quiz nailed exactly the mic + interface combo I needed for my podcast pilot.',
    name: 'Priya S.',
    role: 'Podcaster',
  },
]

function LandingPage() {
  const posthog = usePostHog()
  const categories = [
    { label: 'Film & Video', to: '/browse-rent/all-categories/film-video' },
    { label: 'Streaming & Audio', to: '/browse-rent/all-categories/streaming-audio' },
    { label: 'Photography', to: '/browse-rent/all-categories/photography' },
    { label: 'Theater', to: '/browse-rent/all-categories/theater' },
    { label: 'Art / Creative Tools', to: '/browse-rent/all-categories/art-creative-tools' },
  ]

  const featured = FEATURED_IDS
    .map((id) => LISTINGS.find((l) => l.id === id))
    .filter(Boolean)

  const handleCta = (label) => () => {
    posthog?.capture('landing_cta_clicked', { cta: label })
  }

  return (
    <div className="landing-page">
      <div className="landing-hero">
        <h1 className="landing-headline">{emphasizeText('Rent the Gear You Need. List the Gear You Have.')}</h1>
        <p className="landing-description">
          {emphasizeText(
            'GearShare is a peer-to-peer marketplace where creators, artists, and professionals rent and share equipment directly with each other. No middlemen, no overpriced rental houses. Just the right gear, at the right price, from real people in your community.',
          )}
        </p>

        <div className="landing-ctas">
          <NavLink to="/browse-rent" className="cta primary" onClick={handleCta('browse')}>
            Browse / Rent
          </NavLink>
          <NavLink to="/recommendations" className="cta primary" onClick={handleCta('recommendations')}>
            Find My Match
          </NavLink>
          <NavLink to="/for-renters" className="cta secondary" onClick={handleCta('apply-renter')}>
            Apply as Renter
          </NavLink>
          <NavLink to="/for-owners" className="cta secondary" onClick={handleCta('apply-owner')}>
            Apply as Owner
          </NavLink>
        </div>
      </div>

      <section className="landing-stats">
        <div className="stat">
          <div className="stat-value">{LISTINGS.length}+</div>
          <div className="stat-label">items live</div>
        </div>
        <div className="stat">
          <div className="stat-value">5</div>
          <div className="stat-label">creator categories</div>
        </div>
        <div className="stat">
          <div className="stat-value">5%</div>
          <div className="stat-label">platform fee</div>
        </div>
        <div className="stat">
          <div className="stat-value">48h</div>
          <div className="stat-label">claims window</div>
        </div>
      </section>

      <section className="landing-section">
        <h2 className="landing-section-title">How GearShare Works</h2>
        <div className="landing-steps">
          <div className="step">
            <h3 className="step-title">1. Owners list gear</h3>
            <p className="step-text">Set your own rates, availability, and rules. We handle payments and protection.</p>
          </div>
          <div className="step">
            <h3 className="step-title">2. Renters book</h3>
            <p className="step-text">Browse options, request your dates, and pay through the platform.</p>
          </div>
          <div className="step">
            <h3 className="step-title">3. Gear gets delivered</h3>
            <p className="step-text">GearShare coordinates pickup or shipping and keeps both sides covered.</p>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="section-head">
          <h2 className="landing-section-title">Featured Gear</h2>
          <NavLink to="/browse-rent" className="section-link">
            See all →
          </NavLink>
        </div>
        <div className="featured-grid">
          {featured.map((item) => (
            <article key={item.id} className="listing-card listing-card--compact">
              {item.imageSrc ? (
                <img className="listing-image" src={item.imageSrc} alt={item.name} />
              ) : (
                <div className="listing-image listing-image--placeholder" aria-hidden="true">
                  {item.name.split(' ')[0]}
                </div>
              )}
              <h3 className="listing-title">{item.name}</h3>
              <div className="listing-footer">
                <div className="listing-price">
                  ${item.pricePerDay}
                  <span className="per-day"> Per day</span>
                </div>
                <NavLink to="/browse-rent" className="rent-btn rent-btn--link">
                  View
                </NavLink>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-cta-band">
        <div className="cta-band-text">
          <h2 className="cta-band-title">Not sure what you need?</h2>
          <p className="cta-band-sub">
            Answer five quick questions and we'll rank gear from the marketplace by fit, skill, and budget.
          </p>
        </div>
        <NavLink to="/recommendations" className="cta primary" onClick={handleCta('cta-band-recommendations')}>
          Try the Match Quiz
        </NavLink>
      </section>

      <section className="landing-section">
        <h2 className="landing-section-title">Browse by Category</h2>
        <div className="landing-categories">
          {categories.map((c) => (
            <NavLink key={c.to} to={c.to} className="category-pill">
              {c.label}
            </NavLink>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <h2 className="landing-section-title">Covered, End to End</h2>
        <div className="trust-grid">
          <div className="trust-card">
            <h3 className="trust-title">Damage Protection</h3>
            <p className="trust-text">
              Every booking can include accidental damage coverage at checkout — flat 8% of the rental subtotal.
            </p>
          </div>
          <div className="trust-card">
            <h3 className="trust-title">Verified Members</h3>
            <p className="trust-text">
              Renters and owners apply with ID and school or studio affiliation before their first transaction.
            </p>
          </div>
          <div className="trust-card">
            <h3 className="trust-title">Fast Claims</h3>
            <p className="trust-text">
              File within 48 hours from your dashboard. Most claims resolve in under five business days.
            </p>
          </div>
        </div>
        <NavLink to="/insurance-agreement" className="section-link section-link--cta">
          Read the full insurance agreement →
        </NavLink>
      </section>

      <section className="landing-section">
        <h2 className="landing-section-title">From the Community</h2>
        <div className="testimonials">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="testimonial">
              <blockquote className="testimonial-quote">"{t.quote}"</blockquote>
              <figcaption className="testimonial-attr">
                <span className="testimonial-name">{t.name}</span>
                <span className="testimonial-role">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="landing-final">
        <h2 className="landing-final-title">{emphasizeText('Your next shoot starts here.')}</h2>
        <div className="landing-ctas">
          <NavLink to="/browse-rent" className="cta primary" onClick={handleCta('final-browse')}>
            Browse the Marketplace
          </NavLink>
          <NavLink to="/for-owners" className="cta secondary" onClick={handleCta('final-list')}>
            List Your Gear
          </NavLink>
        </div>
      </section>
    </div>
  )
}

const PROJECT_TYPES = [
  { value: 'indie-film', label: 'Indie film / short film', tagBoost: ['camera', 'cinema', 'video', 'gimbal', 'lighting', 'tripod'] },
  { value: 'event-coverage', label: 'Wedding / event coverage', tagBoost: ['camera', 'lens', 'event', 'lighting', 'wireless'] },
  { value: 'podcast', label: 'Podcast / interview', tagBoost: ['microphone', 'podcast', 'interface', 'broadcast'] },
  { value: 'live-music', label: 'Live music / concert', tagBoost: ['speakers', 'microphone', 'live', 'pa', 'stage'] },
  { value: 'streaming', label: 'Streaming / content creation', tagBoost: ['streaming', 'capture', 'microphone', 'camera'] },
  { value: 'photoshoot', label: 'Studio photoshoot', tagBoost: ['camera', 'lens', 'lighting', 'strobe', 'studio', 'portrait'] },
  { value: 'theater', label: 'Theater production', tagBoost: ['stage', 'theater', 'lighting', 'wireless', 'effects'] },
  { value: 'art-project', label: 'Art / illustration project', tagBoost: ['art', 'illustration', 'digital', 'painting', 'craft', 'fineart'] },
]

const PROJECT_TYPE_TO_CATEGORY = {
  'indie-film': 'film-video',
  'event-coverage': 'photography',
  podcast: 'streaming-audio',
  'live-music': 'streaming-audio',
  streaming: 'streaming-audio',
  photoshoot: 'photography',
  theater: 'theater',
  'art-project': 'art-creative-tools',
}

function scoreListing(listing, prefs) {
  let score = 0
  const reasons = []

  const preferredCategory = prefs.category || PROJECT_TYPE_TO_CATEGORY[prefs.projectType]
  if (preferredCategory && listing.category === preferredCategory) {
    score += 6
    reasons.push('matches your category')
  }

  const projectType = PROJECT_TYPES.find((p) => p.value === prefs.projectType)
  if (projectType) {
    const tagMatches = listing.tags?.filter((t) => projectType.tagBoost.includes(t)) ?? []
    if (tagMatches.length > 0) {
      score += tagMatches.length * 2
      reasons.push(`fits ${projectType.label.toLowerCase()}`)
    }
  }

  if (prefs.skill && listing.skill === prefs.skill) {
    score += 3
    reasons.push(`matched to ${prefs.skill} level`)
  } else if (prefs.skill === 'beginner' && listing.skill === 'advanced') {
    score -= 2
  }

  if (prefs.budget) {
    const budget = Number(prefs.budget)
    if (listing.pricePerDay <= budget) {
      score += 2
      const slack = budget - listing.pricePerDay
      if (slack < budget * 0.25) {
        score += 1
        reasons.push('great value at your budget')
      } else {
        reasons.push('within your budget')
      }
    } else {
      const overshoot = (listing.pricePerDay - budget) / budget
      score -= Math.min(8, Math.round(overshoot * 6))
    }
  }

  if (prefs.keyword) {
    const k = prefs.keyword.toLowerCase().trim()
    if (k && (listing.name.toLowerCase().includes(k) || listing.tags?.some((t) => t.includes(k)))) {
      score += 4
      reasons.push(`matches "${prefs.keyword}"`)
    }
  }

  return { score, reasons }
}

function RecommendationsPage() {
  const posthog = usePostHog()
  const [prefs, setPrefs] = useState({
    projectType: '',
    category: '',
    skill: '',
    budget: '',
    keyword: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const recommendations = useMemo(() => {
    if (!submitted) return []
    return LISTINGS.map((listing) => ({ listing, ...scoreListing(listing, prefs) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
  }, [submitted, prefs])

  const updatePref = (key, value) => {
    setPrefs((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
    posthog?.capture('recommendation_submitted', {
      project_type: prefs.projectType,
      category: prefs.category,
      skill: prefs.skill,
      budget: prefs.budget ? Number(prefs.budget) : null,
      has_keyword: Boolean(prefs.keyword?.trim()),
    })
  }

  const handleReset = () => {
    setPrefs({ projectType: '', category: '', skill: '', budget: '', keyword: '' })
    setSubmitted(false)
  }

  return (
    <section className="recommend-page">
      <div className="recommend-copy">
        <h1 className="recommend-title">Find Your Gear Match</h1>
        <p className="recommend-intro">
          Tell us about your project and we'll rank gear from the marketplace based on fit, skill level, and budget.
        </p>
      </div>

      <form className="recommend-form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>What are you working on?</span>
          <select
            className="form-input"
            value={prefs.projectType}
            onChange={(e) => updatePref('projectType', e.target.value)}
            required
          >
            <option value="">Select a project type</option>
            {PROJECT_TYPES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <span>Preferred category (optional)</span>
          <select
            className="form-input"
            value={prefs.category}
            onChange={(e) => updatePref('category', e.target.value)}
          >
            <option value="">Any — pick the best fit</option>
            <option value="film-video">Film &amp; Video</option>
            <option value="streaming-audio">Streaming &amp; Audio</option>
            <option value="photography">Photography</option>
            <option value="theater">Theater</option>
            <option value="art-creative-tools">Art / Creative Tools</option>
          </select>
        </label>

        <label className="form-field">
          <span>Your experience level</span>
          <div className="skill-toggles">
            {['beginner', 'intermediate', 'advanced'].map((level) => (
              <button
                key={level}
                type="button"
                className={prefs.skill === level ? 'skill-pill active' : 'skill-pill'}
                onClick={() => updatePref('skill', prefs.skill === level ? '' : level)}
              >
                {level[0].toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </label>

        <label className="form-field">
          <span>Daily budget (USD)</span>
          <input
            type="number"
            min="0"
            step="5"
            className="form-input"
            placeholder="e.g. 75"
            value={prefs.budget}
            onChange={(e) => updatePref('budget', e.target.value)}
          />
        </label>

        <label className="form-field">
          <span>Specific gear or keyword (optional)</span>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. camera, mic, lighting"
            value={prefs.keyword}
            onChange={(e) => updatePref('keyword', e.target.value)}
          />
        </label>

        <div className="recommend-actions">
          <button type="submit" className="application-submit">
            Get Recommendations
          </button>
          {submitted ? (
            <button type="button" className="recommend-reset" onClick={handleReset}>
              Start over
            </button>
          ) : null}
        </div>
      </form>

      {submitted ? (
        <section className="recommend-results">
          <h2 className="recommend-results-title">
            {recommendations.length > 0
              ? `Top ${recommendations.length} matches for you`
              : 'No strong matches — try widening your filters'}
          </h2>
          <div className="market-grid">
            {recommendations.map(({ listing, score, reasons }, idx) => (
              <article key={listing.id} className="listing-card">
                <div className="recommend-rank">#{idx + 1} · score {score}</div>
                {listing.imageSrc ? (
                  <img className="listing-image" src={listing.imageSrc} alt={listing.name} />
                ) : (
                  <div className="listing-image listing-image--placeholder" aria-hidden="true">
                    {listing.name.split(' ')[0]}
                  </div>
                )}
                <h2 className="listing-title">{listing.name}</h2>
                <p className="listing-blurb">{listing.blurb}</p>
                {reasons.length > 0 ? (
                  <ul className="recommend-reasons">
                    {reasons.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                ) : null}
                <div className="listing-footer">
                  <div className="listing-price">
                    ${listing.pricePerDay}
                    <span className="per-day"> Per day</span>
                  </div>
                  <button type="button" className="rent-btn">
                    Rent
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  )
}

function Page({ title, subtitle, intro, sections, hideTitle = false }) {
  return (
    <article className="page">
      {!hideTitle ? <h1>{emphasizeText(title)}</h1> : null}
      {subtitle ? <p className="tagline">{emphasizeText(subtitle)}</p> : null}
      {intro ? <p className="intro">{emphasizeText(intro)}</p> : null}
      {sections?.map((section) => (
        <section key={section.heading} className="content-section">
          <h2>{emphasizeText(section.heading)}</h2>
          {section.text ? <p>{emphasizeText(section.text)}</p> : null}
          {section.items ? (
            <ul>
              {section.items.map((item) => (
                <li key={item}>{emphasizeText(item)}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </article>
  )
}

function App() {
  const location = useLocation()
  const [openMenu, setOpenMenu] = useState(null)
  const bannerTitle = BANNER_TITLES[location.pathname] ?? 'GearShare'

  useEffect(() => {
    setOpenMenu(null)
  }, [location.pathname])

  return (
    <div className="site-shell">
      <header className="top-nav">
        <p className="brand">GEARSHARE</p>
        <nav className="top-nav-links" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <div key={item.to} className="menu-item">
              <NavLink
                to={item.to}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                {item.label}
              </NavLink>
              {item.children ? (
                <button
                  type="button"
                  className="caret-button"
                  aria-label={`Open ${item.label} menu`}
                  aria-expanded={openMenu === item.to}
                  onClick={() => setOpenMenu((current) => (current === item.to ? null : item.to))}
                >
                  <span className="caret">▾</span>
                </button>
              ) : null}
              {item.children ? (
                <div className={openMenu === item.to ? 'dropdown open' : 'dropdown'}>
                  {item.children.map((subItem) => (
                    <NavLink
                      key={subItem.to}
                      to={subItem.to}
                      className={({ isActive }) =>
                        isActive ? 'dropdown-link active-dropdown-link' : 'dropdown-link'
                      }
                    >
                      {subItem.label}
                    </NavLink>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
      </header>
      <div className="banner-wrap">
        <img className="page-banner" src="/banner.png" alt="GearShare banner" />
        <h1 className="banner-title">{bannerTitle}</h1>
      </div>

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={<LandingPage />}
          />
          <Route
            path="/how-gearshare-works"
            element={
              <Page
                title="How GearShare Works"
                subtitle="Rent the Gear You Need. List the Gear You Have."
                intro="GearShare is a peer-to-peer marketplace where creators, artists, and professionals rent and share equipment directly with each other."
                sections={[
                  {
                    heading: 'How It Works',
                    text: 'Owners list their equipment and set their own rates. Renters browse, book, and pick up. GearShare handles the transaction, the protection, and everything in between. A small 5% fee on each completed rental keeps the platform running.',
                  },
                  {
                    heading: 'Every Rental Covered',
                    text: 'Every rental on GearShare comes with optional damage protection and insurance at checkout, so both owners and renters have a safety net.',
                  },
                  {
                    heading: 'Built for Creators',
                    text: 'GearShare is designed for photographers, filmmakers, musicians, theater makers, streamers, and artists of every kind.',
                  },
                ]}
              />
            }
          />
          <Route
            path="/for-renters"
            element={
              <ApplicationPage
                title="Renter Application"
                intro="Fill out this short application to request access to rent equipment on GearShare."
                fields={[
                  { name: 'fullName', label: 'Full Name', placeholder: 'Enter your full name' },
                  {
                    name: 'email',
                    label: 'Email Address',
                    type: 'email',
                    placeholder: 'Enter your email',
                  },
                  {
                    name: 'phone',
                    label: 'Phone Number',
                    type: 'tel',
                    placeholder: 'Enter your phone number',
                  },
                  {
                    name: 'schoolOrOrganization',
                    label: 'School / Organization',
                    placeholder: 'USC, studio, club, etc.',
                  },
                  {
                    name: 'gearNeeds',
                    label: 'What gear are you looking to rent?',
                    type: 'textarea',
                    placeholder: 'Tell us what types of gear you need and how you plan to use it.',
                  },
                ]}
              />
            }
          />
          <Route
            path="/for-renters/my-rentals"
            element={<Navigate to="/for-renters" replace />}
          />
          <Route
            path="/for-owners"
            element={
              <ApplicationPage
                title="Owner Application"
                intro="Fill out this application to start listing your equipment on GearShare."
                fields={[
                  { name: 'fullName', label: 'Full Name', placeholder: 'Enter your full name' },
                  {
                    name: 'email',
                    label: 'Email Address',
                    type: 'email',
                    placeholder: 'Enter your email',
                  },
                  {
                    name: 'phone',
                    label: 'Phone Number',
                    type: 'tel',
                    placeholder: 'Enter your phone number',
                  },
                  {
                    name: 'gearTypes',
                    label: 'What gear do you want to list?',
                    type: 'textarea',
                    placeholder: 'List the equipment you want to share on GearShare.',
                  },
                  {
                    name: 'availability',
                    label: 'Typical Availability',
                    placeholder: 'Weekdays, weekends, flexible, etc.',
                  },
                ]}
              />
            }
          />
          <Route
            path="/for-owners/rental-requests"
            element={<Navigate to="/for-owners" replace />}
          />
          <Route
            path="/insurance-agreement"
            element={
              <Page
                title="Insurance Agreement"
                subtitle="Coverage you can count on."
                intro="Every rental on GearShare is backed by an optional damage protection plan. Read the agreement below before booking or listing."
                sections={[
                  {
                    heading: 'Who Is Covered',
                    text: 'Both renters and owners are covered. Owners receive payout for accidental damage; renters are protected from liability beyond the agreed deductible.',
                  },
                  {
                    heading: 'What Is Covered',
                    items: [
                      'Accidental damage during the rental window',
                      'Theft with a filed police report',
                      'Loss in transit when GearShare-coordinated shipping is used',
                    ],
                  },
                  {
                    heading: 'What Is Not Covered',
                    items: [
                      'Intentional damage or misuse',
                      'Cosmetic wear that does not affect function',
                      'Use outside the listing\'s stated purpose',
                    ],
                  },
                  {
                    heading: 'Deductibles & Claims',
                    text: 'Standard deductible is $75 per claim. File within 48 hours of the incident through your rental dashboard. GearShare typically resolves claims within 5 business days.',
                  },
                  {
                    heading: 'Opting In',
                    text: 'Insurance is added at checkout for a flat 8% of the rental subtotal. Owners can require insurance on individual listings.',
                  },
                ]}
              />
            }
          />
          <Route
            path="/for-owners/insurance-agreement"
            element={<Navigate to="/insurance-agreement" replace />}
          />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route
            path="/browse-rent"
            element={
              <MarketplacePage heading="All Categories" category="all-categories" />
            }
          />
          <Route
            path="/browse-rent/all-categories"
            element={
              <MarketplacePage heading="All Categories" category="all-categories" />
            }
          />
          <Route
            path="/browse-rent/all-categories/film-video"
            element={
              <MarketplacePage heading={CATEGORY_SLUG_TO_LABEL['film-video']} category="film-video" />
            }
          />
          <Route
            path="/browse-rent/all-categories/streaming-audio"
            element={
              <MarketplacePage
                heading={CATEGORY_SLUG_TO_LABEL['streaming-audio']}
                category="streaming-audio"
              />
            }
          />
          <Route
            path="/browse-rent/all-categories/photography"
            element={
              <MarketplacePage heading={CATEGORY_SLUG_TO_LABEL.photography} category="photography" />
            }
          />
          <Route
            path="/browse-rent/all-categories/theater"
            element={
              <MarketplacePage heading={CATEGORY_SLUG_TO_LABEL.theater} category="theater" />
            }
          />
          <Route
            path="/browse-rent/all-categories/art-creative-tools"
            element={
              <MarketplacePage
                heading={CATEGORY_SLUG_TO_LABEL['art-creative-tools']}
                category="art-creative-tools"
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <div>© {new Date().getFullYear()} GearShare · Built for creators</div>
        <div className="footer-links">
          <NavLink to="/how-gearshare-works">How It Works</NavLink>
          <NavLink to="/insurance-agreement">Insurance</NavLink>
          <NavLink to="/recommendations">Match Quiz</NavLink>
          <NavLink to="/browse-rent">Marketplace</NavLink>
        </div>
      </footer>
    </div>
  )
}

export default App
