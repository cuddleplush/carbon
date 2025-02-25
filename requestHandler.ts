import { App } from "astal/gtk3";

export default function requestHandler(
	request: string,
	res: (response: any) => void,
): void {
	function haveCloseBox() { 
		if (!App.get_window("closebox")?.is_visible()) {
			App.toggle_window(`closebox`);
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
			if (App.get_window("notification-center")?.is_visible()) {
				App.get_window("notification-center")!.hide()
			}
			App.toggle_window(`launcher`);
			haveCloseBox();
			res("Toggled Launcher");
			break;

		case "NotificationCenter":
			if (App.get_window("launcher")?.is_visible()) {
				App.get_window("launcher")!.hide()
			}
			App.toggle_window(`notification-center`);
			haveCloseBox();
			res("Toggled Notification Center");
			break;

		default:
			res("Unknown Command");
			break;
	}
}
