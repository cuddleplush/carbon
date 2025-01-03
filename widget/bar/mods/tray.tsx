import Tray from "gi://AstalTray"

import { bind } from "astal"

export default function(): JSX.Element {
	const tray = Tray.get_default()

	return <box className={"tray-box"}>
		<box className={"module"}
			spacing={8}>
			{bind(tray, "items").as(items => items.map(item => (
				<menubutton
					className={"tray-item"}
					tooltipMarkup={bind(item, "tooltipMarkup")}
					usePopover={false}
					actionGroup={bind(item, "action-group").as(ag => ["dbusmenu", ag])}
					menuModel={bind(item, "menu-model")}>
					<icon gicon={bind(item, "gicon")} />
				</menubutton>
			)))}
		</box>
	</box>
}

