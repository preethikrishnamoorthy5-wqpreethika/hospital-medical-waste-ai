// Advanced Mode: Department Bin Capacity & Compartment Routing Service

/**
 * Suggests the exact compartment/bin number based on waste type and real-time bin capacity
 * @param {Object} params
 * @param {string} params.category - Category key ('YELLOW', 'RED', 'WHITE', 'BLUE', 'BLACK')
 * @param {string} params.departmentId - Hospital ward ID (e.g. 'ICU', 'WARD_3')
 * @param {number} params.estimatedWeightKg - Weight in kg
 * @param {Array} params.bins - Current list of all hospital bins
 */
export function routeWasteToCompartment({ category, departmentId, estimatedWeightKg = 0.2, bins = [] }) {
  // 1. Filter bins belonging to this department with the matching waste category
  const departmentBins = bins.filter(
    b => b.departmentId === departmentId && b.category === category
  );

  if (departmentBins.length === 0) {
    // Fallback to finding closest bin in another department or general pool
    const alternateBin = bins.find(b => b.category === category && (b.currentFillKg / b.maxCapacityKg) < 0.85);
    if (alternateBin) {
      return {
        recommendedBin: alternateBin,
        status: 'Rerouted',
        fillPercentage: Math.round((alternateBin.currentFillKg / alternateBin.maxCapacityKg) * 100),
        message: `No active ${category} bin registered directly in this ward. Rerouting to ${alternateBin.binCode} (${alternateBin.locationTag}).`,
        warningLevel: 'info',
        availableBins: []
      };
    }
    return {
      recommendedBin: null,
      status: 'Unavailable',
      fillPercentage: 100,
      message: `No operational ${category} bins available in the hospital. Request immediate bin provisioning from Infection Control.`,
      warningLevel: 'critical',
      availableBins: []
    };
  }

  // Calculate projected fill for all candidate bins
  const evaluatedBins = departmentBins.map(bin => {
    const currentFill = bin.currentFillKg || 0;
    const max = bin.maxCapacityKg || 10;
    const currentPercent = Math.round((currentFill / max) * 100);
    const projectedFill = currentFill + estimatedWeightKg;
    const projectedPercent = Math.round((projectedFill / max) * 100);

    let state = 'Optimal';
    if (projectedPercent >= 90) {
      state = 'Critical';
    } else if (projectedPercent >= 75) {
      state = 'Warning';
    }

    return {
      ...bin,
      currentPercent,
      projectedFill: parseFloat(projectedFill.toFixed(2)),
      projectedPercent,
      state
    };
  });

  // Sort candidate bins by least filled first
  evaluatedBins.sort((a, b) => a.projectedPercent - b.projectedPercent);

  const bestBin = evaluatedBins[0];
  const mostFullBin = evaluatedBins[evaluatedBins.length - 1];

  // Routing recommendation logic
  let message = '';
  let warningLevel = 'optimal'; // 'optimal' | 'warning' | 'critical'

  if (bestBin.projectedPercent >= 95) {
    warningLevel = 'critical';
    message = `CRITICAL ALERT: All ${category} bins in this department are at or over capacity (${bestBin.currentPercent}%). Contact sanitation dispatch immediately before placing more waste.`;
  } else if (evaluatedBins.length > 1 && mostFullBin.currentPercent >= 80) {
    warningLevel = 'warning';
    message = `REROUTE SUGGESTION: Primary bin ${mostFullBin.binCode} (${mostFullBin.locationTag}) is at ${mostFullBin.currentPercent}%. Recommended: Use secondary bin ${bestBin.binCode} (${bestBin.locationTag}) at ${bestBin.currentPercent}% to balance ward load.`;
  } else if (bestBin.projectedPercent >= 75) {
    warningLevel = 'warning';
    message = `Bin ${bestBin.binCode} is nearing scheduled collection threshold (${bestBin.projectedPercent}% full). Scheduled for routine ward clearing.`;
  } else {
    warningLevel = 'optimal';
    message = `Optimal capacity available. Place item in Compartment ${bestBin.binCode} at ${bestBin.locationTag} (${bestBin.currentPercent}% currently utilized).`;
  }

  return {
    recommendedBin: bestBin,
    status: bestBin.state,
    fillPercentage: bestBin.projectedPercent,
    currentPercent: bestBin.currentPercent,
    message,
    warningLevel,
    availableBins: evaluatedBins
  };
}