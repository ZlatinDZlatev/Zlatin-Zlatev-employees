const findCommonDays = (startDate1, endDate1, startDate2, endDate2) => {
    if (endDate1 < startDate2 || endDate2 < startDate1) return 0;
    const commonStart = startDate1 > startDate2 ? startDate1 : startDate2;
    const commonEnd = endDate1 < endDate2 ? endDate1 : endDate2;
    const commonDays = (commonEnd - commonStart) / 86400000;
    return commonDays;
  };

  export default findCommonDays