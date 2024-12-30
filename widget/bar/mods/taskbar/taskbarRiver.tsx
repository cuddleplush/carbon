import { Gdk } from "astal/gtk3";
import { bind } from "astal";
import { getRiverOutput, truncateString } from "../../../../utils";

export function Taskbar(gdkmonitor: Gdk.Monitor): JSX.Element {
	const output = getRiverOutput(gdkmonitor);
	return <box className={"window-box"}>
		<button
			className={"module window"}
			visible={true}
			cursor="pointer">
			<box spacing={5}>
				<label label={bind(output!, "focused_view").as((label) => label != null && label.length > 0 ? truncateString(label, 30) : "Desktop")}/>
			</box>
		</button>
	</box>
}
