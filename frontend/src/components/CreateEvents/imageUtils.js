// Image utility functions for placeholder images

export const getEventImage = (eventId, eventType) => {
  // Convert to string and handle null/undefined cases
  const idStr = String(eventId || "event");
  const seed = Math.abs(idStr.charCodeAt(0)) + Math.abs(idStr.charCodeAt(1) || 0);
  return `https://picsum.photos/400/240?random=${seed % 100}`;
};

export const getOrganizerAvatar = (organizerId) => {
  const id = String(organizerId || "user");
  return `https://i.pravatar.cc/80?u=${id}&s=80`;
};

export const getVenueImage = (venueId) => {
  const idStr = String(venueId || "venue");
  const seed = Math.abs(idStr.charCodeAt(0)) + Math.abs(idStr.charCodeAt(1) || 0);
  return `https://picsum.photos/300/200?random=${seed % 100}`;
};

export const getProductImage = (productId) => {
  // Use clothing/apparel images from image service
  const images = [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1556821552-5f1a0adb5f1c?w=300&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1539185441766-6a6d0ce70813?w=300&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1552062407-291a714f8c16?w=300&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1521387645378-e19f372b3b38?w=300&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1588359348347-9bc676ca01a3?w=300&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300&h=300&fit=crop&q=80"
  ];
  const idStr = String(productId || "product");
  const seed = Math.abs(idStr.charCodeAt(0)) + Math.abs(idStr.charCodeAt(1) || 0);
  return images[seed % images.length];
};

export const getIconImage = (category) => {
  const iconMap = {
    "Conference": "🎤",
    "Hackathon": "💻",
    "Workshop": "🛠️",
    "Seminar": "📚",
    "Sports": "⚽",
    "Cultural": "🎭",
    "Social": "🎉",
    "default": "📌"
  };
  return iconMap[category] || iconMap.default;
};
