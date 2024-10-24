import { execAsync, writeFile, exec } from "astal"
import { Gtk, Gdk, App } from "astal/gtk3"
import style1 from "inline:./style/colors.scss"
import style2 from "inline:./style/bar.scss"
import style3 from "inline:./style/misc.scss"
import style4 from "inline:./style/power.scss"
import style5 from "inline:./style/ctrl.scss"

export function range(length: number, start = 1) {
    return Array.from({ length }, (_, i) => i + start)
}

export function forMonitors(widget: (monitor: number) => Gtk.Window) {
    const n = Gdk.Display.get_default()?.get_n_monitors() || 1
    return range(n, 0).flatMap(widget)
}

export function easyAsync(cmd: string) {
execAsync(["bash", "-c", cmd])
    .then((out) => console.log(out))
    .catch((err) => console.error(err))
}

export function applyStyle(barSplit?: boolean){
	const tmpscss = "/tmp/style.scss"
	const target = "/tmp/style.css"

	writeFile(tmpscss, `
$bar-split: ${barSplit === true ? "true" : "false"};

* {
  all: unset;	
  font-family: BlexMono Nerd Font Propo;
  font-weight: normal;
}

${style1}
${style2}
${style3}
${style4}
${style5}
`)
	exec(`sass ${tmpscss} ${target}`)
	
	App.reset_css()
	App.apply_css(target)
}
