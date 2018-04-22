import settings from '../settings.js';
import Util from '../Util.js';
import Vue from 'vue';

const appName = settings.appModuleName;
class UiRouterToolbarModule {
	// constructor must take a component name as its parameter
	constructor(componentName) {
		const state = Util.$inject('$state');
		this.moduleCount = 0;
		this.moduleMap = {};
		// Class must expose a 'name' property with the component name it's given
		this.name = componentName;
		// Best practice to expose the component data as a class property
		this.componentData = {
			state,
			moduleMap: this.moduleMap
		};
		[appName, ...angular.module(appName).requires].forEach((module) => {
			angular.module(module)._invokeQueue.forEach((value) => { 
				if (!this.moduleMap.hasOwnProperty(value[1])) {
					this.moduleMap[value[1]] = {};
				}
				this.moduleMap[value[1]][value[2][0]] = module;
				this.moduleCount++;
			})
		});
		// Vue component must be set up as part of class constructor using the componentName provided
		Vue.component(componentName, {
			template: `<div class="toolbar-module">
				<i class="fa fa-map-signs" aria-hidden="true"></i>
				<div>
					<template v-if="$root.mode === 'full' || $root.mode === 'compact'">
						<p>State: {{state.current.name}}</p>
						<p v-if="$root.mode === 'full'">{{currentComponent}} ({{moduleMap.component[currentComponent]}})</p>
					</template>
					<p v-if="$root.mode === 'mini'">{{state.current.name}}</p>
				</div>
			</div>`,
			data: () => this.componentData,
			computed: {
				currentComponent() {
					return this.state.current.template.replace(/<([a-z\-]+).*$/, "$1").replace(/(\-\w)/g, (m) => m[1].toUpperCase());
				}
			}
		});
	}
}

export default UiRouterToolbarModule;