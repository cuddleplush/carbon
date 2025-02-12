import Wp from "gi://AstalWp"

import { bind } from "astal"
import { Gdk } from "astal/gtk4"

export function sliders(type: string): JSX.Element {
	const device = type === "speaker"
		? Wp.get_default()?.audio.defaultSpeaker!
		: Wp.get_default()?.audio.defaultMicrophone!
	return <box
		cssClasses={["control-volsliders"]}>
		{type === "speaker"
			? <image iconName={bind(device, "volumeIcon")} cssClasses={["volicon"]}/>
			: <label label={"󰍬"} cssClasses={["volicon"]}/>}
		<slider
			cursor={Gdk.Cursor.new_from_name('pointer', null)}
			hexpand={true}
			drawValue={false} 
			max={1.0}
            step={0.01}
			onChangeValue={(self) => {
				device.volume = self.value
			}}
			value={bind(device, "volume")} >
		</slider>
	</box>
}
