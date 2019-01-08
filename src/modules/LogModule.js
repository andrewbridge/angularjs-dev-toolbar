import Vue from 'vue';
import Util from '../Util.js';

class LogToolbarModule {
	constructor(componentName) {
		this.$log = Util.$inject('$log');
		this.hijackDebug();
		this.name = componentName;
		this.componentData = {
			debugs: []
		}
		Vue.component(componentName, {
			template: `<div class="toolbar-module full-width">
				<i class="fa fa-terminal" aria-hidden="true"></i>
				<div>
					<code v-if="$root.mode === 'full'">{{latestDebug || 'No debug messages'}}</code>
					<code v-else-if="$root.mode === 'compact'">{{latestDebug ? latestDebug.substr(0, 20) + (latestDebug.length > 20 ? '...' : '') : 'No debug messages'}}</code>
					<p v-else-if="$root.mode === 'mini'">{{ debugs.length }} debugs</p>
				</div>
			</div>`,
			data: () => this.componentData,
			computed: {
				latestDebug() {
					return this.debugs.length ? this.debugs[this.debugs.length - 1] : null;
				}
			}
		})
	}

	hijackDebug() {
		const oldDebug = this.$log.debug;
		const self = this;
		this.oldDebug = oldDebug;
		this.$log.debug = function() { // Needs to be a full function
			const args = Array.from(arguments);
			self.componentData.debugs.push(
				args.reduce((debugStr, arg) => {
					switch(typeof arg) {
						case 'object':
							debugStr += arg === null ? '' : Util.toJSON(arg);
							break;
						case 'undefined':
							break;
						default:
							debugStr += arg;
					}
					return debugStr;
				}, '')
			);
			return oldDebug(...arguments);
		}
	}
}

export default LogToolbarModule;
