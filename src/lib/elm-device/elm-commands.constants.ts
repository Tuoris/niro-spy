import * as obdParsers from './parsers/obd2.parsers';
import * as hkmcParsers from './parsers/hkmc.parsers';
import type { Command } from './elm-device.types';
import { HKMC_HEADERS } from './elm-headers.constants';

export const COMMANDS = {
	PIDS_SUPPORTED: {
		payload: '0100',
		responseParser: obdParsers.defaultParser
	},
	WARM_START: {
		payload: 'AT WS',
		responseParser: obdParsers.defaultParser
	},
	ECHO_OFF: {
		payload: 'AT E 0',
		responseParser: obdParsers.defaultParser
	},
	EXTEND_WAIT_TIMEOUT: {
		payload: 'AT ST 96',
		responseParser: obdParsers.defaultParser
	},
	ALLOW_LONG_OBD2_RESPONSES: {
		payload: 'AT AL',
		responseParser: obdParsers.defaultParser
	},
	VIN: {
		payload: '0902',
		responseParser: obdParsers.parseVINResponse
	},
	MONITOR_STATUS_SINCE_DTCS_CLEARED: {
		payload: '0101',
		responseParser: obdParsers.parseMonitorStatusSinceDtcsCleared
	},
	ENGINE_COOLANT_TEMPERATURE: {
		payload: '0105',
		responseParser: obdParsers.parseEngineCoolantTemperature
	},
	ENGINE_OIL_TEMPERATURE: {
		payload: '015C',
		responseParser: obdParsers.parseEngineOilTemperature
	},
	CALCULATED_ENGINE_LOAD: {
		payload: '0104',
		responseParser: obdParsers.parseCalculatedEngineLoad
	},
	ENGINE_SPEED: {
		payload: '010C',
		responseParser: obdParsers.parseEngineSpeed
	},
	VEHICLE_SPEED: {
		payload: '010D',
		responseParser: obdParsers.parseVehicleSpeed
	},
	INTAKE_AIR_TEMPERATURE: {
		payload: '010F',
		responseParser: obdParsers.parseIntakeAirTemperature
	},
	MASS_AIR_FLOW_SENSOR: {
		payload: '0110',
		responseParser: obdParsers.parseMassAirFlowSensor
	},
	THROTTLE_POSITION: {
		payload: '0111',
		responseParser: obdParsers.parseThrottlePosition
	},
	FUEL_TANK_LEVEL: {
		payload: '012F',
		responseParser: obdParsers.parseFuelTankLevel
	},
	CONTROL_MODULE_VOLTAGE: {
		payload: '0142',
		responseParser: obdParsers.parseControlModuleVoltage
	},
	ENGINE_FUEL_RATE: {
		payload: '015E',
		responseParser: obdParsers.parseEngineFuelRate
	},
	HKMC_BMS_INFO01: {
		payload: '220101',
		header: HKMC_HEADERS.BMS,
		responseParser: hkmcParsers.parseHkmcEvBmsInfo01
	},
	HKMC_BMS_INFO02: {
		payload: '220102',
		header: HKMC_HEADERS.BMS,
		responseParser: hkmcParsers.parseHkmcEvBmsInfo02
	},
	HKMC_BMS_INFO03: {
		payload: '220103',
		header: HKMC_HEADERS.BMS,
		responseParser: hkmcParsers.parseHkmcEvBmsInfo03
	},
	HKMC_BMS_INFO04: {
		payload: '220104',
		header: HKMC_HEADERS.BMS,
		responseParser: hkmcParsers.parseHkmcEvBmsInfo04
	},
	HKMC_BMS_INFO05: {
		payload: '220105',
		header: HKMC_HEADERS.BMS,
		responseParser: hkmcParsers.parseHkmcEvBmsInfo05
	},
	HKMC_BMS_INFO06: {
		payload: '220106',
		header: HKMC_HEADERS.BMS,
		responseParser: hkmcParsers.parseHkmcEvBmsInfo06
	},
	HKMC_EV_CLUSTER_INFO02: {
		payload: '22B002',
		header: HKMC_HEADERS.CLUSTER,
		responseParser: hkmcParsers.parseHkmcEvClusterInfo02
	},
	HKMC_EV_ABS_INFO01: {
		payload: '22C101',
		header: HKMC_HEADERS.ABS,
		responseParser: hkmcParsers.parseHkmcEvAbsInfo01
	},
	HKMC_EV_VMCU_INFO01: {
		payload: '2101',
		header: HKMC_HEADERS.VMCU,
		responseParser: hkmcParsers.parseHkmcEvVmcuInfo01
	},
	HKMC_EV_VMCU_INFO02: {
		payload: '2102',
		header: HKMC_HEADERS.VMCU,
		responseParser: hkmcParsers.parseHkmcEvVmcuInfo02
	},
	HKMC_EV_ECU_7D4_INFO01: {
		payload: '220101',
		header: HKMC_HEADERS.ECU_7D4,
		responseParser: hkmcParsers.parseHkmcEcu7D4Info01
	},
	HKMC_EV_TPMS_ECU_INFO02: {
		payload: '22C00B',
		header: HKMC_HEADERS.TPMS,
		responseParser: hkmcParsers.parseHkmcEvTpmsInfo02
	},
	HKMC_EV_AIRCON_ECU_INFO00: {
		payload: '220100',
		header: HKMC_HEADERS.AIRCON,
		responseParser: hkmcParsers.parseHkmcEvAirconInfo00,
		waitAfterCommand: 120
	},
	HKMC_EV_AIRCON_ECU_INFO02: {
		payload: '220102',
		header: HKMC_HEADERS.AIRCON,
		responseParser: hkmcParsers.parseHkmcEvAirconInfo02,
		waitAfterCommand: 120
	},
	HKMC_EV_MCU_INFO02: {
		payload: '2102',
		header: HKMC_HEADERS.MCU,
		responseParser: hkmcParsers.parseHkmcEvMcuInfo02
	}
} as const;
