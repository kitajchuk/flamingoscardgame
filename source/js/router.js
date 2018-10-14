import $ from "properjs-hobo";
import Controller from "properjs-controller";
import PageController from "properjs-pagecontroller";
import Controllers from "./class/Controllers";
import * as core from "./core";



/**
 *
 * @public
 * @namespace router
 * @description Handles async web app routing for nice transitions.
 *
 */
const router = {
    /**
     *
     * @public
     * @method init
     * @memberof router
     * @description Initialize the router module.
     *
     */
    init () {
        this.blit = new Controller();
        this.animDuration = 500;
        this.controllers = new Controllers({
            el: core.dom.main,
            cb: () => {
                // core.emitter.fire( "app--page-teardown" );
                this.topper();
            }
        });

        core.emitter.on( "app--intro-teardown", () => {} );

        // Transition page state stuff
        this.state = {
            now: null,
            future: null
        };

        this.bindEmpty();
        this.prepPages();

        core.log( "[Router initialized]", this );
    },


    load () {
        return new Promise(( resolve ) => {
            this.controller = new PageController({
                transitionTime: this.animDuration,
                routerOptions: {
                    async: true
                }
            });

            this.controller.setConfig([
                "/",
                ":view",
                ":view/:uid",
                ":view/:uid/:uid2"
            ]);

            // this.controller.setModules( [] );

            //this.controller.on( "page-controller-router-samepage", () => {} );
            this.controller.on( "page-controller-router-transition-out", this.changePageOut.bind( this ) );
            this.controller.on( "page-controller-router-refresh-document", this.changeContent.bind( this ) );
            this.controller.on( "page-controller-router-transition-in", this.changePageIn.bind( this ) );
            this.controller.on( "page-controller-initialized-page", ( data ) => {
                this.initPage( data );
                resolve();
            });
            this.controller.initPage();
        });
    },


    /**
     *
     * @public
     * @method bindEmpty
     * @memberof router
     * @description Suppress #hash links.
     *
     */
    bindEmpty () {
        core.dom.body.on( "click", "[href^='#']", ( e ) => e.preventDefault() );
    },


    prepPages () {
        this.controllers.exec();
    },


    /**
     *
     * @public
     * @method initPage
     * @param {object} data The PageController data object
     * @memberof router
     * @description Cache the initial page load.
     *
     */
    initPage ( data ) {
        this.setDoc( data );
        this.setState( "now", data );
        this.setState( "future", data );
        this.setClass();
    },


    /**
     *
     * @public
     * @method parseDoc
     * @param {string} html The responseText to parse out
     * @memberof router
     * @description Get the DOM information to cache for a request.
     * @returns {object}
     *
     */
    parseDoc ( html ) {
        let doc = document.createElement( "html" );
        let main = null;

        doc.innerHTML = html;

        doc = $( doc );
        main = doc.find( core.config.mainSelector );

        return {
            doc: doc,
            main: main,
            html: main[ 0 ].innerHTML,
            data: main.data()
        };
    },


    setDoc ( data ) {
        this.doc = this.parseDoc( data.response );
    },


    setState ( time, data ) {
        this.state[ time ] = {
            raw: data,
            uid: data.request.params.uid || null,
            uid2: data.request.params.uid2 || null,
            view: data.request.params.view || core.config.homepage,
            cat: data.request.query.category || null
        };
    },


    setClass () {
        if ( this.state.future.view ) {
            core.dom.html.addClass( `is-${this.state.future.view}-page` );
        }

        if ( this.state.future.uid ) {
            core.dom.html.addClass( `is-uid-page` );
        }

        if ( this.state.future.uid2 ) {
            core.dom.html.addClass( `is-uid2-page` );
        }

        if ( this.state.future.cat ) {
            core.dom.html.addClass( `is-cat-page` );
        }
    },


    unsetClass () {
        if ( this.state.now.view !== this.state.future.view ) {
            core.dom.html.removeClass( `is-${this.state.now.view}-page` );
        }

        if ( this.state.now.uid && !this.state.future.uid ) {
            core.dom.html.removeClass( `is-uid-page` );
        }

        if ( this.state.now.uid2 && !this.state.future.uid2 ) {
            core.dom.html.removeClass( `is-uid2-page` );
        }

        if ( this.state.now.cat && !this.state.future.cat ) {
            core.dom.html.removeClass( `is-cat-page` );
        }
    },


    changePageOut ( data ) {
        core.dom.html.addClass( "is-tranny" );
        this.setState( "future", data );
        this.transitionOut();
        this.controllers.destroy();
    },


    changeContent ( data ) {
        this.setDoc( data );
        core.dom.main[ 0 ].innerHTML = this.doc.html;
        this.topper();
        this.controllers.exec();
        core.emitter.fire( "app--metrics-pageview", this.doc );
    },


    changePageIn ( data ) {
        setTimeout(() => {
            core.dom.html.removeClass( "is-tranny" );
            this.unsetClass();
            this.setClass();
            this.transitionIn();
            this.setState( "now", data );
            this.execSquarespace();

        }, this.animDuration );
    },


    tweenContent ( opacity ) {
        const isOne = (opacity === 1);

        // this.tween = gsap.TweenLite.to( core.dom.main[ 0 ], 0.5, {
        //     css: {
        //         opacity
        //     },
        //     ease: isOne ? gsap.Power4.easeOut : gsap.Power4.easeIn,
        //     onComplete: () => {}
        // });

        if ( isOne ) {
            core.dom.html.removeClass( "is-tranny" );

        } else {
            core.dom.html.addClass( "is-tranny" );
        }
    },


    transitionOut () {
        this.tweenContent( 0 );
    },


    transitionIn () {
        this.blit.go(() => {
            if ( this.tween && !this.tween.isActive() ) {
                this.blit.stop();

                this.tweenContent( 1 );
            }
        });
    },


    route ( path ) {
        this.controller.getRouter().trigger( path );
    },


    push ( path, cb ) {
        this.controller.routeSilently( path, (cb || core.util.noop) );
    },


    topper () {
        window.scrollTo( 0, 0 );
    },


    // Initialize core sqs blocks after ajax routing
    execSquarespace () {
        setTimeout(() => {
            // window.Squarespace.initializeVideo( window.Y );
            window.Squarespace.initializeCommerce( window.Y );
            // window.Squarespace.initializeFormBlocks( window.Y, window.Y );
            // window.Squarespace.initializeLayoutBlocks( window.Y );
            // window.Squarespace.initializeSummaryV2Block( window.Y );

        }, 0 );
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default router;
