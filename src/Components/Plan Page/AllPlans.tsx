import React, { useEffect, useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useCart } from '../Cart/CartProvider';
import { FOOD_CATEGORIES, getCategoryMeta, planDisplayIcon } from '../../utils/foodCategories';
import { planImageUrl } from '../../utils/planApi';
import { API_V1, mediaUrl } from '../../utils/apiBase';
import { displayPlanName, planCategoryLabel, planImagePlaceholder, planPricing } from '../../utils/planDisplay';
import { filterVegetarianPlans } from '../../utils/vegFilter';
import DishCinema from './DishCinema';
import DishStoryPlayer from './DishStoryPlayer';
import '../Styles/allplans.css';
import axios from 'axios';

function AllPlans() {
    const [plans, setPlans] = useState<any[]>([]);
    const [filteredPlans, setFilteredPlans] = useState<any[]>([]);
    const [loadingPlans, setLoadingPlans] = useState<boolean>(true);
    const [plansError, setPlansError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchMode, setSearchMode] = useState('text');
    const [semanticNotice, setSemanticNotice] = useState<string>('');
    const [semanticLoading, setSemanticLoading] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [showImageGallery, setShowImageGallery] = useState<boolean>(false);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [plansPerPage] = useState(12);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isZoomed, setIsZoomed] = useState<boolean>(false);
    const [storyPlan, setStoryPlan] = useState<any>(null);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchPlans = async () => {
            setLoadingPlans(true);
            setPlansError('');
            try {
                const res = await axios.get(`${API_V1}/plan/`, { params: { diet: 'veg' } });
                const list = filterVegetarianPlans(res.data.Allplans || []);
                setPlans(list);
                setFilteredPlans(list);
            } catch (err: any) {
                console.error('Error fetching plans:', err);
                setPlansError('Could not load plans. Check that the backend is running.');
            } finally {
                setLoadingPlans(false);
            }
        };
        fetchPlans();
    }, []);

    useEffect(() => {
        if (loadingPlans) return;
        if (window.location.hash === '#cinema') {
            const el = document.getElementById('cinema');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [loadingPlans, filteredPlans.length]);

    useEffect(() => {
        if (searchMode !== 'text') return;

        let filtered = plans;
        
        if (searchTerm) {
            filtered = filtered.filter(plan => 
                plan.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(plan => plan.category === selectedCategory);
        }
        
        setFilteredPlans(filtered);
        setSemanticNotice('');
    }, [searchTerm, selectedCategory, plans, searchMode]);

    useEffect(() => {
        if (searchMode !== 'smart') return;

        if (!searchTerm || searchTerm.trim().length < 2) {
            setFilteredPlans(plans);
            setSemanticNotice('');
            return;
        }

        const timer = setTimeout(async () => {
            setSemanticLoading(true);
            try {
                const res = await axios.get(`${API_V1}/plan/semantic-search`, {
                    params: { q: searchTerm.trim() },
                });
                const results = filterVegetarianPlans(res.data.plans || []);
                if (results.length > 0) {
                    setFilteredPlans(results);
                    setSemanticNotice('');
                } else {
                    setFilteredPlans([]);
                    setSemanticNotice(res.data.message || 'No matching vegetarian plans found.');
                }
            } catch (err: any) {
                const fallback = plans.filter(plan =>
                    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setFilteredPlans(fallback);
                setSemanticNotice('Smart search unavailable. Showing text matches.');
            } finally {
                setSemanticLoading(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, searchMode, plans]);

    const handleAddToCart = (plan) => {
        addToCart(plan);
    };

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(0);
    }, [searchTerm, filteredPlans]);




    const closeImageGallery = () => {
        console.log('Closing gallery');
        setShowImageGallery(false);
        setSelectedPlan(null);
        setCurrentImageIndex(0);
    };

    const nextImage = () => {
        if (selectedPlan && selectedPlan.images) {
            setCurrentImageIndex((prev: any) => 
                prev === selectedPlan.images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (selectedPlan && selectedPlan.images) {
            setCurrentImageIndex((prev: any) => 
                prev === 0 ? selectedPlan.images.length - 1 : prev - 1
            );
        }
    };

    const goToImage = (index) => {
        setCurrentImageIndex(index);
    };

    // Zoom functions
    const zoomIn = () => {
        setZoomLevel(prev => Math.min(prev + 0.5, 3));
        setIsZoomed(true);
    };

    const zoomOut = () => {
        setZoomLevel(prev => Math.max(prev - 0.5, 0.5));
        if (zoomLevel <= 1) {
            setIsZoomed(false);
        }
    };

    const resetZoom = () => {
        setZoomLevel(1);
        setIsZoomed(false);
    };

    const handleImageClick = () => {
        if (isZoomed) {
            resetZoom();
        } else {
            zoomIn();
        }
    };

    // Pagination logic
    const totalPages = Math.ceil(filteredPlans.length / plansPerPage);
    const startIndex = currentPage * plansPerPage;
    const endIndex = startIndex + plansPerPage;
    const currentPlans = filteredPlans.slice(startIndex, endIndex);

    const nextPage = () => {
        setCurrentPage((prev: any) => (prev + 1) % totalPages);
    };

    const prevPage = () => {
        setCurrentPage((prev: any) => (prev - 1 + totalPages) % totalPages);
    };

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className='food-ordering-app'>
            <div className='main-content'>
                {/* Search Bar */}
                <div className='search-section'>
                    <div className='plans-page-heading'>
                        <h1>Meal Plans</h1>
                        <p>Play through our kitchen — then pick a plan and add it to your cart.</p>
                    </div>
                    <div className='search-container'>
                        <BsSearch className='search-icon' />
                        <input
                            type='text'
                            placeholder={searchMode === 'smart' ? 'Smart search: e.g. high protein under 300...' : 'Search for your favorite food...'}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='search-input'
                        />
                    </div>
                    <div className='search-mode-toggle'>
                        <button
                            type='button'
                            className={`search-mode-btn ${searchMode === 'text' ? 'active' : ''}`}
                            onClick={() => setSearchMode('text')}
                        >
                            Text
                        </button>
                        <button
                            type='button'
                            className={`search-mode-btn ${searchMode === 'smart' ? 'active' : ''}`}
                            onClick={() => setSearchMode('smart')}
                        >
                            Smart search
                        </button>
                    </div>
                    {(semanticLoading || semanticNotice) && (
                        <p className='semantic-search-notice'>
                            {semanticLoading ? 'Searching with AI...' : semanticNotice}
                        </p>
                    )}
                    <div className='category-filter-row'>
                        <button
                            type='button'
                            className={`category-chip ${selectedCategory === 'All' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('All')}
                        >
                            All
                        </button>
                        {FOOD_CATEGORIES.map((cat: any) => (
                            <button
                                key={cat.id}
                                type='button'
                                className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                                style={{ ['--cat-color' as any]: cat.color }}
                                onClick={() => setSelectedCategory(cat.id)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {!loadingPlans && !plansError && filteredPlans.length > 0 && (
                  <DishCinema
                    plans={filteredPlans}
                    onPlayStory={(plan) => setStoryPlan(plan)}
                    onAddToCart={(plan) => addToCart(plan)}
                  />
                )}

                {/* Food Items */}
                <div className='food-items-section'>
                    <div className='food-items-header'>
                        <h3>Our kitchen</h3>
                        {totalPages > 1 && (
                            <div className='pagination-controls'>
                                <button 
                                    className='pagination-btn prev-btn' 
                                    onClick={prevPage}
                                    disabled={currentPage === 0}
                                >
                                    ‹
                                </button>
                                <span className='page-info'>
                                    {currentPage + 1} of {totalPages}
                                </span>
                                <button 
                                    className='pagination-btn next-btn' 
                                    onClick={nextPage}
                                    disabled={currentPage === totalPages - 1}
                                >
                                    ›
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div className='food-items-container' data-testid="plans-grid">
                        {loadingPlans && (
                          <p className='plans-status' data-testid="plans-loading">Loading meal plans…</p>
                        )}
                        {!loadingPlans && plansError && (
                          <p className='plans-status plans-status--error' data-testid="plans-error">{plansError}</p>
                        )}
                        {!loadingPlans && !plansError && currentPlans.length === 0 && (
                          <p className='plans-status' data-testid="plans-empty">No plans match your filters.</p>
                        )}
                        {currentPlans.map((plan: any, index: any) => {
                            const catMeta = getCategoryMeta(plan.category);
                            const displayIcon = planDisplayIcon(plan);
                            return (
                            <div className='food-item-card' key={plan._id || index} data-testid="plan-card">
                                <Link
                                    to={`/planDetails/${plan._id}`}
                                    className='food-image-container'
                                    style={{ cursor: 'pointer', display: 'block', textDecoration: 'none', color: 'inherit' }}
                                >
                                    {plan.image ? (
                                    <img 
                                        src={planImageUrl(plan.image)}
                                        alt={displayPlanName(plan)}
                                        className='food-image'
                                        onError={(e) => {
                                          e.currentTarget.onerror = null;
                                          e.currentTarget.src = planImagePlaceholder(plan);
                                        }}
                                    />
                                    ) : (
                                    <div className='food-image food-image-placeholder'>
                                        <span className='food-placeholder-icon'>{displayIcon}</span>
                                    </div>
                                    )}
                                    <span
                                        className='category-badge'
                                        style={{ backgroundColor: catMeta.color }}
                                        title={catMeta.label}
                                    >
                                        {displayIcon}
                                    </span>
                                    <div className='food-rating'>
                                        <span className='rating-star'>★</span>
                                        <span className='rating-value'>{plan.ratingsAverage || plan.averageRating || 4.5}</span>
                                    </div>
                                    {plan.images && plan.images.length > 1 && (
                                        <div className='gallery-indicator'>
                                            <span className='image-count'>{plan.images.length} photos</span>
                                        </div>
                                    )}
                                </Link>
                                <div className='food-details'>
                                    <Link to={`/planDetails/${plan._id}`} className='food-name-link'>
                                      <h4 className='food-name'>{displayPlanName(plan)}</h4>
                                    </Link>
                                    <p className='food-category-label'>{planCategoryLabel(plan)}</p>
                                    <p className='food-price'>
                                      {(() => {
                                        const p = planPricing(plan);
                                        return p.hasDeal ? (
                                          <>
                                            <span className="food-price-sale">₹{p.salePrice}</span>
                                            <span className="food-price-list">₹{p.listPrice}</span>
                                          </>
                                        ) : (
                                          <>₹{p.listPrice}</>
                                        );
                                      })()}
                                    </p>
                                    <button 
                                        className='add-to-cart-item'
                                        onClick={() => handleAddToCart(plan)}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        );})}
                            </div>

                    {/* Pagination Dots */}
                    {totalPages > 1 && (
                        <div className='pagination-dots'>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    className={`pagination-dot ${index === currentPage ? 'active' : ''}`}
                                    onClick={() => goToPage(index)}
                                />
                            ))}
                        </div>
                    )}
                </div>
                                </div>
                            

            {/* Image Gallery Modal */}
            {showImageGallery && selectedPlan && (
                <div 
                    className='image-gallery-modal' 
                    onClick={closeImageGallery}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 9999,
                        background: 'rgba(0, 0, 0, 0.95)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px'
                    }}
                >
                    <div 
                        className='gallery-content' 
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: '#2d2d2d',
                            borderRadius: '20px',
                            maxWidth: '90vw',
                            maxHeight: '90vh',
                            width: '100%',
                            overflow: 'hidden',
                            position: 'relative',
                            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        <div className='gallery-header'>
                            <h2 className='gallery-title'>{selectedPlan.name}</h2>
                            <div className='gallery-controls'>
                                <div className='zoom-controls'>
                                    <button className='zoom-btn' onClick={zoomOut} title="Zoom Out">
                                        −
                                    </button>
                                    <span className='zoom-level'>{Math.round(zoomLevel * 100)}%</span>
                                    <button className='zoom-btn' onClick={zoomIn} title="Zoom In">
                                        +
                                    </button>
                                    <button className='reset-zoom-btn' onClick={resetZoom} title="Reset Zoom">
                                        ↺
                                    </button>
                                </div>
                                <button className='close-gallery' onClick={closeImageGallery}>
                                    ✕
                                </button>
                                </div>
                            </div>

                        <div className='main-image-container'>
                            {selectedPlan.images && selectedPlan.images.length > 1 && (
                                <button className='nav-button prev-button' onClick={prevImage}>
                                    ‹
                                </button>
                            )}
                            
                            <div className='main-image-wrapper' onClick={handleImageClick}>
                                <img 
                                    src={mediaUrl(selectedPlan.images ? selectedPlan.images[currentImageIndex] : selectedPlan.image)}
                                    alt={selectedPlan.name}
                                    className='main-image'
                                    style={{
                                        transform: `scale(${zoomLevel})`,
                                        cursor: isZoomed ? 'zoom-out' : 'zoom-in',
                                        transition: 'transform 0.3s ease'
                                    }}
                                    onError={(e) => {
                                        console.error('Image failed to load:', e.currentTarget.src);
                                        e.currentTarget.src = mediaUrl(selectedPlan.image);
                                    }}
                                />
                                {isZoomed && (
                                    <div className='zoom-indicator'>
                                        Click to reset zoom
                                    </div>
                                )}
                            </div>
                            
                            {selectedPlan.images && selectedPlan.images.length > 1 && (
                                <button className='nav-button next-button' onClick={nextImage}>
                                    ›
                                </button>
                            )}
                        </div>
                        
                        {selectedPlan.images && selectedPlan.images.length > 1 && (
                            <div className='thumbnail-container'>
                                {selectedPlan.images.map((image: any, index: any) => (
                                    <img
                                        key={index}
                                        src={mediaUrl(image)}
                                        alt={`${selectedPlan.name} ${index + 1}`}
                                        className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                                        onClick={() => goToImage(index)}
                                        onError={(e) => {
                                            console.error('Thumbnail failed to load:', e.currentTarget.src);
                                        }}
                                    />
                                ))}
                        </div>
                    )}

                        <div className='gallery-info'>
                            <div className='plan-details'>
                                <div className='detail-item'>
                                    <span className='detail-label'>Price:</span>
                                    <span className='detail-value price-highlight'>₹{selectedPlan.price}</span>
                                </div>
                                <div className='detail-item'>
                                    <span className='detail-label'>Duration:</span>
                                    <span className='detail-value'>{selectedPlan.duration || 'N/A'} days</span>
                                </div>
                                <div className='detail-item'>
                                    <span className='detail-label'>Discount:</span>
                                    <span className='detail-value discount-highlight'>{selectedPlan.discount || 0}% off</span>
                                </div>
                                <div className='detail-item'>
                                    <span className='detail-label'>Images:</span>
                                    <span className='detail-value'>{selectedPlan.images ? selectedPlan.images.length : 1} photos</span>
                                </div>
                            </div>
                            <div className='gallery-actions'>
                                <button 
                                    className='add-to-cart-from-gallery'
                                    onClick={() => {
                                        addToCart(selectedPlan);
                                        closeImageGallery();
                                    }}
                                >
                                    Add to Cart - ₹{selectedPlan.price}
                                </button>
                                <div className='zoom-instructions'>
                                    Click image to zoom • Use +/- buttons for precise control
                </div>
                            </div>
            </div>
        </div>
                </div>
            )}
            {storyPlan && (
              <DishStoryPlayer
                plan={storyPlan}
                onClose={() => setStoryPlan(null)}
                onAddToCart={(plan) => addToCart(plan)}
              />
            )}
        </div>
    );
}
export default AllPlans;
