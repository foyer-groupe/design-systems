(function(){
	const menu         = document.getElementById('menu');
	const menuBtn      = document.querySelectorAll('.menu-button');
	const searchShadow = document.querySelector('.doc-search-dropshadow');
	const mobileMenu   = document.querySelector('.mobile-navigation');
	const menuToggle   = menu.querySelectorAll('[aria-controls]');

	var closeMenu = function(){

			menuBtn.forEach(function(menuB){
				menuB.classList.remove('is-open');
				menuB.setAttribute('aria-expanded', 'false');
			});

			menu.classList.remove('is-open');
			menu.setAttribute('aria-hidden', 'true');

			if ( mobileMenu ) {
				mobileMenu.classList.remove('is-open');
			}
		},
		openMenu = function() {
			menuBtn.forEach(function(menuB){
				menuB.classList.remove('is-open');
				menuB.setAttribute('aria-expanded', 'false');
			});

			menu.classList.add('is-open');
			menu.setAttribute('aria-hidden', 'false');

			menu.querySelector('.doc-main-nav > li:first-child a').focus();

			if ( mobileMenu ) {
				mobileMenu.classList.add('is-open');
			}
		}

	/**
	 * Open Menu
	 */
	if ( menuBtn ) {
		menuBtn.forEach(function(element){
			element.addEventListener('click', function(){
				if ( this.classList.contains('is-open') ) {
					closeMenu();
				} else {
					openMenu();
				}
			});
		});
	}

	/**
	 * Drop search shadow on click to close everything's open
	 */
	if ( searchShadow ) {
		searchShadow.addEventListener('click', closeMenu);
	}

	/**
	 * Submenu interactions
	 */
	if ( menuToggle ) {
		menuToggle.forEach(function(tog){
			tog.addEventListener('click', function(e){
				var parent = e.target.closest('.is-toggle-only'),
					button = parent.querySelector('button'),
					list   = document.getElementById( button.getAttribute('aria-controls') );

				if ( parent.classList.contains('is-active') ) {
					parent.classList.remove('is-active');
					list.setAttribute('aria-hidden', 'true');
					button.setAttribute('aria-expanded', 'false');
				} else {
					parent.classList.add('is-active');
					list.setAttribute('aria-hidden', 'false');
					button.setAttribute('aria-expanded', 'true');
				}
			});
		});
	}

	/**
	 * Timeline
	 */
	var timeline = document.querySelector(".timeline");

	if ( timeline ) {
		var line     = timeline.querySelector(".time-line"),
			progress = timeline.querySelector(".line"),
			events   = timeline.querySelectorAll(".event-item"),
			move     = function() {
				var timelineRec = timeline.getBoundingClientRect(),
					timeTop     = timelineRec.top,
					timeBot     = timelineRec.bottom,
					scrollT     = window.pageYOffset || document.body.scrollTop,
					bodyRec     = document.body.getBoundingClientRect(),
					winHeight   = document.body.clientHeight,
					timeHeight  = parseInt( getComputedStyle(line).top ),
					treshold    = winHeight / 2 - timeHeight;

				progress.style.height = scrollT - (winHeight / 3 + timeHeight) + "px";

				if ( scrollT - treshold >= timeTop - winHeight && timeBot - winHeight > 0 - treshold ) {
					events.forEach(function(el) {
						var eventRec = el.getBoundingClientRect(),
							a = eventRec.top - bodyRec.top;
						scrollT - treshold >= a - winHeight ? el.classList.add("GoGoGo") : el.classList.remove("GoGoGo")
					});
				}
			};

		window.addEventListener('scroll', function() {
			window.requestAnimationFrame(move);
		});
	}

	/**
	 * Show code preview with HighlightJS
	 */
	hljs.initHighlightingOnLoad();

	document.querySelectorAll('pre code').forEach( function(el) {
		const tabPanel = el.closest( '[role="tabpanel"]' );

		if(tabPanel) {
			const textArea = document.createElement('textarea');
			textArea.innerHTML = el.innerHTML;
			textArea.tabIndex = '-1';
			textArea.className = 'doc-to-copy';
			textArea.style.position = 'absolute';
			textArea.style.opacity = '0.01';

			tabPanel.insertBefore( textArea,  tabPanel.firstChild);
		}
	});

	document.querySelectorAll('pre code.html').forEach(function(el){
		el.innerHTML = el.innerHTML
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");

		el.style.visibility = 'visible';
	});

	/**
	 * Tabs controls
	 */
	document.querySelectorAll('.doc-tabs [role="tab"]').forEach((el) => {
		el.addEventListener('click', (ev) => {
			const target = ev.target, currTabs = target.closest('.doc-tabs'), targetID = target.getAttribute('href');

			// Current on tab
			currTabs.querySelectorAll('[role="tab"]').forEach(el => el.setAttribute('aria-selected', 'false'));
			target.setAttribute('aria-selected', 'true');

			// Current on tab panel
			currTabs.querySelectorAll('[role="tabpanel"]').forEach(el => el.setAttribute('aria-expanded', 'false'));
			document.querySelector(targetID).setAttribute('aria-expanded', 'true');

			return false;
		});
	});

	/**
	 * Code/Doc Help control
	 */
	document.querySelectorAll('.doc-help').forEach((el) => el.style.display = '');
	document.querySelectorAll('.doc-btn-help button').forEach((el) => {
		el.addEventListener('click', (ev) => {
			const target = ev.currentTarget;
			target.classList.toggle('is-active');
			const helps = target.closest('.doc-tabs').querySelectorAll('.doc-help');
			helps.forEach(e => {
				target.classList.contains('is-active') ? e.style.display = '' : e.style.display = 'none'
			});
		});
	});

	/**
	 * Color details
	 */
	let colors  = document.querySelectorAll('.doc-color-block'),
		panel   = document.querySelector('.doc-color-detail-panel'),
		dpLayer = document.querySelector('.doc-color-detail-panel-back'),
		i = 0,
		closePanel = function(e) {
			// If it's a keypress event and CMD or CTRL is activated, maybe a Copy attempt
			// Let's user take control on Meta/Ctrl press.
			if ( e.type === 'keydown' && ( e.ctrlKey || e.metaKey ) ) {
				return;
			}

			// If it's a keypress event, close only if it's an Escape attempt.
			if ( ( e.type === 'keydown' && e.keyCode !== 27 ) ) {
				e.preventDefault();
				return false;
			}

			var colorID    = panel.getAttribute('data-source-id'),
				theColor   = document.querySelector('[aria-controls="' + colorID + '"]'),
				thisDetail = panel.querySelector('.doc-color-more-details');

			// move data from panel to color tile
			panel.removeAttribute('data-source-id');
			panel.removeAttribute('role', 'modal' );
			thisDetail.setAttribute('aria-hidden', 'true');

			theColor.appendChild( thisDetail );
			theColor.setAttribute('aria-expanded', 'false');

			window.removeEventListener('keydown', closePanel);

			return false;
		};

	if ( colors ) {

		// While page loading, internal anchors are kind of messed up because content disappear after page load.
		// Make it better after page load and JS loaded.
		if ( window.location.hash ) {
			let hash = window.location.hash;

			window.location.hash = '';

			setTimeout(function(){
				window.location.hash =  hash;
			}, 75);
		}

		colors.forEach(function(color){
			i++;
			var uniqid = 'color-block-detail-' + i,
				detail = color.querySelector('.doc-color-more-details');

			if ( detail ) {
				color.setAttribute('role', 'button');
				color.setAttribute('tabindex', '0');
				color.setAttribute('aria-expanded', 'false');
				color.setAttribute('aria-controls', uniqid);
				
				detail.setAttribute('id', uniqid);
				detail.setAttribute('aria-hidden', 'true');

				color.addEventListener('click', function(e){
					var thisDetail = this.querySelector('.doc-color-more-details');

					if ( this.getAttribute('aria-expanded') === 'false' ) {
						// move data to panel
						panel.setAttribute('data-source-id', thisDetail.id );
						panel.setAttribute('role', 'modal' );
						panel.appendChild( thisDetail );

						this.setAttribute('aria-expanded', 'true');
						thisDetail.setAttribute('aria-hidden', 'false');

						// init esc capability
						window.addEventListener('keydown', closePanel);

						// init on click on colors table
						var colorLinks = panel.querySelectorAll('.doc-compatibility-table a');

						colorLinks.forEach(function(colorLink){
							colorLink.addEventListener('click', closePanel);
						});
					}
				});
			}
		});

		// Close on clicking backdrop layer
		if ( dpLayer ) {
			dpLayer.addEventListener('click', closePanel);
		}
	}

	/**
	 * Inline Color Generator
	 */
	let inlineColors = document.querySelectorAll('.color');

	if ( inlineColors ) {
		inlineColors.forEach(function(color){
			var theColor = color.innerHTML;
			color.innerHTML = '<span class="color-thumbnail" style="background:' + theColor + '"></span><span class="color-hexa">' + theColor + '</span>';
		});
	}

	/**
	 * Installation Prompt Tracking
	 */
	
	window.addEventListener("beforeinstallprompt", function(e) { 
	
		var platform = e.platforms; // e.g., ["web", "android", "windows"]

		e.userChoice.then(function(choice) { 
			var answer = choice.outcome; // either "accepted" or "dismissed"

			// Send it as custom event for GTM.
			dataLayer = dataLayer || [];
			dataLayer.push({'event': 'PWA-Install', 'userDecision': answer, 'userPlatform': platform });

		}); 
	});

})();
/*
* This script uses the following html id:
* outdated
* outdated-img-foyer
* outdated-link-google
* outdated-link-firefox
* outdated-link-safari
* outdated-link-edge
* outdated-img-google
* outdated-img-firefox
* outdated-img-safari
* outdated-img-edge
* copyright-year
* */

