const Promotion = ()=>{
    return (
  <article className="discover-card ad-premium-container">
    {/* Clean, Unobstructed Ad Photography Background */}
    <div className="discover-card__media">
      <img
        src="https://unsplash.com"
        className="media-cover-img"
        alt="Premium Lookbook Feature"
        loading="lazy"
      />
      <div className="ad-sponsor-badge">Sponsored</div>
    </div>

    {/* Elegant Thin-Glass Content Block */}
    <div className="discover-card__overlay">
      <div className="ad-content-wrapper">
        <header className="ad-header">
          <span className="ad-tagline">Elevate Your Connection</span>
          <h2>Go Premium Lookbook</h2>
        </header>

        <p className="ad-description">
          Unlock dynamic asymmetrical profiles, exclusive lookbook badges, and zero boundary messaging. Find your perfect narrative.
        </p>

        <footer>
          <button className="btn-primary btn-ad-cta">
            Upgrade Now — 50% Off
          </button>
        </footer>
      </div>
    </div>
  </article>
);

}
export default Promotion