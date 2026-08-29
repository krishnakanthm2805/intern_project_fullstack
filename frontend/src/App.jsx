import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CollegeDirectorySection from './components/CollegeDirectorySection';
import TellMeMoreAbout from './components/TellMeMoreAbout';
import LatestReviewsSection from './components/LatestReviewsSection';
import EquipmentReviewsSection from './components/EquipmentReviewsSection';
import CourseModal from './components/CourseModal';
import ArticleModal from './components/ArticleModal';
import CollegeDetailModal from './components/CollegeDetailModal';
import TipsNewsletterModal from './components/TipsNewsletterModal';
import CompareView from './components/CompareView';
import CompareDrawer from './components/CompareDrawer';
import Footer from './components/Footer';
import Toast from './components/Toast';
import DatabaseStatusModal from './components/DatabaseStatusModal';
import { fetchCollegeDetails, subscribeNewsletter, fetchDatabaseStatus } from './services/api';

export default function App() {
  // Modal & View States
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [collegeSearchFilter, setCollegeSearchFilter] = useState({});
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedCollegeDetail, setSelectedCollegeDetail] = useState(null);
  const [tipsModalOpen, setTipsModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [dbModalOpen, setDbModalOpen] = useState(false);

  // Active section tracker
  const [activeSection, setActiveSection] = useState('hero');

  // Database Connection Telemetry State
  const [dbStatus, setDbStatus] = useState(null);

  // Compared colleges state (up to 3)
  const [comparedColleges, setComparedColleges] = useState([]);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Poll Database Status on mount and periodically
  useEffect(() => {
    let mounted = true;
    async function loadDbStatus() {
      try {
        const res = await fetchDatabaseStatus();
        if (mounted && res) {
          setDbStatus(res);
        }
      } catch (err) {
        if (mounted) setDbStatus({ connected: false, error: err.message });
      }
    }

    loadDbStatus();
    const interval = setInterval(loadDbStatus, 20000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Listen to /colleges/:slug route in URL
  useEffect(() => {
    const handleUrlRoute = async () => {
      const path = window.location.pathname;
      const match = path.match(/^\/colleges\/([a-zA-Z0-9_-]+)/);
      if (match) {
        const slug = match[1];
        try {
          const res = await fetchCollegeDetails(slug);
          if (res.success && res.data) {
            setSelectedCollegeDetail(res.data);
          }
        } catch (err) {
          console.warn('Could not load college route:', err);
        }
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    return () => window.removeEventListener('popstate', handleUrlRoute);
  }, []);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // View College Detail handler
  const handleOpenCollegeDetail = async (collegeOrSlug) => {
    try {
      if (typeof collegeOrSlug === 'string') {
        const res = await fetchCollegeDetails(collegeOrSlug);
        if (res.success) {
          setSelectedCollegeDetail(res.data);
          window.history.pushState({}, '', `/colleges/${res.data.slug || collegeOrSlug}`);
        }
      } else {
        setSelectedCollegeDetail(collegeOrSlug);
        if (collegeOrSlug.slug) {
          window.history.pushState({}, '', `/colleges/${collegeOrSlug.slug}`);
        }
      }
    } catch (err) {
      addToast(`Could not load details: ${err.message}`, 'error');
    }
  };

  const handleCloseCollegeDetail = () => {
    setSelectedCollegeDetail(null);
    if (window.location.pathname.startsWith('/colleges/')) {
      window.history.pushState({}, '', window.location.search ? `/${window.location.search}` : '/');
    }
  };

  // Handlers
  const handleSearchColleges = (filters) => {
    setCollegeSearchFilter(filters);
    setCourseModalOpen(true);
  };

  const handleOpenMapsModal = () => {
    setCollegeSearchFilter({ query: '', state: 'All', degree: 'All' });
    setCourseModalOpen(true);
  };

  const handleNavigateSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubscribeEmail = async (email) => {
    try {
      await subscribeNewsletter({ name: 'Student', email, targetExam: 'General' });
    } catch (err) {
      console.warn('Subscription notice:', err);
    }
    addToast(`Thank you for subscribing! Daily cutoff alerts & college news will be sent to ${email}`, 'tip');
  };

  const handleTipsSuccess = (msg) => {
    addToast(msg, 'success');
  };

  const handleToggleCompare = (college) => {
    const exists = comparedColleges.some((c) => c.id === college.id);
    if (exists) {
      setComparedColleges((prev) => prev.filter((c) => c.id !== college.id));
      addToast(`Removed ${college.name} from comparison`, 'tip');
    } else {
      if (comparedColleges.length >= 3) {
        addToast('You can compare a maximum of 3 colleges simultaneously.', 'tip');
        return;
      }
      setComparedColleges((prev) => [...prev, college]);
      addToast(`Added ${college.name} to comparison`, 'success');
    }
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        onOpenTips={() => setTipsModalOpen(true)}
        onNavigateSection={handleNavigateSection}
        activeSection={activeSection}
        compareCount={comparedColleges.length}
        onOpenCompare={() => setCompareModalOpen(true)}
        dbStatus={dbStatus}
        onOpenDbModal={() => setDbModalOpen(true)}
      />

      {/* Main Page Flow */}
      <main>
        {/* Section 1: Hero Section with 3D University Campus Artwork, Headings & Search Card */}
        <HeroSection
          onOpenTips={() => setTipsModalOpen(true)}
          onOpenNewsletter={() => setTipsModalOpen(true)}
          onSearchColleges={handleSearchColleges}
          onOpenMapsModal={handleOpenMapsModal}
        />

        {/* Section 2: College Listing + Search & Multi-Filters (URL SearchParams synced) */}
        <CollegeDirectorySection
          onViewDetails={handleOpenCollegeDetail}
          onToggleCompare={handleToggleCompare}
          comparedColleges={comparedColleges}
        />

        {/* Section 3: Tell Me More About (3 Feature Cards: Engineering, Management, Beginners) */}
        <TellMeMoreAbout
          onSelectCategory={(category) => setSelectedArticle(category)}
        />

        {/* Section 4: Latest Reviews (2x2 Grid + Sidebar + Subscribe) */}
        <LatestReviewsSection
          onSelectReview={(review) => setSelectedArticle(review)}
          onSubscribeEmail={handleSubscribeEmail}
        />

        {/* Section 5: Reviews of Top Institutions (Light Theme Contrast + Brand Stack) */}
        <EquipmentReviewsSection
          onSelectBrand={(brand) => setSelectedArticle(brand)}
          onDiscoverAll={() => {
            handleNavigateSection('directory');
            addToast('Viewing all 2,000+ verified institution reviews', 'tip');
          }}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenTips={() => setTipsModalOpen(true)}
        onNavigateSection={handleNavigateSection}
      />

      {/* College Directory / Search Modal */}
      <CourseModal
        isOpen={courseModalOpen}
        onClose={() => setCourseModalOpen(false)}
        initialFilter={collegeSearchFilter}
        onToggleCompare={handleToggleCompare}
        comparedIds={comparedColleges.map((c) => c.id)}
      />

      {/* Dynamic Full College Detail Modal (/colleges/:slug) */}
      {selectedCollegeDetail && (
        <CollegeDetailModal
          college={selectedCollegeDetail}
          onClose={handleCloseCollegeDetail}
          onToggleCompare={handleToggleCompare}
          isCompared={comparedColleges.some((c) => c.id === selectedCollegeDetail.id)}
        />
      )}

      {/* Article / Review Reader Modal */}
      <ArticleModal
        item={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      {/* Free Tips & Newsletter Modal */}
      <TipsNewsletterModal
        isOpen={tipsModalOpen}
        onClose={() => setTipsModalOpen(false)}
        onSuccess={handleTipsSuccess}
      />

      {/* Comparison Drawer (when colleges are selected) */}
      {comparedColleges.length > 0 && !compareModalOpen && (
        <CompareDrawer
          comparedColleges={comparedColleges}
          onRemoveCollege={(id) => setComparedColleges((prev) => prev.filter((c) => c.id !== id))}
          onOpenCompare={() => setCompareModalOpen(true)}
          onClearAll={() => setComparedColleges([])}
        />
      )}

      {/* Comparison Full View Modal */}
      {compareModalOpen && (
        <div className="modal-backdrop" onClick={() => setCompareModalOpen(false)}>
          <div
            className="modal-dialog"
            style={{ maxWidth: '1100px', width: '95%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="modal-title">Side-by-Side College Comparison</h3>
              <button className="btn-modal-close" onClick={() => setCompareModalOpen(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <CompareView
                colleges={comparedColleges}
                onBack={() => setCompareModalOpen(false)}
                onRemoveCollege={(id) => setComparedColleges((prev) => prev.filter((c) => c.id !== id))}
                onViewDetails={(c) => {
                  setCompareModalOpen(false);
                  handleOpenCollegeDetail(c);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Database & API Diagnostics Modal */}
      <DatabaseStatusModal
        isOpen={dbModalOpen}
        onClose={() => setDbModalOpen(false)}
        dbStatus={dbStatus}
        onStatusUpdated={(updated) => setDbStatus({ ...dbStatus, database: updated })}
      />

      {/* Toast Feedback */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
