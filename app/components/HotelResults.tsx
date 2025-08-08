"use client";

import {
  Building,
  MapPin,
  Star,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  Waves,
} from "lucide-react";
import { HotelOffer } from "../services/hotels";

interface HotelResultsProps {
  hotels: HotelOffer[];
  isLoading: boolean;
  error: string | null;
}

const getAmenityIcon = (amenity: string) => {
  const amenityLower = amenity.toLowerCase();
  if (amenityLower.includes("wifi") || amenityLower.includes("internet")) {
    return <Wifi className="w-4 h-4" />;
  }
  if (amenityLower.includes("parking")) {
    return <Car className="w-4 h-4" />;
  }
  if (amenityLower.includes("restaurant") || amenityLower.includes("dining")) {
    return <Utensils className="w-4 h-4" />;
  }
  if (amenityLower.includes("gym") || amenityLower.includes("fitness")) {
    return <Dumbbell className="w-4 h-4" />;
  }
  if (amenityLower.includes("pool") || amenityLower.includes("spa")) {
    return <Waves className="w-4 h-4" />;
  }
  return <Building className="w-4 h-4" />;
};

const renderStars = (rating?: number) => {
  if (!rating) return null;

  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "text-yellow-400 fill-current" : "text-gray-400"
          }`}
        />
      ))}
      <span className="text-sm text-gray-400 ml-1">{rating}/5</span>
    </div>
  );
};

export default function HotelResults({
  hotels,
  isLoading,
  error,
}: HotelResultsProps) {
  // Debug logging to see what we're getting
  console.log("HotelResults received:", { hotels, isLoading, error });
  if (hotels.length > 0) {
    console.log("First hotel structure:", hotels[0]);
  }

  if (isLoading) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-800">
        <div className="flex items-center justify-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <p className="text-gray-300">Searching for the best hotels...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-red-800">
        <div className="text-center">
          <div className="bg-red-500/20 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Building className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-red-400 mb-2">
            Search Error
          </h3>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-800">
        <div className="text-center">
          <div className="bg-gray-500/20 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Building className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            No hotels found
          </h3>
          <p className="text-gray-400">
            Try adjusting your search criteria or location.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          {hotels.length} hotel{hotels.length !== 1 ? "s" : ""} found
        </h2>
        <p className="text-gray-400">Prices shown are per night</p>
      </div>

      {hotels.map((hotelOffer) => {
        // Defensive check to ensure we have valid hotel data
        if (!hotelOffer || !hotelOffer.hotel) {
          console.warn("Invalid hotel offer data:", hotelOffer);
          return null;
        }

        return (
          <div
            key={hotelOffer.hotel.hotelId || Math.random()}
            className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-800 hover:border-gray-700 transition-all duration-200"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Hotel Info */}
              <div className="lg:col-span-2">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {hotelOffer.hotel.name}
                    </h3>
                    {renderStars(hotelOffer.hotel.rating)}
                  </div>
                  {hotelOffer.hotel.chainCode && (
                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                      {hotelOffer.hotel.chainCode}
                    </span>
                  )}
                </div>

                {/* Address */}
                <div className="flex items-start space-x-2 mb-4">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="text-gray-300 text-sm">
                    {hotelOffer.hotel.address?.lines &&
                      hotelOffer.hotel.address.lines.length > 0 && (
                        <div>{hotelOffer.hotel.address.lines.join(", ")}</div>
                      )}
                    <div>
                      {hotelOffer.hotel.address?.cityName &&
                        `${hotelOffer.hotel.address.cityName}`}
                      {hotelOffer.hotel.address?.countryCode &&
                        `, ${hotelOffer.hotel.address.countryCode}`}
                      {hotelOffer.hotel.address?.postalCode &&
                        ` ${hotelOffer.hotel.address.postalCode}`}
                    </div>
                    {hotelOffer.hotel.hotelDistance && (
                      <div className="text-blue-400 text-xs mt-1">
                        {hotelOffer.hotel.hotelDistance.distance}{" "}
                        {hotelOffer.hotel.hotelDistance.distanceUnit} from city
                        center
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {hotelOffer.hotel.description && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {hotelOffer.hotel.description.text}
                  </p>
                )}

                {/* Amenities */}
                {hotelOffer.hotel.amenities &&
                  hotelOffer.hotel.amenities.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">
                        Amenities
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {hotelOffer.hotel.amenities
                          .slice(0, 6)
                          .map((amenity, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-1 bg-gray-800/50 rounded-lg px-2 py-1 text-xs text-gray-300"
                            >
                              {getAmenityIcon(amenity)}
                              <span>{amenity}</span>
                            </div>
                          ))}
                        {hotelOffer.hotel.amenities.length > 6 && (
                          <div className="bg-gray-800/50 rounded-lg px-2 py-1 text-xs text-gray-400">
                            +{hotelOffer.hotel.amenities.length - 6} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                {/* Contact Info */}
                {hotelOffer.hotel.contact && (
                  <div className="text-xs text-gray-500">
                    {hotelOffer.hotel.contact.phone && (
                      <div>Phone: {hotelOffer.hotel.contact.phone}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Offers */}
              <div className="lg:col-span-1">
                <div className="space-y-3">
                  {hotelOffer.offers.slice(0, 3).map((offer) => (
                    <div
                      key={offer.id}
                      className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
                    >
                      {/* Room Type */}
                      <div className="mb-3">
                        <h4 className="font-medium text-white mb-1">
                          {offer.room.typeEstimated?.category ||
                            offer.room.type}
                        </h4>
                        {offer.room.description && (
                          <p className="text-xs text-gray-400 line-clamp-2">
                            {offer.room.description.text}
                          </p>
                        )}
                        {offer.room.typeEstimated && (
                          <div className="text-xs text-gray-500 mt-1">
                            {offer.room.typeEstimated.beds &&
                              `${offer.room.typeEstimated.beds} bed(s)`}
                            {offer.room.typeEstimated.bedType &&
                              ` • ${offer.room.typeEstimated.bedType}`}
                          </div>
                        )}
                      </div>

                      {/* Price */}
                      <div className="mb-3">
                        <div className="text-2xl font-bold text-green-400">
                          {offer.price.currency} {offer.price.total}
                        </div>
                        <div className="text-xs text-gray-400">
                          per night • {offer.guests.adults} adult
                          {offer.guests.adults !== 1 ? "s" : ""}
                        </div>
                        {offer.price.base &&
                          offer.price.base !== offer.price.total && (
                            <div className="text-xs text-gray-500">
                              Base: {offer.price.currency} {offer.price.base}
                            </div>
                          )}
                      </div>

                      {/* Board Type */}
                      {offer.boardType && (
                        <div className="mb-3">
                          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                            {offer.boardType}
                          </span>
                        </div>
                      )}

                      {/* Policies */}
                      {offer.policies && (
                        <div className="text-xs text-gray-500 mb-3 space-y-1">
                          {offer.policies.cancellation && (
                            <div>
                              Cancellation: {offer.policies.cancellation.type}
                              {offer.policies.cancellation.deadline &&
                                ` until ${new Date(
                                  offer.policies.cancellation.deadline
                                ).toLocaleDateString()}`}
                            </div>
                          )}
                          {offer.policies.paymentType && (
                            <div>Payment: {offer.policies.paymentType}</div>
                          )}
                        </div>
                      )}

                      <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] text-sm">
                        Select Room
                      </button>
                    </div>
                  ))}

                  {hotelOffer.offers.length > 3 && (
                    <div className="text-center">
                      <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                        View all {hotelOffer.offers.length} offers
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
