export default function toggleClassName(
	widget: any,
	bool: boolean,
	className: string
): void {
	if (bool) {
		widget.add_css_class(className)
	} else {
		widget.remove_css_class(className)
	}
}
