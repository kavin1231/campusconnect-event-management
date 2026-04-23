import React, { useEffect, useMemo, useState } from 'react';
import { enrichStallsWithPositions } from '../../utils/stallDataMapper';
import './VendorStallMap.css';

export default function VendorStallMap({
  stalls = [],
  loading = false,
  error = null,
  isDarkMode = false,
  mapImage = '',
  fallbackMapImage = '/maps/sliit-campus-map.png',
  title = 'Vendor Stall Allocation Map',
  subtitle = '',
}) {
  const [hoveredStallId, setHoveredStallId] = useState(null);
  const [mapLoadFailed, setMapLoadFailed] = useState(false);
  const preferredMapImage = mapImage || fallbackMapImage;
  const [activeMapImage, setActiveMapImage] = useState(preferredMapImage);

  useEffect(() => {
    setActiveMapImage(preferredMapImage);
    setMapLoadFailed(false);
  }, [preferredMapImage]);

  /**
   * Enrich stalls with fixed position coordinates from stallPositions config.
   * This merges API stall data (vendor/status) with fixed map positions.
   * The enrichment happens here automatically - no need to do it before passing stalls prop.
   */
  const normalizedStalls = useMemo(
    () => {
      if (!stalls || stalls.length === 0) return [];
      
      try {
        // Enrich each stall with its fixed position coordinates
        return enrichStallsWithPositions(stalls);
      } catch (err) {
        console.error('[VendorStallMap] Error enriching stalls:', err);
        // Fallback: return stalls with default positioning if enrichment fails
        return (stalls || []).map((stall, index) => ({
          ...stall,
          mapX: Math.min(96, Math.max(4, Number(stall.mapX ?? 50))),
          mapY: Math.min(96, Math.max(4, Number(stall.mapY ?? 50))),
          category: stall.category || 'General',
          description: stall.description || `Stall ${stall.stallNumber}`,
          _index: index,
        }));
      }
    },
    [stalls],
  );

  const reservedCount = normalizedStalls.filter((s) => s.vendorId && s.vendor).length;
  const freeCount = normalizedStalls.filter((s) => !s.vendorId || !s.vendor).length;

  if (loading) {
    return (
      <div className="vendor-stall-map-container">
        <div className="stall-map-loading">
          <div className="loading-spinner"></div>
          <p>Loading stall allocation map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vendor-stall-map-container">
        <div className="stall-map-error">
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!stalls || stalls.length === 0) {
    return (
      <div className="vendor-stall-map-container">
        <div className="stall-map-empty-state">
          <div className="empty-state-icon">📍</div>
          <h4 className="empty-state-title">No Stall Allocation Yet</h4>
          <p className="empty-state-description">
            No vendor stalls have been allocated for this event. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-stall-map-container" style={isDarkMode ? { '--bg-primary': '#1F2937' } : {}}>
      <div className="stall-map-header">
        <div className="stall-map-headline">
          <h3 className="stall-map-title">{title}</h3>
          {subtitle ? <p className="stall-map-subtitle">{subtitle}</p> : null}
        </div>
        <div className="stall-map-legend">
          <div className="legend-item">
            <span className="legend-badge legend-reserved"></span>
            <span className="legend-label">Red = Reserved ({reservedCount})</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge legend-free"></span>
            <span className="legend-label">Blue = Free ({freeCount})</span>
          </div>
        </div>
      </div>

      <div className="stall-map-canvas">
        {activeMapImage && !mapLoadFailed ? (
          <img
            src={activeMapImage}
            alt="Stall map"
            className="stall-map-bg-image"
            onError={() => {
              if (activeMapImage !== fallbackMapImage) {
                setActiveMapImage(fallbackMapImage);
                return;
              }
              setMapLoadFailed(true);
            }}
          />
        ) : (
          <div className="stall-map-fallback-overlay" />
        )}

        {normalizedStalls.map((stall) => {
          const isReserved = Boolean(stall.vendorId && stall.vendor);
          const isHovered = hoveredStallId === stall.id;
          return (
            <div
              key={stall.id || `stall-${stall.stallNumber || stall._index}`}
              className="stall-map-pin-wrap"
              style={{ left: `${stall.mapX}%`, top: `${stall.mapY}%` }}
              onMouseEnter={() => setHoveredStallId(stall.id)}
              onMouseLeave={() => setHoveredStallId(null)}
              data-testid={`stall-${stall.stallNumber}`}
              data-stall-number={stall.stallNumber}
              data-reserved={isReserved ? 'true' : 'false'}
            >
              <button
                className={`stall-map-pin ${isReserved ? 'stall-map-pin-reserved' : 'stall-map-pin-free'}`}
                aria-label={`Stall ${stall.stallNumber} - ${stall.category} - ${isReserved ? 'Reserved' : 'Available'}`}
                type="button"
              >
                {stall.stallNumber}
              </button>

              {isHovered ? (
                <div className="stall-map-tooltip">
                  <div className="stall-map-tooltip-title">Stall {stall.stallNumber}</div>
                  <div className="stall-map-tooltip-line">Status: <strong>{isReserved ? 'Reserved' : 'Available'}</strong></div>
                  <div className="stall-map-tooltip-line">Category: <strong>{stall.category || 'General'}</strong></div>
                  {stall.description && (
                    <div className="stall-map-tooltip-line">Location: <strong>{stall.description}</strong></div>
                  )}
                  <div className="stall-map-tooltip-line">Vendor: <strong>{stall.vendor?.name || stall.vendor?.companyName || 'Unassigned'}</strong></div>
                  {stall.vendor?.contactName ? (
                    <div className="stall-map-tooltip-line">Contact: <strong>{stall.vendor.contactName}</strong></div>
                  ) : null}
                  {stall.vendor?.contactPhone ? (
                    <div className="stall-map-tooltip-line">Phone: <strong>{stall.vendor.contactPhone}</strong></div>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="stall-map-footer">
        <p className="stall-map-info">
          Total Stalls: {normalizedStalls.length} • Reserved: {reservedCount} • Free: {freeCount}
        </p>
      </div>
    </div>
  );
}
