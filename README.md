# Niro Spy

Companion app for the Kia e-Niro and Huyndai Kona.

Allows to monitor live data and charts, exporting and importing trip recording.

Works with BLE (Bluetooth 4+) OBD2 adapters and browsers supporting Web Bluetooth API.

English and Korean version is WIP.

## Screenshots

### Main screen

![Main screen](screenshots/screenshot_0000.png)

### All OBD2 parameters

![All OBD2 parameters](screenshots/screenshot_0001.png)

### Charts for OBD2 parameters

![Charts for OBD2 parameters](screenshots/screenshot_0002.png)

### Chart tooltips

![Chart tooltips](screenshots/screenshot_0003.png)

### Battery info page

![Battery info page](screenshots/screenshot_0004.png)

### Battery cells section

![Battery cells section](screenshots/screenshot_0005.png)

### TPMS (tire temperature and pressure monitoring)

![TPMS (tire temperature and pressure monitoring)](screenshots/screenshot_0006.png)

### VIN

![VIN](screenshots/screenshot_0007.png)

### Trip info page

![Trip info page](screenshots/screenshot_0008.png)

### Debugger (CAN message explorer)

![Debugger (CAN message explorer)](screenshots/screenshot_0009.png)

![Debugger (CAN message explorer) screenshot 2](screenshots/screenshot_0010.png)

## Developing

Install dependencies with `npm install` (or `pnpm install` or `yarn`).

Start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.
