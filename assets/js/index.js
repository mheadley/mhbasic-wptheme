
/*	-----------------------------------------------------------------------------------------------
	Namespace (WP best practices I guess)
--------------------------------------------------------------------------------------------------- */

var mheadleythemeapp = mheadleythemeapp || {};

// Set a default value for scrolled.
mheadleythemeapp.scrolled = 0;

// polyfill closest
// https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
if ( ! Element.prototype.closest ) {
	Element.prototype.closest = function( s ) {
		var el = this;

		do {
			if ( el.matches( s ) ) {
				return el;
			}

			el = el.parentElement || el.parentNode;
		} while ( el !== null && el.nodeType === 1 );

		return null;
	};
}

// polyfill forEach
// https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach#Polyfill
if ( window.NodeList && ! NodeList.prototype.forEach ) {
	NodeList.prototype.forEach = function( callback, thisArg ) {
		var i;
		var len = this.length;

		thisArg = thisArg || window;

		for ( i = 0; i < len; i++ ) {
			callback.call( thisArg, this[ i ], i, this );
		}
	};
}
Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};

// event "polyfill"
mheadleythemeapp.createEvent = function( eventName ) {
	var event;
	if ( typeof window.Event === 'function' ) {
		event = new Event( eventName );
	} else {
		event = document.createEvent( 'Event' );
		event.initEvent( eventName, true, false );
	}
	return event;
};

// matches "polyfill"
// https://developer.mozilla.org/es/docs/Web/API/Element/matches
if ( ! Element.prototype.matches ) {
	Element.prototype.matches =
		Element.prototype.matchesSelector ||
		Element.prototype.mozMatchesSelector ||
		Element.prototype.msMatchesSelector ||
		Element.prototype.oMatchesSelector ||
		Element.prototype.webkitMatchesSelector ||
		function( s ) {
			var matches = ( this.document || this.ownerDocument ).querySelectorAll( s ),
				i = matches.length;
			while ( --i >= 0 && matches.item( i ) !== this ) {}
			return i > -1;
		};
}

// Add a class to the body for when touch is enabled for browsers that don't support media queries
// for interaction media features. Adapted from <https://codepen.io/Ferie/pen/vQOMmO>
mheadleythemeapp.touchEnabled = {

	init: function() {
		var matchMedia = function() {
			// Include the 'heartz' as a way to have a non matching MQ to help terminate the join. See <https://git.io/vznFH>.
			var prefixes = [ '-webkit-', '-moz-', '-o-', '-ms-' ];
			var query = [ '(', prefixes.join( 'touch-enabled),(' ), 'heartz', ')' ].join( '' );
			return window.matchMedia && window.matchMedia( query ).matches;
		};

		if ( ( 'ontouchstart' in window ) || ( window.DocumentTouch && document instanceof window.DocumentTouch ) || matchMedia() ) {
			document.body.classList.add( 'touch-enabled' );
		}
	}
}; // mheadleythemeapp.touchEnabled

/*	-----------------------------------------------------------------------------------------------
	Cover Modals
--------------------------------------------------------------------------------------------------- */

mheadleythemeapp.coverModals = {

	init: function() {
		if ( document.querySelector( '.cover-modal' ) ) {
			// Handle cover modals when they're toggled
			this.onToggle();

			// When toggled, untoggle if visitor clicks on the wrapping element of the modal
			this.outsideUntoggle();

			// Close on escape key press
			this.closeOnEscape();

			// Hide and show modals before and after their animations have played out
			this.hideAndShowModals();
		}
	},

	// Handle cover modals when they're toggled
	onToggle: function() {
		document.querySelectorAll( '.cover-modal' ).forEach( function( element ) {
			element.addEventListener( 'toggled', function( event ) {
				var modal = event.target,
					body = document.body;

				if ( modal.classList.contains( 'active' ) ) {
					body.classList.add( 'showing-modal' );
				} else {
					body.classList.remove( 'showing-modal' );
					body.classList.add( 'hiding-modal' );

					// Remove the hiding class after a delay, when animations have been run
					setTimeout( function() {
						body.classList.remove( 'hiding-modal' );
					}, 500 );
				}
			} );
		} );
	},

	// Close modal on outside click
	outsideUntoggle: function() {
		document.addEventListener( 'click', function( event ) {
			var target = event.target;
			var modal = document.querySelector( '.cover-modal.active' );

			if ( target === modal ) {
				this.untoggleModal( target );
			}
		}.bind( this ) );
	},

	// Close modal on escape key press
	closeOnEscape: function() {
		document.addEventListener( 'keydown', function( event ) {
			if ( event.keyCode === 27 ) {
				event.preventDefault();
				document.querySelectorAll( '.cover-modal.active' ).forEach( function( element ) {
					this.untoggleModal( element );
				}.bind( this ) );
			}
		}.bind( this ) );
	},

	// Hide and show modals before and after their animations have played out
	hideAndShowModals: function() {
		var _doc = document,
			_win = window,
			modals = _doc.querySelectorAll( '.cover-modal' ),
			htmlStyle = _doc.documentElement.style,
			adminBar = _doc.querySelector( '#wpadminbar' );

		function getAdminBarHeight( negativeValue ) {
			var height,
				currentScroll = _win.pageYOffset;

			if ( adminBar ) {
				height = currentScroll + adminBar.getBoundingClientRect().height;

				return negativeValue ? -height : height;
			}

			return currentScroll === 0 ? 0 : -currentScroll;
		}

		function htmlStyles() {
			var overflow = _win.innerHeight > _doc.documentElement.getBoundingClientRect().height;

			return {
				'overflow-y': overflow ? 'hidden' : 'scroll',
				position: 'fixed',
				width: '100%',
				top: getAdminBarHeight( true ) + 'px',
				left: 0
			};
		}

		// Show the modal
		modals.forEach( function( modal ) {
			modal.addEventListener( 'toggle-target-before-inactive', function( event ) {
				var styles = htmlStyles(),
					offsetY = _win.pageYOffset,
					paddingTop = ( Math.abs( getAdminBarHeight() ) - offsetY ) + 'px',
					mQuery = _win.matchMedia( '(max-width: 600px)' );

				if ( event.target !== modal ) {
					return;
				}

				Object.keys( styles ).forEach( function( styleKey ) {
					htmlStyle.setProperty( styleKey, styles[ styleKey ] );
				} );

				_win.mheadleythemeapp.scrolled = parseInt( styles.top, 10 );

				if ( adminBar ) {
					_doc.body.style.setProperty( 'padding-top', paddingTop );

					if ( mQuery.matches ) {
						if ( offsetY >= getAdminBarHeight() ) {
							modal.style.setProperty( 'top', 0 );
						} else {
							modal.style.setProperty( 'top', ( getAdminBarHeight() - offsetY ) + 'px' );
						}
					}
				}

				modal.classList.add( 'show-modal' );
			} );

			// Hide the modal after a delay, so animations have time to play out
			modal.addEventListener( 'toggle-target-after-inactive', function( event ) {
				if ( event.target !== modal ) {
					return;
				}

				setTimeout( function() {
					var clickedEl = mheadleythemeapp.toggles.clickedEl;

					modal.classList.remove( 'show-modal' );

					Object.keys( htmlStyles() ).forEach( function( styleKey ) {
						htmlStyle.removeProperty( styleKey );
					} );

					if ( adminBar ) {
						_doc.body.style.removeProperty( 'padding-top' );
						modal.style.removeProperty( 'top' );
					}

					if ( clickedEl !== false ) {
						clickedEl.focus();
						clickedEl = false;
					}

					_win.scrollTo( 0, Math.abs( _win.mheadleythemeapp.scrolled + getAdminBarHeight() ) );

					_win.mheadleythemeapp.scrolled = 0;
				}, 500 );
			} );
		} );
	},

	// Untoggle a modal
	untoggleModal: function( modal ) {
		var modalTargetClass,
			modalToggle = false;

		// If the modal has specified the string (ID or class) used by toggles to target it, untoggle the toggles with that target string
		// The modal-target-string must match the string toggles use to target the modal
		if ( modal.dataset.modalTargetString ) {
			modalTargetClass = modal.dataset.modalTargetString;

			modalToggle = document.querySelector( '*[data-toggle-target="' + modalTargetClass + '"]' );
		}

		// If a modal toggle exists, trigger it so all of the toggle options are included
		if ( modalToggle ) {
			modalToggle.click();

			// If one doesn't exist, just hide the modal
		} else {
			modal.classList.remove( 'active' );
		}
	}

}; // mheadleythemeapp.coverModals

