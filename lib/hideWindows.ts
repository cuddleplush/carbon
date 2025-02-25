import { App } from "astal/gtk3"

export default function hideWindows(): void {
	App.get_window("closebox")?.hide()
	App.get_window("control")?.hide()
	App.get_window("notification-center")?.hide()
	App.get_window("power")?.hide()
	App.get_window("launcher")?.hide()
}
