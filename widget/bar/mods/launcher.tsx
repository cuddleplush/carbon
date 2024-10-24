import { App } from "astal/gtk3"

export function Launcher(monitor: number): JSX.Element { 
	return <button
		label={"󰣨"}
		className={"module ctrl"}
		tooltipText={"Control Panel"}
		onClick={() => App.toggle_window(`ctrl${monitor}`)} >
		</button>
}