/*	-----------------------------------------------------------------------------------------------
	Intrinsic Ratio Embeds
--------------------------------------------------------------------------------------------------- */

mheadleythemeapp.intrinsicRatioVideos = {

	init: function() {
		this.makeFit();

		window.addEventListener( 'resize', function() {
			this.makeFit();
		}.bind( this ) );
	},

	makeFit: function() {
		document.querySelectorAll( 'iframe, object, video' ).forEach( function( video ) {
			var ratio, iTargetWidth,
				container = video.parentNode;

			// Skip videos we want to ignore
			if ( video.classList.contains( 'intrinsic-ignore' ) || video.parentNode.classList.contains( 'intrinsic-ignore' ) ) {
				return true;
			}

			if ( ! video.dataset.origwidth ) {
				// Get the video element proportions
				video.setAttribute( 'data-origwidth', video.width );
				video.setAttribute( 'data-origheight', video.height );
			}

			iTargetWidth = container.offsetWidth;

			// Get ratio from proportions
			ratio = iTargetWidth / video.dataset.origwidth;

			// Scale based on ratio, thus retaining proportions
			video.style.width = iTargetWidth + 'px';
			video.style.height = ( video.dataset.origheight * ratio ) + 'px';
		} );
	}

}; // mheadleythemeapp.instrinsicRatioVideos


/*	-----------------------------------------------------------------------------------------------
	Primary Menu
--------------------------------------------------------------------------------------------------- */

mheadleythemeapp.primaryMenu = {

	init: function() {
		this.focusMenuWithChildren();
	},

	// The focusMenuWithChildren() function implements Keyboard Navigation in the Primary Menu
	// by adding the '.focus' class to all 'li.menu-item-has-children' when the focus is on the 'a' element.
	focusMenuWithChildren: function() {
		// Get all the link elements within the primary menu.
		var links, i, len,
			menu = document.querySelector( '.primary-menu-wrapper' );

		if ( ! menu ) {
			return false;
		}

		links = menu.getElementsByTagName( 'a' );

		// Each time a menu link is focused or blurred, toggle focus.
		for ( i = 0, len = links.length; i < len; i++ ) {
			links[i].addEventListener( 'focus', toggleFocus, true );
			links[i].addEventListener( 'blur', toggleFocus, true );
		}

		//Sets or removes the .focus class on an element.
		function toggleFocus() {
			var self = this;

			// Move up through the ancestors of the current link until we hit .primary-menu.
			while ( -1 === self.className.indexOf( 'primary-menu' ) ) {
				// On li elements toggle the class .focus.
				if ( 'li' === self.tagName.toLowerCase() ) {
					if ( -1 !== self.className.indexOf( 'focus' ) ) {
						self.className = self.className.replace( ' focus', '' );
					} else {
						self.className += ' focus';
					}
				}
				self = self.parentElement;
			}
		}
	}
}; // mheadleythemeapp.primaryMenu

/*	-----------------------------------------------------------------------------------------------
	Toggles
--------------------------------------------------------------------------------------------------- */

mheadleythemeapp.toggles = {

	clickedEl: false,

	init: function() {
		// Do the toggle
		this.toggle();

		// Check for toggle/untoggle on resize
		this.resizeCheck();

		// Check for untoggle on escape key press
		this.untoggleOnEscapeKeyPress();
	},

	performToggle: function( element, instantly ) {
		var target, timeOutTime, classToToggle,
			self = this,
			_doc = document,
			// Get our targets
			toggle = element,
			targetString = toggle.dataset.toggleTarget,
			activeClass = 'active';

		// Elements to focus after modals are closed
		if ( ! _doc.querySelectorAll( '.show-modal' ).length ) {
			self.clickedEl = _doc.activeElement;
		}

		if ( targetString === 'next' ) {
			target = toggle.nextSibling;
		} else {
			target = _doc.querySelector( targetString );
		}

		// Trigger events on the toggle targets before they are toggled
		if ( target.classList.contains( activeClass ) ) {
			target.dispatchEvent( mheadleythemeapp.createEvent( 'toggle-target-before-active' ) );
		} else {
			target.dispatchEvent( mheadleythemeapp.createEvent( 'toggle-target-before-inactive' ) );
		}

		// Get the class to toggle, if specified
		classToToggle = toggle.dataset.classToToggle ? toggle.dataset.classToToggle : activeClass;

		// For cover modals, set a short timeout duration so the class animations have time to play out
		timeOutTime = 0;

		if ( target.classList.contains( 'cover-modal' ) ) {
			timeOutTime = 10;
		}

		setTimeout( function() {
			var focusElement,
				subMenued = target.classList.contains( 'sub-menu' ),
				newTarget = subMenued ? toggle.closest( '.menu-item' ).querySelector( '.sub-menu' ) : target,
				duration = toggle.dataset.toggleDuration;

			// Toggle the target of the clicked toggle
			if ( toggle.dataset.toggleType === 'slidetoggle' && ! instantly && duration !== '0' ) {
				mheadleythemeappMenuToggle( newTarget, duration );
			} else {
				newTarget.classList.toggle( classToToggle );
			}

			// If the toggle target is 'next', only give the clicked toggle the active class
			if ( targetString === 'next' ) {
				toggle.classList.toggle( activeClass );
			} else if ( target.classList.contains( 'sub-menu' ) ) {
				toggle.classList.toggle( activeClass );
			} else {
				// If not, toggle all toggles with this toggle target
				_doc.querySelector( '*[data-toggle-target="' + targetString + '"]' ).classList.toggle( activeClass );
			}

			// Toggle aria-expanded on the toggle
			mheadleythemeappToggleAttribute( toggle, 'aria-expanded', 'true', 'false' );

			if ( self.clickedEl && -1 !== toggle.getAttribute( 'class' ).indexOf( 'close-' ) ) {
				mheadleythemeappToggleAttribute( self.clickedEl, 'aria-expanded', 'true', 'false' );
			}

			// Toggle body class
			if ( toggle.dataset.toggleBodyClass ) {
				_doc.body.classList.toggle( toggle.dataset.toggleBodyClass );
			}

			// Check whether to set focus
			if ( toggle.dataset.setFocus ) {
				focusElement = _doc.querySelector( toggle.dataset.setFocus );

				if ( focusElement ) {
					if ( target.classList.contains( activeClass ) ) {
						focusElement.focus();
					} else {
						focusElement.blur();
					}
				}
			}

			// Trigger the toggled event on the toggle target
			target.dispatchEvent( mheadleythemeapp.createEvent( 'toggled' ) );

			// Trigger events on the toggle targets after they are toggled
			if ( target.classList.contains( activeClass ) ) {
				target.dispatchEvent( mheadleythemeapp.createEvent( 'toggle-target-after-active' ) );
			} else {
				target.dispatchEvent( mheadleythemeapp.createEvent( 'toggle-target-after-inactive' ) );
			}
		}, timeOutTime );
	},

	// Do the toggle
	toggle: function() {
		var self = this;

		document.querySelectorAll( '*[data-toggle-target]' ).forEach( function( element ) {
			element.addEventListener( 'click', function( event ) {
				event.preventDefault();
				self.performToggle( element );
			} );
		} );
	},

	// Check for toggle/untoggle on screen resize
	resizeCheck: function() {
		if ( document.querySelectorAll( '*[data-untoggle-above], *[data-untoggle-below], *[data-toggle-above], *[data-toggle-below]' ).length ) {
			window.addEventListener( 'resize', function() {
				var winWidth = window.innerWidth,
					toggles = document.querySelectorAll( '.toggle' );

				toggles.forEach( function( toggle ) {
					var unToggleAbove = toggle.dataset.untoggleAbove,
						unToggleBelow = toggle.dataset.untoggleBelow,
						toggleAbove = toggle.dataset.toggleAbove,
						toggleBelow = toggle.dataset.toggleBelow;

					// If no width comparison is set, continue
					if ( ! unToggleAbove && ! unToggleBelow && ! toggleAbove && ! toggleBelow ) {
						return;
					}

					// If the toggle width comparison is true, toggle the toggle
					if (
						( ( ( unToggleAbove && winWidth > unToggleAbove ) ||
							( unToggleBelow && winWidth < unToggleBelow ) ) &&
							toggle.classList.contains( 'active' ) ) ||
						( ( ( toggleAbove && winWidth > toggleAbove ) ||
							( toggleBelow && winWidth < toggleBelow ) ) &&
							! toggle.classList.contains( 'active' ) )
					) {
						toggle.click();
					}
				} );
			} );
		}
	},

	// Close toggle on escape key press
	untoggleOnEscapeKeyPress: function() {
		document.addEventListener( 'keyup', function( event ) {
			if ( event.key === 'Escape' ) {
				document.querySelectorAll( '*[data-untoggle-on-escape].active' ).forEach( function( element ) {
					if ( element.classList.contains( 'active' ) ) {
						element.click();
					}
				} );
			}
		} );
	}

}; 

