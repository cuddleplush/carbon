import { Variable } from "astal"

export function crypto(): JSX.Element { 
	const getPrice = Variable<string>("").poll(
		300000,
		["bash", "-c", "curl -s \
			-H 'X-CMC_PRO_API_KEY: c43798d2-c7ea-4f1c-8601-d6b133d71dab' \
			-H 'Accept: application/json' \
			-G https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest \
			--data-urlencode 'symbol=XRP' \
			--data-urlencode 'convert=USDT' \
			| jq '.data.XRP.quote.USDT.price'"])

	return <box spacing={8} className={"time-box"}>
		<box>
			<label label={" XRP "} className={"icon crypto"} />
			<button		
				className={"module crypto"}
				tooltipText={"Open ByBit"}
				cursor="pointer">
				<label
					label={getPrice().as((s) => s.slice(0, 6))}>
				</label>
			</button>
		</box>
	</box>
}
