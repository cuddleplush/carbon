import { App } from "astal/gtk4"

import { style } from "./lib"

import Desktop 				from "./widget/desktop/desktop"
import Bar 					from "./widget/bar/bar"
import Power 				from "./widget/power/power"
import Control 				from "./widget/control/control"
import OnScreenDisplay 		from "./widget/osd/osd"
import Launcher 			from "./widget/launcher/launcher"
import Notifications 		from "./widget/notifs/notificationPopup"
import NotificationCenter 	from "./widget/notifs/notificationCenter"
import CloseBox 			from "./widget/closebox/closebox"

// Apply our scss using the sassc transpiler
style();

// Start the shell
App.start({
	// https://aylur.github.io/astal/guide/typescript/cli-app#instance-identifier
	instanceName: "carbon",

	requestHandler(request: string, res: (_response: string) => void): void {
		// TODO: de-uglify
		function haveCloseBox() { 
			if (!App.get_window("closebox")?.is_visible()) {
				App.get_window(`closebox`)?.show();
			} else if (
				!App.get_window("control")?.is_visible()
				&& !App.get_window("power")?.is_visible()
				&& !App.get_window("launcher")?.is_visible()
				&& !App.get_window("notification-center")?.is_visible()
			) {
				App.get_window("closebox")!.hide();
			}
		}
		switch (request) {
			case "ControlPanel":
				App.toggle_window(`control`);
				haveCloseBox();
				res("Toggled Control Panel");
				break;
			case "PowerMenu":
				App.toggle_window(`power`);
				haveCloseBox();
				res("Toggled Power Menu");
				break;
			case "Launcher":
				App.toggle_window(`launcher`);
				App.get_window("notification-center")?.hide()
				haveCloseBox();
				res("Toggled Launcher");
				break;
			case "NotificationCenter":
				App.toggle_window(`notification-center`);
				App.get_window("launcher")?.hide()
				haveCloseBox();
				res("Toggled Notification Center");
				break;
			default:
				res(`I don't know what "${request}" is.`);
				break;
		}
	},
	// Run our widgets 
    main() {
		// We want certain widgets to behave differently depending on the monitor.
		// the gdkmonitor object exists for each monitor, so we pass it to the widgets
		// that require monitor-specific information. We also use this to make sure
		// some widgets exist on all monitors, e.g. Desktop()
		for (const gdkmonitor of App.get_monitors()) {
			Bar(gdkmonitor)
			Desktop(gdkmonitor)
		}
		// These widgets are monitor-agnostic
		Control()
		OnScreenDisplay()
		Power()
		Notifications()
		NotificationCenter()
		Launcher()
		CloseBox()
	}
})