// mheadleythemeapp.toggles

/*	-----------------------------------------------------------------------------------------------
*   Scroll reactions
--------------------------------------------------------------------------------------------------- */


mheadleythemeapp.scrollReactor = { 

  targets: [],
  currWindow: {},
  viewWatched: null,
  scrollAnimation: null,
  //scrollAnimation: null,
  scrolling: false,
  currentPos: 0,
  lastPos: 0,
  scrollReactWatching: false,
  targetWindowSelector: "windowContainer",
  direction:  '',

  init: function(){
    var scrlRxObj  = this;
    var defaultOptions = {
      delta: 0.3,
      mobileBreak: false,
      targetWindowID: null,
      targetPanels: null
    };

    var scrollReactObj = function () {
      function scrollReactObj(target, opts) {
        var delta = opts.delta, mobileBreak = opts.mobileBreak;
        this.delta = (delta === 0 || delta) ? opts.delta : defaultOptions.delta;
        this.mobileBreak = mobileBreak || defaultOptions.mobileBreak;
        this.targetWindowID = opts.targetWindowID;
        this.targetScrollBody = opts.scrollbody ? opts.scrollbody : this.targetWindowID;
        this.simpleWatcher =  opts.watch ? opts.watch :false;
        this.mobileDisable = false;
        this.conditions = [];
        this.current = {};
        this.active = true;
        this.target = target;
        this.accumulated =  this.current.accumulated = 0;
        this.targetR = this.getRect();
        this.current.origin = this.targetR;
        this.current.offsetCalcTop = 0;
        this.current.inViewport = false;
        //console.log("top offsets calculated",this.getTopOffset(), this.target);
        this.startScroll = this.current.startOffset = this.targetR.top = this.getTopOffset();

        //console.log(offsetParent, this.startScroll, this.target.classList);

        //this.startScroll = this.current.startOffset = this.getTopOffset();
      }
      var scrollReact = scrollReactObj.prototype;

      scrollReact.off = function off() {
        this.active = false;
      };

      scrollReact.on = function on() {
        this.active = true;
      };

      scrollReact.getDelta = function getDelta() {
        return this.delta;
      }; 
      
      scrollReact.getOffSets = function getOffSets() {
        return this.current;
      };
      scrollReact.getTopOffset = function getTopOffset(){
        return this.target.getBoundingClientRect().top + scrlRxObj.currentPos;
      };

      scrollReact.changeDelta = function changeDelta(newDelta) {
        if (newDelta !== this.delta) {
          //var oldAccumulation = this.current.accumulated;
          //this.accumulated =  this.getTranslation();
          //if(!this.current.offsetCalcTop){this.current.offsetCalcTop = 0}
          //this.current.accumulated = this.accumulated =  this.delta > 0 ? this.current.offsetCalcTop / this.delta : 0;
          var accTest = newDelta === 0 ?  this.current.offsetCalcTop : this.current.offsetCalcTop;
          this.accumulated = accTest;
          //reverse scrolltop that will get you what the old delta would have placed you minus position for new delta calc
          //this.startScroll = currentPos -  (accTest * this.delta);
          this.startScroll = newDelta === 0 ?  this.targetR.top : scrlRxObj.currentPos - (accTest / Math.abs(newDelta));
         // this.startScroll = newDelta > 0 ? this.current.origin.top  - accTest: this.targetR.top;
          //console.log("change delta", this.startScroll, accTest, currentPos, newDelta);
          //finally move it! if delta is move
          if(newDelta === 0){
            //check to make sure you don't over translate haha
            if( (scrlRxObj.currentPos) < this.targetR.top ){
              //if( currentPos - this.startScroll < Math.abs(accTest)){
                //this.current.offsetCalcTop =  Math.abs(currentPos - this.current.origin.top);
                this.accumulated = 0;
                //console.log("fixed the fuck up in calc with a catch case");
              }
            //console.log("current pos offset from origin in no translate: ", currentPos - this.current.origin.top);

          }
          //console.log("new accum", this.accumulated);
          //finally update
          this.delta = newDelta;
          //if(this.delta  > 0){ 
          this.move();
          //}
        }
      };


      scrollReact.getTranslation = function getTranslation() {

        var dist = this.scrollY() - this.startScroll;
        //resetting when setting delta to 0 meaning no change on scroll so no need to use current pos just accumulated if changed speed
        var translation = this.delta > 0 ? (this.delta *  dist ) : this.accumulated;
       // var translation = (this.delta *  (dist  + this.accumulated) ) + this.current.accumulated;
        //console.log("dist:", dist, "accum:", this.accumulated,  this.current.accumulated, "start:",this.startScroll, this.delta);
        return translation;
       // return translation >= 0 ? translation : 0;
      };



      scrollReact.when = function when(condition, action) {
        this.conditions.push({
          condition: condition,
          action: action
        });
        return this;
      };

      //not sure if needed.  transforms are relative no? just set vals and when scroll control
      // scrollReact.resize = function resize(condition, action) {
      //   this.targetR = this.getRect();
      //   this.current.origin = this.targetR;
      //   console.log(this.targetR);
      // };


      scrollReact.scrollY = function scrollY() {
        if(this.targetWindowID){return scrlRxObj.currentPos}
        return window.scrollY || window.pageYOffset;
      };

      scrollReact.getRect = function getRect() {
        rectObject = this.target.getBoundingClientRect();
        return rectObject;
      };

      scrollReact.inWindow = function inWindow() {
        var rectObject = this.getRect();
        var top = rectObject.top;
        var bottom = rectObject.bottom;
        return top < scrlRxObj.currWindow.winHeight && bottom > 0;
      };

      scrollReact.move = function move() {
        var calcOffset = this.getTranslation();
        this.current.offsetCalcTop = calcOffset;
        if( ((scrlRxObj.currentPos < this.targetR.top) && this.delta === 0 )|| (calcOffset === 0 && this.delta === 0)){
            this.current.offsetCalcTop = calcOffset = 0;
            this.target.style.transform = "";
          } else{
            this.target.style.transform = "translateY(" +  calcOffset + "px)";
          }
        //console.log("update to DOM Element", this.current.offsetCalcTop, this.getTranslation(), scrlRxObj.currentPos);
      };
      

      return scrollReactObj;
    }();
    
    this.newItem = function(opts, tuts){
      return new scrollReactObj(opts, tuts);
    };

    

    var addListener = function addListener(opts) {
      scrlRxObj.viewWatched = window;
      if(opts.targetWindowID){
        scrlRxObj.viewWatched = document.getElementById(opts.targetWindowID);
      } 
      scrlRxObj.viewWatched.addEventListener('scroll', function (event) {
        scrlRxObj.lastPos = scrlRxObj.currentPos;
        scrlRxObj.currentPos = event.target.scrollTop;
        scrlRxObj.direction = (scrlRxObj.currentPos > scrlRxObj.lastPos) ? 'down' : (scrlRxObj.currentPos < scrlRxObj.lastPos ? 'up' : scrlRxObj.direction)
        //currentPos
        scrlRxObj.scrolling = true;
        //update(targets);
      });
      window.addEventListener('resize', function (event) {
        scrlRxObj.resizing = true;
      });
      //set interval to debounce better and return to clear
      return setInterval( function() {
        if ( scrlRxObj.resizing ) {
          scrlRxObj.resizing = false;
          scrlRxObj.resize();
        }
        if ( scrlRxObj.scrolling ) {
          clearTimeout(scrlRxObj.scrollEcho);
          if(!scrlRxObj.scrollAnimation){
            scrlRxObj.scrolling = false;
          }
          scrlRxObj.update(scrlRxObj.targets);
          /*scrollEcho = setTimeout(function(){
            scrlRxObj.update(scrlRxObj.targets);
            //console.log(" 2nd run : echo of scroll function", scrlRxObj.currentPos);
          }, 50);*/
        }
      }, 15);
      
    };

    var scrollReactorInit = function (target, userOptions) {
  
      var targetsArray, scrollReacts = [];
      if (userOptions === void 0) {
        userOptions = {};
      }

      if (typeof target === 'string') {
        targetsArray = [].slice.call(document.querySelectorAll("" + target));
        //console.log(targetsArray);
      } else{
        targetsArray = [ target]
      }
      //console.log(scrlRxObj);
      targetsArray.forEach(function(el){
        var reactor = new scrollReactObj(el, userOptions);
        scrlRxObj.targets.push(reactor);
        scrollReacts.push(reactor);
      })
      
      scrlRxObj.resize();

      if (!scrlRxObj.scrollReactWatching) {
        addListener(userOptions);
        scrlRxObj.scrollReactWatching = true;
      }

      //scrlRxObj.update(scrlRxObj.targets);

      return scrollReacts;
    };
    
    const initArray = scrollReactorInit('.scroll-reactor-watch-item', { delta: 0, targetWindowID: this.targetWindowSelector , watch: true});
    //return initArray;
    initArray.forEach(function(reactor){
      reactor.
      when(function () {
        return scrlRxObj.currentPos > -1
      }, function () {
        reactor.current.inViewport = reactor.inWindow();
        reactor.target.classList.remove( scrlRxObj.direction == "up" ? "scrolling-down" : "scrolling-up");
        reactor.target.classList.add( scrlRxObj.direction == "up"  ? "scrolling-up" : "scrolling-down");
        reactor.target.classList.remove(reactor.current.inViewport ? "out-viewport" : "in-viewport");
        reactor.target.classList.add(reactor.current.inViewport ? "in-viewport" : "out-viewport");
        return true;
      });
    })
    return scrlRxObj;
  },
  resize: function resize() {
    var scrlRxObj = this;
    var newSize = window.innerWidth;
    scrlRxObj.currWindow.winHeight = window.innerHeight;
    scrlRxObj.currWindow.winWidth = newSize;
    scrlRxObj.targets.forEach(function (targ) {
      //on resize before we compute things.  easier this way.  if you want rect, get in on resize.
      if(targ.onResize){
        targ.onResize(scrlRxObj.currWindow.winWidth, scrlRxObj.currWindow.winHeight)
      }
      if (targ.mobileBreak >= newSize) {
        targ.mobileDisable = true;
      }
      scrlRxObj.refreshWatchedItem(targ);
    });
    scrlRxObj.update(scrlRxObj.targets);
  },
  refreshWatchedItem(item){
    item.targetR  = item.getRect();
    item.targetR.top = item.targetR.y =  item.startScroll = item.targetR.originTop =   item.getTopOffset();
    item.targetR.bottom = item.targetR.top + item.targetR.height;
    item.current.origin = item.targetR;
    //item.targetR.bottom =   item.targetR.top + targ.targetR.height;
    //item.current.origin =  item.targetR;
    //console.log("bounding rect before", targ.targetR);
    //item.target.setAttribute("data-top", item.targetR.top);
    //console.log("bounding rect after", item.targetR.top,(item.target.offsetTop + item.target.parentNode.offsetTop) );
  },
  update: function(targets) {
    var scrlRxObj = this;
    //console.log("controlla fired", scrlRxObj.scrollAnimation);
    requestAnimationFrame(function () {
      //We may render something else than the actual scrollbar position.
      var renderTop = scrlRxObj.currentPos;
      //If there's an animation, which ends in current render call, call the callback after rendering.
      var afterAnimationCallback, moveBy;

      var anim = scrlRxObj.scrollAnimation
      if(anim && anim.topDiff) {      
        var now = +new Date();
        var progress;
        //It's over
        if(now >= anim.endTime) {
          //console.log("ended");
          renderTop = anim.targetTop;
          scrlRxObj.scrolling = false;
          afterAnimationCallback = anim.done;
          scrlRxObj.scrollAnimation = undefined;
          if(afterAnimationCallback){afterAnimationCallback.call(scrlRxObj, false)};
        } else {
          //Map the current progress to the new progress using given easing function.
				  progress = anim.easing((now - anim.startTime) / anim.duration);
				  //progress = anim.easing((now - anim.startTime) / anim.duration);
          renderTop = (anim.startTop + progress * anim.topDiff) | 0;
          //moveTop = (anim.startTop + (progress * anim.topDiff)) | 0;
          scrlRxObj.scrolling = true;
          //anim.startTop = renderTop;
          //console.log("inprogress:", progress, (now - anim.startTime), anim.startTop, renderTop  );
        }
        scrlRxObj.setScrollTop(renderTop);
      }
      scrlRxObj.targets.forEach(function (obj) {
        if (obj.mobileDisable) return;
        obj.conditions.forEach(function (condItem, index) {
          var condition = condItem.condition,
              action = condItem.action;
              //console.log("this condition[" + index + "]: @[" + scrlRxObj.currentPos + "]", condition());
          if (condition()) action();
        });

        if (obj.active && !obj.simpleWatcher) {
          obj.move();
        }
      });

    });
  },
  easeInDefault: function(x){
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  },
  easeInCubic: function(x){
    return Math.sin((x * Math.PI) / 2);
  },
  animateTo: function(top, options) {
    var scrlRxObj = this;
		options = options || {};

		var now = +new Date();
    var scrollTop = scrlRxObj.currentPos;
    var toMove = 0;
    var progress = 0;
    var duration =  function(diff) {
      return (Math.abs(diff) * 1000) / 600;
    }
    if(options.duration){
      duration = function(diff){return options.duration;}
    };

		//Setting this to a new value will automatically cause the current animation to stop, if any.
		var anim = scrlRxObj.scrollAnimation = {
			startTop: scrollTop,
			topDiff: top - scrollTop,
			targetTop: top,
			startTime: now,
			endTime: now,
			easing: scrlRxObj.easeInDefault,
			done: options.done
		};

    anim.duration = parseInt(duration(Math.abs(top - scrollTop))) > 600 ?  parseInt(duration(Math.abs(top - scrollTop))) : 600;
    anim.duration = parseInt(duration(Math.abs(top - scrollTop))) < 2500 ?  parseInt(duration(Math.abs(top - scrollTop))) : 2500;
    anim.endTime = anim.duration + anim.startTime;
		//Don't queue the animation if there's nothing to animate.
		if(!anim.topDiff) {
			if(anim.done) {
				anim.done.call(scrlRxObj, false);
			}
			anim = null;
    } else{
      scrlRxObj.scrolling = true;
    }
		return scrlRxObj;
  },
  setScrollTop: function(top) {
    var scrlRxObj = this;
    scrlRxObj.viewWatched.scrollTo(0, top);
    //console.log("new scrollTop", scrlRxObj.viewWatched.scrollTop);
		return scrlRxObj;
	},
  refresh: function(top) {
    var scrlRxObj = this;
    scrlRxObj.targets.forEach(function(el){
      scrlRxObj.refreshWatchedItem(el);
    })
    scrlRxObj.update(scrlRxObj.targets);
		return scrlRxObj;
	},
  addTargets: function(target, userOptions){
    var scrlRxObj = this;
    var targetsArray, scrollReacts = [];
      if (userOptions === void 0) {
        userOptions = {};
      }

      if (typeof target === 'string') {
        targetsArray = [].slice.call(document.querySelectorAll("" + target));
        //console.log(targetsArray);
      } else{
        targetsArray = [ target]
      }



      targetsArray.forEach(function(el){
        var reactor = scrlRxObj.newItem(el, userOptions);
        scrlRxObj.targets.push(reactor);
        scrollReacts.push(reactor);
      })

      scrlRxObj.targets.sort(function(a, b){return a.targetR.top - b.targetR.top});
      
      scrlRxObj.resize();

      if (!scrlRxObj.scrollReactWatching) {
        scrlRxObj.scrollReactWatching = true;
      }

      //scrlRxObj.update(scrollReacts);
      //console.log("adding more targets", scrollReacts);
      return scrollReacts;
  }
}


