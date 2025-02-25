import { App, Gdk, Astal } from "astal/gtk3"

import { header } from "./modules/header";
import { sliders } from "./modules/sliders";
import { toggles } from "./modules/toggles";
import { hideWindows } from "../../lib/";

function controlBox(): JSX.Element {
	return <box
		className={"control"}
		vertical={true} >
		{header()}
		<box vertical
			className={"control-volsliders"}>
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
		onKeyPressEvent={(_, event) => {
			if (event.get_keyval()[1] === Gdk.KEY_Escape) {
				hideWindows()
			}
		}}>
		{controlBox()}
	</window>
}
