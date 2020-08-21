/**
 * Designed by Mirsaid Patarov
 * License: MIT license
 * Version: 0.3.1
 * Build: B0318
 */

(function () {
  'use strict';

  var l2 = function (selector) {
    return new l2.prototype.init(selector);
  }


  l2.ajax = function (options) {
    var url = options.url;
    var method = options.method || 'GET';
    var contentType = options.contentType || 'text/plain';
    var data = options.data;

    var success = options.success;


    var request = new XMLHttpRequest();
    request.withCredentials = true;
    request.onreadystatechange = function() {
      if (this.readyState == 4) {
        var resContentType = request.getResponseHeader('Content-type');
        
        success(/json/.test(resContentType) ? JSON.parse(this.response) : this.response);
      }
    };

    request.open(method, url, true);
    request.setRequestHeader('Content-type', contentType);

    if (data) {
      if (/json/.test(contentType)) {
        data = JSON.stringify(data);
      }
    }

    request.send(data);
  }

  l2.create = function (...args) {
    var tag = undefined;

    if (args.length >= 1) {
      tag = document.createElement(args[0]);

      if (args.length === 2) {
        if (typeof args[1] === 'string') {
          l2(tag).text(args[1]);
        } else if (typeof args[1] === 'object') {
          for (var k in args[1]) {
            l2(tag).attr(k, args[1][k]);
          }
        }
      } else if (args.length === 3) {
        l2(tag).text(args[1]);

        for (var k in args[2]) {
          l2(tag).attr(k, args[2][k]);
        }
      }
    }

    return tag;
  }

  // Set/get cookie
  l2.cookie = function (name, value, expires) {
    if (value === undefined) {
      if (document.cookie.length > 0) {
        var s = document.cookie.indexOf(name + "=");

        if (s != -1) {
          s = s + name.length + 1;
          expires = document.cookie.indexOf(";", s);
          if (expires == -1) expires = document.cookie.length;
          return unescape(document.cookie.substring(s, expires));
        }
      }

      return undefined;
    } else {
      var d = new Date(Date.parse(new Date()) + expires * 1000);
      var expires = "expires="+ d.toUTCString();
      document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }
  },

  // Remove cookie
  l2.removeCookie = function (name) {
    if (getCookie(name) !== undefined) {
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  }

  var init = l2.prototype.init = function (selector) {
    if (selector) {
      if (typeof selector === 'object') {
        this.element = selector;
      } else {
        var allElements = document.querySelectorAll(selector);
        if (allElements.length === 1) {
          this.element = allElements[0];
        } else {
          this.elements = allElements;
        }
      }
    }
  };

  l2.fn = init.prototype = {
    // Get element
    get: function (index) {
      if (this.elements) {
        return index ? this.elements[index] : this.elements[0];
      } else {
        return this.element;
      }
    },

    // Finds in the parent element
    find: function (selector) {
      if (typeof selector === 'string') {
        if (this.elements) {
          // TODO
        } else {
          var allElements = this.element.querySelectorAll(selector);
          if (allElements.length === 1) {
            this.element = allElements[0];
          } else {
            this.elements = allElements;
            this.element = undefined;
          }
        }
      }

      return this;
    },

    // Set/get attribute
    attr: function (name, value) {
      if (value === undefined) return this.element.getAttribute(name);
      this.element.setAttribute(name, value);
    },

    // Remove attribute
    removeAttr: function (...name) {
      for (var i = 0; i < name.length; i++) {
        this.element.removeAttribute(name[i]);
      }
    },

    // On some event
    on: function (options, cb) {
      if (this.elements) {
        for (var i = 0; i < this.elements.length; i++) {
          if (typeof options === 'string') {
            this.elements[i].addEventListener(options, cb);
          } else if (typeof options === 'object') {
            this.elements[i].addEventListener(options.event, function () {
              cb(options.data);
            });
          }
        }
      } else {
        if (typeof options === 'string') {
          this.element.addEventListener(options, cb);
        } else if (typeof options === 'object') {
          this.element.addEventListener(options.event, function () {
            cb(options.data);
          });
        }
      }

      return this;
    },

    goto: function (top = 0) {
      if (this.element) {
        var position = this.element.getBoundingClientRect();
        window.scrollTo(position.left, position.top + top);
      }

      return this;
    },

    // Add class
    addClass: function (...args) {
      if (this.elements) {
        for (var i = 0; i < this.elements.length; i++) {
          this.elements[i].classList.add(...args);
        }
      } else this.element.classList.add(...args);

      return this;
    },

    // Remove class
    removeClass: function (...args) {
      if (this.elements) {
        for (var i = 0; i < this.elements.length; i++) {
          if (args.length > 0) this.elements[i].classList.remove(...args);
          else this.elements[i].className = '';
        }
      } else {
        if (args.length > 0) this.element.classList.remove(...args);
        else this.element.className = '';
      }

      return this;
    },

    // If element contains class return true
    hasClass: function (name) {
      if (this.elements) {
        for (var i = 0; i < this.elements.length; i++) {
          if (this.element.classList.contains(name)) return true;
        }

        return false;
      } else {
        return this.element.classList.contains(name);
      }
    },

    // Set/get Text
    text: function (...args) {
      if (args.length === 1) {
        var text = args[0];

        if (typeof text === 'string' || typeof text === 'number' || typeof text === 'boolean') {
          if (this.elements) {
            for (var i = 0; i < this.elements.length; i++) {
              this.elements[i].innerHTML = text;
            }
          } else {
            this.element.innerHTML = text;
          }
        }
      } else {
        if (this.element.nodeName === 'INPUT') {
          return this.element.value;
        } else return this.element.innerHTML;
      }
    },

    // Append child
    append: function (ch) {
      if (this.elements) {
        for (var i = 0; i < this.elements.length; i++) {
          this.elements[i].appendChild(ch);
        }
      } else this.element.appendChild(ch);

      return this;
    },

    // Detach child
    detach: function (ch) {
      if (ch) {
        if (this.elements) {
          for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].removeChild(ch);
          }
        } else this.element.removeChild(ch);
      } else this.text('');

      return this;
    }
  }

  window.l2 = l2;
})();