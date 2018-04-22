import settings from './settings.js';
import Util from './Util.js';
import NgDevToolbar from './NgDevToolbar.js';

if (Util.isPlatform()) {
	const toolbarInstance = new NgDevToolbar();
	if (settings.exposeGlobal) {
		window.NgDevTools = {
			toolbar: toolbarInstance,
			util: Util
		}
	}
} else {
	alert(`This toolbar can only run on a site running the ${settings.appModuleName} angularjs app.`);
}
