'use strict';

module.exports = function(grunt) {
  var DEPLOY_MODE = 'DEV';


  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),

    // Task configuration.
    clean: {
      js: ['build/js'],
      css: ['build/css']
    },

    concat: {
      js: {
        src: [
             ],
        dest: 'build/js/<%= pkg.name %>.js'
      }
    },
    uglify: {
      js: {
        src: '<%= concat.js.dest %>',
        dest: 'build/js/<%= pkg.name %>.min.js'
      }
    },
    sass: {
      all: {
        options: {
          //style: 'compressed'
        },
        files: [{
          expand: true,
          cwd: 'src/sass',
          src: ['app.scss'],
          dest: 'build/css',
          ext: '.css'
        }]
      }
    },
    copy: {
      js: {
        files: [
          {
            expand: true,
            cwd: 'build/js',
            src: '*.js',
            dest: './public/themes/op/js/'
          },
          {
            expand: true,
            cwd: 'build/js',
            src: '*.js',
            dest: './target/admin-themes/js/'
          }

        ]
      },
      css: {
        files: [
          {
            expand: true,
            cwd: 'build/css',
            src: '*.css',
            dest: './public/themes/op/css/'
          },
          {
            expand: true,
            cwd: 'build/css',
            src: '*.css',
            dest: './target/admin-themes/op/css'
          }
        ]
      },
      templates: {
        files: [
          {
            expand: true,
            cwd: 'node_modules/bootstrap-sass/assets/fonts/',
            src: '**',
            dest: './public/css/'
          },          
          {
            expand: true,
            cwd: 'node_modules/angular-ui-bootstrap/template/',
            src: '**',
            dest: './public/uib/template/'
          }          
		    ]
      },
      target: {
        files: [
          {
            expand: true,
            cwd: 'public/',
            src: '**',
            dest: './target/'
          }
        ]
      }
    },

    ftpscript: { // Don't forget to set up your .ftppass file
      jsDEV: {
        options: {
          host: 'dev.local', 
          passive: false,
          mkdir: false,
          authKey:'key1'
        },
        files: [
          {
            expand: true,
            cwd: 'build/js',
            src: '<%= pkg.name %>.min.js',
            dest: '/js/'
          }
        ]
      },
      cssDEV: {
        options: {
          host: 'dev.local', 
          passive: false,
          mkdir: false,
          authKey:'key1'
        },
        files: [
          {
            expand: true,
            cwd: 'build/css',
            src: '*.css',
            dest: '/css/'
          }
        ]
      }
    },

    watch: {
      js: {
        //files: '<%= concat.js.src %>',
        files: 'src/js/**/*.js',
        tasks: ['js']
      },
      //jsdeploy: {
      //  files: '<%= concat.js.src %>',
      //  tasks: ['jsdeploy']
      //},
      css: {
        files: 'src/sass/**/*',
        tasks: ['css']
      },
      //cssdeploy: {
      //  files: 'src/sass/**/*',
      //  tasks: ['cssdeploy']
      //}      
    },
  
    debian_package: {
	    options: {
		maintainer: {
		    name: "PA Nilsson",
		    email: "pa.nilsson@openproducts.se"
		},
		name: "opi-webfrontend",
		short_description: "OPI Web frontend",
		long_description: "OPI administrative web frontend",
		version: "1.0",
		build_number: "1",
		postinst : {
			src : "opi-webfronted.postinst.template"
		},
		directories: [
		    '/usr/share/${name}',
		    '/etc/nginx/apps'
		]
	    },
	    files: [
		{
		    expand: true,       // enable dynamic expansion
		    cwd: 'public/',      // src matches are relative to this path
		    src: '*',              // actual pattern(s) to match
		    dest: '/usr/share/opi-webfrontend'   // destination path prefix
		},
		{                       // use template in file path
		    src:  'webfrontend-nginx.conf',
		    dest: '/etc/nginx/apps'
		}
	    ]
	  }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-ftpscript');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-debian-package');

  // Default task.
  //grunt.registerTask('default', ['js','css','templates']);
  grunt.registerTask('default', ['css']);

  grunt.registerTask('js', ['clean:js', 'concat:js', 'uglify:js','copy:js']);
  //grunt.registerTask('js', ['clean:js', 'concat:js', 'uglify:js']);

  //grunt.registerTask('jsdeploy', ['js','ftpscript:js'+DEPLOY_MODE]);
  
  grunt.registerTask('css', ['clean:css', 'sass','copy:css']);
  //grunt.registerTask('css', ['clean:css', 'sass']);
  //grunt.registerTask('cssdeploy', ['css','ftpscript:css'+DEPLOY_MODE]);
  grunt.registerTask('templates', ['copy:templates']);
  
  grunt.registerTask('target', ['default','copy:target']);



};
