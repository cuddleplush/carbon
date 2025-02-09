import { App, Gdk, Astal } from "astal/gtk4"

import { header } from "./modules/Header";
import { sliders } from "./modules/Sliders";
import { toggles } from "./modules/Toggles";
import { hideWindows } from "../../lib/";

function controlBox(): JSX.Element {
	return <box
		cssClasses={["control"]}
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
		margin={-5}
		application={App}
		onKeyPressed={(_, keyval) => {
			if (keyval === Gdk.KEY_Escape) {
				hideWindows()
			}
		}} >
		{controlBox()}
	</window>
}
