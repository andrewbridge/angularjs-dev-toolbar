import modules from './modules';
import Util from './Util.js';
import Vue from 'vue';

const defaultSettings = {
	mode: 'full'
};

class NgDevToolbar {
	constructor(appendTo = document.body) {
		this.modules = this.runModules();
		this.rootData = {
			settings: Object.assign(defaultSettings, JSON.parse(window.localStorage.getItem('NgDevToolbarSettings'))),
			modalCount: 0,
			modules: this.modules,
			hasFocus: false
		};
		this.hijackModalStack();
		const toolbarElm = appendTo.appendChild(document.createElement('DIV'));
		this.app = new Vue({
			el: toolbarElm,
			template: `<div class="dev-toolbar-wrapper" :class="[mode, {focussed: hasFocus}]" @mouseenter="hasFocus = true" @mouseleave="hasFocus = false">
							<component v-for="component in modules" :is="component.name" :key="component.name"></component>
						</div>`,
			data: this.rootData,
			computed: {
				modalIsOpen() {
					return this.modalCount > 0;
				},
				mode() {
					if (this.modalIsOpen && 
						(this.settings.mode !== 'dynamic' || (this.settings.mode === 'dynamic' && !this.hasFocus))) {
						return 'mini';
					} else if (this.settings.mode === 'dynamic') {
						return this.hasFocus ? 'full' : 'compact';
					} else {
						return this.settings.mode;
					}
				}
			},
			watch: {
				settings: {
					handler(newSettings) {
						window.localStorage.setItem('NgDevToolbarSettings', JSON.stringify(newSettings));
					},
					deep: true
				}
			}
		});
	}

	runModules() {
		return Object.keys(modules).map(tagName => new modules[tagName](tagName));
	}

	// Watch the modal stack so the toolbar can behave nicely with modals
	hijackModalStack() {
		const $uibModalStack = Util.$inject('$uibModalStack');
		const oldClose = $uibModalStack.close;
		const oldDismiss = $uibModalStack.dismiss;
		const oldOpen = $uibModalStack.open;
		const rootData = this.rootData;
		rootData.modalCount = $uibModalStack.getTop() ? 1 : 0;
		$uibModalStack.open = function() {
			rootData.modalCount++;
			return oldOpen(...arguments);
		}
		$uibModalStack.close = function() {
			rootData.modalCount--;
			return oldClose(...arguments);
		}
		$uibModalStack.dismiss = function() {
			rootData.modalCount--;
			return oldDismiss(...arguments);
		}
	}
}

export default NgDevToolbar;