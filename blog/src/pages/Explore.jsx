import { useState, useEffect } from 'react';
import { postService } from '../api/services';
import PostCard from '../components/PostCard';
import FloatingElements from '../components/animations/FloatingElements';
import { FiSearch, FiFilter, FiX, FiTrendingUp, FiClock, FiEye } from 'react-icons/fi';
import './Explore.css';

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('-publishedAt');

  const categories = ['article', 'tutorial', 'story', 'news', 'other'];
  const popularTags = ['javascript', 'react', 'node.js', 'python', 'web-development', 'ai', 'tutorial', 'beginners'];

  useEffect(() => {
    fetchPosts();
  }, [page, selectedCategory, selectedTag, sortBy]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        sort: sortBy,
      };

      if (selectedCategory) params.category = selectedCategory;
      if (selectedTag) params.tag = selectedTag;
      if (searchQuery) params.search = searchQuery;

      const data = await postService.getPosts(params);
      setPosts(data.posts);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
    setPage(1);
  };

  const handleTagClick = (tag) => {
    setSelectedTag(tag === selectedTag ? '' : tag);
    setPage(1);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedTag('');
    setSearchQuery('');
    setSortBy('-publishedAt');
    setPage(1);
  };

  return (
    <div className="explore-page">
      <FloatingElements count={12} />
      
      <div className="container">
        <div className="explore-header">
          <div className="header-content">
            <h1 className="page-title">
              Explore <span className="gradient-text">Stories</span>
            </h1>
            <p className="page-description">
              Discover amazing stories, thinking, and expertise from talented writers on any topic.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="search-bar-container">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for posts, tags, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="clear-search-btn"
              >
                <FiX />
              </button>
            )}
            <button type="submit" className="search-button">
              Search
            </button>
          </div>
        </form>

        <div className="explore-content">
          {/* Sidebar Filters */}
          <aside className="filters-sidebar">
            <div className="filter-section">
              <div className="filter-header">
                <FiFilter />
                <h3>Filters</h3>
              </div>
              {(selectedCategory || selectedTag || searchQuery) && (
                <button onClick={clearFilters} className="clear-filters-btn">
                  Clear All Filters
                </button>
              )}
            </div>

            <div className="filter-section">
              <h4>Sort By</h4>
              <div className="sort-options">
                <button
                  className={`sort-btn ${sortBy === '-publishedAt' ? 'active' : ''}`}
                  onClick={() => handleSortChange('-publishedAt')}
                >
                  <FiClock /> Latest
                </button>
                <button
                  className={`sort-btn ${sortBy === '-views' ? 'active' : ''}`}
                  onClick={() => handleSortChange('-views')}
                >
                  <FiEye /> Most Viewed
                </button>
                <button
                  className={`sort-btn ${sortBy === '-upvoteCount' ? 'active' : ''}`}
                  onClick={() => handleSortChange('-upvoteCount')}
                >
                  <FiTrendingUp /> Popular
                </button>
              </div>
            </div>

            <div className="filter-section">
              <h4>Categories</h4>
              <div className="category-filters">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4>Popular Tags</h4>
              <div className="tag-filters">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    className={`tag-btn ${selectedTag === tag ? 'active' : ''}`}
                    onClick={() => handleTagClick(tag)}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Posts Grid */}
          <main className="posts-main">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Discovering amazing stories...</p>
              </div>
            ) : posts.length > 0 ? (
              <>
                <div className="results-info">
                  <div className="filter-badges">
                    {selectedCategory && (
                      <span className="active-filter-badge">
                        Category: {selectedCategory}
                        <button onClick={() => setSelectedCategory('')}>
                          <FiX />
                        </button>
                      </span>
                    )}
                    {selectedTag && (
                      <span className="active-filter-badge">
                        Tag: {selectedTag}
                        <button onClick={() => setSelectedTag('')}>
                          <FiX />
                        </button>
                      </span>
                    )}
                  </div>
                  <p className="results-count">{posts.length} stories found</p>
                </div>
                <div className="posts-grid">
                  {posts.map((post, index) => (
                    <div 
                      key={post._id} 
                      className="post-card-wrapper"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <PostCard post={post} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">
                  <FiSearch />
                </div>
                <h3>No Stories Found</h3>
                <p>We couldn't find any posts matching your criteria</p>
                <button onClick={clearFilters} className="btn-clear">
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="btn-pagination"
                >
                  Previous
                </button>
                <div className="pagination-dots">
                  {[...Array(totalPages)].map((_, i) => (
                    <span
                      key={i}
                      className={`pagination-dot ${page === i + 1 ? 'active' : ''}`}
                      onClick={() => setPage(i + 1)}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="btn-pagination"
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Explore;
