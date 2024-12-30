#!/usr/bin/env bash

case "$1" in
	"logout")
		if [[ "$(~/.config/astal/carbon/bin/dialog.tsx -a Logout)" == "yes" ]]; then
			hyprctl dispatch exit
		else
			exit
		fi
		;;
	"shutdown")
		if [[ "$(~/.config/astal/carbon/bin/dialog.tsx -a Shutdown)" == "yes" ]]; then
			fctl poweroff
		else
			exit
		fi
		;;
	"reboot")
		if [[ "$(~/.config/astal/carbon/bin/dialog.tsx -a Reboot)" == "yes" ]]; then
			fctl reboot
		else
			exit
		fi
esac
