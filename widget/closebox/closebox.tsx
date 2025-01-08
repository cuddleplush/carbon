import { App, Gdk, Astal } from "astal/gtk3"

import { debug } from "../../lib/vars"
import { bind } from "astal"

function closeBox(): JSX.Element {
	return <eventbox
		onButtonPressEvent={(_, event) => {
			if (event.get_button()[1] === Gdk.BUTTON_PRIMARY) {
				App.get_window("control")!.hide()
				App.get_window("power")!.hide()
				App.get_window("launcher")!.hide()
				App.get_window("closebox")!.hide()
			}
		}
		}
		css={bind(debug).as((value) =>
			value ? "background-color: red; opacity: 0.5;" : ""
		)}
		vexpand>
	</eventbox>
}

export default function(): JSX.Element {
	return <window
		visible={false}
		name={`closebox`}
		namespace={"carbon-debug-closebox"}
		anchor={Astal.WindowAnchor.TOP
			| Astal.WindowAnchor.BOTTOM
			| Astal.WindowAnchor.LEFT
			| Astal.WindowAnchor.RIGHT}
		exclusivity={Astal.Exclusivity.IGNORE}
		keymode={Astal.Keymode.NONE}
		margin_top={45}
		layer={Astal.Layer.TOP}
		application={App}
		onKeyPressEvent={(_, event) => {
			if (event.get_keyval()[1] === Gdk.KEY_Escape) {
				App.get_window("control")!.hide()
				App.get_window("power")!.hide()
				App.get_window("launcher")!.hide()
				App.get_window("closebox")!.hide()

			}
		}} >
		{closeBox()}
	</window>
}
