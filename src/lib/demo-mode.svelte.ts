import { browser } from '$app/environment';

export const isInDemoMode = browser && window.localStorage.isInDemoMode === 'on';

export const enterDemoMode = () => {
	window.localStorage.isInDemoMode = 'on';
	window.location.reload();
};

export const exitDemoMode = () => {
	window.localStorage.isInDemoMode = 'off';
	window.location.reload();
};
