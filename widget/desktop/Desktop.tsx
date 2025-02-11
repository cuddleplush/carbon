import { Astal, Gdk, Gtk, App } from "astal/gtk4"
import { exec } from "astal";

import { desktopMenu } from "./DesktopMenu";
import { desktopMenuGroup } from "./DesktopMenu";

function Menu(): JSX.Element {
	const menuButton = <menubutton
		name="desktop-menu"
		cssClasses={["desktop"]}
		menuModel={desktopMenu}
		setup={(self) => {
			self.insert_action_group("desktop-menu", desktopMenuGroup)
		}}>
		<label
			cssClasses={["splash"]}
			valign={Gtk.Align.END}
			halign={Gtk.Align.CENTER}
			hexpand
			vexpand
			setup={(self: any) => {
				self.label = exec(`bash -c "hyprctl splash"`)
			}}>
		</label>
	</menubutton> as Gtk.MenuButton

	const controller = new Gtk.EventControllerLegacy({
		propagationPhase: Gtk.PropagationPhase.CAPTURE,
	});
	let poppedUp = false
	controller.connect("event", (_c, event) => {
		const type = event.get_event_type();

		if (type == Gdk.EventType.BUTTON_RELEASE) {
			const pressEvent = event as Gdk.ButtonEvent;
			const mouseButton = pressEvent.get_button();
			const [_, x, y] = pressEvent.get_position();

			if (mouseButton == Gdk.BUTTON_SECONDARY) {
				if (poppedUp) {
					menuButton.popdown()
					poppedUp = false
				} else {
					menuButton.popover.set_pointing_to(new Gdk.Rectangle({x: x + 85, y: y - 12, width: 1, height: 1}))
					menuButton.popup()
					poppedUp = true
				}
			} else if (mouseButton == Gdk.BUTTON_PRIMARY) {
				if (poppedUp) {
					menuButton.popdown()
					poppedUp = false
				}
			}
		}
		return true;
	});

	menuButton.add_controller(controller);
	return menuButton;
}

export default function(gdkmonitor: Gdk.Monitor): JSX.Element {
	return <window
		visible
		name={`desktop`}
		anchor={Astal.WindowAnchor.TOP
			| Astal.WindowAnchor.BOTTOM
			| Astal.WindowAnchor.LEFT
			| Astal.WindowAnchor.RIGHT}
		exclusivity={Astal.Exclusivity.IGNORE}
		keymode={Astal.Keymode.NONE}
		layer={Astal.Layer.BOTTOM}
		gdkmonitor={gdkmonitor}
		application={App} >
		<Menu/>
	</window>
}

