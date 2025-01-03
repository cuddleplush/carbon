import { App, Gdk, Astal } from "astal/gtk3"

import { header } from "./mods/header";
import { sliders } from "./mods/sliders";
import { toggles } from "./mods/toggles";

function controlBox(): JSX.Element {
	return <box
		className={"control-box"}
		vertical={true} >
		{header()}
		{sliders("speaker")}
		{sliders("microphone")}
		{toggles()}
	</box>	
}

export default function(): JSX.Element {
	return <window
		visible={false}
		name={`control`}
		anchor={Astal.WindowAnchor.TOP
			| Astal.WindowAnchor.LEFT }
		exclusivity={Astal.Exclusivity.NORMAL}
		keymode={Astal.Keymode.ON_DEMAND}
		layer={Astal.Layer.OVERLAY}
		margin={10}
		application={App}
		onKeyPressEvent={(_, event) => {
			if (event.get_keyval()[1] === Gdk.KEY_Escape) {
				App.get_window("control")!.hide()
				App.get_window("power")!.hide()
				App.get_window("launcher")!.hide()
				App.get_window("closebox")!.hide()
			}
		}} >
		{controlBox()}
	</window>
}