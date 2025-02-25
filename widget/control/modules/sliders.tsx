import { bind } from "astal"
import Wp from "gi://AstalWp"

export function sliders(type: string): JSX.Element {
	const device = type === "speaker"
		? Wp.get_default()?.audio.defaultSpeaker!
		: Wp.get_default()?.audio.defaultMicrophone!
	return <box>
		{type === "speaker"
			? <label
				label={bind(device, "volume").as((v => {
					return v <= 0 ? "󰝟"
						: v <= 0.33 && v < 0.66 ? "󰕿"
						: v > 0.33 && v < 0.99 ? "󰖀"
						: v >= 0.99 ? "󰕾"
						: "null"
				}))}
				className={"volicon"}>
			</label>
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
