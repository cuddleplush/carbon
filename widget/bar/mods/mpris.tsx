import Mpris from "gi://AstalMpris"

import { bind } from "astal"
import vars from "../../../lib/vars"

export function Player(): JSX.Element {
	const player =  Mpris.Player.new(vars.player)

	if (bind(player, "available")) {
		return <box>
			{bind(player, "artist").as(p => p ? (
				<box className={"mpris-box"}>
					<label label={"󰋋"} className={"icon mpris"} />
					<button
						className="module mpris"
						onClicked={() => player.play_pause()}
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
