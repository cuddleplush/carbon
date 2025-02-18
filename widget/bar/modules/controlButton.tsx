import { Gdk } from 'astal/gtk4'

import { bash } from "../../../lib/"

export default function(): JSX.Element { 
	return <button
		label={"󰣨"}
		cssClasses={["module", "icon-button"]}
		cursor={Gdk.Cursor.new_from_name('pointer', null)}
		tooltipText={"Control Panel"}
		onButtonPressed={() => bash('ags --instance carbon request ControlPanel')}>
	</button>
}
