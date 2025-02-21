import { App } from "astal/gtk4";
import { execAsync, monitorFile, writeFileAsync } from "astal";

/* CSS Hot Reload */
export default async function(barBorders?: boolean, barSpacers?: boolean) {
	const pathsToMonitor = [`${SRC}/css/main.scss`, `${SRC}/css/colors.scss`, `${SRC}/css/widgets`]; // Paths to monitor

	const mainScss = `${SRC}/css/main.scss`; // SCSS input file to compile
	const vars = `${SRC}/css/variables.scss`
	const css = `/tmp/style.css`; // CSS output file

	let isApplying = false;

	async function transpileAndApply() {
		if (isApplying) return;
		isApplying = true;

		try {
			await writeFileAsync(vars, `
@use "sass:color";
@use "./colors" as *;

$borders: ${barBorders ? "true" : "false"};
$spacers: ${barSpacers ? "true" : "false"};
$box-shadow: color.adjust($black, $alpha: - 0.5) 0px 0px 6px 3px;
`)
			await execAsync(`sass ${mainScss} ${css}`);
			App.reset_css()
			App.apply_css(css, true);
			print("CSS applied successfully!");
		} catch (error) {
			print("Error transpiling SCSS:", error);
			// execAsync(`notify-send -u critical "Error transpiling SCSS" "${error}"`);
		} finally {
			isApplying = false;
		}
	}

	pathsToMonitor.forEach((path) => monitorFile(path, transpileAndApply));

	return transpileAndApply();
}