mheadleythemeapp.scrollSegment = {
  currentSegments: [],
  isFocusing: false,
  hasSegmentIntent: false,
  segmentIntents: [],
  segmentAnimation: null,
  init: function(){
    var scrlSgmtObj = this;
    const targetWindowSelector = "windowContainer";
    var scrollRxInstance = mheadleythemeapp.scrollReactor;

    //set interval to debounce better
    setInterval( function() {
      if(!(scrollRxInstance.scrollAnimation && scrollRxInstance.scrollAnimation.topDiff)  && scrlSgmtObj.hasSegmentIntent){
        if ( scrlSgmtObj.segmentIntents.length > 0 ) {
          //console.log(scrlSgmtObj.segmentIntents);
          scrlSgmtObj.commitSectionIntent();
        }
      } 
    }, 25);
    
    scrlSgmtObj.addNew({selector: '#contentWrapper.sticky-scrolling-enabled .post-part-vertical-align.sticky'});
    scrollRxInstance.resizing = true;
  },
  addNew: function(configOptions){
    var selectString = configOptions.selector;
    var scrlSgmtObj = this;
    const targetWindowSelector = "windowContainer";
    const targetContainerSelector = "bodyWrapper";
    var scrollRxInstance = mheadleythemeapp.scrollReactor;

    var segmentsArray = mheadleythemeapp.scrollReactor.addTargets(selectString, { delta: 0, targetWindowID: targetWindowSelector, scrollbody: targetContainerSelector});

    segmentsArray.forEach(function(seg){
      scrlSgmtObj.currentSegments.push(seg);
    })

    this.currentSegments.forEach(function(segment, idx){
      //segment.targetR = segment.getRect();
      segment.onResize = function(width,height){
        segment.target.classList.remove("vp-center");
        segment.target.style.height = null;
        segment.target.style.minHeight = null;
        var heightCurr = segment.target.getBoundingClientRect().height;
        if(heightCurr < height ){
          segment.target.classList.add("vp-center");
          segment.target.style.height = height+"px";
        } else if(heightCurr > height){
          segment.target.style.minHeight = height+"px";
        }
      }
      segment.onLeave = function(){
        //console.log("leaving segment", this);
        if(configOptions.onLeave){
          configOptions.onLeave(segment.target)
        }
      }
      segment.onEnter = function(){
        //console.log("entering segment", this);
        if(configOptions.onEnter){
          configOptions.onEnter(segment.target)
        }
      }
      segment.onFocused = function(){
        //console.log("focus to enter segment; now animate", this);
        if(configOptions.onFocused){
          configOptions.onFocused(segment.target)
        }
      }
      
      //fire now. controller already fired.... think of merging object options for function
      segment.onResize(scrollRxInstance.currWindow.winWidth, scrollRxInstance.currWindow.winHeight);

      segment.
      when(function () {
        //return window.scrollY < 750;
        return scrollRxInstance.currentPos > -1
      }, function () {
        //var bodyWrap = document.getElementById("bodyWrapper");
        //scrollRxInstance.viewWatched.setAttribute("")=
        scrollRxInstance.viewWatched.classList.remove( scrollRxInstance.direction == "up" ? "scrolling-down" : "scrolling-up");
        scrollRxInstance.viewWatched.classList.add( scrollRxInstance.direction == "up"  ? "scrolling-up" : "scrolling-down");
        // var vpBot = scrollRxInstance.currentPos + scrollRxInstance.currWindow.winHeight;
        // var originTop = segment.getTopOffset();
        // var originBottom = originTop + segment.targetR.height;
        segment.current.inViewport = segment.inWindow();
        scrlSgmtObj.segmentIntents = [];
        if(segment.current.inViewport){
          //console.log("in: ", parallax);
          //segment.current.inViewport = true;
          segment.target.classList.remove("segment-out-viewport");
          segment.target.classList.add("segment-in-viewport");
        } else{
          //console.log("out: ", parallax);
          //segment.current.inViewport = true;
          segment.target.classList.add("segment-out-viewport");
          segment.target.classList.remove("segment-in-viewport");
        }


        if(segment.current.inViewport){
          scrlSgmtObj.hasSegmentIntent = true;
          scrlSgmtObj.checkSegmentIntent(segment);
        }
        return true;
      })
    })
    //console.log("these are current segments", this.currentSegments);
      
    //console.log(segmentsArray);
  },
  checkSegmentIntent(segment){
    var scrlSgmtObj = this;
    var scrollRxInstance = mheadleythemeapp.scrollReactor;
    clearTimeout(segment.segmentFocusTimer);
    scrlSgmtObj.segmentAnimation = null;
    var focusTimerLimit = 100;
    var vpBot = scrollRxInstance.currentPos + scrollRxInstance.currWindow.winHeight;
    var originTop = segment.current.origin.top;
    var originBottom = segment.current.origin.bottom;
    var curr = {
      vpBot: vpBot,
      originTop: originTop,
      originBottom: originBottom,
      top: scrollRxInstance.currentPos,
      focused: segment,
      test: (.2 * scrollRxInstance.currWindow.winHeight) > 100 ? Math.floor(.2 * scrollRxInstance.currWindow.winHeight) : 100
    };

    var segmentChecker = function(obj){
      if(obj.top + obj.test  <  obj.originTop  && ( obj.vpBot - obj.test > obj.originTop) ){
        scrlSgmtObj.segmentIntents.push({curr: curr, top: obj.originTop, int: "BELOW"});
      }
      else if(obj.vpBot  > obj.originBottom + obj.test  && (obj.originBottom - obj.test > obj.top)) {
        scrlSgmtObj.segmentIntents.push({curr: curr, top: obj.originTop, int: "ABOVE"});
      }  
      else{
        scrlSgmtObj.segmentIntents.push({curr: curr, top: obj.originTop, int: "INSIDE"});
      }

      //console.log('checking segment', scrlSgmtObj.segmentIntents);
    }
    segment.segmentFocusTimer = setTimeout(function(){   segmentChecker(curr); },focusTimerLimit);
  },
  focusedItem() {
    var scrlSgmtObj = this;
    return scrlSgmtObj.currentSegments.filter(function(el){
      return el.isFocused
    }); 
  },
  segmentDecideFocalPoint: function(seg){
    seg.target.classList.remove('focus-top');
    seg.target.classList.remove('focus-bottom');
    //seg.target.classList.remove('focus-in');
    if(mheadleythemeapp.scrollSegment.isFocusing == seg.startScroll){
      seg.target.classList.add('focus-top');
    } else{
      seg.target.classList.add('focus-bottom');
    }
  },
  segmentInFocus: function(){
    var scrlSgmt = mheadleythemeapp.scrollSegment.focusedItem();
    if(scrlSgmt.length > 0){
      if(scrlSgmt[0].onEnter){
        scrlSgmt[0].onEnter()
      }
      mheadleythemeapp.scrollSegment.segmentDecideFocalPoint(scrlSgmt[0]);
    }
    return false;
  },
  segmentSetFocus: function(){
    var scrlSgmt = mheadleythemeapp.scrollSegment.focusedItem();
    if(scrlSgmt.length > 0){
      if(scrlSgmt[0].onFocused){
        scrlSgmt[0].onFocused()
      }
    }
    return false;
  },
  segmentOutFocus: function(){
    var scrlSgmt = mheadleythemeapp.scrollSegment.focusedItem();
    if(scrlSgmt.length > 0){
      if(scrlSgmt[0].onLeave){
        scrlSgmt[0].onLeave()
      }
      scrlSgmt[0].isFocused = false;
    }
    return false;
  },
  commitSectionIntent(){
    var scrlSgmtObj = this;
    var scrollRxInstance = mheadleythemeapp.scrollReactor;
    var wrkingArray = [];
    var makeArrayItems = function(){
      scrlSgmtObj.segmentIntents.forEach(function(seg){
        var id = seg.top;
        var newSeg;
        var exist = wrkingArray.filter(function(el){
          return el.top === id;
        })
        if(!exist[0]){
          newSeg = seg;
          wrkingArray.push(newSeg);
        } else{
          newSeg = exist[0];
          newSeg.orientationUp  = seg.int;
        }
      });
    }
    makeArrayItems();
    scrlSgmtObj.segmentIntents = [];

    var isSingle = wrkingArray.length === 1;
    var viewOffset = scrollRxInstance.currWindow.winHeight;
    var item1 = wrkingArray[0].curr;
    var item2 =  wrkingArray.length > 1 ? wrkingArray[1].curr : false;
    animOptionsIn = {"done": scrlSgmtObj.segmentInFocus};
    //console.log("eval", item1, item2);
    switch(true){
      //primary case
      case isSingle &&  wrkingArray[0].int === "INSIDE" && (item1.top > item1.originTop) &&  (item1.vpBot < item1.originBottom):
        // //do nothing
        // item1.focused.target.classList.remove('focus-top');
        // item1.focused.target.classList.remove('focus-bottom');
        // item1.focused.target.classList.add('focus-in');
        //console.log("in the middle on scrolling not  in test area");
      break; 
      case isSingle && wrkingArray[0].int === "INSIDE" && (item1.top + item1.test > item1.originTop) && (item1.top < item1.originTop):
        scrlSgmtObj.isFocusing = item1.originTop;
        item1.focused.isFocused = true;
        scrollRxInstance.animateTo(scrlSgmtObj.isFocusing,  {duration: 400});
        scrlSgmtObj.segmentSetFocus();
        //console.log("focus to top of single item in buffer zone");
      break;
      case !isSingle && (item1.vpBot - item2.test < item1.originBottom) && (item1.vpBot > item1.originBottom):   
      case isSingle && wrkingArray[0].int === "INSIDE" && (item1.vpBot - item1.test < item1.originBottom) && (item1.vpBot > item1.originBottom):
        scrlSgmtObj.isFocusing = item1.originBottom - viewOffset; 
        item1.focused.isFocused = true;
        scrollRxInstance.animateTo(scrlSgmtObj.isFocusing,  {duration: 400});
        scrlSgmtObj.segmentSetFocus();
        //console.log("focus to bottom of item when 1 or 2");
      break;

      case !isSingle && (item2.top + item2.test > item2.originTop) && (item2.top < item2.originTop):   
        scrlSgmtObj.isFocusing = item2.originTop;
        scrlSgmtObj.segmentOutFocus();
        item2.focused.isFocused = true;
        scrollRxInstance.animateTo(scrlSgmtObj.isFocusing, {duration: 400});
        scrlSgmtObj.segmentSetFocus();
        //console.log("focus to top of second item is in intent");
      break;

      //case !isSingle && (item2.originTop + item1.test > item1.vpbot) && (item2.originTop - item2.test < item2.top) && (item1.originBottom + item1.test > item1.vpBot):  
      // case !isSingle && (item1.originBottom < item2.originBottom ) && (item1.originBottom + item1.test > item2.originTop) && (item1.originBottom + item1.test > item1.top) && (item2.originTop - item2.test < item1.vpBot):   
      case !isSingle && (item1.originBottom < item2.originBottom ) && (item1.originBottom + item1.test > item2.originTop) && (item1.originBottom + item1.test > item1.top) && (item2.originTop - item2.test < item2.vpBot):  
        //console.log("has two items and is not in buffer zone to refocus",item2.originTop + item2.test, item1.vpBot);
        var currSeg = scrlSgmtObj.focusedItem();
        var animateOptionsObj = animOptionsIn;
        if((currSeg.length > 0 && currSeg[0] === item1.focused) || (currSeg.length > 0 && currSeg[1] === item1.focused) ){
         //console.log("push up below");
         scrlSgmtObj.segmentOutFocus();
          item2.focused.isFocused = true;
          scrlSgmtObj.isFocusing = item2.originTop;
        } 
        else if(currSeg.length > 0 && currSeg[0] === item2.focused  || (currSeg.length > 0 && currSeg[1] === item2.focused )){
            scrlSgmtObj.segmentOutFocus();
            item1.focused.isFocused = true;
            scrlSgmtObj.isFocusing = item1.originBottom - viewOffset; 
          //console.log("pull down above");
        } else{
          //console.log("decide on focus");
          if(item1.originBottom - item1.top >  item1.vpBot - item1.originTop){
            item1.focused.isFocused = true;
            scrlSgmtObj.isFocusing = item1.originBottom - viewOffset; 
          } else{
            item2.focused.isFocused = true;
            scrlSgmtObj.isFocusing = item2.originTop;
          }
          animateOptionsObj = {duration: 400};

        }
        scrollRxInstance.animateTo(scrlSgmtObj.isFocusing, animateOptionsObj);
        scrlSgmtObj.segmentSetFocus();
      break;
      default:
        //not a thing?
        //scrollRxInstance.animateTo(scrlSgmtObj.isFocusing);
        //console.log("came in function matched no case, maybe case to refocus?",  item1, item2, scrlSgmtObj.isFocusing, scrollRxInstance.currentPos);
        //scrlSgmtObj.segmentOutFocus();
        //sconsole.log("no case met", item1, item2);
      break;
    }

   
  }
}