/*
 * Following issues with Webviews, we use this library:
 * https://github.com/faisalman/ua-parser-js
 * UAParser.js v0.7.21
 * Lightweight JavaScript-based User-Agent string parser
 * https://github.com/faisalman/ua-parser-js
 *
 * Copyright © 2012-2019 Faisal Salman <f@faisalman.com>
 * Licensed under MIT License
 */
(function(window,undefined){"use strict";var LIBVERSION="0.7.21",EMPTY="",UNKNOWN="?",FUNC_TYPE="function",UNDEF_TYPE="undefined",OBJ_TYPE="object",STR_TYPE="string",MAJOR="major",MODEL="model",NAME="name",TYPE="type",VENDOR="vendor",VERSION="version",ARCHITECTURE="architecture",CONSOLE="console",MOBILE="mobile",TABLET="tablet",SMARTTV="smarttv",WEARABLE="wearable",EMBEDDED="embedded";var util={extend:function(regexes,extensions){var mergedRegexes={};for(var i in regexes){if(extensions[i]&&extensions[i].length%2===0){mergedRegexes[i]=extensions[i].concat(regexes[i])}else{mergedRegexes[i]=regexes[i]}}return mergedRegexes},has:function(str1,str2){if(typeof str1==="string"){return str2.toLowerCase().indexOf(str1.toLowerCase())!==-1}else{return false}},lowerize:function(str){return str.toLowerCase()},major:function(version){return typeof version===STR_TYPE?version.replace(/[^\d\.]/g,"").split(".")[0]:undefined},trim:function(str){return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")}};var mapper={rgx:function(ua,arrays){var i=0,j,k,p,q,matches,match;while(i<arrays.length&&!matches){var regex=arrays[i],props=arrays[i+1];j=k=0;while(j<regex.length&&!matches){matches=regex[j++].exec(ua);if(!!matches){for(p=0;p<props.length;p++){match=matches[++k];q=props[p];if(typeof q===OBJ_TYPE&&q.length>0){if(q.length==2){if(typeof q[1]==FUNC_TYPE){this[q[0]]=q[1].call(this,match)}else{this[q[0]]=q[1]}}else if(q.length==3){if(typeof q[1]===FUNC_TYPE&&!(q[1].exec&&q[1].test)){this[q[0]]=match?q[1].call(this,match,q[2]):undefined}else{this[q[0]]=match?match.replace(q[1],q[2]):undefined}}else if(q.length==4){this[q[0]]=match?q[3].call(this,match.replace(q[1],q[2])):undefined}}else{this[q]=match?match:undefined}}}}i+=2}},str:function(str,map){for(var i in map){if(typeof map[i]===OBJ_TYPE&&map[i].length>0){for(var j=0;j<map[i].length;j++){if(util.has(map[i][j],str)){return i===UNKNOWN?undefined:i}}}else if(util.has(map[i],str)){return i===UNKNOWN?undefined:i}}return str}};var maps={browser:{oldsafari:{version:{"1.0":"/8",1.2:"/1",1.3:"/3","2.0":"/412","2.0.2":"/416","2.0.3":"/417","2.0.4":"/419","?":"/"}}},device:{amazon:{model:{"Fire Phone":["SD","KF"]}},sprint:{model:{"Evo Shift 4G":"7373KT"},vendor:{HTC:"APA",Sprint:"Sprint"}}},os:{windows:{version:{ME:"4.90","NT 3.11":"NT3.51","NT 4.0":"NT4.0",2000:"NT 5.0",XP:["NT 5.1","NT 5.2"],Vista:"NT 6.0",7:"NT 6.1",8:"NT 6.2",8.1:"NT 6.3",10:["NT 6.4","NT 10.0"],RT:"ARM"}}}};var regexes={browser:[[/(opera\smini)\/([\w\.-]+)/i,/(opera\s[mobiletab]+).+version\/([\w\.-]+)/i,/(opera).+version\/([\w\.]+)/i,/(opera)[\/\s]+([\w\.]+)/i],[NAME,VERSION],[/(opios)[\/\s]+([\w\.]+)/i],[[NAME,"Opera Mini"],VERSION],[/\s(opr)\/([\w\.]+)/i],[[NAME,"Opera"],VERSION],[/(kindle)\/([\w\.]+)/i,/(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]*)/i,/(avant\s|iemobile|slim)(?:browser)?[\/\s]?([\w\.]*)/i,/(bidubrowser|baidubrowser)[\/\s]?([\w\.]+)/i,/(?:ms|\()(ie)\s([\w\.]+)/i,/(rekonq)\/([\w\.]*)/i,/(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon)\/([\w\.-]+)/i],[NAME,VERSION],[/(konqueror)\/([\w\.]+)/i],[[NAME,"Konqueror"],VERSION],[/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i],[[NAME,"IE"],VERSION],[/(edge|edgios|edga|edg)\/((\d+)?[\w\.]+)/i],[[NAME,"Edge"],VERSION],[/(yabrowser)\/([\w\.]+)/i],[[NAME,"Yandex"],VERSION],[/(Avast)\/([\w\.]+)/i],[[NAME,"Avast Secure Browser"],VERSION],[/(AVG)\/([\w\.]+)/i],[[NAME,"AVG Secure Browser"],VERSION],[/(puffin)\/([\w\.]+)/i],[[NAME,"Puffin"],VERSION],[/(focus)\/([\w\.]+)/i],[[NAME,"Firefox Focus"],VERSION],[/(opt)\/([\w\.]+)/i],[[NAME,"Opera Touch"],VERSION],[/((?:[\s\/])uc?\s?browser|(?:juc.+)ucweb)[\/\s]?([\w\.]+)/i],[[NAME,"UCBrowser"],VERSION],[/(comodo_dragon)\/([\w\.]+)/i],[[NAME,/_/g," "],VERSION],[/(windowswechat qbcore)\/([\w\.]+)/i],[[NAME,"WeChat(Win) Desktop"],VERSION],[/(micromessenger)\/([\w\.]+)/i],[[NAME,"WeChat"],VERSION],[/(brave)\/([\w\.]+)/i],[[NAME,"Brave"],VERSION],[/(qqbrowserlite)\/([\w\.]+)/i],[NAME,VERSION],[/(QQ)\/([\d\.]+)/i],[NAME,VERSION],[/m?(qqbrowser)[\/\s]?([\w\.]+)/i],[NAME,VERSION],[/(baiduboxapp)[\/\s]?([\w\.]+)/i],[NAME,VERSION],[/(2345Explorer)[\/\s]?([\w\.]+)/i],[NAME,VERSION],[/(MetaSr)[\/\s]?([\w\.]+)/i],[NAME],[/(LBBROWSER)/i],[NAME],[/xiaomi\/miuibrowser\/([\w\.]+)/i],[VERSION,[NAME,"MIUI Browser"]],[/;fbav\/([\w\.]+);/i],[VERSION,[NAME,"Facebook"]],[/safari\s(line)\/([\w\.]+)/i,/android.+(line)\/([\w\.]+)\/iab/i],[NAME,VERSION],[/headlesschrome(?:\/([\w\.]+)|\s)/i],[VERSION,[NAME,"Chrome Headless"]],[/\swv\).+(chrome)\/([\w\.]+)/i],[[NAME,/(.+)/,"$1 WebView"],VERSION],[/((?:oculus|samsung)browser)\/([\w\.]+)/i],[[NAME,/(.+(?:g|us))(.+)/,"$1 $2"],VERSION],[/android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i],[VERSION,[NAME,"Android Browser"]],[/(sailfishbrowser)\/([\w\.]+)/i],[[NAME,"Sailfish Browser"],VERSION],[/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i],[NAME,VERSION],[/(dolfin)\/([\w\.]+)/i],[[NAME,"Dolphin"],VERSION],[/(qihu|qhbrowser|qihoobrowser|360browser)/i],[[NAME,"360 Browser"]],[/((?:android.+)crmo|crios)\/([\w\.]+)/i],[[NAME,"Chrome"],VERSION],[/(coast)\/([\w\.]+)/i],[[NAME,"Opera Coast"],VERSION],[/fxios\/([\w\.-]+)/i],[VERSION,[NAME,"Firefox"]],[/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i],[VERSION,[NAME,"Mobile Safari"]],[/version\/([\w\.]+).+?(mobile\s?safari|safari)/i],[VERSION,NAME],[/webkit.+?(gsa)\/([\w\.]+).+?(mobile\s?safari|safari)(\/[\w\.]+)/i],[[NAME,"GSA"],VERSION],[/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i],[NAME,[VERSION,mapper.str,maps.browser.oldsafari.version]],[/(webkit|khtml)\/([\w\.]+)/i],[NAME,VERSION],[/(navigator|netscape)\/([\w\.-]+)/i],[[NAME,"Netscape"],VERSION],[/(swiftfox)/i,/(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,/(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([\w\.-]+)$/i,/(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,/(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,/(links)\s\(([\w\.]+)/i,/(gobrowser)\/?([\w\.]*)/i,/(ice\s?browser)\/v?([\w\._]+)/i,/(mosaic)[\/\s]([\w\.]+)/i],[NAME,VERSION]],cpu:[[/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i],[[ARCHITECTURE,"amd64"]],[/(ia32(?=;))/i],[[ARCHITECTURE,util.lowerize]],[/((?:i[346]|x)86)[;\)]/i],[[ARCHITECTURE,"ia32"]],[/windows\s(ce|mobile);\sppc;/i],[[ARCHITECTURE,"arm"]],[/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i],[[ARCHITECTURE,/ower/,"",util.lowerize]],[/(sun4\w)[;\)]/i],[[ARCHITECTURE,"sparc"]],[/((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+[;l]))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i],[[ARCHITECTURE,util.lowerize]]],device:[[/\((ipad|playbook);[\w\s\),;-]+(rim|apple)/i],[MODEL,VENDOR,[TYPE,TABLET]],[/applecoremedia\/[\w\.]+ \((ipad)/],[MODEL,[VENDOR,"Apple"],[TYPE,TABLET]],[/(apple\s{0,1}tv)/i],[[MODEL,"Apple TV"],[VENDOR,"Apple"],[TYPE,SMARTTV]],[/(archos)\s(gamepad2?)/i,/(hp).+(touchpad)/i,/(hp).+(tablet)/i,/(kindle)\/([\w\.]+)/i,/\s(nook)[\w\s]+build\/(\w+)/i,/(dell)\s(strea[kpr\s\d]*[\dko])/i],[VENDOR,MODEL,[TYPE,TABLET]],[/(kf[A-z]+)\sbuild\/.+silk\//i],[MODEL,[VENDOR,"Amazon"],[TYPE,TABLET]],[/(sd|kf)[0349hijorstuw]+\sbuild\/.+silk\//i],[[MODEL,mapper.str,maps.device.amazon.model],[VENDOR,"Amazon"],[TYPE,MOBILE]],[/android.+aft([bms])\sbuild/i],[MODEL,[VENDOR,"Amazon"],[TYPE,SMARTTV]],[/\((ip[honed|\s\w*]+);.+(apple)/i],[MODEL,VENDOR,[TYPE,MOBILE]],[/\((ip[honed|\s\w*]+);/i],[MODEL,[VENDOR,"Apple"],[TYPE,MOBILE]],[/(blackberry)[\s-]?(\w+)/i,/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]*)/i,/(hp)\s([\w\s]+\w)/i,/(asus)-?(\w+)/i],[VENDOR,MODEL,[TYPE,MOBILE]],[/\(bb10;\s(\w+)/i],[MODEL,[VENDOR,"BlackBerry"],[TYPE,MOBILE]],[/android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone|p00c)/i],[MODEL,[VENDOR,"Asus"],[TYPE,TABLET]],[/(sony)\s(tablet\s[ps])\sbuild\//i,/(sony)?(?:sgp.+)\sbuild\//i],[[VENDOR,"Sony"],[MODEL,"Xperia Tablet"],[TYPE,TABLET]],[/android.+\s([c-g]\d{4}|so[-l]\w+)(?=\sbuild\/|\).+chrome\/(?![1-6]{0,1}\d\.))/i],[MODEL,[VENDOR,"Sony"],[TYPE,MOBILE]],[/\s(ouya)\s/i,/(nintendo)\s([wids3u]+)/i],[VENDOR,MODEL,[TYPE,CONSOLE]],[/android.+;\s(shield)\sbuild/i],[MODEL,[VENDOR,"Nvidia"],[TYPE,CONSOLE]],[/(playstation\s[34portablevi]+)/i],[MODEL,[VENDOR,"Sony"],[TYPE,CONSOLE]],[/(sprint\s(\w+))/i],[[VENDOR,mapper.str,maps.device.sprint.vendor],[MODEL,mapper.str,maps.device.sprint.model],[TYPE,MOBILE]],[/(htc)[;_\s-]+([\w\s]+(?=\)|\sbuild)|\w+)/i,/(zte)-(\w*)/i,/(alcatel|geeksphone|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]*)/i],[VENDOR,[MODEL,/_/g," "],[TYPE,MOBILE]],[/(nexus\s9)/i],[MODEL,[VENDOR,"HTC"],[TYPE,TABLET]],[/d\/huawei([\w\s-]+)[;\)]/i,/(nexus\s6p|vog-l29|ane-lx1|eml-l29)/i],[MODEL,[VENDOR,"Huawei"],[TYPE,MOBILE]],[/android.+(bah2?-a?[lw]\d{2})/i],[MODEL,[VENDOR,"Huawei"],[TYPE,TABLET]],[/(microsoft);\s(lumia[\s\w]+)/i],[VENDOR,MODEL,[TYPE,MOBILE]],[/[\s\(;](xbox(?:\sone)?)[\s\);]/i],[MODEL,[VENDOR,"Microsoft"],[TYPE,CONSOLE]],[/(kin\.[onetw]{3})/i],[[MODEL,/\./g," "],[VENDOR,"Microsoft"],[TYPE,MOBILE]],[/\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?:?(\s4g)?)[\w\s]+build\//i,/mot[\s-]?(\w*)/i,/(XT\d{3,4}) build\//i,/(nexus\s6)/i],[MODEL,[VENDOR,"Motorola"],[TYPE,MOBILE]],[/android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i],[MODEL,[VENDOR,"Motorola"],[TYPE,TABLET]],[/hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i],[[VENDOR,util.trim],[MODEL,util.trim],[TYPE,SMARTTV]],[/hbbtv.+maple;(\d+)/i],[[MODEL,/^/,"SmartTV"],[VENDOR,"Samsung"],[TYPE,SMARTTV]],[/\(dtv[\);].+(aquos)/i],[MODEL,[VENDOR,"Sharp"],[TYPE,SMARTTV]],[/android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i,/((SM-T\w+))/i],[[VENDOR,"Samsung"],MODEL,[TYPE,TABLET]],[/smart-tv.+(samsung)/i],[VENDOR,[TYPE,SMARTTV],MODEL],[/((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i,/(sam[sung]*)[\s-]*(\w+-?[\w-]*)/i,/sec-((sgh\w+))/i],[[VENDOR,"Samsung"],MODEL,[TYPE,MOBILE]],[/sie-(\w*)/i],[MODEL,[VENDOR,"Siemens"],[TYPE,MOBILE]],[/(maemo|nokia).*(n900|lumia\s\d+)/i,/(nokia)[\s_-]?([\w-]*)/i],[[VENDOR,"Nokia"],MODEL,[TYPE,MOBILE]],[/android[x\d\.\s;]+\s([ab][1-7]\-?[0178a]\d\d?)/i],[MODEL,[VENDOR,"Acer"],[TYPE,TABLET]],[/android.+([vl]k\-?\d{3})\s+build/i],[MODEL,[VENDOR,"LG"],[TYPE,TABLET]],[/android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i],[[VENDOR,"LG"],MODEL,[TYPE,TABLET]],[/(lg) netcast\.tv/i],[VENDOR,MODEL,[TYPE,SMARTTV]],[/(nexus\s[45])/i,/lg[e;\s\/-]+(\w*)/i,/android.+lg(\-?[\d\w]+)\s+build/i],[MODEL,[VENDOR,"LG"],[TYPE,MOBILE]],[/(lenovo)\s?(s(?:5000|6000)(?:[\w-]+)|tab(?:[\s\w]+))/i],[VENDOR,MODEL,[TYPE,TABLET]],[/android.+(ideatab[a-z0-9\-\s]+)/i],[MODEL,[VENDOR,"Lenovo"],[TYPE,TABLET]],[/(lenovo)[_\s-]?([\w-]+)/i],[VENDOR,MODEL,[TYPE,MOBILE]],[/linux;.+((jolla));/i],[VENDOR,MODEL,[TYPE,MOBILE]],[/((pebble))app\/[\d\.]+\s/i],[VENDOR,MODEL,[TYPE,WEARABLE]],[/android.+;\s(oppo)\s?([\w\s]+)\sbuild/i],[VENDOR,MODEL,[TYPE,MOBILE]],[/crkey/i],[[MODEL,"Chromecast"],[VENDOR,"Google"],[TYPE,SMARTTV]],[/android.+;\s(glass)\s\d/i],[MODEL,[VENDOR,"Google"],[TYPE,WEARABLE]],[/android.+;\s(pixel c)[\s)]/i],[MODEL,[VENDOR,"Google"],[TYPE,TABLET]],[/android.+;\s(pixel( [23])?( xl)?)[\s)]/i],[MODEL,[VENDOR,"Google"],[TYPE,MOBILE]],[/android.+;\s(\w+)\s+build\/hm\1/i,/android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i,/android.+(mi[\s\-_]*(?:a\d|one|one[\s_]plus|note lte)?[\s_]*(?:\d?\w?)[\s_]*(?:plus)?)\s+build/i,/android.+(redmi[\s\-_]*(?:note)?(?:[\s_]*[\w\s]+))\s+build/i],[[MODEL,/_/g," "],[VENDOR,"Xiaomi"],[TYPE,MOBILE]],[/android.+(mi[\s\-_]*(?:pad)(?:[\s_]*[\w\s]+))\s+build/i],[[MODEL,/_/g," "],[VENDOR,"Xiaomi"],[TYPE,TABLET]],[/android.+;\s(m[1-5]\snote)\sbuild/i],[MODEL,[VENDOR,"Meizu"],[TYPE,MOBILE]],[/(mz)-([\w-]{2,})/i],[[VENDOR,"Meizu"],MODEL,[TYPE,MOBILE]],[/android.+a000(1)\s+build/i,/android.+oneplus\s(a\d{4})[\s)]/i],[MODEL,[VENDOR,"OnePlus"],[TYPE,MOBILE]],[/android.+[;\/]\s*(RCT[\d\w]+)\s+build/i],[MODEL,[VENDOR,"RCA"],[TYPE,TABLET]],[/android.+[;\/\s]+(Venue[\d\s]{2,7})\s+build/i],[MODEL,[VENDOR,"Dell"],[TYPE,TABLET]],[/android.+[;\/]\s*(Q[T|M][\d\w]+)\s+build/i],[MODEL,[VENDOR,"Verizon"],[TYPE,TABLET]],[/android.+[;\/]\s+(Barnes[&\s]+Noble\s+|BN[RT])(V?.*)\s+build/i],[[VENDOR,"Barnes & Noble"],MODEL,[TYPE,TABLET]],[/android.+[;\/]\s+(TM\d{3}.*\b)\s+build/i],[MODEL,[VENDOR,"NuVision"],[TYPE,TABLET]],[/android.+;\s(k88)\sbuild/i],[MODEL,[VENDOR,"ZTE"],[TYPE,TABLET]],[/android.+[;\/]\s*(gen\d{3})\s+build.*49h/i],[MODEL,[VENDOR,"Swiss"],[TYPE,MOBILE]],[/android.+[;\/]\s*(zur\d{3})\s+build/i],[MODEL,[VENDOR,"Swiss"],[TYPE,TABLET]],[/android.+[;\/]\s*((Zeki)?TB.*\b)\s+build/i],[MODEL,[VENDOR,"Zeki"],[TYPE,TABLET]],[/(android).+[;\/]\s+([YR]\d{2})\s+build/i,/android.+[;\/]\s+(Dragon[\-\s]+Touch\s+|DT)(\w{5})\sbuild/i],[[VENDOR,"Dragon Touch"],MODEL,[TYPE,TABLET]],[/android.+[;\/]\s*(NS-?\w{0,9})\sbuild/i],[MODEL,[VENDOR,"Insignia"],[TYPE,TABLET]],[/android.+[;\/]\s*((NX|Next)-?\w{0,9})\s+build/i],[MODEL,[VENDOR,"NextBook"],[TYPE,TABLET]],[/android.+[;\/]\s*(Xtreme\_)?(V(1[045]|2[015]|30|40|60|7[05]|90))\s+build/i],[[VENDOR,"Voice"],MODEL,[TYPE,MOBILE]],[/android.+[;\/]\s*(LVTEL\-)?(V1[12])\s+build/i],[[VENDOR,"LvTel"],MODEL,[TYPE,MOBILE]],[/android.+;\s(PH-1)\s/i],[MODEL,[VENDOR,"Essential"],[TYPE,MOBILE]],[/android.+[;\/]\s*(V(100MD|700NA|7011|917G).*\b)\s+build/i],[MODEL,[VENDOR,"Envizen"],[TYPE,TABLET]],[/android.+[;\/]\s*(Le[\s\-]+Pan)[\s\-]+(\w{1,9})\s+build/i],[VENDOR,MODEL,[TYPE,TABLET]],[/android.+[;\/]\s*(Trio[\s\-]*.*)\s+build/i],[MODEL,[VENDOR,"MachSpeed"],[TYPE,TABLET]],[/android.+[;\/]\s*(Trinity)[\-\s]*(T\d{3})\s+build/i],[VENDOR,MODEL,[TYPE,TABLET]],[/android.+[;\/]\s*TU_(1491)\s+build/i],[MODEL,[VENDOR,"Rotor"],[TYPE,TABLET]],[/android.+(KS(.+))\s+build/i],[MODEL,[VENDOR,"Amazon"],[TYPE,TABLET]],[/android.+(Gigaset)[\s\-]+(Q\w{1,9})\s+build/i],[VENDOR,MODEL,[TYPE,TABLET]],[/\s(tablet|tab)[;\/]/i,/\s(mobile)(?:[;\/]|\ssafari)/i],[[TYPE,util.lowerize],VENDOR,MODEL],[/[\s\/\(](smart-?tv)[;\)]/i],[[TYPE,SMARTTV]],[/(android[\w\.\s\-]{0,9});.+build/i],[MODEL,[VENDOR,"Generic"]]],engine:[[/windows.+\sedge\/([\w\.]+)/i],[VERSION,[NAME,"EdgeHTML"]],[/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i],[VERSION,[NAME,"Blink"]],[/(presto)\/([\w\.]+)/i,/(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,/(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,/(icab)[\/\s]([23]\.[\d\.]+)/i],[NAME,VERSION],[/rv\:([\w\.]{1,9}).+(gecko)/i],[VERSION,NAME]],os:[[/microsoft\s(windows)\s(vista|xp)/i],[NAME,VERSION],[/(windows)\snt\s6\.2;\s(arm)/i,/(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s\w]*)/i,/(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i],[NAME,[VERSION,mapper.str,maps.os.windows.version]],[/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],[[NAME,"Windows"],[VERSION,mapper.str,maps.os.windows.version]],[/\((bb)(10);/i],[[NAME,"BlackBerry"],VERSION],[/(blackberry)\w*\/?([\w\.]*)/i,/(tizen|kaios)[\/\s]([\w\.]+)/i,/(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|sailfish|contiki)[\/\s-]?([\w\.]*)/i],[NAME,VERSION],[/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]*)/i],[[NAME,"Symbian"],VERSION],[/\((series40);/i],[NAME],[/mozilla.+\(mobile;.+gecko.+firefox/i],[[NAME,"Firefox OS"],VERSION],[/(nintendo|playstation)\s([wids34portablevu]+)/i,/(mint)[\/\s\(]?(\w*)/i,/(mageia|vectorlinux)[;\s]/i,/(joli|[kxln]?ubuntu|debian|suse|opensuse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]*)/i,/(hurd|linux)\s?([\w\.]*)/i,/(gnu)\s?([\w\.]*)/i],[NAME,VERSION],[/(cros)\s[\w]+\s([\w\.]+\w)/i],[[NAME,"Chromium OS"],VERSION],[/(sunos)\s?([\w\.\d]*)/i],[[NAME,"Solaris"],VERSION],[/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]*)/i],[NAME,VERSION],[/(haiku)\s(\w+)/i],[NAME,VERSION],[/cfnetwork\/.+darwin/i,/ip[honead]{2,4}(?:.*os\s([\w]+)\slike\smac|;\sopera)/i],[[VERSION,/_/g,"."],[NAME,"iOS"]],[/(mac\sos\sx)\s?([\w\s\.]*)/i,/(macintosh|mac(?=_powerpc)\s)/i],[[NAME,"Mac OS"],[VERSION,/_/g,"."]],[/((?:open)?solaris)[\/\s-]?([\w\.]*)/i,/(aix)\s((\d)(?=\.|\)|\s)[\w\.])*/i,/(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms|fuchsia)/i,/(unix)\s?([\w\.]*)/i],[NAME,VERSION]]};var UAParser=function(uastring,extensions){if(typeof uastring==="object"){extensions=uastring;uastring=undefined}if(!(this instanceof UAParser)){return new UAParser(uastring,extensions).getResult()}var ua=uastring||(window&&window.navigator&&window.navigator.userAgent?window.navigator.userAgent:EMPTY);var rgxmap=extensions?util.extend(regexes,extensions):regexes;this.getBrowser=function(){var browser={name:undefined,version:undefined};mapper.rgx.call(browser,ua,rgxmap.browser);browser.major=util.major(browser.version);return browser};this.getCPU=function(){var cpu={architecture:undefined};mapper.rgx.call(cpu,ua,rgxmap.cpu);return cpu};this.getDevice=function(){var device={vendor:undefined,model:undefined,type:undefined};mapper.rgx.call(device,ua,rgxmap.device);return device};this.getEngine=function(){var engine={name:undefined,version:undefined};mapper.rgx.call(engine,ua,rgxmap.engine);return engine};this.getOS=function(){var os={name:undefined,version:undefined};mapper.rgx.call(os,ua,rgxmap.os);return os};this.getResult=function(){return{ua:this.getUA(),browser:this.getBrowser(),engine:this.getEngine(),os:this.getOS(),device:this.getDevice(),cpu:this.getCPU()}};this.getUA=function(){return ua};this.setUA=function(uastring){ua=uastring;return this};return this};UAParser.VERSION=LIBVERSION;UAParser.BROWSER={NAME:NAME,MAJOR:MAJOR,VERSION:VERSION};UAParser.CPU={ARCHITECTURE:ARCHITECTURE};UAParser.DEVICE={MODEL:MODEL,VENDOR:VENDOR,TYPE:TYPE,CONSOLE:CONSOLE,MOBILE:MOBILE,SMARTTV:SMARTTV,TABLET:TABLET,WEARABLE:WEARABLE,EMBEDDED:EMBEDDED};UAParser.ENGINE={NAME:NAME,VERSION:VERSION};UAParser.OS={NAME:NAME,VERSION:VERSION};if(typeof exports!==UNDEF_TYPE){if(typeof module!==UNDEF_TYPE&&module.exports){exports=module.exports=UAParser}exports.UAParser=UAParser}else{if(typeof define==="function"&&define.amd){define(function(){return UAParser})}else if(window){window.UAParser=UAParser}}var $=window&&(window.jQuery||window.Zepto);if($&&!$.ua){var parser=new UAParser;$.ua=parser.getResult();$.ua.get=function(){return parser.getUA()};$.ua.set=function(uastring){parser.setUA(uastring);var result=parser.getResult();for(var prop in result){$.ua[prop]=result[prop]}}}})(typeof window==="object"?window:this);
(function() {
    /* This code must be in es5 and old browsers compliant */
	function hasClass(elem, className) {
	  return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
	}

	function addClass(elem, className) {
	  if (!hasClass(elem, className)) {
		elem.className += ' ' + className;
	  }
	}

	var browserName = navigator.appName;
	var language = navigator.language || navigator.userLanguage;
    var nameVersion = new UAParser().getBrowser();
    if(nameVersion == null) return;

	var version = parseInt('' + nameVersion.version, 10);
	browserName = nameVersion.name || browserName || '';
	browserName = browserName.toLowerCase();

	var browserMinVersion = {
		opera: 49,
		msie: 11,
		ie: 11,
		edge: 12,
		chrome: 49,
		safari: 9,
		firefox: 45
	};

    if(browserMinVersion[browserName]) {

		function i18n(language) {
		  var lang = language.substring(0, 2);
		  if(lang == 'en') {
			document.body.innerHTML = document.body.innerHTML.replace(/telechargeri18n/g, 'Download');
			document.body.innerHTML = document.body.innerHTML.replace(/pasAdaptei18n/g, 'Your browser or browser version is not suitable for this site.');
			document.body.innerHTML = document.body.innerHTML.replace(/utilisationOptimalei18n/g, 'For optimal use');
			document.body.innerHTML = document.body.innerHTML.replace(/connectezNavigateuri18n/g, ', connect with one of the following browsers:');
			document.getElementById("outdated-link-firefox").href = "https://www.mozilla.org/en-US/firefox/new/"
			document.getElementById("outdated-link-edge").href = "https://www.microsoft.com/en-us/windows/microsoft-edge"
		  }
		  else if(lang == 'de') {
			document.body.innerHTML = document.body.innerHTML.replace(/telechargeri18n/g, 'Herunterladen');
			document.body.innerHTML = document.body.innerHTML.replace(/pasAdaptei18n/g, 'Ihr Browser oder Ihre Browserversion ist für diese Seite nicht geeignet.');
			document.body.innerHTML = document.body.innerHTML.replace(/utilisationOptimalei18n/g, 'Für eine optimale Nutzung');
			document.body.innerHTML = document.body.innerHTML.replace(/connectezNavigateuri18n/g, ', verbinden Sie sich mit einem der folgenden Browser:');
			document.getElementById("outdated-link-firefox").href = "https://www.mozilla.org/de-DE/firefox/new/"
			document.getElementById("outdated-link-edge").href = "https://www.microsoft.com/de-de/windows/microsoft-edge"
		  }
		  else {
			document.body.innerHTML = document.body.innerHTML.replace(/telechargeri18n/g, 'Télécharger');
			document.body.innerHTML = document.body.innerHTML.replace(/pasAdaptei18n/g, 'Votre navigateur ou la version de votre navigateur n\'est pas adapté pour ce site.');
			document.body.innerHTML = document.body.innerHTML.replace(/utilisationOptimalei18n/g, 'Pour une utilisation optimale');
			document.body.innerHTML = document.body.innerHTML.replace(/connectezNavigateuri18n/g, ', connectez-vous avec l\'un des navigateurs suivants :');
			document.getElementById("outdated-link-firefox").href = "https://www.mozilla.org/fr-FR/firefox/new/"
			document.getElementById("outdated-link-edge").href = "https://www.microsoft.com/fr-fr/windows/microsoft-edge"
		  }
		}

		if(version < browserMinVersion[browserName]) {
		  var body =  document.body;
		  body.innerHTML +=
			'<style>' +
			  'body.outdated {background-color: #F7FBFF;font-family: Lato;display: block !important;}' +
			  '.outdated {display: none;text-align: center;font-family: Arial;}' +
			  '@media only screen and (max-width: 680px) {.outdated {padding: 0 18px;}}' +
			  '.outdated.is-visible {display: block !important;}' +
			  '.outdated-is-hidden {display: none !important;}' +
			  '.foyer-logo {padding-top: 108px;padding-bottom: 20px;}' +
			  '@media only screen and (max-width: 680px) {.foyer-logo {padding-top: 34px;padding-bottom: 20px;}}' +
			  '.outdated .loader-content {display: none;}' +
			  '.outdated .panel {margin: 0 auto;max-width: 740px;min-width: 270px;border: 1px solid #eaf0f6;background: #fff;border-radius: 4px;box-shadow: 0 8px 16px -8px rgba(0,76,146,.3);transition: box-shadow .3s ease;margin-bottom: 40px;}' +
			  '.outdated .panel-header {font-size: 20px;font-weight: 700;padding: 40px 60px 30px;border-bottom: 1px solid #eaf0f6;}' +
			  '.outdated .panel-body {font-size: 14px;padding: 30px 20px 20px 20px;}' +
			  '.outdated .is-bold {font-weight: 700 !important;}' +
			  '.outdated .is-blue-foyer {color: #004C92 !important;}' +
			  '.outdated .browser {padding: 40px;display: inline-block;}' +
			  '.outdated .browser > a, .outdated a:visited, .outdated a:active {text-decoration: none;color: #3B4856;}' +
			  '.outdated a:hover {color: #5EB2FF;}' +
			  '.outdated img {border: none;}' +
			  '@media only screen and (max-width: 680px) {.outdated .browser {/* display: block; */padding: 20px;}}' +
			  '.outdated .copyright {color: #999999;font-size: 12px;}' +
			'</style>' +
			'' +
			'' +
			'<div class="outdated" id="outdated">' +
			  '<div class="foyer-logo">' +
			   '<img id="outdated-img-foyer" width="80" height="80"  alt="Foyer Assurances">' +
			  '</div>' +
			  '<div class="panel">' +
				'<div class="panel-header">' +
				  'pasAdaptei18n' +
				'</div>' +
				'<div class="panel-body">' +
				  '<p>' +
					'<span class="is-bold is-blue-foyer">' +
					  'utilisationOptimalei18n' +
					'</span>' +
					'connectezNavigateuri18n' +
				  '</p>' +
				  '<div class="browsers">' +
					'<span class="browser">' +
					  '<a id="outdated-link-google" href="https://www.google.com/chrome/?brand=CHBD&gclid=EAIaIQobChMIwJKEjNT54AIVlOF3Ch1IEgSsEAAYASAAEgKzlfD_BwE&gclsrc=aw.ds" target="_blank">' +
						'<img id="outdated-img-google" width="60" height="60" alt="Foyer Assurances">' +
						'<br>' +
						  'telechargeri18n<br>Chrome' +
					  '</a>' +
					'</span>' +
					'<span class="browser">' +
					  '<a id="outdated-link-firefox" href="https://www.mozilla.org/en-US/firefox/new/" target="_blank">' +
						'<img id="outdated-img-firefox" width="60" height="60" alt="Foyer Assurances">' +
						'<br>' +
						'telechargeri18n<br>Firefox' +
					  '</a>' +
					'</span>' +
					'<span class="browser">' +
					  '<a id="outdated-link-safari" href="https://support.apple.com/downloads/safari" target="_blank">' +
						'<img id="outdated-img-safari" width="60" height="60" alt="Foyer Assurances">' +
						'<br>' +
						'telechargeri18n<br>Safari' +
					  '</a>' +
					'</span>' +
					'<span class="browser">' +
					  '<a id="outdated-link-edge" href="https://www.microsoft.com/en-us/windows/microsoft-edge" target="_blank">' +
						'<img id="outdated-img-edge" width="60" height="60" alt="Foyer Assurances">' +
						'<br>' +
						'telechargeri18n<br>Edge' +
					  '</a>' +
					'</span>' +
				  '</div>' +
				'</div>' +
			  '</div>' +
			  '<div class="copyright">' +
				'Copyright ©' +
				'<span id="copyright-year">' +
				'</span>' +
				'FOYER, Luxembourg, Europe' +
			  '</div>' +
			'</div>';

		  //  Logo
		  document.getElementById("outdated-img-google").src = 'data:image/png;base64,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';
		  document.getElementById("outdated-img-firefox").src = 'data:image/png;base64,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';
		  document.getElementById("outdated-img-safari").src = 'data:image/png;base64,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';
		  document.getElementById("outdated-img-edge").src = 'data:image/png;base64,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';
		  document.getElementById("outdated-img-foyer").src = 'data:image/png;base64,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';

		  //  Link
		  document.getElementById("outdated-link-google").href = "https://www.google.com/chrome/?brand=CHBD&gclid=EAIaIQobChMIwJKEjNT54AIVlOF3Ch1IEgSsEAAYASAAEgKzlfD_BwE&gclsrc=aw.ds";
		  document.getElementById("outdated-link-safari").href = "https://support.apple.com/downloads/safari";

		  var outdated = document.getElementById("outdated");
		  var appRoot = document.getElementsByTagName("app-root")[0] || document.getElementById("app-root");
		  var copyright = document.getElementById("copyright-year");
		  copyright.innerText = new Date().getFullYear() + ' ';

		  addClass(body, 'outdated');
		  addClass(outdated, 'is-visible');
		  if(appRoot)
			addClass(appRoot, 'outdated-is-hidden');
		  i18n(language);
		}
	}
})();

(function(){
    let collapsablePanels = document.querySelectorAll('.Panel.is-collapsable'),
        i = 1;

    collapsablePanels.forEach(function(panel){
        const header = panel.querySelector('.Panel-header'),
            panelContent = panel.querySelector('.Panel-collapse');

        if(panelContent) {
            panelContent.setAttribute('id', 'panel-content-' + i);
            panelContent.setAttribute('tabindex', '-1');
        }

        if(header) {
            header.setAttribute('aria-expanded', 'false');
            header.setAttribute('aria-controls', 'panel-content-' + i);

            header.addEventListener('click', function(){
                const parent = this.parentNode,
                    panelC = parent.querySelector('.Panel-collapse');

                if ( parent.classList.contains('is-opened') ) {
                    this.setAttribute('aria-expanded', 'false');
                    parent.classList.remove('is-opened');
                    if(panelC) panelC.setAttribute('tabindex', '-1');
                    this.focus();
                } else {
                    this.setAttribute('aria-expanded', 'true');
                    parent.classList.add('is-opened');
                    if(panelC) {
                        panelC.setAttribute('tabindex', '0');
                        panelC.focus();
                    }
                }

            });
        }
        i++;
    });
})();
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

    Array.prototype.forEach = function (callback/*, thisArg*/) {
        var T, k;
        if (this == null) {
            throw new TypeError('this is null or not defined');
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }
        if (arguments.length > 1) {
            T = arguments[1];
        }
        k = 0;
        while (k < len) {
            var kValue;
            if (k in O) {
                kValue = O[k];
                callback.call(T, kValue, k, O);
            }
            k++;
        }
    };
}

// Polyfill Closest();
// Reference: https://developer.mozilla.org/fr/docs/Web/API/Element/closest
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;
        if (!document.documentElement.contains(el)) return null;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType == 1); 
        return null;
    };
}
