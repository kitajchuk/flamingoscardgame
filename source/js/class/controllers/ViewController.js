import View from "../components/View";



/**
 *
 * @public
 * @class ViewController
 * @param {Hobo} elements The ajax/js-template view modules
 * @classdesc Handles views
 *
 */
class ViewController {
    constructor ( elements ) {
        this.elements = elements;
        this.instances = [];

        this.init();
    }


    init () {
        this.elements.forEach(( element, i ) => {
            this.instances.push( new View( this.elements.eq( i ) ) );
        });
    }


    destroy () {
        this.instances.forEach(( instance ) => {
            instance.destroy();
        });
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default ViewController;
