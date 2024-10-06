import { App } from "astal"

export function Launcher(monitor: number): JSX.Element { 
	return <button
		// onHover={(self) => self.toggleClassName("hover", true)}
		// onHoverLost={(self) => self.toggleClassName("hover", false)}

		label={"󰣨"}
		className={"module ctrl"}
		tooltipText={"Control Panel"}
		onClick={() => App.toggle_window(`ctrl${monitor}`)} >
		</button>
}
