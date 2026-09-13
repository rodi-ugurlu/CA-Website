import { useEffect, useMemo, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react'
import './App.css'

const SITE = {
  name: 'Yavuz Oto Kurtarma',
  shortName: 'YAVUZ',
  phoneDisplay: '+90 553 550 41 47',
  phoneHref: 'tel:+905535504147',
  whatsappNumber: '905535504147',
  location: 'Yenişehir, Mersin',
  address: 'Cumhuriyet Mahallesi, 1661. Sokak No: 26 Kat: 2/3, Yenişehir/Mersin',
  mapQuery: 'Cumhuriyet Mahallesi 1661 Sokak No 26 Yenişehir Mersin',
}

const imageModules = import.meta.glob('../images/*.jpeg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const images = Object.entries(imageModules)
  .sort(([pathA], [pathB]) => pathA.localeCompare(pathB, 'tr', { numeric: true }))
  .map(([, url]) => url)

const heroImage = Object.entries(imageModules).find(([path]) =>
  path.endsWith('WhatsApp Image 2026-09-13 at 01.48.44 (1).jpeg'),
)?.[1] ?? images[0]

type IconProps = { children: ReactNode; size?: number; className?: string }

function Icon({ children, size = 20, className = '' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

const PhoneIcon = ({ size }: { size?: number }) => (
  <Icon size={size}><path d="M22 16.9v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.45 19.45 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.56 2.81.69A2 2 0 0 1 22 16.9Z" /></Icon>
)

const WhatsAppIcon = ({ size }: { size?: number }) => (
  <Icon size={size}>
    <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.56L3 21l1.88-5.46A8.5 8.5 0 1 1 21 11.5Z" />
    <path d="M8.1 7.6c.2-.45.42-.46.72-.47h.4c.15 0 .36.05.46.31l.9 2.08c.08.22.02.4-.1.58l-.53.66c-.14.16-.25.3-.1.57.43.75 1.04 1.4 1.78 1.9.65.44 1.2.69 1.56.82.25.1.42.05.58-.13l.82-.96c.18-.2.35-.16.58-.08l1.92.9c.25.12.42.18.48.3.06.12.06.7-.16 1.36-.23.66-1.3 1.25-1.85 1.33-.47.07-1.07.1-1.73-.1-.4-.12-.9-.3-1.55-.58a11.7 11.7 0 0 1-4.65-4.1c-.3-.45-.74-1.2-.74-2.04 0-.83.43-1.64.7-1.92l.5-.44Z" />
  </Icon>
)

const ArrowIcon = () => <Icon size={18}><path d="m5 12 14 0M13 6l6 6-6 6" /></Icon>
const PinIcon = ({ size }: { size?: number }) => <Icon size={size}><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></Icon>
const CheckIcon = () => <Icon size={18}><path d="m5 12 4 4L19 6" /></Icon>
const ClockIcon = () => <Icon size={22}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Icon>

function App() {
  const [showAll, setShowAll] = useState(false)
  const [activeImage, setActiveImage] = useState<number | null>(null)
  const [showMobileContact, setShowMobileContact] = useState(false)
  const [isLocating, setIsLocating] = useState(false)

  const whatsappHref = useMemo(() => {
    if (!SITE.whatsappNumber) return '#contact'
    const message = encodeURIComponent(`Merhaba ${SITE.name}, yol yardım hizmeti almak istiyorum. Konumumu WhatsApp üzerinden paylaşacağım.`)
    return `https://wa.me/${SITE.whatsappNumber}?text=${message}`
  }, [])

  const phoneHref = SITE.phoneHref
  const visibleImages = showAll ? images : images.slice(0, 6)

  const handleLocationShare = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (!navigator.geolocation || isLocating) return

    event.preventDefault()
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const latitude = coords.latitude.toFixed(6)
        const longitude = coords.longitude.toFixed(6)
        const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`
        const message = encodeURIComponent(
          `Merhaba ${SITE.name}, yol yardım hizmeti almak istiyorum.\n\nKonumum: ${locationUrl}`,
        )
        window.location.assign(`https://wa.me/${SITE.whatsappNumber}?text=${message}`)
      },
      () => {
        setIsLocating(false)
        window.location.assign(whatsappHref)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }

  useEffect(() => {
    if (activeImage === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveImage(null)
      if (event.key === 'ArrowRight') setActiveImage((current) => current === null ? null : (current + 1) % images.length)
      if (event.key === 'ArrowLeft') setActiveImage((current) => current === null ? null : (current - 1 + images.length) % images.length)
    }

    document.body.classList.add('modal-open')
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeImage])

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>('.hero-section')
    if (!hero) return

    const updateMobileContact = () => {
      setShowMobileContact(window.scrollY > hero.offsetHeight - 120)
    }

    updateMobileContact()
    window.addEventListener('scroll', updateMobileContact, { passive: true })
    window.addEventListener('resize', updateMobileContact)
    return () => {
      window.removeEventListener('scroll', updateMobileContact)
      window.removeEventListener('resize', updateMobileContact)
    }
  }, [])

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label={`${SITE.name} ana sayfa`}>
          <span className="brand-mark">Y</span>
          <span className="brand-copy"><strong>{SITE.shortName}</strong><small>OTO KURTARMA</small></span>
        </a>
        <nav className="desktop-nav" aria-label="Ana menü">
          <a href="#services">Hizmetler</a><a href="#work">Çalışmalar</a><a href="#location">Konum</a>
        </nav>
        <a className="top-call" href={phoneHref}><PhoneIcon size={18} /><span>Hemen Ara</span></a>
      </header>

      <main id="top">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-photo-wrap">
            <img className="hero-photo" src={heroImage} alt="Gece göreve hazır Yavuz Oto Kurtarma çekicisi" fetchPriority="high" />
            <div className="hero-overlay" /><div className="hero-grid" />
          </div>
          <div className="hero-content page-width">
            <div className="hero-copy">
              <p className="eyebrow">TÜRKİYE GENELİ 7/24 HİZMET</p>
              <h1 id="hero-title">Yolda kaldığında<span>yanındayız.</span></h1>
              <p className="hero-description">Aracınızı bulunduğu noktadan güvenle alıyor, istediğiniz adrese hızlıca ulaştırıyoruz.</p>
              <div className="hero-actions">
                <a className="button button-primary" href={whatsappHref} onClick={handleLocationShare} aria-busy={isLocating}><WhatsAppIcon size={21} />{isLocating ? 'Konum alınıyor…' : "WhatsApp'tan konum gönder"}<ArrowIcon /></a>
                <a className="button button-ghost" href={phoneHref}><PhoneIcon size={20} />Hemen ara</a>
              </div>
            </div>
          </div>
          <div className="hero-foot page-width" aria-label="Hizmet özellikleri">
            <span><CheckIcon /> Hızlı iletişim</span><span><CheckIcon /> Güvenli taşıma</span><span><CheckIcon /> 81 ile hizmet</span>
          </div>
        </section>

        <section className="services section page-width" id="services">
          <div className="section-heading">
            <div><p className="eyebrow">İHTİYACINIZ OLDUĞU ANDA</p><h2>Yolun her anında<br />güvenilir destek.</h2></div>
            <p>Arızadan kazaya, şehir içinden Türkiye'nin diğer ucuna kadar aracınız emin ellerde.</p>
          </div>
          <div className="service-grid">
            <article className="service-card featured-service">
              <div className="service-number">01</div>
              <div className="service-icon" aria-hidden="true"><Icon size={34}><path d="M3 17h12l3-6h3v6M5 17l2-7h7l3 7" /><circle cx="7" cy="18" r="2" /><circle cx="19" cy="18" r="2" /><path d="M9 10V7h5l4 4" /></Icon></div>
              <h3>Oto Kurtarma</h3><p>Kazalı veya hareket edemeyen aracınızı güvenle taşıyoruz.</p>
            </article>
            <article className="service-card">
              <div className="service-number">02</div>
              <div className="service-icon" aria-hidden="true"><Icon size={31}><path d="M14.7 6.3a4 4 0 0 0-5-5L7.8 3.2l3 3-4.6 4.6-3-3-1.9 1.9a4 4 0 0 0 5 5l7.5 7.5a2 2 0 0 0 2.8-2.8l-7.5-7.5" /><path d="m16 8 4-4M18 2l4 4" /></Icon></div>
              <h3>Yol Yardım</h3><p>Beklenmedik arızalarda bulunduğunuz noktaya hızlı destek.</p>
            </article>
            <article className="service-card">
              <div className="service-number">03</div>
              <div className="service-icon" aria-hidden="true"><Icon size={31}><path d="M3 16h18M5 16V9l3-4h8l3 4v7" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /><path d="M8 9h8" /></Icon></div>
              <h3>Araç Nakliyesi</h3><p>Türkiye'nin 81 iline profesyonel araç transferi.</p>
            </article>
          </div>
        </section>

        <section className="work-section section" id="work">
          <div className="page-width">
            <div className="section-heading work-heading">
              <div><p className="eyebrow">ÇALIŞMALARIMIZ</p><h2>Özenle taşıdığımız<br />araçlardan kareler.</h2></div>
              <p>Farklı araçlarla tamamladığımız taşımalardan gerçek görüntüler.</p>
            </div>
            <div className="gallery-grid">
              {visibleImages.map((image, index) => (
                <button className={`gallery-item gallery-item-${index + 1}`} type="button" key={image} onClick={() => setActiveImage(index)} aria-label={`${index + 1}. çalışmayı büyüt`}>
                  <img src={image} alt={`Yavuz Oto Kurtarma saha çalışması ${index + 1}`} loading="lazy" />
                  <span className="gallery-zoom">+</span><span className="gallery-label">ÇALIŞMA #{String(index + 1).padStart(2, '0')}</span>
                </button>
              ))}
            </div>
            {!showAll && images.length > 6 && <button className="show-more" type="button" onClick={() => setShowAll(true)}>Tüm çalışmaları gör <span>{images.length}</span></button>}
          </div>
        </section>

        <section className="process-section section page-width" aria-label="Nasıl çalışır">
          <div className="process-intro"><p className="eyebrow">3 KOLAY ADIM</p><h2>Yardım almak<br />bu kadar kolay.</h2></div>
          <ol className="process-list">
            <li><span>01</span><div><strong>Bize ulaşın</strong><p>Arayın veya WhatsApp'tan yazın.</p></div></li>
            <li><span>02</span><div><strong>Konum gönderin</strong><p>Bulunduğunuz noktayı paylaşın.</p></div></li>
            <li><span>03</span><div><strong>Hemen yola çıkalım</strong><p>En kısa sürede yanınıza gelelim.</p></div></li>
          </ol>
        </section>

        <section className="location-section" id="location">
          <div className="map-wrap">
            <iframe title={`${SITE.location} harita konumu`} src={`https://www.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            <div className="map-shade" />
          </div>
          <div className="location-content page-width">
            <div className="location-card">
              <div className="pin-box"><PinIcon size={24} /></div>
              <p className="eyebrow">HİZMET NOKTAMIZ</p><h2>{SITE.location}</h2>
              <p className="location-address">{SITE.address}</p>
              <p className="location-note">Buradan Türkiye'nin 81 iline hizmet veriyoruz.</p>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapQuery)}`} target="_blank" rel="noreferrer">Haritada görüntüle <ArrowIcon /></a>
            </div>
          </div>
        </section>

        <section className="contact-section section" id="contact">
          <div className="contact-glow" />
          <div className="page-width contact-inner">
            <div><p className="eyebrow">7/24 BİZE ULAŞIN</p><h2>Yolda kalmayın.<br /><span>Biz geliyoruz.</span></h2></div>
            <div className="contact-actions">
              <a className="contact-line" href={phoneHref}><span className="contact-icon"><PhoneIcon size={23} /></span><span><small>TELEFON</small><strong>{SITE.phoneDisplay}</strong></span><ArrowIcon /></a>
              <a className="contact-line" href={whatsappHref} onClick={handleLocationShare} aria-busy={isLocating}><span className="contact-icon whatsapp"><WhatsAppIcon size={23} /></span><span><small>WHATSAPP</small><strong>{isLocating ? 'Konum alınıyor…' : 'Konumunu gönder'}</strong></span><ArrowIcon /></a>
              <div className="always-open"><ClockIcon /> Haftanın 7 günü, 24 saat hizmetinizdeyiz.</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="page-width footer-inner">
          <a className="brand footer-brand" href="#top"><span className="brand-mark">Y</span><span className="brand-copy"><strong>{SITE.shortName}</strong><small>OTO KURTARMA</small></span></a>
          <p>© {new Date().getFullYear()} {SITE.name}. Tüm hakları saklıdır.</p>
        </div>
      </footer>

      <div className={`mobile-contact-bar${showMobileContact ? ' is-visible' : ''}`} aria-label="Hızlı iletişim">
        <a href={phoneHref}><PhoneIcon size={20} /> Hemen Ara</a><a href={whatsappHref} target="_blank" rel="noreferrer"><WhatsAppIcon size={20} /> WhatsApp</a>
      </div>

      {activeImage !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Çalışma görseli">
          <button className="lightbox-close" type="button" onClick={() => setActiveImage(null)} aria-label="Galeriyi kapat">×</button>
          <button className="lightbox-arrow lightbox-prev" type="button" onClick={() => setActiveImage((activeImage - 1 + images.length) % images.length)} aria-label="Önceki görsel">‹</button>
          <img src={images[activeImage]} alt={`Büyütülmüş saha çalışması ${activeImage + 1}`} />
          <button className="lightbox-arrow lightbox-next" type="button" onClick={() => setActiveImage((activeImage + 1) % images.length)} aria-label="Sonraki görsel">›</button>
          <span className="lightbox-count">{activeImage + 1} / {images.length}</span>
        </div>
      )}
    </div>
  )
}

export default App
