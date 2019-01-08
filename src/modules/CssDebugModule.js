import Debucsser from 'debucsser';
import Vue from 'vue';

const debugConfig = {
	color: '#d60b52 !important', // color of the outline
	width: '4px', // width of the outline
	grayscaleOnDebugAll: true // apply grayscale filter to every element
}

class CssDebugToolbarModule {
	constructor(componentName) {
		this.name = componentName;
		this.componentData = {
			state: false,
			debug: null
		};
		Vue.component(componentName, {
			template: `<div class="toolbar-module" @click="enableDebugging">
				<i class="fa fa-bug" aria-hidden="true"></i>
				<div>
					<template v-if="$root.mode === 'full' || $root.mode === 'compact'">
						<p>CSS debugging: {{humanState}}</p>
						<p v-if="$root.mode === 'full'" class="text-lightest">(Hold ctrl or ctrl + shift)</p>
					</template>
					<p v-if="$root.mode === 'mini'">{{humanState}}</p>
				</div>
			</div>`,
			data: () => this.componentData,
			computed: {
				humanState() {
					return this.state ? 'Enabled' : 'Disabled';
				}
			},
			methods: {
				enableDebugging() {
					if (!this.state) {
						this.debug = new Debucsser(debugConfig).init();
						this.state = true;
					}
				}
			}
		});
	}
}

export default CssDebugToolbarModule;