/*	-----------------------------------------------------------------------------------------------
	story cover 
--------------------------------------------------------------------------------------------------- */

mheadleythemeapp.storyCover = {
  needResize: false,
  coverItemList: [],
  resizeTimer: null,
  bodyWrapSelector: "bodyWrapper",
  init: function(){
    var scrlCoverObj = this;
    var i;
    var scrollRxInstance = mheadleythemeapp.scrollReactor;
    const targetWindowSelector = "windowContainer";
    const targetContainerSelector = "bodyWrapper";
    //scrlCoverObj.coverItemList = [];
    var scrlCoverList = document.querySelectorAll('.masthead.fill-screen-height, .section-part-cover.fill-screen-height, .custom-section.fill-screen-height');
    if(scrlCoverList.length > 0){
      for (i = 0; i < scrlCoverList.length; ++i) {
        var coverItem = mheadleythemeapp.scrollReactor.addTargets( scrlCoverList[i] , { delta: 0, targetWindowID: targetWindowSelector, scrollbody: targetContainerSelector })[0];
        scrlCoverObj.coverItemList.push(coverItem);
        coverItem.onResize = function(w,h){
          var offset = 0;
          var adminBar = document.getElementById('wpadminbar');
          if(adminBar){
            offset = adminBar.getBoundingClientRect().height;
          }
          return scrlCoverObj.setSize(w,h - offset);
        }
        coverItem.onResize(scrollRxInstance.currWindow.winWidth,scrollRxInstance.currWindow.winHeight);
      }
    } 
  },
  setSize: function(w,h){
    var scrollRxInstance = mheadleythemeapp.scrollReactor;
    scrlCoverObj = this;
    h = h - parseInt(window.getComputedStyle(document.getElementById(scrlCoverObj.bodyWrapSelector)).getPropertyValue('padding-top')) ;
    //console.log(h);
    if(w > h && w > 768){
      //console.log("landscape");
      if(h > 900){ h = 900}
      if(h < 500 && w > 1024){ h = 500}
    } 
    scrlCoverObj.coverItemList.forEach(function(el,idx){
      el.target.style.height = h + "px";
    });
    
  }

}

