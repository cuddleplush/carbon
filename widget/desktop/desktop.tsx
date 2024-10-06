import { App, Variable, Astal, Gtk, Gdk, GLib, bind, execAsync, Widget } from "astal"
import { menu } from "./menu";

function desktopBox(): JSX.Element {
	return <eventbox
		onButtonPressEvent={(_, event) => menu?.popup_at_pointer(event)}>
	</eventbox>
}

export default function Desktop(monitor: number) {
    const anchor = Astal.WindowAnchor.TOP
        | Astal.WindowAnchor.BOTTOM
        | Astal.WindowAnchor.LEFT
        | Astal.WindowAnchor.RIGHT

	return <window
		layer={Astal.Layer.BACKGROUND}
		className="desktop"
		monitor={monitor}
		visible={true}
		name={`desktop${monitor}`}
		anchor={anchor}
		exclusivity={Astal.Exclusivity.IGNORE}
		keymode={Astal.Keymode.NONE}>
		{desktopBox()}
	</window>
}
