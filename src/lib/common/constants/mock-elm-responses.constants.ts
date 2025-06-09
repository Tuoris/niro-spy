import { COMMANDS } from '$lib/elm-device/elm-commands.constants';
import type { Command } from '$lib/elm-device/elm-device.types';

export const MOCK_ELM_RESPONSES: Record<
	string,
	{
		command: Command;
		values: { timestamp: number; value: string }[];
	}
> = {
	'7D1 : 22C101': {
		command: COMMANDS.HKMC_EV_ABS_INFO01,
		values: [
			{
				timestamp: 1749304911652,
				value: `02A 
0: 62 C1 01 5F D7 E7
1: D0 FF FF 68 FF 04 E7 
2: D4 68 68 68 67 FF 7F 
3: FF 00 30 F4 00 00 00 
4: FF FF 7F F5 08 0E 07 
5: F6 00 FF 00 FF 3F FF 
6: FF AA AA AA AA AA AA
>`
			},
			{
				timestamp: 1749304912652,
				value: `02A 
0: 62 C2 01 5F D7 E7
1: D0 FF FF 68 FF 04 E7 
2: D4 68 68 68 67 FF 7F 
3: FF 00 30 F4 00 00 00 
4: FF FF 7F F5 08 0E 07 
5: F6 00 FF 00 FF 3F FF 
6: FF AA AA AA AA AA AA
>`
			},
			{
				timestamp: 1749304915652,
				value: `02A 
0: 62 AA 01 5F D7 E7
1: D0 FF FF 68 FF 04 E7 
2: D4 68 68 68 67 FF 7F 
3: FF 00 30 F4 00 00 00 
4: FF FF 7F F5 08 0E 07 
5: F6 00 FF 00 FF 3F FF 
6: FF AA AA AA AA AA AA
>`
			}
		]
	},
	'7E2 : 2102': {
		command: COMMANDS.HKMC_EV_VMCU_INFO02,
		values: [
			{
				timestamp: 1749304911652,
				value: `027 
0: 61 02 F8 FF FC 00
1: 01 01 00 00 00 94 1F
2: BC 6E F0 39 D7 0B 02
3: 93 F1 38 20 80 46 1B
4: 22 5F 00 00 01 01 01
>`
			},
			{
				timestamp: 1749304921652,
				value: `027 
0: 61 02 F8 FF FC 00
1: 01 01 00 00 00 94 1F
2: BC 6E F0 39 D7 0B 02
3: 93 F2 38 20 80 46 1B
4: 22 5F 00 00 01 01 01
5: 00 00 01 07 04 00 00
>`
			}
		]
	}
} as const;
