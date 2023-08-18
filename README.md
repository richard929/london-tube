# The London Transportation Problem

## How to Run & Play

### Installation

- Install [Node.js](https://nodejs.org/en/download)
- Install dependencies
  ```bash
  npm install
  ```
- Run the application
  ```
  npm run start
  ```

### Simple Test

Run `npm run test` to see how the app is working for the sample travel provided below.

- Tube Holborn to Earl’s Court
- 328 bus from Earl’s Court to Chelsea
- Tube Chelsea to Wimbledon

### User Interactive

Run `npm run start`, and provide input as prompted. You'll be asked to enter initial balance, start station, and then next stations moving forward while specifying travel type, and whether you wiped the card out or not for each tube travel.
Type `exit` when you want to finish travel, and the application will respond back with the cost of each trip, and final balance.

## Network Configuration

Modify `network.json` for different tube network.
It has three fields.

- zones: Total Zone Count
- stations: Station list with the zone it's in.
- fares: Fare data.
  - Supported types: `any` or `bus`
  - Length: Number of zones for the path.
  - Optional Rule:
    - includes: Zones included in the path
    - excludes: Zones should be excluded from the path
  - Price: Fare of the path
