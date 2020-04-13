const normalisedTime = (timeToElapse, periodType) => {
  let days = '';
  if (periodType === 'days') days = timeToElapse;
  else if (periodType === 'weeks') days = timeToElapse * 7;
  else days = timeToElapse * 30;
  return 2 ** Math.trunc(days / 3);
};
const covid19ImpactEstimator = (data) => {
  const input = data;
  const {
    reportedCases, timeToElapse, periodType, totalHospitalBeds
  } = data;
  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = data.region;
  const impact = { currentlyInfected: reportedCases * 10 };
  const severeImpact = { currentlyInfected: reportedCases * 50 };
  const normalisedTimePeriod = normalisedTime(timeToElapse, periodType);

  impact.infectionsByRequestedTime = impact.currentlyInfected * normalisedTimePeriod;
  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * normalisedTimePeriod;

  impact.severeCasesByRequestedTime = impact.infectionsByRequestedTime * 0.15;
  severeImpact.severeCasesByRequestedTime = severeImpact.infectionsByRequestedTime * 0.15;
  const freeBeds = totalHospitalBeds * 0.35;
  impact.hospitalBedsByRequestedTime = freeBeds - impact.severeCasesByRequestedTime;
  severeImpact.hospitalBedsByRequestedTime = freeBeds - severeImpact.severeCasesByRequestedTime;
  impact.casesForICUByRequestedTime = impact.infectionsByRequestedTime * 0.05;
  severeImpact.casesForICUByRequestedTime = severeImpact.infectionsByRequestedTime * 0.05;
  impact.casesForVentilatorsByRequestedTime = impact.infectionsByRequestedTime * 0.02;
  severeImpact.casesForVentilatorsByRequestedTime = severeImpact.infectionsByRequestedTime * 0.02;
  const avgD = avgDailyIncomeInUSD;
  const avgDIP = avgDailyIncomePopulation;
  impact.dollarsInFlight = (impact.infectionsByRequestedTime * avgD * avgDIP) / 30;
  severeImpact.dollarsInFlight = (severeImpact.infectionsByRequestedTime * avgD * avgDIP) / 30;
  const impactData = impact;
  const severeImpactData = severeImpact;
  return {
    data: input,
    impact: impactData,
    severeImpact: severeImpactData
  };
};
export default covid19ImpactEstimator;
