const covid19ImpactEstimator = (data) => {
    let {
        timeToElapse
    } = data;
    const { reportedCases, periodType, totalHospitalBeds } = data;
    const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = data.region;
    const impact = {
        currentlyInfected: reportedCases * 10

    };
    const severeImpact = {
        currentlyInfected: reportedCases * 50

    };
    const normalisedTime = () => {
        if (periodType === 'days') return 2 ** (timeToElapse / 3);
        if (periodType === 'weeks') {
            timeToElapse *= 7;
            return 2 ** (timeToElapse / 3);
        }
        timeToElapse *= 30;
        return 2 ** (timeToElapse / 3);
    };
    impact.infectionsByRequestedTime = impact.currentlyInfected * normalisedTime;
    severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * normalisedTime;
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
    return {
        data: data,
        impact: impact,
        severeImpact: severeImpact
    };
};

export default covid19ImpactEstimator;
