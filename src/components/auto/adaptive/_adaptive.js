//
//	_adaptive.js
//	auto
//
//	Created by Andrey Shpigunov on 15.05.2021
//	Copyright © 2021 . All rights reserved.
//

// if (auto.adaptive.small) { ... }
// if (auto.adaptive.medium) { ... }
// if (auto.adaptive.large) { ... }

class Adaptive {
	constructor() {
		this.breakpoints = {
			small: 639,
			medium: 1023,
		};
	}
	get small() {
		return this.isSmall();
	}
	get medium() {
		return this.isMedium();
	}
	get large() {
		return this.isLarge();
	}
	isSmall() {
		return window.innerWidth <= this.breakpoints.small;
	}
	isMedium() {
		return (
			window.innerWidth > this.breakpoints.small &&
			window.innerWidth <= this.breakpoints.medium
		);
	}
	isLarge() {
		return window.innerWidth > this.breakpoints.medium;
	}
}

export default new Adaptive();
