'use strict';

exports.__esModule = true;
exports.MeshLineMaterial = exports.MeshLine = undefined;

var _three = require('three');

var THREE = _interopRequireWildcard(_three);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MeshLine = exports.MeshLine = function () {
	function MeshLine() {
		_classCallCheck(this, MeshLine);

		this.positions = [];
		this.previous = [];
		this.next = [];
		this.side = [];
		this.width = [];
		this.indices_array = [];
		this.uvs = [];
		this.counters = [];
		this.geometry = new THREE.BufferGeometry();
		this.widthCallback = null;
	}

	MeshLine.prototype.setGeometry = function setGeometry(g, c) {
		this.widthCallback = c;

		this.positions = [];
		this.counters = [];

		if (g instanceof THREE.Geometry) {
			for (var j = 0; j < g.vertices.length; j++) {
				var v = g.vertices[j];
				var c = j / g.vertices.length;
				this.positions.push(v.x, v.y, v.z);
				this.positions.push(v.x, v.y, v.z);
				this.counters.push(c);
				this.counters.push(c);
			}
		}

		if (g instanceof THREE.BufferGeometry) {}

		if (g instanceof Float32Array || g instanceof Array) {
			for (var j = 0; j < g.length; j += 3) {
				var c = j / g.length;
				this.positions.push(g[j], g[j + 1], g[j + 2]);
				this.positions.push(g[j], g[j + 1], g[j + 2]);
				this.counters.push(c);
				this.counters.push(c);
			}
		}

		this.process();
	};

	MeshLine.prototype.compareV3 = function compareV3(a, b) {
		var aa = a * 6;
		var ab = b * 6;
		return this.positions[aa] === this.positions[ab] && this.positions[aa + 1] === this.positions[ab + 1] && this.positions[aa + 2] === this.positions[ab + 2];
	};

	MeshLine.prototype.copyV3 = function copyV3(a) {
		var aa = a * 6;
		return [this.positions[aa], this.positions[aa + 1], this.positions[aa + 2]];
	};

	MeshLine.prototype.process = function process() {
		var l = this.positions.length / 6;

		this.previous = [];
		this.next = [];
		this.side = [];
		this.width = [];
		this.indices_array = [];
		this.uvs = [];

		for (var j = 0; j < l; j++) {
			this.side.push(1);
			this.side.push(-1);
		}

		var w;
		for (var j = 0; j < l; j++) {
			if (this.widthCallback) w = this.widthCallback(j / (l - 1));else w = 1;
			this.width.push(w);
			this.width.push(w);
		}

		for (var j = 0; j < l; j++) {
			this.uvs.push(j / (l - 1), 0);
			this.uvs.push(j / (l - 1), 1);
		}

		var v;

		if (this.compareV3(0, l - 1)) {
			v = this.copyV3(l - 2);
		} else {
			v = this.copyV3(0);
		}
		this.previous.push(v[0], v[1], v[2]);
		this.previous.push(v[0], v[1], v[2]);
		for (var j = 0; j < l - 1; j++) {
			v = this.copyV3(j);
			this.previous.push(v[0], v[1], v[2]);
			this.previous.push(v[0], v[1], v[2]);
		}

		for (var j = 1; j < l; j++) {
			v = this.copyV3(j);
			this.next.push(v[0], v[1], v[2]);
			this.next.push(v[0], v[1], v[2]);
		}

		if (this.compareV3(l - 1, 0)) {
			v = this.copyV3(1);
		} else {
			v = this.copyV3(l - 1);
		}
		this.next.push(v[0], v[1], v[2]);
		this.next.push(v[0], v[1], v[2]);

		for (var j = 0; j < l - 1; j++) {
			var n = j * 2;
			this.indices_array.push(n, n + 1, n + 2);
			this.indices_array.push(n + 2, n + 1, n + 3);
		}

		if (!this.attributes) {
			this.attributes = {
				position: new THREE.BufferAttribute(new Float32Array(this.positions), 3),
				previous: new THREE.BufferAttribute(new Float32Array(this.previous), 3),
				next: new THREE.BufferAttribute(new Float32Array(this.next), 3),
				side: new THREE.BufferAttribute(new Float32Array(this.side), 1),
				width: new THREE.BufferAttribute(new Float32Array(this.width), 1),
				uv: new THREE.BufferAttribute(new Float32Array(this.uvs), 2),
				index: new THREE.BufferAttribute(new Uint16Array(this.indices_array), 1),
				counters: new THREE.BufferAttribute(new Float32Array(this.counters), 1)
			};
		} else {
			this.attributes.position.copyArray(new Float32Array(this.positions));
			this.attributes.position.needsUpdate = true;
			this.attributes.previous.copyArray(new Float32Array(this.previous));
			this.attributes.previous.needsUpdate = true;
			this.attributes.next.copyArray(new Float32Array(this.next));
			this.attributes.next.needsUpdate = true;
			this.attributes.side.copyArray(new Float32Array(this.side));
			this.attributes.side.needsUpdate = true;
			this.attributes.width.copyArray(new Float32Array(this.width));
			this.attributes.width.needsUpdate = true;
			this.attributes.uv.copyArray(new Float32Array(this.uvs));
			this.attributes.uv.needsUpdate = true;
			this.attributes.index.copyArray(new Uint16Array(this.indices_array));
			this.attributes.index.needsUpdate = true;
		}

		this.geometry.addAttribute('position', this.attributes.position);
		this.geometry.addAttribute('previous', this.attributes.previous);
		this.geometry.addAttribute('next', this.attributes.next);
		this.geometry.addAttribute('side', this.attributes.side);
		this.geometry.addAttribute('width', this.attributes.width);
		this.geometry.addAttribute('uv', this.attributes.uv);
		this.geometry.addAttribute('counters', this.attributes.counters);

		this.geometry.setIndex(this.attributes.index);
	};

	MeshLine.prototype.advance = function advance(position) {
		var positions = this.attributes.position.array;
		var previous = this.attributes.previous.array;
		var next = this.attributes.next.array;
		var l = positions.length;

		memcpy(positions, 0, previous, 0, l);

		memcpy(positions, 6, positions, 0, l - 6);

		positions[l - 6] = position.x;
		positions[l - 5] = position.y;
		positions[l - 4] = position.z;
		positions[l - 3] = position.x;
		positions[l - 2] = position.y;
		positions[l - 1] = position.z;

		memcpy(positions, 6, next, 0, l - 6);

		next[l - 6] = position.x;
		next[l - 5] = position.y;
		next[l - 4] = position.z;
		next[l - 3] = position.x;
		next[l - 2] = position.y;
		next[l - 1] = position.z;

		this.attributes.position.needsUpdate = true;
		this.attributes.previous.needsUpdate = true;
		this.attributes.next.needsUpdate = true;
	};

	return MeshLine;
}();

