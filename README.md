[![SWUbanner](https://github.com/vshymanskyy/StandWithUkraine/blob/main/banner-direct-single.svg)](https://vshymanskyy.github.io/StandWithUkraine/)

# Niro Spy

Companion app for the Kia e-Niro and Huyndai Kona.

Allows to monitor live data and charts, exporting and importing trip recording.

Works with BLE (Bluetooth 4+) OBD2 adapters and browsers supporting Web Bluetooth API.

Language support:

- [Ukrainian](https://niro-spy.tupychak.com.ua/?lang=uk)
- [English](https://niro-spy.tupychak.com.ua/?lang=en)
- [Korean](https://niro-spy.tupychak.com.ua/?lang=ko)
- [Slovak](https://niro-spy.tupychak.com.ua/?lang=sk)

## Screenshots

### Main screen

![Main screen](screenshots/screenshot_00.png)

### All OBD2 parameters

![All OBD2 parameters](screenshots/screenshot_01.png)
![All OBD2 parameters](screenshots/screenshot_02.png)
![All OBD2 parameters](screenshots/screenshot_03.png)

### Charts for OBD2 parameters

![Charts for OBD2 parameters](screenshots/screenshot_04.png)
![Charts for OBD2 parameters](screenshots/screenshot_05.png)

### Battery info page

![Battery info page](screenshots/screenshot_06.png)
![Battery info page](screenshots/screenshot_07.png)

### TPMS (tire temperature and pressure monitoring)

![TPMS (tire temperature and pressure monitoring)](screenshots/screenshot_08.png)

### VIN

![VIN](screenshots/screenshot_09.png)

### Trip info page

![Trip info page](screenshots/screenshot_10.png)
![Trip info page](screenshots/screenshot_11.png)

### Supported languages

![Supported languages](screenshots/screenshot_12.png)
![Supported languages](screenshots/screenshot_13.png)
![Supported languages](screenshots/screenshot_14.png)

### Debugger (CAN message explorer)

![Debugger (CAN message explorer) screenshot 2](screenshots/screenshot_15.png)
![Debugger (CAN message explorer) screenshot 2](screenshots/screenshot_16.png)
![Debugger (CAN message explorer) screenshot 2](screenshots/screenshot_17.png)
![Debugger (CAN message explorer) screenshot 2](screenshots/screenshot_18.png)
![Debugger (CAN message explorer) screenshot 2](screenshots/screenshot_19.png)

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
