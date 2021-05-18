//
//	_modal.js
//	Modal windows
//
//	Created by Andrey Shpigunov on 14.12.2020.
//

// Using:
// <a data-modal="my-modal">Open modal</a>
//
//	<div id="my-modal" class="modal-content [custom-classes]">
//		<div class="text">
//			<p>Hello modal!</p>
//			<p><a class="button modal-close">Close</a></p>
//		</div>
//	</div>
//
//	<script>
//		var modal = document.getElementById('modal-test');
//		modal.addEventListener('modal:ready', function (event) { ... });
//		modal.addEventListener('modal:open', function (event) { ... });
//		modal.addEventListener('modal:close', function (event) { ... });
//	</script>

import adaptive from "../adaptive/_adaptive";
import device from "../device/_device";

const modal = (function() {
    // Init windows
    let modalContents = document.querySelectorAll(".modal-content");
    let modalLevel = 0;
    let scrollPosition = 0;
    let cp;
    
    if (modalContents.length) {
        modalContents.forEach((e, index) => {
            let html;
            let here = document.querySelector(".modal-here");
            let placeholder = document.querySelector("body");
            
            if (here) placeholder = here;
            html =
                '<div id="' +
                e.getAttribute("id") +
                '" class="modal ' +
                e.getAttribute("class").replace("modal-content", "") +
                '">' +
                '<div class="modal-overlay"></div>' +
                '<div class="modal-outer">' +
                '<div class="modal-inner">' +
                '<div class="modal-window">' +
                '<a class="modal-close"></a>' +
                e.innerHTML +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>";
                
            placeholder.insertAdjacentHTML("beforeend", html);
            e.remove();
        });
    }
    
    let modalLinks = document.querySelectorAll("[data-modal]");
    if (modalLinks.length) {
        modalLinks.forEach((e, index) => {
            e.addEventListener("click", (event) => {
                event.preventDefault();
                show(e.dataset.modal);
            });
        });
    }
    
    document.addEventListener("click", (event) => {
        let modalActive = document.querySelector(".modal.active");
        if (
            modalActive &&
            event.target.matches(".modal.active, .modal.active *") &&
            (event.target.classList.contains("modal-close") ||
                event.target.classList.contains("modal-custom-close") ||
                !event.target.matches(".modal-window, .modal-window *"))
        ) {
            event.preventDefault();
            hide(event.target.closest(".modal").getAttribute("id"));
        }
    });
    
    document.addEventListener("keydown", (event) => {
        let modalsActive = document.querySelectorAll(".modal.active");
        let modalActive = modalsActive[modalsActive.length - 1];
        if (modalActive && event.keyCode == 27) {
            /* Esc */
            event.preventDefault();
            hide(modalActive.getAttribute("id"));
        }
    });
    
    let eventReady = new CustomEvent("modal:ready");
    let eventOpen = new CustomEvent("modal:open");
    let eventClose = new CustomEvent("modal:close");
    
    // Show window
    function show(id) {
        let html = document.documentElement;
        let modal = document.getElementById(id);
        
        if (modal) {
            let activeModals = document.querySelectorAll(".modal.active");
            let timeout = 0;
            
            setTimeout(() => {
                _closerPosition(id);
                window.addEventListener(
                    "resize",
                    (cp = (event) => {
                        _closerPosition(id);
                    })
                );
                html.classList.add("modal-active");
                html.classList.add(id + "-active");
                modal.dispatchEvent(eventReady);
                modalLevel++;
                modal.classList.add("top", "active", "level-" + modalLevel);
                setTimeout(() => {
                    modal.dispatchEvent(eventOpen);
                }, 400);
                
                if (device.iphone || device.ipad || device.android) {
                    scrollPosition = window.scrollY;
                    document.body.style.position = "fixed";
                    document.body.style.top = "-" + scrollPosition + "px";
                }
            }, timeout);
        }
    }
    
    // Hide window
    function hide(id) {
        let modal = document.getElementById(id);
        window.removeEventListener("resize", cp);
        modal.classList.remove("active");
        
        setTimeout(() => {
            document.documentElement.classList.remove(id + "-active");
            modal.classList.remove("top", "level-" + modalLevel);
            modalLevel--;
            if (modalLevel == 0)
                document.documentElement.classList.remove("modal-active");
            modal.dispatchEvent(eventClose);
        }, 400);
        
        if (device.iphone || device.ipad || device.android) {
            document.body.style.position = null;
            document.body.style.top = null;
            window.scrollTo(0, scrollPosition);
        }
    }
    
    // Move closer depends to window size. We need to fix it on small screen.
    // Simple "transform: fixed" not working (transform feature).
    function _closerPosition(id) {
        let modal = document.getElementById(id);
        let closer;
        
        if (
            adaptive.small &&
            modal.querySelector(".modal-window").scrollHeight >=
            window.innerHeight
        ) {
            closer = document.querySelector(
                "#" + id + " .modal-window .modal-close"
            );
            if (closer) modal.appendChild(closer);
        } else {
            closer = document.querySelector("#" + id + " > .modal-close");
            if (closer)
                document
                .querySelector("#" + id + " .modal-window")
                .appendChild(closer);
        }
    }
    
    return {
        show: show,
        hide: hide,
    };
})();

export default modal;
