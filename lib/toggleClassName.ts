import { Gtk } from "astal/gtk4"

export default function toggleClassName(
	widget: Gtk.Widget,
	bool: boolean,
	className: string
): void {
	if (bool) {
		widget.add_css_class(className)
	} else {
		widget.remove_css_class(className)
	}
}
