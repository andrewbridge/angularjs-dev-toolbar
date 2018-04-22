import modules from './modules';
import Util from './Util.js';
import Vue from 'vue';

const defaultSettings = {
	mode: 'full'
};

class NgDevToolbar {
	constructor(appendTo = document.body) {
		this.modules = this.runModules();
		const toolbarElm = document.createElement('DIV');
		toolbarElm.classList.add('dev-toolbar-wrapper');
		toolbarElm.innerHTML = `<div class="mode" :class="mode">`;
		this.modules.forEach((module) => {
			toolbarElm.innerHTML += `<${module.name}></${module.name}>`;
		});
		toolbarElm.innerHTML += `</div>`;
		this.rootData = {
			settings: JSON.parse(window.localStorage.getItem('NgDevToolbarSettings')) || defaultSettings,
			modalCount: 0
		};
		this.hijackModalStack();
		appendTo.appendChild(toolbarElm);
		this.app = new Vue({
			el: toolbarElm,
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