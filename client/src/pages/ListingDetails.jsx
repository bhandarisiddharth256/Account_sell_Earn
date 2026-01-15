import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProfileLink, platformIcons } from "../assets/assets/assets";
import {ArrowLeft,ArrowUpRightFromSquareIcon,CheckCircle2,DollarSign,Loader2Icon,ChevronLeftIcon,ChevronRightIcon,Users,
LineChart,Eye,Calendar,MapPin,MessageCircle,ShoppingBagIcon} from "lucide-react";
import { setChat } from "../app/features/chatSlice";

const ListingDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";

  const [listing, setListing] = useState(null);
  const [current, setcurrent] = useState(0);

  const { listingId } = useParams();
  const { listings } = useSelector((state) => state.listing);

  const images = listing ? listing.images : [];

  const prevSlide = () =>
    setcurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const nextSlide = () =>
    setcurrent((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );

  const profileLink =
    listing && getProfileLink(listing.platform, listing.username);

  const purchaseAccount = async () =>{
        
  }

  const loadChatbox = () => {
       dispatch(setChat({listing:listing}));
  }

  useEffect(() => {
    const foundListing = listings.find((item) => item.id === listingId);
    if (foundListing) setListing(foundListing);
  }, [listingId, listings]);

  return listing ? (
    <div className="mx-auto min-h-screen px-6 md:px-16 lg:px-24 xl:px-32">
      <button
        onClick={() => navigate(-1)}
        className="mt-6 mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="size-4" /> Go to previous page
      </button>

      <div className="flex items-start max-md:flex-col gap-10">
        <div className="flex-1 max-md:w-full">
          {/* Top section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl">
                  {platformIcons[listing.platform]}
                </div>

                <div>
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                    {listing.title}
                    <Link to={profileLink} target="_blank">
                      <ArrowUpRightFromSquareIcon className="size-4 hover:text-indigo-500" />
                    </Link>
                  </h2>

                  <p className="text-gray-500 text-sm">
                    @{listing.username} •{" "}
                    {listing.platform?.charAt(0).toUpperCase() +
                      listing.platform?.slice(1)}
                  </p>

                  <div className="flex gap-3 mt-2">
                    {listing.verified && (
                      <span className="flex items-center text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Verified Account
                      </span>
                    )}

                    {listing.monetized && (
                      <span className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-md">
                        <DollarSign className="w-3 h-3 mr-1" /> Monetized Account
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <h3 className="text-2xl font-bold text-gray-800">
                  {currency}
                  {listing.price?.toLocaleString()}
                </h3>
                <p className="text-sm text-gray-500">USD</p>
              </div>
            </div>
          </div>

          {/* Screenshot section */}
          {images.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 mb-5 overflow-hidden">
              <div className="p-4">
                <h4 className="font-semibold text-gray-800">
                  Screenshots & proofs
                </h4>
              </div>

              {/* Slider container */}
              <div className="relative w-full aspect-video overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${current * 100}%)` }}
                >
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt="Listingproof"
                      className="w-full shrink-0"
                    />
                  ))}
                </div>

                {/* Navigation Buttons */}
                <button
                  onClick={prevSlide}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow"
                >
                  <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow"
                >
                  <ChevronRightIcon className="w-5 h-5 text-gray-700" />
                </button>

                {/* Dots indicator */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setcurrent(index)}
                      className={`w-2.5 h-2.5 rounded-full ${
                        current === index
                          ? "bg-indigo-600"
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Account Metrices */}
          <div className='bg-white rounded-xl border border-gray-200 mb-5'>
            <div className='p-4 border-b border-gray-100'>
              <h4 className='font-semibold text-gray-800'>Account Metrics</h4>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 p-4 text-center'>
              <div>
                <Users className='mx-auto text-gray-400 w-5 h-5 mb-1' />
                <p className='font-semibold text-gray-800'>
                  {listing.followers_count?.toLocaleString()}
                </p>
                <p className='text-xs text-gray-500'>Followers</p>
              </div>
              <div>
                <LineChart className='mx-auto text-gray-400 w-5 h-5 mb-1' />
                <p className='font-semibold text-gray-800'>
                  {listing.engagement_rate}%
                </p>
                <p className='text-xs text-gray-500'>Engagement</p>
              </div>
              <div>
                <Eye className='mx-auto text-gray-400 w-5 h-5 mb-1' />
                <p className='font-semibold text-gray-800'>
                  {listing.monthly_views?.toLocaleString()}
                </p>
                <p className='text-xs text-gray-500'>Monthly Views</p>
              </div>
              <div>
                <Calendar className='mx-auto text-gray-400 w-5 h-5 mb-1' />
                <p className='font-semibold text-gray-800'>
                  {new Date(listing.createdAt).toLocaleDateString()}
                </p>
                <p className='text-xs text-gray-500'>Listed</p>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className='bg-white rounded-xl border border-gray-200 mb-5'>
            <div className='p-4 border-b border-gray-100'>
              <h4 className='font-semibold text-gray-800'>Description</h4>
            </div>
            <div className='p-4 text-sm text-gray-600'>
              {listing.description}
            </div>
          </div>

          {/* Additional Details */}
        <div className='bg-white rounded-xl border border-gray-200 mb-5'>
          
          <div className='p-4 border-b border-gray-100'>
            <h4 className='font-semibold text-gray-800'>Additional Details</h4>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-4 text-sm'>
            <div>
              <p className='text-gray-500'>Niche</p>
              <p className='font-medium capitalize'>{listing.niche}</p>
            </div>

            <div>
              <p className='text-gray-500'>Primary Country</p>
              <p className='flex items-center font-medium'>
                <MapPin className="size-4 mr-1 text-gray-400"/> {listing.country}
              </p>
            </div>

            <div>
              <p className='text-gray-500'>Audience Age</p>
              <p className='font-medium'>
               {listing.age_range}
              </p>
            </div>

            <div>
              <p className='text-gray-500'>Platform Verified</p>
              <p className='font-medium'>
               {listing.platformAssured ? "Yes" : "No"}
              </p>
            </div>

            <div>
              <p className='text-gray-500'>Monetization</p>
              <p className='font-medium'>
               {listing.monetized ? "Enabled" : "Disabled"}
              </p>
            </div>

            <div>
              <p className='text-gray-500'>Status</p>
              <p className='font-medium capitalize'>
               {listing.status}
              </p>
            </div>

          </div>

        </div>

        </div>

        {/* Seller Info and Purchase Page */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
            <h4 className="font-semibold text-gray-800 mb-4">
              Seller Information
            </h4>

            {/* Seller Basic Info */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={listing.owner?.image}
                alt="seller image"
                className="w-12 h-12 rounded-full object-cover border"
              />

              <div className="flex-1">
                <p className="font-medium text-gray-800">
                  {listing.owner?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {listing.owner?.email}
                </p>
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <p>
                Member Since{" "}
                <span className="font-medium">
                  {new Date(listing.owner?.createdAt).toLocaleDateString()}
                </span>
              </p>
            </div>

            {/* Chat Button */}
            <button
              onClick={loadChatbox}
              className="w-full flex items-center justify-center gap-2 
                        bg-indigo-600 hover:bg-indigo-700 
                        text-white text-sm font-medium 
                        py-2.5 rounded-lg transition"
            >
              <MessageCircle size={18} />
              Chat with Seller
            </button>

            {listing.isCredentialChanged && (
              <button
              onClick={purchaseAccount}
                className="w-full mt-2 bg-purple-600 text-white py-2 rounded-lg
                          hover:bg-purple-700 transition text-sm font-medium
                          flex items-center justify-center gap-2"
              >
                <ShoppingBagIcon className="size-4" />
                Purchase
              </button>
            )}
        </div>
      </div>

      {/* Footer */}
      <div className='bg-white border-t border-gray-200 p-4 text-center mt-28'>
        <p className='text-sm text-gray-500'>
          © 2025 <span>siddharth</span>. All rights reserved.
        </p>
      </div>

    </div>
  ) : (
    <div className="w-full h-full flex justify-center items-center">
      <Loader2Icon className="size-7 animate-spin h-6 w-6 mx-auto mt-20" />
    </div>
  );
};

export default ListingDetails;