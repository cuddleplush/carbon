import { App } from "astal/gtk3"

import { style } from "./lib"
import request from "./requestHandler"

import Bar 					from "./widget/bar/bar"
import Power 				from "./widget/power/power"
import Control 				from "./widget/control/control"
import Desktop 				from "./widget/desktop/desktop"
import Notifications   		from "./widget/notifs/notifPopup"
import NotificationCenter	from "./widget/notifs/notificationCenter"
import OnScreenDisplay  	from "./widget/osd/osd"
import Launcher 			from "./widget/launcher/launcher"
import CloseBox 			from "./widget/closebox/closebox"

// Apply our scss using the sassc transpiler
style(false, false)

// Start the shell
App.start({
	// https://aylur.github.io/astal/guide/typescript/cli-app#instance-identifier
	instanceName: "carbon",
	requestHandler(req, res) {
		request(req, res);
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
