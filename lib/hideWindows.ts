import { App } from "astal/gtk4"

export default function hideWindows(): void {
	App.get_window("closebox")?.hide()
	App.get_window("control")?.hide()
	App.get_window("notification-center")?.hide()
	App.get_window("power")?.hide()
}