var MeshLineMaterial = exports.MeshLineMaterial = function (_THREE$Material) {
	_inherits(MeshLineMaterial, _THREE$Material);

	function MeshLineMaterial(parameters) {
		var _ret;

		_classCallCheck(this, MeshLineMaterial);

		var check = function check(v, d) {
			if (v === undefined) return d;
			return v;
		};

		var _this = _possibleConstructorReturn(this, _THREE$Material.call(this));

		parameters = parameters || {};

		_this.lineWidth = check(parameters.lineWidth, 1);
		_this.map = check(parameters.map, null);
		_this.useMap = check(parameters.useMap, 0);
		_this.alphaMap = check(parameters.alphaMap, null);
		_this.useAlphaMap = check(parameters.useAlphaMap, 0);
		_this.color = check(parameters.color, new THREE.Color(0xffffff));
		_this.opacity = check(parameters.opacity, 1);
		_this.resolution = check(parameters.resolution, new THREE.Vector2(1, 1));
		_this.sizeAttenuation = check(parameters.sizeAttenuation, 1);
		_this.near = check(parameters.near, 1);
		_this.far = check(parameters.far, 1);
		_this.dashArray = check(parameters.dashArray, []);
		_this.useDash = _this.dashArray !== [] ? 1 : 0;
		_this.visibility = check(parameters.visibility, 1);
		_this.alphaTest = check(parameters.alphaTest, 0);
		_this.repeat = check(parameters.repeat, new THREE.Vector2(1, 1));

		var material = new THREE.RawShaderMaterial({
			uniforms: {
				lineWidth: { type: 'f', value: _this.lineWidth },
				map: { type: 't', value: _this.map },
				useMap: { type: 'f', value: _this.useMap },
				alphaMap: { type: 't', value: _this.alphaMap },
				useAlphaMap: { type: 'f', value: _this.useAlphaMap },
				color: { type: 'c', value: _this.color },
				opacity: { type: 'f', value: _this.opacity },
				resolution: { type: 'v2', value: _this.resolution },
				sizeAttenuation: { type: 'f', value: _this.sizeAttenuation },
				near: { type: 'f', value: _this.near },
				far: { type: 'f', value: _this.far },
				dashArray: { type: 'v2', value: new THREE.Vector2(_this.dashArray[0], _this.dashArray[1]) },
				useDash: { type: 'f', value: _this.useDash },
				visibility: { type: 'f', value: _this.visibility },
				alphaTest: { type: 'f', value: _this.alphaTest },
				repeat: { type: 'v2', value: _this.repeat }
			},
			vertexShader: vertexShaderSource,
			fragmentShader: fragmentShaderSource
		});

		delete parameters.lineWidth;
		delete parameters.map;
		delete parameters.useMap;
		delete parameters.alphaMap;
		delete parameters.useAlphaMap;
		delete parameters.color;
		delete parameters.opacity;
		delete parameters.resolution;
		delete parameters.sizeAttenuation;
		delete parameters.near;
		delete parameters.far;
		delete parameters.dashArray;
		delete parameters.visibility;
		delete parameters.alphaTest;
		delete parameters.repeat;

		material.type = 'MeshLineMaterial';

		material.setValues(parameters);

		return _ret = material, _possibleConstructorReturn(_this, _ret);
	}

	MeshLineMaterial.prototype.copy = function copy(source) {
		THREE.Material.prototype.copy.call(this, source);

		this.lineWidth = source.lineWidth;
		this.map = source.map;
		this.useMap = source.useMap;
		this.alphaMap = source.alphaMap;
		this.useAlphaMap = source.useAlphaMap;
		this.color.copy(source.color);
		this.opacity = source.opacity;
		this.resolution.copy(source.resolution);
		this.sizeAttenuation = source.sizeAttenuation;
		this.near = source.near;
		this.far = source.far;
		this.dashArray.copy(source.dashArray);
		this.useDash = source.useDash;
		this.visibility = source.visibility;
		this.alphaTest = source.alphaTest;
		this.repeat.copy(source.repeat);

		return this;
	};

	return MeshLineMaterial;
}(THREE.Material);

