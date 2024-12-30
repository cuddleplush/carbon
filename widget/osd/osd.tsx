import { Gtk, Widget, Astal } from "astal/gtk3";
import { bind, timeout } from "astal";
import Progress from "./progress";
import AstalWp from "gi://AstalWp?version=0.1";

const DELAY = 2500;

function OnScreenProgress(window: Astal.Window, vertical: boolean): Widget.Box {
	const speaker = AstalWp.get_default()?.audio.defaultSpeaker!;
	const microphone = AstalWp.get_default()?.audio.defaultMicrophone!;

	const indicator = new Widget.Icon({
		className: "osd-icon",
		pixelSize: 20,
		icon: bind(speaker, "volumeIcon"),
	});

	const progress = Progress({
		vertical,
		width: vertical ? 48 : 400,
		height: vertical ? 400 : 48,
		child: new Widget.Box({
			className: "indicatorBox",
			child: indicator,
		}),
	});

	let count = 0;
	function show(value: number, muted: boolean, icon: string): void {
		window.visible = true;
		indicator.icon = icon;
		progress.setValue(value, muted);
		count++;
		timeout(DELAY, () => {
			count--;
			if (count === 0) window.visible = false;
		});
	}

	return new Widget.Box({
		className: "indicator",
		halign: Gtk.Align.CENTER,
		valign: Gtk.Align.END,
		css: "min-height: 2px;",
		child: progress,
		setup: () => {
			progress.hook(microphone, "notify::mute", () => {
				progress.setMute(microphone.mute);
				return show(
					microphone.volume,
					microphone.mute,
					microphone.mute === true 
						? "microphone-disabled-symbolic"
						: "microphone-sensitivity-high-symbolic"
				)
			});
			progress.hook(speaker, "notify::volume", () => {
				return show(
					speaker.volume,
					speaker.mute,
					"audio-speakers-symbolic",
				);
			});
			progress.hook(microphone, "notify::volume", () => {
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
		className="OSD"
		namespace="osd"
		layer={Astal.Layer.OVERLAY}
		anchor={Astal.WindowAnchor.BOTTOM}
		setup={(self) => {
			self.add(
				<box className="osd" vertical={true}>
					{OnScreenProgress(self, false)}
				</box>,
			);
		}}
	></window>
}
