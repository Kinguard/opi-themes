<?php
	# This file is intended to be included in php configs to return the configured theme
	# from the configdb file.

	
	function getTheme($ns="webapps", $key="theme") {
		$config = shell_exec("kgp-sysinfo -p -c $ns -k $key");
		if ($config) {
			return rtrim($config);
		}
	}

	/*
	function getThemeFromFile($ns="webapps") {
		define("CONFIG", "/etc/kinguard/sysconfigdb.json");
		if(is_file(CONFIG)) {
			$config = json_decode(file_get_contents(CONFIG));
			if (isset($config->$ns->theme) && $config->$ns->theme) {
				return $config->$ns->theme;
			}
		}
		return null;
	}
	*/