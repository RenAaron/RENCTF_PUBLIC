# RenCTF

RenCTF is an interactive, team-based platform designed to teach penetration testing (pentesting) skills. Combining web application functionality with hardware integration, RenCTF provides a unique and engaging experience for participants. This project was developed by **RenAaron Ellis** and **Dr. Zuzak**.

## Features

### Web Application
- **Frontend Framework**: Built using Angular.
- **Data Hosting**: Firebase is utilized for hosting user and game data.
- **API Integration**: Stubbed-out API keys are included in the `Webapp` directory in the `master` branch.

### Server
- **Backend Hosting**: Heroku serves as the backend hosting solution.
- Stubbed-out API keys for the server can be found in the `Server` directory on the `main` branch.

### Hardware Integration
- **Components**:
  - 64x64 LED Matrix.
  - 5.5” HDMI OLED Display.
  - Raspberry Pi ZERO WH.
  - Custom 3D-Printed Case.
- The LED matrix visually displays:
  - Leaderboard.
  - Game status.
  - Other media.

### Activities
- Solve Capture The Flag (CTF) challenges via third-party platforms such as PicoCTF.
- Submit correct flags through the web app to climb the leaderboard.
- Engage in grid-based board games including:
  - Othello/Go.
  - Connect4.
  - Super TIC-TAC-TOE.

## Development Tools
RenCTF was developed using the following technologies:
- **Firebase**: For front-end hosting and database management.
- **Angular**: To build the web application's frontend.
- **Heroku**: For backend/server hosting.
- **Blender**: For rendering web app and matrix GIFs.
- **Fusion360**: For designing 3D-printed hardware housing.

## Installation

### Prerequisites
1. Ensure you have the following installed:
   - Node.js and npm.
   - Angular CLI.
   - Firebase CLI.
   - Heroku CLI.
2. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/renctf.git
   ```

### Web App Setup
1. Navigate to the `Webapp` directory:
   ```bash
   cd Webapp
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Firebase:
   - Replace the stubbed-out API keys with your Firebase project credentials in `Server/index.js`.
   - Replace the stubbed-out API keys with your Firebase project credentials in `ren-ctf-webapp/src/firebase.js`.
4. Start the development server:
   ```bash
   ng serve
   ```

### Server Setup
1. Navigate to the `Server` directory:
   ```bash
   cd Server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Deploy the backend to Heroku:
   ```bash
   heroku login
   git push heroku main
   ```

## Usage
1. Visit the live web app: [RenCTF Web App](https://ren-ctf-webapp.web.app/).
2. Log in and start solving CTF challenges on third-party platforms.
3. Submit flags to advance on the leaderboard.

## Acknowledgements
This work is supported by National Science Foundation grant 2245573 
4. View your progress and game status on the LED matrix within your department.


---