// end story cover

mheadleythemeapp.scrollFades = {
  init: function(){
    var scrlRxObj  = this;
    const targetWindowSelector = "windowContainer";
    const targetContainerSelector = "bodyWrapper";
    var scrollRxInstance = mheadleythemeapp.scrollReactor;
    
    const initArrayFade = mheadleythemeapp.scrollReactor.addTargets('#contentWrapper.block-transitions-enabled .bxTr', { delta: 0, targetWindowID: targetWindowSelector, watch: true, scrollbody: targetContainerSelector});
    
    //return initArrayFade;
    initArrayFade.forEach(function(reactor){
      reactor.target.currentTransition = null;
      reactor.target.currentState = null;
      reactor.
      when(function () {
        return mheadleythemeapp.scrollReactor.currentPos > -1
      }, function () {
        if((reactor.target.currentState != null) && (reactor.target.currentState  === reactor.inWindow())){
          return;
        }
        var delay, duration, effect;
        var noReturnEffects = ['fadeInNoOut','leftInNoOut','upInNoOut','downInNoOut','rightInNoOut'];
        reactor.current.inViewport = reactor.target.currentState = reactor.inWindow();

        reactor.target.classList.remove( mheadleythemeapp.scrollReactor.direction == "up" ? "scroll-dir-down" : "scroll-dir-up");
        reactor.target.classList.add( mheadleythemeapp.scrollReactor.direction == "up"  ? "scroll-dir-up" : "scroll-dir-down");

        reactor.target.classList.remove(reactor.current.inViewport ? "out-viewport" : "in-viewport");
        reactor.target.classList.add(reactor.current.inViewport ? "in-viewport" : "out-viewport");

        duration = window.getComputedStyle(reactor.target, null).getPropertyValue("transition-duration").replace('s', '')*1000;
        delay = reactor.target.getAttribute("data-box-transition-delay") ? reactor.target.getAttribute("data-box-transition-delay") : 0;
        effect = reactor.target.getAttribute("data-box-transition") ? reactor.target.getAttribute("data-box-transition") : null;

        if(noReturnEffects.indexOf(effect) > -1 && reactor.target.lockedTransition){
          return;
        }
        if(reactor.current.inViewport){
          if(effect){ 
            setTimeout( function(){
              enterTransitionEl(reactor.target,effect, duration);
            }, delay);
            if(noReturnEffects.indexOf(effect) > -1){
              reactor.target.lockedTransition = true;
            }
          }
        } else {
          if(effect){
            leaveTransitionEl(reactor.target,effect, 800);
          }
        }

        return true;
      });
    })

    
    function enterTransitionEl(element,transition,durationAnim) {
      element.classList.add(transition + "-enter");
      element.classList.add(transition + "-enter-start");
      element.classList.add(transition + "-enter-active");
      element.classList.remove(transition + "-leave-active");
      requestAnimationFrame(function () {
        element.classList.remove(transition + "-enter-start");
        element.classList.add(transition + "-enter-end"); // Wait until the transition is over...
        setTimeout(function(){
          element.classList.remove(transition + "-enter-end");
          element.classList.remove(transition + "-enter");
          element.currentTransition = "in";
        }, durationAnim);
        });
    }

    function leaveTransitionEl(element,transition,durationAnim) {
      element.classList.add(transition + "-leave");
      element.classList.add(transition + "-leave-active");
      element.classList.add(transition + "-leave-start");
      element.classList.remove(transition + "-enter-active");
      requestAnimationFrame(function () {
        element.classList.remove(transition + "-leave-start");
        element.classList.add(transition + "-leave-end");
        setTimeout(function(){
          element.classList.remove(transition + "-leave-end");
          element.classList.remove(transition + "-leave");
          element.currentTransition = "in";
        }, durationAnim);
        });
    }
  }

}



