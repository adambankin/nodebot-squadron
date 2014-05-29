var five = require("johnny-five");
var Spark = require("spark-io");
var socket = require('socket.io-client')('http://192.168.158.11:3000');

var board = new five.Board({
	io: new Spark({
		token: "",
		deviceId: ""
	})
});
var speed = 1;
var wheelLeft;
var wheelRight;
var hasConnected;
var movement = (function () {
	var allDirections = {
		"forward": function () {
			console.log("forward");
			wheelLeft.cw(1 * speed)
			wheelRight.ccw(1 * speed)
		},
		"back": function () {
			console.log("back");
			wheelLeft.ccw(1 * speed)
			wheelRight.cw(1 * speed)
		},
		"fastLeft": function () {
			console.log("fastLeft");
			wheelLeft.stop();
			wheelRight.ccw(1)
		},
		"fastRight": function () {
			console.log("fastRight");
			wheelLeft.cw(1)
			wheelRight.stop()
		},
		"left": function () {
			console.log("left");
			wheelLeft.cw(1 * speed)
			wheelRight.ccw(1 * speed * .04)
		},
		"right": function () {
			console.log("right");
			wheelLeft.cw(1 * speed * .04);
			wheelRight.ccw(1 * speed);
		},
		"fast": function () {
			console.log("fast");
			speed = (speed !== 1)? speed + .1: speed;
		},
		"slow": function () {
			console.log("slow");
			speed = (speed)? speed - .1: speed;
		},
		"spinLeft": function () {
			console.log("spinLeft");
			wheelLeft.ccw(1);
			wheelRight.ccw(1);
		},
		"spinRight": function () {
			console.log("spinRight");
			wheelLeft.cw(1);
			wheelRight.cw(1);
		},
		"stop": function () {
			console.log("STAAAAAHHPP!!!");
			wheelLeft.stop();
			wheelRight.stop();
		},
		"center": function () {
			console.log("Center");
			wheelLeft.center();
			wheelRight.center();
		},
		"test": function () {
			// wheelLeft.cw(1); // right
			// wheelRight.ccw(1); // left
			
			wheelLeft.cw(.03);
			wheelRight.ccw(1);
		}
	}
	return function (direction) {
		allDirections[direction]();
	};
}());

board.on("ready", function() {
	console.log("CONNECTED");

	wheelLeft = new five.Servo({
		pin: "D0",
		type: "continuous"
	});
	wheelRight = new five.Servo({
		pin: "A0",
		type: "continuous"
	});

	hasConnected = true;
});

socket.on("connect", function () {
	socket.on("move", function (data) {
		if (hasConnected) {
			console.log("Directive::" + data.directive);
			movement(data.directive);
		}
	});
});
