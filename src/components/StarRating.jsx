import { useState } from "react";

/**
 * StarRating — works in TWO modes:
 * 1. Interactive (onChange passed): user can click to set rating
 * 2. Display only (no onChange): shows average with half-star support
 */
const StarRating = ({ value = 0, onChange = null, size = 18 }) => {
  const [hover, setHover] = useState(0);
  const display = onChange ? (hover || value) : value;

  return (
    <div
      style={{ display: "flex", gap: 2, cursor: onChange ? "pointer" : "default", lineHeight: 1 }}
      onMouseLeave={() => onChange && setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const full = display >= star;
        const half = !onChange && !full && display + 0.5 >= star;
        return (
          <i
            key={star}
            className={full ? "fas fa-star" : half ? "fas fa-star-half-alt" : "far fa-star"}
            style={{
              fontSize: size,
              color: full || half ? "#f3b519" : "#ddd",
              transition: "color 0.12s, transform 0.1s",
              transform: onChange && hover >= star ? "scale(1.3)" : "scale(1)",
              display: "inline-block",
            }}
            onMouseEnter={() => onChange && setHover(star)}
            onClick={() => onChange && onChange(star)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