mheadleythemeapp.menuOverlay = {
  init: function(){
    var menuToggle = document.getElementById("mobileMenuToggle");
    var scrlRxObj  = this;
    const targetWindowSelector = "windowContainer";
    var scrollRxInstance = mheadleythemeapp.scrollReactor;
    
    const menuOverlay = mheadleythemeapp.scrollReactor.addTargets('#headerWrapper', { delta: 0, targetWindowID: targetWindowSelector, watch: true});
    
    //return initArrayFade;
    menuOverlay.forEach(function(reactor){
      
      reactor.
      when(function () {
        return mheadleythemeapp.scrollReactor.currentPos > -1
      }, function () {

        var height, minHeight = 60;
        

        reactor.target.classList.remove( mheadleythemeapp.scrollReactor.direction == "up" ? ("scroll-dir-down" || "") : "scroll-dir-up");
        reactor.target.classList.add( mheadleythemeapp.scrollReactor.direction == "up"  ? "scroll-dir-up" : "scroll-dir-down");
   
        height = parseInt(window.getComputedStyle(document.getElementById("bodyWrapper"), null).getPropertyValue("padding-top").replace("px",""));
        if(height === minHeight || height < minHeight && height > minHeight/2){
          minHeight = height/2;
        }
        if((mheadleythemeapp.scrollReactor.currentPos >  (height - minHeight) + 1 && height > 0) || (mheadleythemeapp.scrollReactor.currentPos > minHeight && height === 0 )){
          reactor.target.classList.add("floating");
          reactor.target.classList.remove( "docked");
        } else{
          reactor.target.classList.remove( "floating");
          reactor.target.classList.add("docked");
        }
        return true;
      });
    })
    if(menuToggle){
      menuToggle.addEventListener('click', function (event) {
        event.preventDefault();
        var cbItem = document.getElementById("interfaceToggle");
        cbItem.checked = !cbItem.checked;
      })
    }

    document.addEventListener('click', function (event) {

      // If the clicked element doesn't have the right selector, bail
      if (!event.target.matches('#headerWrapper.scroll-dir-down.floating  .site-title > *, #headerWrapper.scroll-dir-down.floating  .site-title, #headerWrapper.scroll-dir-down.floating  .header-branding, #headerWrapper.scroll-dir-down.floating  .header-branding > *, #headerWrapper.scroll-dir-down.floating .content-wrap,  #headerWrapper.scroll-dir-down.floating .custom-logo-link IMG')) return;
    
      // Don't follow the link
      event.preventDefault();
    
      // Log the clicked element in the console
      //console.log(event.target);
      document.getElementById('headerWrapper').classList.remove('floating');
    
    }, false);

    
  }

}
// end fades cover
/**
 * Is the DOM ready
 *
 * this implementation is coming from https://gomakethings.com/a-native-javascript-equivalent-of-jquerys-ready-method/
 *
 * @param {Function} fn Callback function to run.
 */
