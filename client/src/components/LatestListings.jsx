import React from "react";
import { useSelector } from "react-redux";
import Title from "./Title";
import ListingCard from "./ListingCard";

const LatestListings = () => {
  const { listings } = useSelector((state) => state.listing);

  return (
    <div className="mt-20 mb-8">
      <Title
        title="Latest Listings"
        description="Discover the hottest social profiles available right now."
      />

      {/* FIXED ALIGNMENT */}
      <div className="max-w-5xl mx-auto flex flex-col gap-6 px-6">
        {listings.slice(0, 4).map((listing, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
           <ListingCard listing={listing} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestListings;
