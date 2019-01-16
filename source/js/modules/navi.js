import * as core from "../core";



const navi = {
    init () {
        this.element = core.dom.body.find( ".js-navi" );
        this.items = this.element.find( ".js-navi-a" );
        this.bind();
    },


    bind () {},


    active ( view ) {
        this.items.removeClass( "is-active" );
        this.items.filter( `.js-navi--${view}` ).addClass( "is-active" );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default navi;
