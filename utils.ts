import { Gtk, Gdk, execAsync, writeFile, exec, App } from "astal"
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

const dark = `
$bg:    #0a0a0a;
$bg2:   #1b1b1b;
$bg3:   #2f2f2f;
`

const light = `
$bg:    #161616;
$bg2:   #262626;
$bg3:   #393939;
`

export function applyStyle(barSplit?: boolean, darkMode?: boolean){
	const tmpscss = "/tmp/style.scss"
	const footcfg = "/home/max/.config/foot/theme.ini"
	const hyprcfg = "/home/max/.config/hypr/hyprland/theme.hl"
	const nvimcfg = "/home/max/.config/nvim/nitrous.nvim/lua/nitrous/agscolor.lua"
	const target = "/tmp/style.css"

	if (darkMode === true) {
		writeFile(footcfg, `
[colors]
background=0a0a0a
`)
		writeFile(hyprcfg, `
$clr = 1b1b1b
`)
		writeFile(nvimcfg, `
return {
	agscolor = "#0a0a0a"
}
`)
	} else {
		writeFile(footcfg, `
[colors]
background=161616
`)
		writeFile(hyprcfg, `
$clr = 262626
`)
		writeFile(nvimcfg, `
return {
	agscolor = "#161616"
}
`)
	}

	writeFile(tmpscss, `
$bar-split: ${barSplit === true ? "true" : "false"};

* {
  all: unset;	
  font-family: BlexMono Nerd Font Propo;
  font-weight: normal;
}

${darkMode === true ? dark : light}
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
