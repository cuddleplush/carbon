import { Gtk } from "astal"

export function Launcher(): JSX.Element { 
	return <button
		onHover={(self) => self.toggleClassName("hover", true)}
		onHoverLost={(self) => self.toggleClassName("hover", false)}

		label={"󰣨"}
		className={"module ctrl"}
		tooltipText={"Control Panel"}
		onClick="echo launch" >
		</button>
}
