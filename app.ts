import { App } from "astal/gtk3"

import Styler from "./lib/style"
import Bar from "./widget/bar/bar"
import Power from "./widget/power/power"
import Control from "./widget/ctrl/ctrl"
import Desktop from "./widget/desktop/desktop"
import Notifications from "./widget/notifs/notifPopup"
import OnScreenDisplay from "./widget/osd/osd"

Styler()

App.start({
	instanceName: "carbon",
	requestHandler(request: string, res: (response: any) => void) {
		switch (request) {
			case "toggle ctrl":
				App.toggle_window(`ctrl2460G4`);
				break;
			case "toggle power":
				App.toggle_window(`power`);
				break;
			default:
				res("unknown command")
				break;
		}
	},

    main() {
		for (const gdkmonitor of App.get_monitors()) {
			Bar(gdkmonitor)
			Control(gdkmonitor)
			Desktop(gdkmonitor)
		}
		OnScreenDisplay(),
		Power(),
		Notifications()
	}
})
