package com.campusconnect.presidentdashboard.dto.dashboard;

import java.math.BigDecimal;

public record DashboardSummaryResponse(
        long totalEvents,
        long upcomingEvents,
        long totalVendors,
        long totalSponsorships,
        BigDecimal totalSponsorshipAmount
) {
}