function memcpy(src, srcOffset, dst, dstOffset, length) {
	var i;

	src = src.subarray || src.slice ? src : src.buffer;
	dst = dst.subarray || dst.slice ? dst : dst.buffer;

	src = srcOffset ? src.subarray ? src.subarray(srcOffset, length && srcOffset + length) : src.slice(srcOffset, length && srcOffset + length) : src;

	if (dst.set) {
		dst.set(src, dstOffset);
	} else {
		for (i = 0; i < src.length; i++) {
			dst[i + dstOffset] = src[i];
		}
	}

	return dst;
}

var vertexShaderSource = '\n\tprecision highp float;\n\n\tattribute vec3 position;\n\tattribute vec3 previous;\n\tattribute vec3 next;\n\tattribute float side;\n\tattribute float width;\n\tattribute vec2 uv;\n\tattribute float counters;\n\n\tuniform mat4 projectionMatrix;\n\tuniform mat4 modelViewMatrix;\n\tuniform vec2 resolution;\n\tuniform float lineWidth;\n\tuniform vec3 color;\n\tuniform float opacity;\n\tuniform float near;\n\tuniform float far;\n\tuniform float sizeAttenuation;\n\n\tvarying vec2 vUV;\n\tvarying vec4 vColor;\n\tvarying float vCounters;\n\n\tvec2 fix( vec4 i, float aspect ) {\n\t\tvec2 res = i.xy / i.w;\n\t\tres.x *= aspect;\n\t\tvCounters = counters;\n\t\treturn res;\n\t}\n\n\tvoid main() {\n\t\tfloat aspect = resolution.x / resolution.y;\n\t\tfloat pixelWidthRatio = 1. / (resolution.x * projectionMatrix[0][0]);\n\n\t\tvColor = vec4( color, opacity );\n\t\tvUV = uv;\n\n\t\tmat4 m = projectionMatrix * modelViewMatrix;\n\t\tvec4 finalPosition = m * vec4( position, 1.0 );\n\t\tvec4 prevPos = m * vec4( previous, 1.0 );\n\t\tvec4 nextPos = m * vec4( next, 1.0 );\n\n\t\tvec2 currentP = fix( finalPosition, aspect );\n\t\tvec2 prevP = fix( prevPos, aspect );\n\t\tvec2 nextP = fix( nextPos, aspect );\n\n\t\tfloat pixelWidth = finalPosition.w * pixelWidthRatio;\n\t\tfloat w = 1.8 * pixelWidth * lineWidth * width;\n\n\t\tif( sizeAttenuation == 1. ) {\n\t\t\tw = 1.8 * lineWidth * width;\n\t\t}\n\n\t\tvec2 dir;\n\t\tif( nextP == currentP ) dir = normalize( currentP - prevP );\n\t\telse if( prevP == currentP ) dir = normalize( nextP - currentP );\n\t\telse {\n\t\t\tvec2 dir1 = normalize( currentP - prevP );\n\t\t\tvec2 dir2 = normalize( nextP - currentP );\n\t\t\tdir = normalize( dir1 + dir2 );\n\n\t\t\tvec2 perp = vec2( -dir1.y, dir1.x );\n\t\t\tvec2 miter = vec2( -dir.y, dir.x );\n\t\t\t//w = clamp( w / dot( miter, perp ), 0., 4. * lineWidth * width );\n\t\t}\n\n\t\t//vec2 normal = ( cross( vec3( dir, 0. ), vec3( 0., 0., 1. ) ) ).xy;\n\t\tvec2 normal = vec2( -dir.y, dir.x );\n\t\tnormal.x /= aspect;\n\t\tnormal *= .5 * w;\n\n\t\tvec4 offset = vec4( normal * side, 0.0, 1.0 );\n\t\tfinalPosition.xy += offset.xy;\n\n\t\tgl_Position = finalPosition;\n\t}';

var fragmentShaderSource = '\n\t#extension GL_OES_standard_derivatives : enable\n\tprecision mediump float;\n\n\tuniform sampler2D map;\n\tuniform sampler2D alphaMap;\n\tuniform float useMap;\n\tuniform float useAlphaMap;\n\tuniform float useDash;\n\tuniform vec2 dashArray;\n\tuniform float visibility;\n\tuniform float alphaTest;\n\tuniform vec2 repeat;\n\n\tvarying vec2 vUV;\n\tvarying vec4 vColor;\n\tvarying float vCounters;\n\n\tvoid main() {\n\t\tvec4 c = vColor;\n\t\tif( useMap == 1. ) c *= texture2D( map, vUV * repeat );\n\t\tif( useAlphaMap == 1. ) c.a *= texture2D( alphaMap, vUV * repeat ).a;\n\t\tif( c.a < alphaTest ) discard;\n\t\tif( useDash == 1. ){}\n\t\tgl_FragColor = c;\n\t\tgl_FragColor.a *= step(vCounters,visibility);\n\t}';