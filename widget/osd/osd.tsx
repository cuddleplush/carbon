import AstalWp from "gi://AstalWp?version=0.1";

import { Gtk, Widget, Astal, hook } from "astal/gtk4";
import { bind, timeout } from "astal";

import Progress from "./progress";

const DELAY = 2500;

function OnScreenProgress(window: Astal.Window, vertical: boolean): Astal.Box {
	const speaker = AstalWp.get_default()?.audio.defaultSpeaker!;
	const microphone = AstalWp.get_default()?.audio.defaultMicrophone!;

	const indicator = Widget.Image({
		cssClasses: ["osd-icon"],
		pixelSize: 20,
		iconName: bind(speaker, "volumeIcon"),
	});

	const progress = Progress({
		vertical,
		width: vertical ? 48 : 400,
		height: vertical ? 400 : 48,
		child: Widget.Box({
			cssClasses: ["indicatorBox"],
			child: indicator,
		}),
	});

	let count = 0;
	function show(value: number, muted: boolean, icon: string): void {
		window.visible = true;
		indicator.iconName = icon;
		progress.setValue(value, muted);
		count++;
		timeout(DELAY, () => {
			count--;
			if (count === 0) window.visible = false;
		});
	}

	return Widget.Box({
		cssClasses: ["indicator"],
		halign: Gtk.Align.CENTER,
		valign: Gtk.Align.END,
		heightRequest: 2,
		// css: "min-height: 2px;",
		child: progress,
		setup: () => {
			hook(progress, microphone, "notify::mute", () => {
				progress.setMute(microphone.mute);
				return show(
					microphone.volume,
					microphone.mute,
					microphone.mute === true 
						? "microphone-disabled-symbolic"
						: "microphone-sensitivity-high-symbolic"
				)
			});
			hook(progress, speaker, "notify::volume", () => {
				return show(
					speaker.volume,
					speaker.mute,
					"audio-speakers-symbolic",
				);
			});
			hook(progress, microphone, "notify::volume", () => {
				return show(
					microphone.volume,
					microphone.mute,
					microphone.volume <= 0 ? "microphone-disabled-symbolic"
						: microphone.volume <= 0.33 && microphone.volume < 0.66 ? "microphone-sensitivity-low-symbolic"
						: microphone.volume > 0.33 && microphone.volume < 0.99 ? "microphone-sensitivity-medium-symbolic"
						: microphone.volume >= 0.99 ? "microphone-sensitivity-high-symbolic"
						: "null"
				);
			});
		},
	});
}

export default function(): JSX.Element {
	return <window
		visible={false}
		cssClasses={["OSD"]}
		namespace="osd"
		layer={Astal.Layer.OVERLAY}
		anchor={Astal.WindowAnchor.BOTTOM}
		setup={(self) => {
			self.set_child(
				<box cssClasses={["osd"]} vertical={true}>
					{OnScreenProgress(self, false)}
				</box>,
			);
		}}
	></window>
}