function mheadleythemeappDomReady( fn ) {
	if ( typeof fn !== 'function' ) {
		return;
	}

	if ( document.readyState === 'interactive' || document.readyState === 'complete' ) {
		return fn();
	}

	document.addEventListener( 'DOMContentLoaded', fn, false );
}

mheadleythemeappDomReady( function() {
	mheadleythemeapp.toggles.init();	// Handle toggles
	mheadleythemeapp.coverModals.init();	// Handle cover modals
	mheadleythemeapp.intrinsicRatioVideos.init();	// Retain aspect ratio of videos on window resize
	mheadleythemeapp.primaryMenu.init();	// Primary Menu
  mheadleythemeapp.touchEnabled.init();	// Add class to body if device is touch-enabled
  mheadleythemeapp.scrollReactor.init(); // adds scroll reactions and parallax effects
  mheadleythemeapp.scrollSegment.init(); //segment declarations and adding funtionality
  mheadleythemeapp.scrollFades.init(); //fades for layout blocks funtionality
  mheadleythemeapp.storyCover.init(); //adds listener to resize covers
  mheadleythemeapp.menuOverlay.init(); //adds listener to resize covers
  document.body.classList.remove("body-enter");
  document.body.classList.add("body-enter-active");
} );


/*	-----------------------------------------------------------------------------------------------
	Helper functions
--------------------------------------------------------------------------------------------------- */

/* Toggle an attribute ----------------------- */

function mheadleythemeappToggleAttribute( element, attribute, trueVal, falseVal ) {
	if ( trueVal === undefined ) {
		trueVal = true;
	}
	if ( falseVal === undefined ) {
		falseVal = false;
	}
	if ( element.getAttribute( attribute ) !== trueVal ) {
		element.setAttribute( attribute, trueVal );
	} else {
		element.setAttribute( attribute, falseVal );
	}
}

/**
 * Toggle a menu item on or off.
 *
 * @param {HTMLElement} target
 * @param {number} duration
 */
function mheadleythemeappMenuToggle( target, duration ) {
	var initialParentHeight, finalParentHeight, menu, menuItems, transitionListener,
		initialPositions = [],
		finalPositions = [];

	if ( ! target ) {
		return;
	}

	menu = target.closest( '.menu-wrapper' );

	// Step 1: look at the initial positions of every menu item.
	menuItems = menu.querySelectorAll( '.menu-item' );

	menuItems.forEach( function( menuItem, index ) {
		initialPositions[ index ] = { x: menuItem.offsetLeft, y: menuItem.offsetTop };
	} );
	initialParentHeight = target.parentElement.offsetHeight;

	target.classList.add( 'toggling-target' );

	// Step 2: toggle target menu item and look at the final positions of every menu item.
	target.classList.toggle( 'active' );

	menuItems.forEach( function( menuItem, index ) {
		finalPositions[ index ] = { x: menuItem.offsetLeft, y: menuItem.offsetTop };
	} );
	finalParentHeight = target.parentElement.offsetHeight;

	// Step 3: close target menu item again.
	// The whole process happens without giving the browser a chance to render, so it's invisible.
	target.classList.toggle( 'active' );

	// Step 4: prepare animation.
	// Position all the items with absolute offsets, at the same starting position.
	// Shouldn't result in any visual changes if done right.
	menu.classList.add( 'is-toggling' );
	target.classList.toggle( 'active' );
	menuItems.forEach( function( menuItem, index ) {
		var initialPosition = initialPositions[ index ];
		if ( initialPosition.y === 0 && menuItem.parentElement === target ) {
			initialPosition.y = initialParentHeight;
		}
		menuItem.style.transform = 'translate(' + initialPosition.x + 'px, ' + initialPosition.y + 'px)';
	} );

	// The double rAF is unfortunately needed, since we're toggling CSS classes, and
	// the only way to ensure layout completion here across browsers is to wait twice.
	// This just delays the start of the animation by 2 frames and is thus not an issue.
	requestAnimationFrame( function() {
		requestAnimationFrame( function() {
			// Step 5: start animation by moving everything to final position.
			// All the layout work has already happened, while we were preparing for the animation.
			// The animation now runs entirely in CSS, using cheap CSS properties (opacity and transform)
			// that don't trigger the layout or paint stages.
			menu.classList.add( 'is-animating' );
			menuItems.forEach( function( menuItem, index ) {
				var finalPosition = finalPositions[ index ];
				if ( finalPosition.y === 0 && menuItem.parentElement === target ) {
					finalPosition.y = finalParentHeight;
				}
				if ( duration !== undefined ) {
					menuItem.style.transitionDuration = duration + 'ms';
				}
				menuItem.style.transform = 'translate(' + finalPosition.x + 'px, ' + finalPosition.y + 'px)';
			} );
			if ( duration !== undefined ) {
				target.style.transitionDuration = duration + 'ms';
			}
		} );

		// Step 6: finish toggling.
		// Remove all transient classes when the animation ends.
		transitionListener = function() {
			menu.classList.remove( 'is-animating' );
			menu.classList.remove( 'is-toggling' );
			target.classList.remove( 'toggling-target' );
			menuItems.forEach( function( menuItem ) {
				menuItem.style.transform = '';
				menuItem.style.transitionDuration = '';
			} );
			target.style.transitionDuration = '';
			target.removeEventListener( 'transitionend', transitionListener );
		};

		target.addEventListener( 'transitionend', transitionListener );
	} );
}

/**
 * traverses the DOM up to find elements matching the query
 *
 * @param {HTMLElement} target
 * @param {string} query
 * @return {NodeList} parents matching query
 */
function mheadleythemeappFindParents( target, query ) {
	var parents = [];

	// recursively go up the DOM adding matches to the parents array
	function traverse( item ) {
		var parent = item.parentNode;
		if ( parent instanceof HTMLElement ) {
			if ( parent.matches( query ) ) {
				parents.push( parent );
			}
			traverse( parent );
		}
	}

	traverse( target );

	return parents;
}