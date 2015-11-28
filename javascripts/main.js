(function () {
	"use strict";

	var ready = (function () {
		var callbacks = [],
			check_interval = null,
			check_interval_time = 250;

		var callback_check = function () {
			if (
				(document.readyState === "interactive" || document.readyState === "complete") &&
				callbacks !== null
			) {
				var cbs = callbacks,
					cb_count = cbs.length,
					i;

				callbacks = null;

				for (i = 0; i < cb_count; ++i) {
					cbs[i].call(null);
				}

				window.removeEventListener("load", callback_check, false);
				window.removeEventListener("DOMContentLoaded", callback_check, false);
				window.removeEventListener("readystatechange", callback_check, false);

				if (check_interval !== null) {
					clearInterval(check_interval);
					check_interval = null;
				}

				return true;
			}

			return false;
		};

		window.addEventListener("load", callback_check, false);
		window.addEventListener("DOMContentLoaded", callback_check, false);
		window.addEventListener("readystatechange", callback_check, false);

		return function (cb) {
			if (callbacks === null) {
				cb.call(null);
			}
			else {
				callbacks.push(cb);
				if (check_interval === null && callback_check() !== true) {
					check_interval = setInterval(callback_check, check_interval_time);
				}
			}
		};
	})();

	var $ = function (selector) {
		return document.querySelector(selector);
	};

	var on_image_ready = function () {
		var n, r;

		this.classList.add("showcase_image_loaded");

		if (
			(n = $(".showcase")) !== null &&
			(r = this.parentNode.getBoundingClientRect()).height > 0
		) {
			n.style.height = r.height + "px";
			if ((n = $(".showcase")) !== null) {
				n.classList.add("showcase_active");
				if ((n = n.querySelector("svg>path")) !== null) {
					n.addEventListener("click", on_image_change, false);
				}
			}
			
			if ((n = $(".showcase_button_container")) !== null) {
				n.style.height = r.height + "px";
			}
		}
	};
	var on_image_change = function (event) {
		if (event.which !== undefined && event.which !== 1) return;
		event.preventDefault();
		images_load(function () {
			var showcase = $(".showcase"),
				vis = $(".showcase_container.showcase_container_visible"),
				n = $(".showcase_container.showcase_container_visible+.showcase_container"),
				img, change;

			if (n === null) n = $(".showcase_container");
			if (n === null) return;

			img = n.querySelector("img");
			if (img === null) return;

			change = function () {
				if (showcase !== null) {
					var r = img.parentNode.getBoundingClientRect();
					if (r.height > 0) {
						showcase.style.height = r.height + "px";
					}
				}
				vis.classList.remove("showcase_container_visible");
				vis.classList.remove("showcase_container_waiting");
				n.classList.add("showcase_container_visible");
			};

			if (img.classList.contains("showcase_image_loaded")) {
				change();
			}
			else if (!img.classList.contains("showcase_image_load_waiting")) {
				vis.classList.add("showcase_container_waiting");
				img.classList.add("showcase_image_load_waiting");
				img.addEventListener("load", change, false);
			}
		});
	};
	var images_load = function (callback) {
		var nodes = document.querySelectorAll(".showcase_container[data-src]"),
			src, i, n;

		if (nodes.length === 0) {
			callback.call(null);
			return;
		}

		for (i = 0; i < nodes.length; ++i) {
			src = nodes[i].getAttribute("data-src");
			nodes[i].removeAttribute("data-src");

			n = document.createElement("img");
			n.className = "showcase_image";
			n.alt = "";
			n.addEventListener("load", function (i) {
				this.classList.add("showcase_image_loaded");
				if (i === 0) callback.call(null);
			}.bind(n, i), false);
			n.src = src;
			nodes[i].insertBefore(n, nodes[i].firstChild);
		}
	};

	ready(function () {
		var n;

		if ((n = $(".showcase_button_container")) !== null) {
			n.style.display = "";
		}
		
		if ((n = $(".showcase_image")) !== null) {
			n.addEventListener("load", on_image_ready, false);
		}
	});

})();


