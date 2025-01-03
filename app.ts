import { App } from "astal/gtk3"

import Styler from "./lib/style"
import Bar from "./widget/bar/bar"
import Power from "./widget/power/power"
import Control from "./widget/control/control"
import Desktop from "./widget/desktop/desktop"
import Notifications from "./widget/notifs/notifPopup"
import OnScreenDisplay from "./widget/osd/osd"
import Launcher from "./widget/launcher/launcher"
import CloseBox from "./widget/closebox/closebox"

// Apply our scss using the sassc transpiler
Styler()

// Start the shell
App.start({
	// https://aylur.github.io/astal/guide/typescript/cli-app#instance-identifier
	instanceName: "carbon",

	requestHandler(request: string, res: (response: any) => void) {
		function haveCloseBox() { 
			if (!App.get_window("closebox")?.is_visible()) {
				App.toggle_window(`closebox`);
			} else if (
				!App.get_window("control")?.is_visible()
				&& !App.get_window("power")?.is_visible()
				&& !App.get_window("launcher")?.is_visible()
			) {
				App.get_window("closebox")!.hide();
			}
		}
		switch (request) {
			case "toggle control":
				App.toggle_window(`control`);
				haveCloseBox();
				res("toggled control");
				break;
			case "toggle power":
				App.toggle_window(`power`);
				haveCloseBox();
				res("toggled power");
				break;
			case "toggle launcher":
				App.toggle_window(`launcher`);
				haveCloseBox();
				res("toggled launcher");
				break;
			default:
				res("unknown command");
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
		Launcher()
		CloseBox()
	}
})
