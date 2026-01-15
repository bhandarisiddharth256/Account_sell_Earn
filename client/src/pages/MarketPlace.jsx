import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeftIcon, FilterIcon } from "lucide-react";
import { useSelector } from "react-redux";
import ListingCard from "../components/ListingCard";
import FilterSidebar from "../components/FilterSidebar";
import Fuse from "fuse.js";

const MarketPlace = () => {

  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const navigate = useNavigate();
  const [showFilterPhone, setShowFilterPhone] = useState(false);
  const [filters , setFilters] = useState({
    platform: null,
    maxPrice: 100000,
    minFollowers: null,
    niche:null,
    verified: null,
    monetized: null,
    })
  const { listings } = useSelector((state) => state.listing);
  const fuseOptions = {
    includeScore: false,
    threshold: 0.3, // controls fuzziness (0 = strict, 1 = loose)
    keys: [
      "title",
      "description",
      "platform",
      "username",
      "niche"
    ]
  };

  const fuse = new Fuse(listings, fuseOptions);
  let searchResults = listings;

  if (search.trim()) {
    searchResults = fuse.search(search.trim()).map(r => r.item);
  }

 const filteredListings = searchResults.filter((listing) => {
  if (filters.platform && filters.platform.length > 0) {
    if (!filters.platform.includes(listing.platform)) {
      return false;
    }
  }

  if (filters.maxPrice && listing.price > filters.maxPrice) {
    return false;
  }

  if (filters.minFollowers !== null && listing.followers < filters.minFollowers) {
    return false;
  }

  if (filters.niche && !filters.niche.includes(listing.niche)) {
    return false;
  }

  if (filters.verified !== null && listing.verified !== filters.verified) {
    return false;
  }

  if (filters.monetized !== null && listing.monetized !== filters.monetized) {
    return false;
  }
  
  
  return true;
});

  return (
    <div>
      <div className="px-6 md:px-16 lg:px-24 xl:px-32">
        
        {/* Header */}
        <div className="flex items-center justify-between text-slate-500">
          
          {/* Back Button */}
          <button
            onClick={() => {
              navigate("/");
              window.scrollTo(0, 0);
            }}
            className="flex items-center gap-2 py-5"
          >
            <ArrowLeftIcon className="size-4" />
            Back to Home
          </button>

          {/* Mobile Filters Button */}
          <button
            onClick={() => setShowFilterPhone(true)}
            className="flex sm:hidden items-center gap-2 py-5"
          >
            <FilterIcon className="size-4" />
            Filters
          </button>
        </div>

        {/* Main Content */}
        <div className="relative flex items-start justify-between gap-8 pb-8">
          
          {/* Placeholder sidebar */}
          <FilterSidebar setFilters={setFilters} filters={filters} 
           setShowFilterPhone={setShowFilterPhone} showFilterPhone = {showFilterPhone}/>

          {/* Listings */}
          <div className="flex-1 grid xl:grid-cols-2 gap-4">
            {filteredListings
              .sort((a, b) => (a.featured ? -1 : b.featured ? 1 : 0))
              .map((listing, index) => (
                <ListingCard listing={listing} key={index} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPlace;
