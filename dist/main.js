module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _Highlighter = __webpack_require__(2);
	
	var _Highlighter2 = _interopRequireDefault(_Highlighter);
	
	var _utils = __webpack_require__(4);
	
	exports['default'] = _Highlighter2['default'];
	exports.combineChunks = _utils.combineChunks;
	exports.fillInChunks = _utils.fillInChunks;
	exports.findAll = _utils.findAll;
	exports.findChunks = _utils.findChunks;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = Highlighter;
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _utilsJs = __webpack_require__(4);
	
	var Chunks = _interopRequireWildcard(_utilsJs);
	
	Highlighter.propTypes = {
	  highlightClassName: _react.PropTypes.string,
	  highlightStyle: _react.PropTypes.object,
	  searchWords: _react.PropTypes.arrayOf(_react.PropTypes.string).isRequired,
	  textToHighlight: _react.PropTypes.string.isRequired,
	  sanitize: _react.PropTypes.func
	};
	
	/**
	 * Highlights all occurrences of search terms (searchText) within a string (textToHighlight).
	 * This function returns an array of strings and <span>s (wrapping highlighted words).
	 */
	
	function Highlighter(_ref) {
	  var _ref$highlightClassName = _ref.highlightClassName;
	  var highlightClassName = _ref$highlightClassName === undefined ? '' : _ref$highlightClassName;
	  var _ref$highlightStyle = _ref.highlightStyle;
	  var highlightStyle = _ref$highlightStyle === undefined ? {} : _ref$highlightStyle;
	  var searchWords = _ref.searchWords;
	  var textToHighlight = _ref.textToHighlight;
	  var sanitize = _ref.sanitize;
	
	  var chunks = Chunks.findAll(textToHighlight, searchWords, sanitize);
	
	  return _react2['default'].createElement(
	    'span',
	    null,
	    chunks.map(function (chunk, index) {
	      var text = textToHighlight.substr(chunk.start, chunk.end - chunk.start);
	
	      if (chunk.highlight) {
	        return _react2['default'].createElement(
	          'mark',
	          {
	            className: highlightClassName,
	            key: index,
	            style: highlightStyle
	          },
	          text
	        );
	      } else {
	        return _react2['default'].createElement(
	          'span',
	          { key: index },
	          text
	        );
	      }
	    })
	  );
	}
	
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * Creates an array of chunk objects representing both higlightable and non highlightable pieces of text that match each search word.
	 * @param searchWords string[]
	 * @param textToSearch string
	 * @return {start:number, end:number, highlight:boolean}[]
	 */
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var findAll = function findAll(textToSearch, wordsToFind, sanitize) {
	  return fillInChunks(combineChunks(findChunks(textToSearch, wordsToFind, sanitize)), textToSearch.length);
	};
	
	exports.findAll = findAll;
	/**
	 * Takes an array of {start:number, end:number} objects and combines chunks that overlap into single chunks.
	 * @param chunks {start:number, end:number}[]
	 * @return {start:number, end:number}[]
	 */
	var combineChunks = function combineChunks(chunks) {
	  chunks = chunks.sort(function (first, second) {
	    return first.start - second.start;
	  }).reduce(function (processedChunks, nextChunk) {
	    // First chunk just goes straight in the array...
	    if (processedChunks.length === 0) {
	      return [nextChunk];
	    } else {
	      // ... subsequent chunks get checked to see if they overlap...
	      var prevChunk = processedChunks.pop();
	      if (nextChunk.start <= prevChunk.end) {
	        // It may be the case that prevChunk completely surrounds nextChunk, so take the
	        // largest of the end indeces.
	        var endIndex = Math.max(prevChunk.end, nextChunk.end);
	        processedChunks.push({ start: prevChunk.start, end: endIndex });
	      } else {
	        processedChunks.push(prevChunk, nextChunk);
	      }
	      return processedChunks;
	    }
	  }, []);
	
	  return chunks;
	};
	
	exports.combineChunks = combineChunks;
	/**
	 * Examine textToSearch for any matches.
	 * If we find matches, add them to the returned array as a "chunk" object ({start:number, end:number}).
	 * @param textToSearch string
	 * @param wordsToFind string[]
	 * @param sanitize Process and optionally modify textToSearch and wordsToFind before comparison; this can be used to eg. remove accents
	 * @return {start:number, end:number}[]
	 */
	var findChunks = function findChunks(textToSearch, wordsToFind) {
	  var sanitize = arguments.length <= 2 || arguments[2] === undefined ? identity : arguments[2];
	  return wordsToFind.filter(function (searchWord) {
	    return searchWord;
	  }) // Remove empty words
	  .reduce(function (chunks, searchWord) {
	    var normalizedWord = sanitize(searchWord);
	    var normalizedText = sanitize(textToSearch);
	    var regex = new RegExp(escapeRegExp(normalizedWord), 'gi');
	    var match = undefined;
	    while ((match = regex.exec(normalizedText)) != null) {
	      chunks.push({ start: match.index, end: regex.lastIndex });
	    }
	    return chunks;
	  }, []);
	};
	
	exports.findChunks = findChunks;
	/**
	 * Given a set of chunks to highlight, create an additional set of chunks
	 * to represent the bits of text between the highlighted text.
	 * @param chunksToHighlight {start:number, end:number}[]
	 * @param totalLength number
	 * @return {start:number, end:number, highlight:boolean}[]
	 */
	var fillInChunks = function fillInChunks(chunksToHighlight, totalLength) {
	  var allChunks = [];
	  var append = function append(start, end, highlight) {
	    if (end - start > 0) {
	      allChunks.push({ start: start, end: end, highlight: highlight });
	    }
	  };
	
	  if (chunksToHighlight.length === 0) {
	    append(0, totalLength, false);
	  } else {
	    (function () {
	      var lastIndex = 0;
	      chunksToHighlight.forEach(function (chunk) {
	        append(lastIndex, chunk.start, false);
	        append(chunk.start, chunk.end, true);
	        lastIndex = chunk.end;
	      });
	      append(lastIndex, totalLength, false);
	    })();
	  }
	  return allChunks;
	};
	
	exports.fillInChunks = fillInChunks;
	function identity(value) {
	  return value;
	}
	
	function escapeRegExp(str) {
	  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
	}

/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map