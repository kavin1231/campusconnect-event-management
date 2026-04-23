import React, { useState } from 'react';
import { getStallTooltipInfo, getStallCellClass, getDisplayLabel } from '../../utils/stallMapUtils';
import './StallCell.css';

export default function StallCell({ stall, isDarkMode }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipInfo = getStallTooltipInfo(stall);
  const cellClass = getStallCellClass(stall);
  const { stallLabel, vendorLabel } = getDisplayLabel(stall);

  const cellStyle = isDarkMode
    ? {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
      }
    : {};

  return (
    <div className="stall-cell-wrapper">
      <button
        className={cellClass}
        style={cellStyle}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        title={tooltipInfo.description}
        aria-label={`${stallLabel}${vendorLabel ? ` - ${vendorLabel}` : ''}`}
      >
        <div className="stall-number">{stallLabel}</div>
        {vendorLabel && <div className="stall-vendor">{vendorLabel}</div>}
      </button>

      {showTooltip && (
        <div className="stall-tooltip" style={isDarkMode ? { backgroundColor: '#1F2937' } : {}}>
          <div className="tooltip-title">{tooltipInfo.title}</div>
          <div className="tooltip-description">{tooltipInfo.description}</div>
          {tooltipInfo.vendor && (
            <div className="tooltip-vendor-info">
              <div className="tooltip-contact">{tooltipInfo.vendor.contact}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
