import Wp from "gi://AstalWp"
import { Gdk } from 'astal/gtk4'

import { bind } from "astal"

export default function(): JSX.Element { 
	const mic = Wp.get_default()?.audio.defaultMicrophone!
	return <box cssClasses={["mute-box"]}
		visible={bind(mic, "mute").as(Boolean)}>
		<button		
			cssClasses={["module", "muted"]}
			tooltipText={"Unmute"}
			cursor={Gdk.Cursor.new_from_name('pointer', null)}
			onButtonPressed={() => {
				mic.mute = !mic.mute
			}}
			label={""} > 
		</button>
	</box>
}
