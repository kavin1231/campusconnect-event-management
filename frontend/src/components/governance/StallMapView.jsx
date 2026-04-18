import { useMemo, useState } from "react";

const PRIMARY_MAP_IMAGE_URL = "/maps/sliit-campus-map.png";

const StallMapView = ({ stalls = [], eventName = "", loading = false }) => {
  const [selectedStall, setSelectedStall] = useState(null);

  const summary = useMemo(() => {
    const reserved = stalls.filter((stall) => stall.status === "RESERVED").length;
    return {
      total: stalls.length,
      reserved,
      available: stalls.length - reserved,
    };
  }, [stalls]);

  if (loading) {
    return (
      <div
        className="rounded-3xl border p-8 text-sm"
        style={{
          borderColor: "var(--border-color)",
          backgroundColor: "var(--bg-card)",
          color: "var(--text-muted)",
        }}
      >
        Loading stall map...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className="rounded-3xl border p-4 sm:p-5"
        style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold" style={{ color: "var(--text-main)" }}>
              SLIIT Stall Allocation Map
            </h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {eventName || "Select an event to render stall markers"}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs sm:text-sm" style={{ color: "var(--text-muted)" }}>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Red = Reserved ({summary.reserved})
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Blue = Free ({summary.available})
            </span>
          </div>
        </div>

        <div
          className="relative w-full overflow-hidden rounded-2xl border"
          style={{ borderColor: "var(--border-color)", aspectRatio: "16 / 9", backgroundColor: "#0f172a" }}
        >
          <img
            src={PRIMARY_MAP_IMAGE_URL}
            alt="SLIIT stall map background"
            className="h-full w-full object-cover opacity-85"
          />

          {stalls.map((stall) => {
            const isReserved = stall.status === "RESERVED";
            return (
              <button
                key={stall.id}
                type="button"
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
                style={{ left: `${stall.mapX}%`, top: `${stall.mapY}%` }}
                onClick={() => setSelectedStall(stall)}
                aria-label={`Open stall ${stall.stallNumber} details`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-[10px] font-bold text-white shadow-lg ${
                    isReserved
                      ? "border-red-300 bg-red-500"
                      : "border-blue-300 bg-blue-500"
                  }`}
                >
                  {stall.stallNumber}
                </span>
              </button>
            );
          })}
        </div>

        {selectedStall ? (
          <div className="fixed inset-0 z-[1300] flex items-end justify-center bg-black/40 p-4 sm:items-center" onClick={() => setSelectedStall(null)}>
            <div
              className="w-full max-w-sm rounded-2xl border p-4 shadow-xl"
              style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-base font-bold" style={{ color: "var(--text-main)" }}>
                  Stall {selectedStall.stallNumber}
                </h4>
                <button
                  type="button"
                  onClick={() => setSelectedStall(null)}
                  className="rounded-md px-2 py-1 text-xs font-semibold"
                  style={{ color: "var(--text-muted)" }}
                >
                  Close
                </button>
              </div>

              <div className="mt-3 space-y-1 text-sm" style={{ color: "var(--text-main)" }}>
                <p>Vendor: {selectedStall.vendor?.name || "-"}</p>
                <p>Service Category: {selectedStall.serviceCategory || selectedStall.vendor?.serviceCategory || "-"}</p>
                <p>Event: {selectedStall.event?.title || eventName || "-"}</p>
                <p>
                  Status: {selectedStall.status === "RESERVED" ? "Reserved" : "Free"}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default StallMapView;
