import { App, Gdk, Astal } from "astal/gtk4"

import { hideWindows } from "../../lib/";
import { header } from "./modules/header";
import { sliders } from "./modules/sliders";
import { toggles } from "./modules/toggles";

function controlBox(): JSX.Element {
	return <box
		cssClasses={["control"]}
		vertical={true} >
		{header()}
		<box vertical
			cssClasses={["control-volsliders"]}>
			{sliders("speaker")}
			{sliders("microphone")}
		</box>
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
