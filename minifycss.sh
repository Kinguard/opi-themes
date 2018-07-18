#!/bin/bash
# A POSIX variable
OPTIND=1         # Reset in case getopts has been used previously in the shell.

# Initialize our own variables:
themename=op
themelocation="/usr/share/opi-themes/"
target=keep
quiet="-q"

# cmd-line overrides config file parameters.
while getopts "cmrt:d:vw" opt; do
	case "$opt" in
	c)  copysrc=true
		;;
	m)  minimize=true
		;;
	t)  themename=$OPTARG
		;;
	d)  target=$OPTARG
		;;
	r)  remove=true
		;;
	v)  quiet=""
		;;
	w)  watch=true
		;;
	?)	echo "Unknown / missing args"
		exit 1
		;;
	esac
done

function debug {
	if [ -z "$quiet" ]; then
		echo $1
	fi
}

function run_minimize {
	if [ ! -z "$1" ]; then
		cd $1
	fi
	echo "Running minimizer for $1"
	echo "Minimizing javascripts"
	srcdirs=$(find . -type f -name '*.js' | sed -r 's|/[^/]+$||' |sort -u)
	debug "Found javafiles in:"
	debug $srcdirs
	for dir in $srcdirs
	do
		cd $dir
		rm -f *.min.js
		yui-compressor -o '.js$:.min.js' *.js
		cd - >/dev/null
	done

	echo "Minimizing stylesheets"
	srcdirs=$(find . -type f -not -path './debian/*' -name '*.css' | sed -r 's|/[^/]+$||' |sort -u)
	debug "Found stylesheets in:"
	debug $srcdirs
	for dir in $srcdirs
	do
		cd $dir
		rm -f *.min.css
		yui-compressor -o '.css$:.min.css' *.css
		cd - >/dev/null
	done
	cd ..

}

function run_copysrc {
	echo "Copying Nextcloud theme"
	scp -r $quiet "x-cloud/${themename}" "$target:${themelocation}/nextcloud/"
	echo "Copying Roundcube theme"
	scp -r $quiet "roundcube/${themename}" "$target:${themelocation}/roundcube/"
	if [ ! -z "$remove" ]; then
		ssh $target "find ${themelocation} -name '*.min.css' -type f -delete"
	fi
}

function remove_minimized {
	echo "Remove any minimized files"
	find . -name "*.min.css" -type f -delete
	find . -name "*.min.js" -type f -delete
}

if [ ! -z "$watch" ]; then 

	jssrc_=$(find . -type f -not -path './debian/*'  -name '*.js' | sed -r 's|/[^/]+$||' |sort -u)
	csssrc_=$(find . -type f -not -path './debian/*'  -name '*.css' | sed -r 's|/[^/]+$||' |sort -u)

	for dir in $jssrc_
	do
		jssrc="$jssrc $dir"
	done
	for dir in $csssrc_
	do
		csssrc="$csssrc $dir"
	done

	echo "Watching files"
	debug "js sources in:"
	debug $jssrc
	debug "css sources in:"
	debug "$csssrc"

	while inotifywait -r -e close_write $jssrc $csssrc
	do
		if [ ! -z "$remove" ]; then
			remove_minimized
		fi

		if [ ! -z "$minimize" ]; then 
			run_minimize x-cloud
			run_minimize roundcube
		fi
		if [ ! -z "$copysrc" ]; then 
			run_copysrc
		fi
		
	done

fi

if [ ! -z "$remove" ]; then
	remove_minimized
fi


if [ ! -z "$minimize" ]; then 
	run_minimize x-cloud
	run_minimize roundcube
fi
	
if [ ! -z "$copysrc" ]; then 
	run_copysrc
fi

