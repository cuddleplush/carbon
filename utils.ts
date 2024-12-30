import GLib from "gi://GLib"
import AstalRiver from "gi://AstalRiver?version=0.1"

import { execAsync, writeFile, exec, monitorFile } from "astal"
import { Gtk, Gdk, App } from "astal/gtk3"
import style_colors from "inline:./style/colors.scss"
import style_bar from "inline:./style/bar.scss"
import style_misc from "inline:./style/misc.scss"
import style_power from "inline:./style/power.scss"
import style_ctrl from "inline:./style/ctrl.scss"
import style_notifs from "inline:./style/notifs.scss"
import style_desktop from "inline:./style/desktop.scss"

export function getDesktop(): string {
	switch (GLib.getenv("XDG_CURRENT_DESKTOP")?.toLocaleLowerCase()) {
		case "hyprland":
			return "hyprland"
		case "river":
			return "river"
		default:
			return "UNSUPPORTED"
	}
}

export type Coordinates = {
	x: number;
	y: number;
};
export function coordinateEquals(a: Coordinates, b: Coordinates) {
	return a.x == b.x && a.y == b.y;
}

const river = AstalRiver.River.get_default()!;
const display = Gdk.Display.get_default();

// If this is null we have bigger problems anyway
function getMonitorName(gdkmonitor: Gdk.Monitor): string | null | undefined {
  const screen = display!.get_default_screen();
  for(let i = 0; i < display!.get_n_monitors(); ++i) {
    if(gdkmonitor === display!.get_monitor(i))
      return screen!.get_monitor_plug_name(i);
  }
}

export function getRiverOutput(gdkmonitor: Gdk.Monitor): AstalRiver.Output | null {
  const monitor_name = getMonitorName(gdkmonitor);
  return river.get_output(monitor_name!);
}

export function range(length: number, start = 1): number[] {
    return Array.from({ length }, (_, i) => i + start)
}

export function forMonitors(widget: (monitor: number) => Gtk.Widget): Gtk.Widget[] {
    const n = Gdk.Display.get_default()?.get_n_monitors() || 1
    return range(n, 0).flatMap(widget)
}

export function bash(cmd: string): void {
execAsync(["bash", "-c", `${cmd} &`])
    .then((out) => console.log(out))
    .catch((err) => console.error(err))
}

export function truncateString(str: string, num: number): String {
  if (str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
}


export async function cssStyler(barSplit?: boolean): Promise<void> {
	const path = `${SRC}/style`
	const tmpscss = "/tmp/style.scss"
	const target = "/tmp/style.css"

	let isApplying = false;
	
	async function applyStyle() {
		if (isApplying) return;
		isApplying = true;
		
		try {
			writeFile(tmpscss, `
$bar-split: ${barSplit === true ? "true" : "false"};
$river: ${getDesktop() === "river" ? "true" : "false"};
$hyprland: ${getDesktop() === "hyprland" ? "true" : "false"};

* {
  all: unset;	
  font-family: BlexMono Nerd Font Propo;
  font-weight: normal;
}

${style_colors}
${style_bar}
${style_misc}
${style_power}
${style_ctrl}
${style_notifs}
${style_desktop}
`)
			exec(`sass ${tmpscss} ${target}`)

			App.reset_css()
			App.apply_css(target)


		} catch (error) {
			print("Error transpiling SCSS:", error);
			execAsync(`notify-send -u critical "Error transpiling SCSS" "${error}"`);
		} finally {
			isApplying = false;
		}
	}
	monitorFile(path, applyStyle);

	return applyStyle();
}
