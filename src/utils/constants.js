export const SERVER = "/api";
export const getArrivalDepartureTime = (sourceCode, stationlist) => {
  try {
    const temp = stationlist?.filter(
      (x) => x?.stationCode.toUpperCase() === sourceCode?.toUpperCase()
    );
    return {
      departureTime: temp[0]?.departureTime,
      arrivalTime: temp[0]?.arrivalTime,
    };
  } catch (err) {
    console.log(err.message);
  }
};
