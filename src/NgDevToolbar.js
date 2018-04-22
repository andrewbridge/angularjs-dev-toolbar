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
			modules: this.modules
		};
		this.hijackModalStack();
		const toolbarElm = appendTo.appendChild(document.createElement('DIV'));
		this.app = new Vue({
			el: toolbarElm,
			template: `<div class="dev-toolbar-wrapper" :class="mode">
							<component v-for="component in modules" :is="component.name" :key="component.name"></component>
						</div>`,
			data: this.rootData,
			computed: {
				modalIsOpen() {
					return this.modalCount > 0;
				},
				mode() {
					return this.modalIsOpen ? 'mini' : this.settings.mode;
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