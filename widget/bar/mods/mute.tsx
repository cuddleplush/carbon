import { Variable, Gtk, execAsync, bind } from "astal"
import Wp from "gi://AstalWp"

export function Mute(): JSX.Element { 
	const mic = Wp.get_default()?.audio.defaultMicrophone!
	return <box className={"micbox"}
		visible={bind(mic, "mute").as(Boolean)}>
		<button		
			// onHover={(self) => self.toggleClassName("hover", true)}
			// onHoverLost={(self) => self.toggleClassName("hover", false)}

			className={"module muted"}
			tooltipText={"Unmute"}
			onClicked={() => {
				mic.mute = !mic.mute
			}}
			label={""} > 
		</button>
	</box>
}
