import { Bash } from "../../../lib/"
import { Gdk } from 'astal/gtk4'

export default function(): JSX.Element { 
	return <button
		label={"󰣨"}
		cssClasses={["module", "icon-button"]}
		cursor={Gdk.Cursor.new_from_name('pointer', null)}
		tooltipText={"Control Panel"}
		onButtonPressed={() => Bash('ags --instance carbon request "toggle control"')}>
	</button>
}
