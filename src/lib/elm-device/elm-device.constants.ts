import * as obdParsers from './parsers/obd2.parsers';
import * as hkmcParsers from './parsers/hkmc.parsers';
import type { Command } from './elm-device.types';

export const COMMANDS = {
	PIDS_SUPPORTED: {
		i18Label: 'commandPidsSupported',
		payload: '0100',
		responseParser: obdParsers.defaultParser
	},
	WARM_START: {
		i18Label: 'commandWarmStart',
		payload: 'AT WS',
		responseParser: obdParsers.defaultParser
	},
	ECHO_OFF: {
		i18Label: 'commandEchoOff',
		payload: 'AT E 0',
		responseParser: obdParsers.defaultParser
	},
	EXTEND_WAIT_TIMEOUT: {
		i18Label: 'commandExtendWaitTimeout',
		payload: 'AT ST 96',
		responseParser: obdParsers.defaultParser
	},
	ALLOW_LONG_OBD2_RESPONSES: {
		i18Label: 'commandAllowLongObd2Responses',
		payload: 'AT AL',
		responseParser: obdParsers.defaultParser
	},
	VIN: {
		i18Label: 'commandVin',
		payload: '0902',
		responseParser: obdParsers.parseVINResponse
	},
	MONITOR_STATUS_SINCE_DTCS_CLEARED: {
		i18Label: 'commandMonitorStatusSinceDtcsCleared',
		payload: '0101',
		responseParser: obdParsers.parseMonitorStatusSinceDtcsCleared
	},
	ENGINE_COOLANT_TEMPERATURE: {
		i18Label: 'commandEngineCoolantTemperature',
		payload: '0105',
		responseParser: obdParsers.parseEngineCoolantTemperature
	},
	ENGINE_OIL_TEMPERATURE: {
		i18Label: 'commandEngineOilTemperature',
		payload: '015C',
		responseParser: obdParsers.parseEngineOilTemperature
	},
	CALCULATED_ENGINE_LOAD: {
		i18Label: 'commandCalculatedEngineLoad',
		payload: '0104',
		responseParser: obdParsers.parseCalculatedEngineLoad
	},
	ENGINE_SPEED: {
		i18Label: 'commandEngineSpeed',
		payload: '010C',
		responseParser: obdParsers.parseEngineSpeed
	},
	VEHICLE_SPEED: {
		i18Label: 'commandVehicleSpeed',
		payload: '010D',
		responseParser: obdParsers.parseVehicleSpeed
	},
	INTAKE_AIR_TEMPERATURE: {
		i18Label: 'commandIntakeAirTemperature',
		payload: '010F',
		responseParser: obdParsers.parseIntakeAirTemperature
	},
	MASS_AIR_FLOW_SENSOR: {
		i18Label: 'commandMassAirFlowSensor',
		payload: '0110',
		responseParser: obdParsers.parseMassAirFlowSensor
	},
	THROTTLE_POSITION: {
		i18Label: 'commandThrottlePosition',
		payload: '0111',
		responseParser: obdParsers.parseThrottlePosition
	},
	FUEL_TANK_LEVEL: {
		i18Label: 'commandFuelTankLevel',
		payload: '012F',
		responseParser: obdParsers.parseFuelTankLevel
	},
	CONTROL_MODULE_VOLTAGE: {
		i18Label: 'commandControlModuleVoltage',
		payload: '0142',
		responseParser: obdParsers.parseControlModuleVoltage
	},
	ENGINE_FUEL_RATE: {
		i18Label: 'commandEngineFuelRate',
		payload: '015E',
		responseParser: obdParsers.parseEngineFuelRate
	},
	HKMC_BMS_INFO01: {
		i18Label: 'commandHkmcBmsInfo01',
		payload: '220101',
		header: '7E4',
		responseParser: hkmcParsers.parseHkmcEvBmsInfo01
	},
	HKMC_BMS_INFO02: {
		i18Label: 'commandHkmcBmsInfo02',
		payload: '220102',
		header: '7E4',
		responseParser: hkmcParsers.parseHkmcEvBmsInfo02
	},
	HKMC_BMS_INFO03: {
		i18Label: 'commandHkmcBmsInfo03',
		payload: '220103',
		header: '7E4',
		responseParser: hkmcParsers.parseHkmcEvBmsInfo03
	},
	HKMC_BMS_INFO04: {
		i18Label: 'commandHkmcBmsInfo04',
		payload: '220104',
		header: '7E4',
		responseParser: hkmcParsers.parseHkmcEvBmsInfo04
	},
	HKMC_BMS_INFO05: {
		i18Label: 'commandHkmcBmsInfo05',
		payload: '220105',
		header: '7E4',
		responseParser: hkmcParsers.parseHkmcEvBmsInfo05
	},
	HKMC_BMS_INFO06: {
		i18Label: 'commandHkmcBmsInfo06',
		payload: '220106',
		header: '7E4',
		responseParser: hkmcParsers.parseHkmcEvBmsInfo06
	},
	HKMC_EV_CLUSTER_INFO02: {
		i18Label: 'parseHkmcEvClusterInfo02',
		payload: '22B002',
		header: '7C6',
		responseParser: hkmcParsers.parseHkmcEvClusterInfo02
	},
	HKMC_EV_ABS_INFO01: {
		i18Label: 'parseHkmcEvAbsInfo01',
		payload: '22C101',
		header: '7D1',
		responseParser: hkmcParsers.parseHkmcEvAbsInfo01
	},
	HKMC_EV_VMCU_INFO01: {
		i18Label: 'parseHkmcEvVmcuInfo01',
		payload: '2101',
		header: '7E2',
		responseParser: hkmcParsers.parseHkmcEvVmcuInfo01
	}
} as const;
