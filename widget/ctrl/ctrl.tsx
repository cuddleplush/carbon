import { App, Gdk, Astal } from "astal/gtk3"
import { header } from "./mods/header";
import { sliders } from "./mods/sliders";
import { toggles } from "./mods/toggles";

function ctrlBox() {
	return <box
		className={"ctrl-box"}
		vertical={true} >
			{header()}
			{sliders("speaker")}
			{sliders("microphone")}
			{toggles()}
		</box>	
}

export function ctrl(monitor: number) {
	return <window
		monitor={monitor}
		visible={false}
		name={`ctrl${monitor}`}
		anchor={Astal.WindowAnchor.TOP
			| Astal.WindowAnchor.LEFT }
		exclusivity={Astal.Exclusivity.NORMAL}
		keymode={Astal.Keymode.ON_DEMAND}
		layer={Astal.Layer.TOP}
		margin={10}
		application={App}
		onKeyPressEvent={(_, event) => {
			if (event.get_keyval()[1] === Gdk.KEY_Escape) {
				App.toggle_window(`ctrl${monitor}`);
			}
		}} >
		{ctrlBox()}
	</window>
}
