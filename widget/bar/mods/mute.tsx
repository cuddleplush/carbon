import Wp from "gi://AstalWp"

import { bind } from "astal"

export function Mute(): JSX.Element { 
	const mic = Wp.get_default()?.audio.defaultMicrophone!
	return <box className={"mute-box"}
		visible={bind(mic, "mute").as(Boolean)}>
		<button		
			className={"module muted"}
			tooltipText={"Unmute"}
			cursor="pointer"
			onClicked={() => {
				mic.mute = !mic.mute
			}}
			label={""} > 
		</button>
	</box>
}
