import { App, Gdk, Astal } from "astal/gtk3"

import { hideWindows } from "../../lib"

function closeBox(): JSX.Element {
	return <eventbox
		onButtonPressEvent={(_, event) => {
			if (event.get_button()[1] === Gdk.BUTTON_PRIMARY) {
				hideWindows()
			}
		}}
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
				hideWindows()
			}
		}} >
		{closeBox()}
	</window>
}
