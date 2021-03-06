import _ from 'lodash';
import settings from './settings.js';

const appName = settings.appModuleName;
const injectionCache = {};
class Util {
	static isPlatform() {
		try {
			angular.module(appName)
			return true;
		} catch(e) {
			if (e.message.indexOf('$injector:nomod') > -1) {
				console.error(`${appName} module doesn't exist. Are you on a page with coinvestor platform running?`)
			} else if (e.message.indexOf('angular is not defined') > -1) {
				console.error(`angular doesn't exist. Are you on a page with the coinvestor platform running?`);
			} else {
				console.error(`Unknown error finding ${appName} module\n\n${e.message}`);
			}
		}
		return false; 
	}

	static $inject(module, expose = false) {
		if (!Util.isPlatform()) {
			return null;
		}
		if (expose === true && !_.isObject(window)) {
			expose = false;
		}
		if (!('$inject' in injectionCache)) {
			const $body = angular.element(document.body);
			if ($body.length !== 0) {
				injectionCache['$inject'] = $body.injector().get;
			} else {
				return null;
			}
		}
		let injection;
		if (module in injectionCache) {
			injection = injectionCache[module];
			expose && _.set(window, module, injection);
			return injection;
		}
		injection = injectionCache[module] = injectionCache['$inject'](module);
		expose && _.set(window, module, injection);
		return injection;
	}

	static loadAsset(type, url, appendTo) {
		const config = {
			js: {
				elm: 'SCRIPT',
				url: 'src',
				appendTo: document.body
			},
			css: {
				elm: 'LINK',
				url: 'href',
				appendTo: document.head
			}
		}
		return new Promise((resolve, reject) => {
			const elm = document.createElement(config[type].elm);
			elm.addEventListener('load', resolve, false);
			elm.addEventListener('error', reject, false);
			elm[config[type].url] = url
			config[type].appendTo.appendChild(elm);
		});
	}

	static modal(title, content, scopeItems = {}, buttons = {resolve: 'OK', reject: 'Cancel'}) {
		return new Promise((resolve, reject) => {
			const template = `<div class="modal-content">
				<form novalidate autocomplete="off">
					<div class="modal-header">
						<h4 class="modal-title">${title}</h4>
					</div>
					<div class="modal-body">
						<div class="row">
							<div class="col-sm-12">
								${content}
							</div>
						</div>
					</div>
					<div class="modal-footer">
						<div class="row">
							<div class="col-sm-12">
								<button class="btn btn-action pull-left" ng-click="$dismiss(vm)">${buttons.reject}</button>
								<span class="pull-right">
									<button type="submit" class="btn btn-brand" ng-click="$close(vm)">${buttons.resolve}</button>
								</span>
							</div>
						</div>
					</div>
				</form>
			</div>`;
			if (Util.isPlatform()) {
				const modal = Util.$inject('$uibModal');
				const $rootScope = Util.$inject('$rootScope');
				const modalScope = $rootScope.$new(true);
				modalScope.vm = {};
				Object.assign(modalScope.vm, scopeItems);
				modal.open({
					template,
					size: 'md',
					scope: modalScope
				}).result.then(resolve, reject);
			}
		});
	}

	static getScope(selector) {
		let elm;
		if (selector instanceof HTMLElement) {
			elm = selector;
		} else if (_.isArrayLike(selector) && _.isFunction(selector.get)) {
			// Probably jQuery
			elm = selector.get(0);
		} else if (document.querySelector(selector)) {
			elm = document.querySelector(selector);
		} else {
			elm = document.querySelector(_.kebabCase(selector));
		}
		if (elm instanceof HTMLElement && elm.childNodes.length) {
			return angular.element(elm.childNodes[0]).scope();
		}
		return null
	}

	static toJSON(data, space = 2) {
		const seen = [];
		return JSON.stringify(data, (key, value) => {
			if (typeof value === 'object' && value !== null) {
				if (seen.indexOf(value) > -1) {
					return `[Already seen ${key}]`;
				} else {
					seen.push(value);
				}
			}
			return value;
		}, space);
	}

	static stalk(root, path) {
		var oldFunc = root[path];
		root[path] = function() {
			try { throw new Error(); }
			catch (e) { console.log({type: path, stack: e.stack}); }
			return oldFunc(...arguments);
		};
	}

	static get $state() {
		return Util.$inject('$state');
	}

	static get $rootScope() {
		return Util.$inject('$rootScope');
	}

	static get pageScope() {
		return Util.getScope('[ui-view] > :first-child');
	}

	// This could potentially be a bit heavy
	static get scopes() {
		return Array.from(document.querySelectorAll('.ng-scope, .ng-isolate-scope')).reduce((scopes, elm) => {
			const scope = Util.getScope(elm);
			let name = _.camelCase(elm.tagName);
			// Account for multiple components
			if (name in scopes) {
				name += `-${scope.$id}`;
			}
			scopes[name] = scope;
			return scopes;
		}, {});
	}
}

export default Util;