import { useState, useMemo, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import products from "../data/products";

const PAGE_SIZE = 12;
const TYPES    = ["all", "tshirt", "shirt", "pant", "jersey"];
const SORT_OPT = ["default", "price-low", "price-high", "name-az"];
const TYPE_LABELS = { all: "All", tshirt: "T-Shirts", shirt: "Shirts", pant: "Pants", jersey: "Jerseys" };

const Shop = () => {
  const [search,   setSearch]  = useState("");
  const [typeFilter, setType]  = useState("all");
  const [catFilter,  setCat]   = useState("all");
  const [priceRange, setPrice] = useState([0, 2000]);
  const [sort,     setSort]    = useState("default");
  const [showFilter, setShow]  = useState(false);
  const [visible,  setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchType   = typeFilter === "all" || p.type === typeFilter;
      const matchCat    = catFilter  === "all" || p.category === catFilter;
      const matchPrice  = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchSearch && matchType && matchCat && matchPrice;
    });
    if (sort === "price-low")  list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name-az")    list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [search, typeFilter, catFilter, priceRange, sort]);

  // Reset to first page whenever the filtered result set changes
  useEffect(() => { setVisible(PAGE_SIZE); }, [search, typeFilter, catFilter, priceRange, sort]);

  const shown   = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const resetFilters = () => { setSearch(""); setType("all"); setCat("all"); setPrice([0,2000]); setSort("default"); };

  return (
    <>
      <Navbar />
      <section id="page-header">
        <h2>#SHOP ALL</h2>
        <p>Find your perfect style</p>
      </section>

      <div className="shop-toolbar">
        {/* Search */}
        <div className="shop-search-wrap">
          <i className="fal fa-search"></i>
          <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
          {search && <i className="fal fa-times shop-clear" onClick={() => setSearch("")}></i>}
        </div>

        {/* Type pills */}
        <div className="shop-type-pills">
          {TYPES.map((t) => (
            <button key={t} className={`type-pill ${typeFilter === t ? "active" : ""}`} onClick={() => setType(t)}>
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        {/* Sort + Filter toggle */}
        <div className="shop-right-tools">
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="sort-select">
            <option value="default">Sort: Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-az">Name: A–Z</option>
          </select>
          <button className={`filter-toggle-btn ${showFilter ? "active" : ""}`} onClick={() => setShow(!showFilter)}>
            <i className="fal fa-sliders-h"></i> Filters
          </button>
        </div>
      </div>

      {/* Expanded filter panel */}
      {showFilter && (
        <div className="filter-panel">
          <div className="filter-group">
            <label>Category</label>
            <div className="filter-pills">
              {["all","featured","new"].map((c) => (
                <button key={c} className={`type-pill sm ${catFilter === c ? "active" : ""}`} onClick={() => setCat(c)}>
                  {c === "all" ? "All" : c === "featured" ? "Featured" : "New Arrivals"}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <label>Price Range: ₹{priceRange[0]} – ₹{priceRange[1]}</label>
            <div className="price-range-wrap">
              <span>₹0</span>
              <input type="range" min="0" max="2000" step="50"
                value={priceRange[1]}
                onChange={(e) => setPrice([priceRange[0], Number(e.target.value)])}
                className="price-slider"
              />
              <span>₹2000</span>
            </div>
          </div>
          <button className="reset-btn" onClick={resetFilters}>Reset All</button>
        </div>
      )}

      <section id="product1" className="section-p1">
        <p className="result-count">
          Showing <strong>{shown.length}</strong> of <strong>{filtered.length}</strong> product{filtered.length !== 1 ? "s" : ""}
        </p>
        <div className="pro-container">
          {filtered.length === 0
            ? <div className="no-products"><i className="fal fa-box-open"></i><p>No products found. <button onClick={resetFilters}>Clear filters</button></p></div>
            : shown.map((p) => <ProductCard key={p.id} product={p} />)
          }
        </div>

        {hasMore && (
          <div className="load-more-wrap">
            <button className="load-more-btn" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
              Load More <span>({filtered.length - visible} left)</span>
            </button>
          </div>
        )}
      </section>

      <section id="newsletter" className="section-p1 section-m1">
        <div className="newstext">
          <h4>Sign Up for Newsletter</h4>
          <p>Get E-mail updates about our latest shop and <span>special offers.</span></p>
        </div>
        <div className="form">
          <input type="text" placeholder="Your email address" />
          <a href="/register" className="normal" style={{textDecoration:"none",display:"inline-block",padding:"10px 20px",background:"#088178",color:"#fff",borderRadius:4,fontWeight:700}}>Sign Up</a>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Shop;
