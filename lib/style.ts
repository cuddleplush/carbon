import { writeFile, exec } from "astal"
import { App } from "astal/gtk3"

// This module is responsible for applying our css.
// It does this by inlining all of our css files,
// assembling them into one scss file, and transpiling
// it into css. It then applies the resulting css file
// ass the stylesheet for our shell.
// This module is also called when certain changes
// need to be done to the styling at runtime, such as
// chaning the bar style.

// Import our scss files as inline css
import style_colors   from "inline:../css/colors.scss"
import style_bar 	  from "inline:../css/bar.scss"
import style_misc 	  from "inline:../css/misc.scss"
import style_power 	  from "inline:../css/power.scss"
import style_control  from "inline:../css/control.scss"
import style_notifs   from "inline:../css/notifs.scss"
import style_desktop  from "inline:../css/desktop.scss"
import style_launcher from "inline:../css/launcher.scss"

// This function optionally takes a barSplit arg,
// because it is also called when switching the style
// of the bar using the Control Menu.
//
//

export default function(barSplit?: boolean, debug?: boolean): void {
	const tmpscss = "/tmp/style.scss"
	const target = "/tmp/style.css"

	// Yes, this is cursed.
	writeFile(tmpscss, `
$bar-split: ${barSplit === true ? "true" : "false"};
$debug: ${debug === true ? "true" : "false"};

* {
all: unset;	
font-family: BlexMono Nerd Font Propo;
font-weight: normal;
}

${style_colors}
${style_bar}
${style_misc}
${style_power}
${style_control}
${style_notifs}
${style_desktop}
${style_launcher}
`)
	// Run the sass transpiler on our scss
	exec(`sass ${tmpscss} ${target}`)

	// Reset the css before applying our new css
	App.reset_css()
	App.apply_css(target)
}

