import { Gdk } from "astal/gtk3";
import { bind, Variable } from "astal";
import { getRiverOutput } from "../../../../utils";

const classname = (i: number, gdkmonitor: Gdk.Monitor): Variable<string> => {
	const output = getRiverOutput(gdkmonitor);
	if (output == null) return new Variable("");
	return Variable.derive([
		bind(output, "focused_tags"),
		bind(output, "urgent_tags"),
		bind(output, "occupied_tags")
	],
		(isFocused, isUrgent, isOccupied) => {
			if ((isFocused & (1 << (i - 1))) !== 0) return("ws-button focused");
			if ((isOccupied & (1 << (i - 1))) !== 0) return("ws-button occupied");
			if ((isUrgent & (1 << (i - 1))) !== 0) return("ws-button urgent");
			else return("ws-button")
		});
};

const workspaceButton = (i: number, gdkmonitor: Gdk.Monitor): JSX.Element => {
	const output = getRiverOutput(gdkmonitor);
	const icons = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
	return <button
		className={bind(classname(i, gdkmonitor))}
		cursor="pointer"
		onClick={(_, event) => {
			if (event.button === Gdk.BUTTON_PRIMARY) output!.focused_tags = 1 << (i - 1);
			if (event.button === Gdk.BUTTON_SECONDARY) output!.focused_tags ^= 1 << (i - 1);
		}}
	>
		<label label={icons[i - 1]}/>
	</button>
};

export const Workspaces = (gdkmonitor: Gdk.Monitor): JSX.Element => {
	return <box spacing={8}>{(Array.from({ length: 5 }, (_, i) => {
		return workspaceButton(i + 1, gdkmonitor)
	}))}
	</box>
};
