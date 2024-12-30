import { writeFile, exec } from "astal"
import { App } from "astal/gtk3"

import style_colors  from "inline:../css/colors.scss"
import style_bar 	 from "inline:../css/bar.scss"
import style_misc 	 from "inline:../css/misc.scss"
import style_power 	 from "inline:../css/power.scss"
import style_ctrl 	 from "inline:../css/ctrl.scss"
import style_notifs  from "inline:../css/notifs.scss"
import style_desktop from "inline:../css/desktop.scss"

export default function(barSplit?: boolean): void {
	const tmpscss = "/tmp/style.scss"
	const target = "/tmp/style.css"

	writeFile(tmpscss, `
$bar-split: ${barSplit === true ? "true" : "false"};

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
}

