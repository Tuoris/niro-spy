import * as obdParsers from './parsers/obd2.parsers';
import * as hkmcParsers from './parsers/hkmc.parsers';
import type { Command } from './elm-device.types';

export const COMMANDS: Command[] = [
	{
		i18Label: 'commandVin',
		payload: '0902',
		responseParser: obdParsers.parseVINResponse
	},
	{
		i18Label: 'commandMonitorStatusSinceDtcsCleared',
		payload: '0101',
		responseParser: obdParsers.parseMonitorStatusSinceDtcsCleared
	},
	{
		i18Label: 'commandEngineCoolantTemperature',
		payload: '0105',
		responseParser: obdParsers.parseEngineCoolantTemperature
	},
	{
		i18Label: 'commandEngineOilTemperature',
		payload: '015C',
		responseParser: obdParsers.parseEngineOilTemperature
	},
	{
		i18Label: 'commandCalculatedEngineLoad',
		payload: '0104',
		responseParser: obdParsers.parseCalculatedEngineLoad
	},
	{
		i18Label: 'commandEngineSpeed',
		payload: '010C',
		responseParser: obdParsers.parseEngineSpeed
	},
	{
		i18Label: 'commandVehicleSpeed',
		payload: '010D',
		responseParser: obdParsers.parseVehicleSpeed
	},
	{
		i18Label: 'commandIntakeAirTemperature',
		payload: '010F',
		responseParser: obdParsers.parseIntakeAirTemperature
	},
	{
		i18Label: 'commandMassAirFlowSensor',
		payload: '0110',
		responseParser: obdParsers.parseMassAirFlowSensor
	},
	{
		i18Label: 'commandThrottlePosition',
		payload: '0111',
		responseParser: obdParsers.parseThrottlePosition
	},
	{
		i18Label: 'commandFuelTankLevel',
		payload: '012F',
		responseParser: obdParsers.parseFuelTankLevel
	},
	{
		i18Label: 'commandControlModuleVoltage',
		payload: '0142',
		responseParser: obdParsers.parseControlModuleVoltage
	},
	{
		i18Label: 'commandEngineFuelRate',
		payload: '015E',
		responseParser: obdParsers.parseEngineFuelRate
	},
	{
		i18Label: 'commandExtendedTimeout',
		payload: 'AT ST 96',
		responseParser: obdParsers.defaultParser
	},
	{
		i18Label: 'commandHkmcBmsInfo01',
		payload: '220101',
		header: '7E4',
		responseParser: hkmcParsers.parseHkmcEvBmsInfo01
	},
	{
		i18Label: 'commandHkmcBmsInfo02',
		payload: '220102',
		header: '7E4',
		responseParser: hkmcParsers.parseHkmcEvBmsInfo02
	},
	{
		i18Label: 'commandHkmcBmsInfo03',
		payload: '220103',
		header: '7E4',
		responseParser: hkmcParsers.parseHkmcEvBmsInfo03
	},
	{
		i18Label: 'commandHkmcBmsInfo04',
		payload: '220104',
		header: '7E4',
		responseParser: hkmcParsers.parseHkmcEvBmsInfo04
	},
	{
		i18Label: 'commandHkmcBmsInfo05',
		payload: '220105',
		header: '7E4',
		responseParser: hkmcParsers.parseHkmcEvBmsInfo05
	},
	{
		i18Label: 'commandHkmcBmsInfo06',
		payload: '220106',
		header: '7E4',
		responseParser: hkmcParsers.parseHkmcEvBmsInfo06
	},
	{
		i18Label: 'parseHkmcEvClusterInfo02',
		payload: '22B002',
		header: '7C^',
		responseParser: hkmcParsers.parseHkmcEvClusterInfo02
	}
];
