// import $ from "properjs-hobo";
import * as core from "../../core";



class Cards {
    constructor ( view ) {
        this.view = view;

        this.bind();
    }


    bind () {
        this.view.imageLoader.on( "done", () => {
            this.view.element.addClass( "is-loaded" );
        });
    }


    destroy () {}
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Cards;
