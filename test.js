const prompt = require("prompt-sync")({ sigint: true });
const figlet = require("figlet");

const NETWORK = require("./network.json");

const getTravelInput = () => {
  const stationCount = NETWORK.stations.length;
  const path = [];
  let initialBalance,
    station,
    busTrip = "y",
    wipeOut = "y";

  while (1) {
    initialBalance = prompt("How much money do you have? ");
    initialBalance = Number(initialBalance);

    if (initialBalance > 0) {
      break;
    }

    console.log("Invalid input! Try again...");
  }

  while (1) {
    station = prompt(
      `Start the travel by choosing a station[0-${stationCount - 1}]: `
    );
    station = Number(station);

    if (station >= 0 && station < stationCount) {
      break;
    }

    console.log("Invalid station number! Try again...");
  }

  while (1) {
    path.push({ station, busTrip, wipeOut });

    while (1) {
      station = prompt(
        `Choose your next destination[0-${
          stationCount - 1
        }](type 'exit' to finish): `
      );
      if (station === "exit") {
        break;
      }

      station = Number(station);

      if (station >= 0 && station < stationCount) {
        break;
      }

      console.log("Invalid station number! Try again...");
    }

    if (station === "exit") {
      break;
    }

    while (1) {
      busTrip = prompt("Do you want to take a bus trip? (y/n) ");

      if (busTrip === "y" || busTrip === "n") {
        break;
      }

      console.log("Invalid input! Try again...");
    }

    if (busTrip === "n") {
      while (1) {
        wipeOut = prompt("Did you wipe out the card? (y/n) ");

        if (wipeOut === "y" || wipeOut === "n") {
          break;
        }

        console.log("Invalid input! Try again...");
      }
    }
  }

  return {
    initialBalance,
    path,
  };
};

const main = () => {
  console.log(figlet.textSync("London Tube"));
  console.log("Welcome to London Tube!\nHere is the list of the stations:");
  NETWORK.stations.forEach((station, index) => {
    console.log(`${index} - ${station.name}`);
  });

  const { initialBalance, path } = {
    initialBalance: 30,
    path: [
      { station: 0, busTrip: "y", wipeOut: "y" },
      { station: 2, busTrip: "n", wipeOut: "y" },
      { station: 1, busTrip: "y", wipeOut: "y" },
      { station: 3, busTrip: "n", wipeOut: "y" },
    ],
  };

  console.log("\n");

  // Calculate the final balance
  let finalBalance = initialBalance;
  const maxTubeCost = NETWORK.fares
    .filter((fare) => fare.type !== "bus")
    .reduce((max, fare) => Math.max(max, fare.price), 0);

  for (let i = 1; i < path.length; i++) {
    const previousPath = path[i - 1];
    const currentPath = path[i];

    let price = maxTubeCost;

    if (currentPath.busTrip === "y") {
      // Bus Trip
      const busFare = NETWORK.fares.find((fare) => fare.type === "bus");
      price = busFare.price;
    } else if (currentPath.wipeOut === "y") {
      // Find the minimum price between the two stations
      const startZones = NETWORK.stations[previousPath.station].zones;
      const endZones = NETWORK.stations[currentPath.station].zones;

      for (const startZone of startZones) {
        for (const endZone of endZones) {
          const zoneLength = Math.abs(startZone - endZone) + 1;

          const validFares = NETWORK.fares.filter((fare) => {
            if (fare.length !== zoneLength) {
              return false;
            }

            if (fare.rule) {
              if (fare.rule.includes) {
                for (const include of fare.rule.includes) {
                  if (
                    include >= Math.min(startZone, endZone) &&
                    include <= Math.min(startZone, endZone)
                  ) {
                    return true;
                  }
                }
                return false;
              }
              if (fare.rule.excludes) {
                for (const exclude of fare.rule.excludes) {
                  if (
                    exclude >= Math.min(startZone, endZone) &&
                    exclude <= Math.min(startZone, endZone)
                  ) {
                    return false;
                  }
                }
              }
            }

            return true;
          });

          const minPrice = validFares.reduce(
            (min, fare) => Math.min(min, fare.price),
            Infinity
          );

          if (price > minPrice) {
            price = minPrice;
          }
        }
      }
    }

    console.debug(
      `Cost for trip from ${NETWORK.stations[previousPath.station].name} to ${
        NETWORK.stations[currentPath.station].name
      }: ${price}`
    );
    finalBalance -= price;
  }

  console.log(`Your final balance is ${finalBalance}`);
};

(() => {
  main();
})();
