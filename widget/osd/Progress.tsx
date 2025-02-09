import { Gtk, Widget } from "astal/gtk4";
import { toggleClassName } from "../../lib/";

type ProgressProps = {
	height?: number;
	width?: number;
	vertical?: boolean;
	child: Gtk.Widget;
};

export default ({
	height = 48,
	width = 400,
	vertical = false,
	child,
}: ProgressProps) => {
	const fill = Widget.Box({
		cssClasses: ["fill"],
		hexpand: vertical,
		vexpand: !vertical,
		halign: vertical ? Gtk.Align.FILL : Gtk.Align.START,
		valign: vertical ? Gtk.Align.END : Gtk.Align.FILL,
		child,
	});

	const container = Widget.Box({
		cssClasses: ["progress"],
		child: fill,
	});

	return Object.assign(container, {
		setMute(muted: boolean) {
			toggleClassName(fill, muted, "muted")
		},

		setValue(value: number, muted: boolean) {
			if (value < 0) return;
			toggleClassName(fill, muted, "muted")

			const axisv = vertical ? height : width;
			const min = vertical ? width : height;
			const preferred = (axisv - min) * value + min;
			
			fill.widthRequest = preferred
		},
	});
};
