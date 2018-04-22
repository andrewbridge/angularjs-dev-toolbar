import modules from './modules';
import Vue from 'vue';

class NgDevToolbar {
	constructor(appendTo = document.body) {
		this.modules = this.runModules();
		const toolbarElm = document.createElement('DIV');
		toolbarElm.classList.add('dev-toolbar-wrapper');
		toolbarElm.innerHTML = '';
		this.modules.forEach((module) => {
			toolbarElm.innerHTML += `<${module.name}></${module.name}>`;
		});
		appendTo.appendChild(toolbarElm);
		this.app = new Vue({
			el: toolbarElm,
			data: {
				settings: {
					mode: 'full'
				}
			},
			watch: {
				settings: {
					handler(newSettings) {
						window.localStorage.setItem('NgDevToolbarSettings', newSettings);
					},
					deep: true
				}
			}
		});
	}

	runModules() {
		return Object.keys(modules).map(tagName => new modules[tagName](tagName));
	}
}

export default NgDevToolbar;