import { bind } from "astal"
import Wp from "gi://AstalWp"

export function sliders(type: string): JSX.Element {
	const device = type === "speaker"
		? Wp.get_default()?.audio.defaultSpeaker!
		: Wp.get_default()?.audio.defaultMicrophone!
	return <box
		className={"ctrl-volsliders"}
		css={"min-width: 180px"}>
		{type === "speaker"
			? <icon icon={bind(device, "volumeIcon")} className={"volicon"}/>
			: <label label={"󰍬"} className={"volicon"}/>}
		<slider
			hexpand={true}
			drawValue={false}
			cursor={"pointer"}
			onDragged={({ value }) => device.volume = value}
			value={bind(device, "volume")} >
		</slider>
	</box>
}
