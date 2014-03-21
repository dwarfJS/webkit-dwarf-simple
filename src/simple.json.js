/*!
 * simple.json
 * the MIT Licence
 */
define('./simple.json', function (require, exports, module) {

	/**
	 * Reference from binary-extract
	 * https://github.com/segmentio/binary-extract
	 */
	function _findStart(str, key, start) {
		var isKey = true,
			inString = false,
			level = 0,
			i = start || 0,
			l= str.length,
			keyL = key.length,
			c;

		for (; i < l; i++) {
			c = str[i];

			if (c === '\\') {
				i++;
				continue;
			}

			if (c === '"') {
				inString = !inString;
				continue;
			}

			if (!inString) {
				if (c === ':') isKey = false;
				else if (c === ',') isKey = true;
				else if (c === '{') level++;
				else if (c === '}') level--;
			}
			if (!isKey || level > 1 || str.substring(i, i + keyL) !== key)
				continue;

			return i + key.length + 2;
		}
	}

	/**
	 * Reference from binary-extract
	 * https://github.com/segmentio/binary-extract
	 */
	function _findEnd(str, start) {
		var level = 0,
			s = str[start],
			i = start,
			l = str.length,
			c;

		for (; i < l; i++) {
			c = str[i];
			if (c === '{' || c === '[') {
				level++;
				continue;
			} else if (c === '}' || c === ']') {
				if (--level > 0) continue;
			}

			if (
				level < 0 ||
				level === 0 && (c === ',' || c === '}' || c === ']')
			) {
				return s === '{' || s === '[' ?
					i + 1 : 
						i;
			}
		}
	}

	function _parse(str, start, end) {
		return JSON.parse(str.substring(start, end));
	}

	/**
	 * has
	 * if a JSON has a key
	 * @param {String} str
	 * @param {String} key
	 * @param {Number} start (option)
	 */
	function has(str, key, start) {
		var start = _findStart(str, key, start);
		if (start) {
			return {
				start: start,
				end: _findEnd(str, start)
			};
		} else {
			return null;
		}
	}

	/**
	 * extract
	 * extract a key-value from a JSON
	 * @param {String} str
	 * @param {String} key
	 * @param {Position} pos (option)
	 */
	function extract(str, key, pos) {
		pos = pos || has(str, key);
		return pos ?
			_parse(str, pos.start, pos.end) :
				null;
	}

	/**
	 * insert
	 * insert a key-value to a JSON
	 * @param {String} str
	 * @param {String} key
	 * @param {Any} data
	 * @param {Position} pos (option)
	 */
	function insert(str, key, data, pos) {
		pos = pos || has(str, key);
		return pos ?
			str.substring(0, pos.start) + JSON.stringify(data) + str.substring(pos.end) :
				str.substring(0, 1) + '"' + key +'":' + JSON.stringify(data) + ',' + str.substring(2);
	}

	return module.exports = {
		extract: extract,
		insert: insert,
		has: has
	};
});