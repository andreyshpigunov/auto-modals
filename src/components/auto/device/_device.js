//
//	_device.js
//	Device, OS and browser detection.
//
//	Created by Andrey Shpigunov on 15.12.2020.
//

//  All variables, if matched, return true:
//  device.[ie|firefox|safari|webkit|chrome|opera|windows|macos|linux|ios|mobile|desktop|ipad|ipod|iphone|android|js]

const device = (function() {
    let htmlElement_ = document.documentElement,
        userAgent_ = window.navigator.userAgent.toLowerCase(),
        platform_ = window.navigator.platform.toLowerCase(),
        classes = [];
        
    // Save <html> tag classes
    let classAttr = htmlElement_.className;
    if (classAttr !== "") classes = classAttr.split(/\s+/);
    
    // Detect browser classes
    let versionMatch;
    if (
        (/msie/.test(userAgent_) || /trident/.test(userAgent_)) &&
        !/opera/.test(userAgent_)
    ) {
        classes.push("ie");
        versionMatch = userAgent_.match(/msie ([0-9.]+)/);
        if (versionMatch) {
            var version = parseInt(versionMatch[1], 10);
            classes.push("ie" + version);
            if (version === 7 || version === 8) classes.push("ie7-8");
        }
    } else if (
        /mozilla/.test(userAgent_) &&
        !/(compatible|webkit)/.test(userAgent_)
    ) {
        classes.push("firefox");
    } else if (/safari/.test(userAgent_) && !/chrome/.test(userAgent_)) {
        classes.push("safari", "webkit");
        versionMatch = userAgent_.match(/version\/([0-9.]+)/);
        if (versionMatch)
            classes.push("safari" + parseInt(versionMatch[1], 10));
    } else if (/chrome/.test(userAgent_)) {
        classes.push("chrome", "webkit");
    } else if (/opera/.test(userAgent_)) {
        classes.push("opera");
    }
    
    // Detect OS classes
    if (/win/.test(platform_)) {
        classes.push("windows");
    } else if (/mac/.test(platform_)) {
        classes.push("macos");
    } else if (/linux/.test(platform_)) {
        classes.push("linux");
    } else if (/iphone|ipad|ipod/.test(userAgent_)) {
        classes.push("ios");
    }
    
    // Detect device type classes
    if (/mobile/.test(userAgent_)) {
        classes.push("mobile");
    } else {
        classes.push("desktop");
    }
    
    // Detect mobile device classes
    if (/ipad/.test(userAgent_)) {
        classes.push("ipad");
    } else if (/ipod/.test(userAgent_)) {
        classes.push("ipod");
    } else if (/iphone/.test(userAgent_)) {
        classes.push("iphone");
    } else if (/android/.test(userAgent_)) {
        classes.push("android");
    }
    
    // Add js/no-js class
    classes.push("js");
    for (let i = 0, len = classes.length; i < len; i++) {
        if (classes[i] === "no-js") {
            classes.splice(i, 1);
            break;
        }
    }
    
    // Set classes
    htmlElement_.className = classes.join(" ");
    
    // Create object with classes keys
    let classesHash = {};
    
    for (let i = 0, len = classes.length; i < len; i++) {
        classesHash[classes[i]] = true;
    }
    
    classesHash.width = window.innerWidth;
    classesHash.height = window.innerHeight;
    return classesHash;
})();

export default device;
