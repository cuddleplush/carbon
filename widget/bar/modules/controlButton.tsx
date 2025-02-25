import { bash } from "../../../lib"

export default function(): JSX.Element { 
	return <box className={"launcher-box"}>
		<button
			label={"󰣨"}
			className={"module icon-button"}
			tooltipText={"Control Panel"}
			cursor="pointer"
			onClick={() => bash('ags --instance carbon request ControlPanel')}>
		</button>
	</box>
}
