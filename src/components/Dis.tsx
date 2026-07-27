return (
  <div className="discover-page">
    <div className="discover">
      
      {/* ==========================================================================
         1. COMPONENT SEARCH FILTER HEADER
         ========================================================================== */}
      <header className="discover-header">
        <div className="header_message">
          <h2>Discover people</h2>
          <p>Meet like minded people. Real connections. Real love.</p>
        </div>

        <div className="actions">
          <form className="filter-form">
            
            <div className="input-group">
              <FiUsers size={18} className="input-icon" />
              <select 
                name="activity" 
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setActivityFilter(e.target.value)}
                value={activityFilter}
              >
                <option value="">All Activities</option>
                {ACTIVITIES_LIST.map((activity) => (
                  <option value={activity} key={activity}>{activity}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <FiMapPin size={18} className="input-icon" />
              <select 
                name="city" 
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setCityFilter(e.target.value)}
                value={cityFilter}
              >
                <option value="">All Cities</option>
                {POLISH_CITIES.map((city) => (
                  <option value={city} key={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <FiCalendar size={18} className="input-icon" />
              <select  
                name="age"  
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setAgeFilter(e.target.value)}
                value={ageFilter}     
              >
                <option value="">All Ages</option>
                <option value="18-24">18-24</option>
                <option value="25-34">25-34</option>
                <option value="35-44">35-44</option>
                <option value="45-54">45-54</option>
                <option value="54-100">54+</option>
              </select>
            </div>

            <div className="input-group">
              <FiUsers size={18} className="input-icon" />
              <select  
                name="gender"  
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setGenderFilter(e.target.value)}
                value={genderFilter}     
              >
                <option value="">All Gender</option>
                <option value="Male">Men</option>
                <option value="Female">Women</option>
                <option value="Non-binary">Non-binary</option>
              </select>
            </div>

            <button type="submit" className="submit-filter-btn">
              Apply
            </button>
          </form>
        </div>
      </header>

      {/* ==========================================================================
         2. TIMELINE CONTENT DATA LISTING (HERO DESIGN STYLE)
         ========================================================================== */}
      {posts.data.length === 0 ? (
        <div className="empty-range-container">
          <div className="empty-range-card">
            <div className="empty-icon">📍</div>
            <h2>No matches within your range</h2>
            <p>Try expanding your age, city, or activity filters to discover more people nearby.</p>
          </div>
        </div>
      ) : (
        <div className="users-listing">
          {posts.data.map((post) => {
            const isVideo = post.image?.toLowerCase().endsWith('.mp4') || 
                            post.image?.toLowerCase().endsWith('.mov') || 
                            post.image?.toLowerCase().endsWith('.webm'); 
            
            return (
              <article className="user-card" key={post.postId}>
                
                {/* Hero Media Section with Overlay Text */}
                <div className="media-wrapper" onClick={isVideo ? togglePlay : undefined}>
                  {isVideo ? (
                    <video 
                      ref={videoRef}
                      src={post.image} 
                      className="post-media" 
                      playsInline 
                      autoPlay 
                      muted={isMuted}
                      loop 
                    />
                  ) : (
                    <img src={post.image} alt="" className="post-media" />
                  )}

                  {/* Gradient Protection overlay */}
                  <div className="media-overlay" />

                  {/* Top Floating Badge: Location */}
                  <div className="floating-badge floating-badge--location">
                    <FiMapPin size={14} />
                    <span>{post.location || "Warsaw, Poland"}</span>
                  </div>

                  {/* Bottom Floating Details */}
                  <div className="hero-details">
                    <div className="user-meta-header">
                      {/* REDESIGNED PROFILE IMAGE WRAPPER */}
                      <div className="profile-image-container">
                        <img 
                          src={post.profileImage || "https://placehold.co"} 
                          alt={`${post.firstName || 'User'}'s profile`} 
                          className="profile-avatar-img"
                        />
                      </div>
                      
                      <h3 className="user-title">
                        {post.firstName || "Anna"}, {getAgeFromDateOfBirth(post.date_of_birth) || "27"}
                        <span className="online-indicator" />
                      </h3>
                    </div>

                    <div className="meta-pills">
                      {post.lookingFor && (
                        <span className="pill pill--relationship">
                          <FiHeart fill="#fff" size={14} />
                          {post.lookingFor}
                        </span>
                      )}

                      <span className="pill pill--activity">
                        <MdOutlineTravelExplore size={16} />
                        {post.type || "Travel"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quote / Bio Banner Section */}
                {post.content && (
                  <div className="quote-container">
                    <p className="story-text">
                      <span className="quote-mark">“</span>
                      {post.content}
                      <span className="quote-mark">”</span>
                    </p>
                  </div>
                )}

                {/* Footer Action Buttons */}
                <div className="card-footer">
                  <button
                    className="profile-btn"
                    onClick={() => handleViewProfileButtonClick(post.userId)}
                  >
                    <FiEye size={20} />
                    View Profile
                  </button>

                  <button
                    className={`connect-btn ${post.requestSent ? "request_sent" : ""} ${post.requestReceived ? "accept-request" : ""}`}
                    onClick={() => handleInterestedButtonClick(senderId, post.userId, post.postId, post.requestReceived)}
                    disabled={!!post.requestSent}
                  >
                    <FiHeart size={20} />
                    Let's Connect
                  </button>
                </div>

              </article>
            );
          })}
        </div>
      )}
    </div>

    {/* ==========================================================================
       3. DYNAMIC PAGINATION ACTION BAR
       ========================================================================== */}
    <div className="pagination-container">
      <Pagination currentPage={1} totalPages={30} />
    </div>
  </div>
);