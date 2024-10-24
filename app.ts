import { App } from "astal/gtk3"
import Bar from "./widget/bar/Bar"
import power from "./widget/power/power"
import { ctrl } from "./widget/ctrl/ctrl"
// import Desktop from "./widget/desktop/desktop"
import { applyStyle } from "./utils"
import { barSplit } from "./vars"

applyStyle(
	barSplit.get())

App.start({
    main() {
        Bar(0)
        Bar(1)
		ctrl(0)	
		ctrl(1)	
		power()
		// Desktop(0)
		// Desktop(1)
    },
})
