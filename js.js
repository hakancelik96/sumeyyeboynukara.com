var Identity = {
  duration: 1400,
  delay: 500,
  iteration: 0,
  processing: false,
  enough: false,
  interval: null,
  callback: null,
  status: 'loading',
  id: '#identity',
  selector: '#identity div',
  classes: 'working rest robot',

  //  WORK
  work: function () {
    if (Identity.status != 'loading') Identity.status = 'working';
    Identity.wait(function () {
      $(Identity.id).addClass('working');
    });
  },

  //  ROBOT
  robot: function () {
    Identity.status = 'robot';
    Identity.wait(function () {
      $(Identity.id).addClass('robot');
    });
  },

  //  REST
  rest: function () {
    Identity.abort();
    Identity.status = 'rest';
    setTimeout(function () {
      Identity.abort();
      $(Identity.id).addClass('rest');
    }, Identity.delay);
  },

  //  WAIT
  wait: function (call) {
    if (Identity.processing != true) {
      Identity.abort();
      Identity.processing = true;

      setTimeout(function () {
        if (typeof call === 'function' && call) call();
        Identity.waiting();
        Identity.interval = setInterval(Identity.waiting, Identity.duration);
      }, Identity.delay);
    }
  },

  //  WAITING
  waiting: function () {
    if (Identity.enough != true) {
      ++Identity.iteration;
      return;
    }

    Identity.stopping();
  },

  //  STOP
  stop: function (callback) {
    setTimeout(function () {
      if (Identity.processing == true) {
        Identity.enough = true;
        Identity.callback = callback;

        $(Identity.selector).attr('style', 'animation-iteration-count: ' + Identity.iteration + '; -webkit-animation-iteration-count: ' + Identity.iteration + ';');
      }
    }, Identity.delay);
  },

  //  STOPPING
  stopping: function () {
    clearInterval(Identity.interval);
    Identity.rest();

    if (typeof Identity.callback === 'function' && Identity.callback) Identity.callback();
    Identity.reset();
  },

  //  ABORT
  abort: function () {
    if (Identity.status == 'robot') $(Identity.id).removeClass('robot');else if (Identity.status != 'loading' && Identity.processing != true) $(Identity.id).removeClass(Identity.classes + ' loading');else $(Identity.id).removeClass(Identity.classes);
  },

  //  RESET
  reset: function () {
    Identity.iteration = 0;
    Identity.processing = false;
    Identity.enough = false;
    Identity.interval = null;
    Identity.callback = null;

    $(Identity.selector).removeAttr('style');
  }
};
var renderer, scene, camera, ww, wh, particles;
ww = window.innerWidth, wh = window.innerHeight;
var centerVector = new THREE.Vector3(0, 0, 0);
var previousTime = 0;
speed = 10;
isMouseDown = false;
var Router = {
	wrapper: [],
	location: null,
	//	ROUTE
	route: function (location, callback) {
		Identity.work();
		Router.location = Router.processLocation(location);

		//	ROUTES
		Router.routes(callback);
	},

	//	PROCESS LOCATION
	processLocation: function (location) {
		if (location === undefined) location = window.location.hash;

		return location.replace('#', '');
	},

	//	CALLBACK
	callback: function (callback) {
		setTimeout(function () {
			Identity.stop();
      Router.updateWrapper();
      Router.updateTemplate(Router.wrapper[0]);
      window.location.hash = Router.location;
      Router.location = null;

      //  CALLBACKS
      Router.callbacks(Router.wrapper[0]);
      if (typeof callback === 'function' && callback) callback();
		}, 200);
	},

	//	UPDATE TEMPLATE
	updateTemplate: function (template) {
		var templates = $('.template');
		var current = $('.template[data-template=' + template + ']');

		templates.removeClass('current');
		setTimeout(function () {
			templates.hide();
			current.show().addClass('current');
		}, 1120);
	},

	//	UPDATE WRAPPER
	updateWrapper: function (push, pull) {
		if (push) Router.push(push);
		if (pull) Router.pull(pull);

		var wrapper = Router.wrapper.toString().replace(/,/g, ' ');
		$('.wrapper').attr('class', 'wrapper ' + wrapper);
	},

	//	PUSH
	push: function (items) {
		items = items.split(' ');

		for (i = 0; i < items.length; i++) {
			if (!Router.wrapper.includes(items[i]) && items[i] != '') Router.wrapper.push(items[i]);
		}
	},

	//	PULL
	pull: function (items) {
		items = items.split(' ');

		for (i = 0; i < items.length; i++) {
			if (Router.wrapper.includes(items[i]) && items[i] != '') Router.wrapper.splice(Router.wrapper.indexOf(items[i]), 1);
		}
	},

	//	LISTEN
	listen: function () {
		$('.wrapper').on('click', '.router', function (e) {
			Router.route($(this).attr('href'), window[$(this).attr('data-callback')]);
			e.preventDefault();
		});

		window.addEventListener('popstate', function (e) {
			Router.route(undefined);
		});
	}
};
Router.routes = function (callback) {
  Router.wrapper = [];
  var location = Router.location.split('/').filter(Boolean);

  //  HOME
  Router.push('home');

  //  CALLBACK
  Router.callback(callback);
};
Router.callbacks = function (wrapper) {
  if (wrapper == 'secret') secret();else if (wrapper == 'opinion') opinion();else if (wrapper == 'bucketAll') bucketAll();else if (wrapper == 'notFound') notFound();
};
var secretAvailability = true;
var opinionAvailability = true;

var md = new MobileDetect(window.navigator.userAgent);
function loadProject() {
  Router.route(undefined, function () {
    //  CALLBACK
    Router.listen();
  });
};

loadProject();
