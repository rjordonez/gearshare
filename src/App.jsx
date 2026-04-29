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
    blurb: '3 year old sony fx3, up to quality',
    quality: 'up to quality',
    pricePerDay: 90,
    category: 'film-video',
    imageSrc: '/sonyfx.png',
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
  },
  {
    id: 'shure-sm7b',
    name: 'Shure SM7B',
    yearsOld: 0.5,
    blurb: '0.5 year old Shure audio Microphone, up to quality',
    quality: 'up to quality',
    pricePerDay: 10,
    category: 'streaming-audio',
    imageSrc: '/shuresm7b.jpg',
  },
  {
    id: 'canon-rf24-70',
    name: 'Canon RF 24-70mm f/2.8, 70-200mm f/2.8',
    yearsOld: 1,
    blurb: '1 year old Canon RF, up to quality',
    quality: 'up to quality',
    pricePerDay: 100,
    category: 'photography',
    imageSrc: null,
  },
  {
    id: 'qsc-k-speakers',
    name: 'QSC K series powered speakers',
    yearsOld: 4,
    blurb: '4 year QSC K Series Speakers, up to quality',
    quality: 'up to quality',
    pricePerDay: 120,
    category: 'streaming-audio',
    imageSrc: null,
  },
  {
    id: 'airbrush-kit',
    name: 'Airbrush kit',
    yearsOld: 1,
    blurb: '1 year old Airbrush kit, up to quality',
    quality: 'up to quality',
    pricePerDay: 25,
    category: 'art-creative-tools',
    imageSrc: null,
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

function LandingPage() {
  const categories = [
    { label: 'Film & Video', to: '/browse-rent/all-categories/film-video' },
    { label: 'Streaming & Audio', to: '/browse-rent/all-categories/streaming-audio' },
    { label: 'Photography', to: '/browse-rent/all-categories/photography' },
    { label: 'Theater', to: '/browse-rent/all-categories/theater' },
    { label: 'Art / Creative Tools', to: '/browse-rent/all-categories/art-creative-tools' },
  ]

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
          <NavLink to="/browse-rent" className="cta primary">
            Browse / Rent
          </NavLink>
          <NavLink to="/for-renters" className="cta secondary">
            Apply as Renter
          </NavLink>
          <NavLink to="/for-owners" className="cta secondary">
            Apply as Owner
          </NavLink>
        </div>
      </div>

      <section className="landing-section">
        <h2 className="landing-section-title">How GearShare Works</h2>
        <div className="landing-steps">
          <div className="step">
            <h3 className="step-title">1. Owners list gear</h3>
            <p className="step-text">Set your own rates and availability.</p>
          </div>
          <div className="step">
            <h3 className="step-title">2. Renters book</h3>
            <p className="step-text">Browse options and request your rental.</p>
          </div>
          <div className="step">
            <h3 className="step-title">3. Gear gets delivered</h3>
            <p className="step-text">GearShare coordinates the process.</p>
          </div>
        </div>
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
    </div>
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
            path="/for-owners/insurance-agreement"
            element={<Navigate to="/for-owners" replace />}
          />
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
    </div>
  )
}

export default App
