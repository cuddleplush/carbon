import { bash } from "../../../lib/utils"

export default function(): JSX.Element { 
	return <box className={"launcher-box"}>
		<button
			label={"󰣨"}
			className={"module ctrl"}
			tooltipText={"Control Panel"}
			cursor="pointer"
			onClick={() => bash('ags --instance carbon request "toggle control"')}>
		</button>
	</box>
}
