import { App } from "astal/gtk3"
import { barSplit } from "./vars"
import Bar from "./widget/bar/Bar"
import power from "./widget/power/power"
import { ctrl } from "./widget/ctrl/ctrl"
import desktop from "./widget/desktop/desktop"
import NotificationPopups from "./widget/notifs/notifPopup"
import { osd } from "./widget/osd/osd"
import { cssStyler } from "./utils"

cssStyler(barSplit.get())

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
			ctrl(gdkmonitor)
			desktop(gdkmonitor)
		}
		osd(),
		power(),
		NotificationPopups()
	}
})
