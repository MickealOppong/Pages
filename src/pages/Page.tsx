import { CiMountain1 } from "react-icons/ci";
import {
  FiCoffee, FiEye, FiHeart, FiMapPin,
  FiSliders
} from "react-icons/fi";
import { MdOutlineBrush, MdOutlineFastfood, MdOutlineSportsSoccer } from "react-icons/md";
import { RiPlaneFill } from "react-icons/ri";
import "./../css/Page.css";

const Page = () => {
  const filterTabs = [
    { label: "All Activities", icon: null, active: true },
    { label: "Outdoor", icon: <CiMountain1 /> },
    { label: "Sports", icon: <MdOutlineSportsSoccer /> },
    { label: "Travel", icon: <RiPlaneFill /> },
    { label: "Food", icon: <MdOutlineFastfood /> },
    { label: "Arts & Culture", icon: <MdOutlineBrush /> },
  ];

  const matches = [
    { name: "Katarzyna", age: 28, job: "UX/UI Designer", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330", activities: ["Yoga", "Foodie", "Travel"], active: true },
    { name: "Jan", age: 37, job: "Physiotherapist", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e", activities: ["Cycling", "Hiking", "Skiing"] },
    { name: "Aneta", age: 22, job: "Architect", image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df", activities: ["Art", "Travel", "Swimming"] },
    { name: "Aleksandra", age: 29, job: "Graphic Designer", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80", activities: ["Photography", "Coffee", "Hiking"] },
    { name: "Tomek", age: 31, job: "Marketing Specialist", image: "https://unsplash.com", activities: ["Running", "Travel", "Music"] }
  ];

  const popularActivities = [
    { title: "Mountain Hiking", count: "12k+", image: "https://unsplash.com" },
    { title: "Cycling Trails", count: "8k+", image: "https://unsplash.com" },
    { title: "Surfing Group", count: "5k+", image: "https://unsplash.com" },
    { title: "Coffee Tasting", count: "15k+", image: "https://unsplash.com" }
  ];

  return (
    <section className="discover_layout">
      <div className="page">
        <div className="page-container">
          <header className="header">
            <div className="header-title">
              <h1>Discover people</h1>
              <p>Find people who enjoy<br/> the same activities as you.</p>
            </div>
            <button className="filter-panel-btn"><FiSliders /> Filters</button>
          </header>
            {/* FILTERS GO HRE */}
          <div className="filters">
            {filterTabs.map((tab, idx) => (
              <button key={idx} className={tab.active ? "active" : ""}>
                {tab.icon && <span className="tab-icon">{tab.icon}</span>}
                {tab.label}
              </button>
            ))}
          </div>
            {/* END FILTERS */}

          <div className="content">
            <div className="main-feed-column">
              {/* MAIN DISCOVERY LIST */}
              <div className="featured-card">
                <div className="featured-image">
                  <img src="https://images.unsplash.com/photo-1504593811423-6dd665756598" alt="Profile" />

                  {/* USERS SHARED ACTIVITIES */}
                  <div className="image-overlay-chips">
                    <span><CiMountain1 /> Hiking</span>
                    <span><RiPlaneFill /> Travel</span>
                    <span><FiCoffee /> Coffee</span>
                    <span className="more-count">+2</span>
                  </div>
                </div>

                <div className="featured-info">
                  <div className="title-row">
                    <h2>Mateusz, 30</h2>
                    <span className="verified-badge">✓</span>
                  </div>

                  <div className="meta">
                    <div><FiMapPin size={16} /> <span>Warsaw, Poland</span></div>
                  </div>

                    <div className="activity">
                       <h3>About this activity</h3>
                     <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum dicta aut
                    tempore praesentium ullam dolorum corporis veniam aspernatur numquam sequi vero 
                    laudantium iure, deleniti officia cumque repudiandae pariatur temporibus ac
                      </p>

                    </div>

                  <div className="btn-actions">
                    <button className="btn-close"><FiEye/>wiecej o mnie</button>
                    <button className="btn-like"><FiHeart />Make a move</button>
                  </div>
                </div>
              </div>

              {/* Lower Mid Promotion Banner */}
              <div className="adventure-banner">
                <div className="banner-text">
                  <h3>Plan your next adventure together</h3>
                  <p>Connect with people who share your passions and create unforgettable memories.</p>
                </div>
                <button className="banner-btn">Explore Activities →</button>
              </div>

            </div>
                {/** RIGHT SIDE CONTAINER */}
            <aside className="matches">
              <div className="matches-header">
                <h2>People who love what you love</h2>
                <FiHeart className="header-heart-icon" />
              </div>

              {matches.map((person) => (
                <div className={`match-card ${person.active ? 'active-match' : ''}`} key={person.name}>
                  <img src={person.image} alt={person.name} />
                  <div className="match-info">
                    <h3>{person.name}, {person.age}</h3>
                    <p>{person.job}</p>
                    <div className="chips">
                      {person.activities.map((activity) => (
                        <span key={activity}>{activity}</span>
                      ))}
                    </div>
                  </div>
                  <button className="heart-btn">
                    <FiHeart size={16} />
                  </button>
                </div>
              ))}
              <span className="view-more-matches">View more people →</span>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
