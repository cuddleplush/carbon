import Mpris from "gi://AstalMpris"

import { bind } from "astal"

import vars from "../../../lib/vars"

export default function(): JSX.Element {
	const player =  Mpris.Player.new(vars.player)

	if (bind(player, "available")) {
		return <box>
			{bind(player, "artist").as(p => p ? (
				<box cssClasses={["mpris-box"]}>
					<label label={"󰋋"} cssClasses={["icon", "mpris"]} />
					<button
						cssClasses={["module", "mpris"]}
						onButtonPressed={() => player.play_pause()}
						label={`${player.title} - ${player.artist}`}
						tooltipText={`on "${player.album}"`}>
					</button>
				</box>
			) : (
					<box visible={false}/> 
				)
			)}
		</box>
	} else {
		return <box visible={false}/>
	}
}
