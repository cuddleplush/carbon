import { App, Gdk, Astal } from "astal/gtk3"
import { header } from "./mods/header";
import { sliders } from "./mods/sliders";
import { toggles } from "./mods/toggles";

function ctrlBox(): JSX.Element {
	return <box
		className={"ctrl-box"}
		vertical={true} >
			{header()}
			{sliders("speaker")}
			{sliders("microphone")}
			{toggles()}
		</box>	
}

export function ctrl(gdkmonitor: Gdk.Monitor): JSX.Element {
	return <window
		gdkmonitor={gdkmonitor}
		visible={false}
		name={`ctrl${gdkmonitor.model}`}
		anchor={Astal.WindowAnchor.TOP
			| Astal.WindowAnchor.LEFT }
		exclusivity={Astal.Exclusivity.NORMAL}
		keymode={Astal.Keymode.ON_DEMAND}
		layer={Astal.Layer.TOP}
		margin={10}
		application={App}
		onKeyPressEvent={(_, event) => {
			if (event.get_keyval()[1] === Gdk.KEY_Escape) {
				App.toggle_window(`ctrl${gdkmonitor.model}`);
			}
		}} >
		{ctrlBox()}
	</window>
}
