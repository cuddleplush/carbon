import { App, Gdk } from "astal/gtk3"

export function Launcher(gdkmonitor: Gdk.Monitor): JSX.Element { 
	return <box className={"launcher-box"}>
		<button
			label={"󰣨"}
			className={"module ctrl"}
			tooltipText={"Control Panel"}
			cursor="pointer"
			onClick={() => App.toggle_window(`ctrl${gdkmonitor.model}`)} >
		</button>
	</box>
}
