// import $ from "properjs-hobo";
import * as core from "../../core";



class Decks {
    constructor ( view ) {
        this.view = view;
        this.curr = 2;
        this.belt =  this.view.element.find( ".js-decks-belt" );
        this.right = this.view.element.find( ".js-decks-right" );
        this.left = this.view.element.find( ".js-decks-left" );
        this.cards = this.view.element.find( ".js-decks-card" );

        this.bind();
        this.move();
    }


    bind () {
        this.left.on( "click", () => {
            if ( this.curr === 0 ) {
                this.view.element.addClass( "no-left" );

            } else {
                this.view.element.removeClass( "no-left no-right" );
                this.curr--;
                if ( this.curr === 0 ) {
                    this.view.element.addClass( "no-left" );
                }
                this.move();
            }
        });

        this.right.on( "click", () => {
            if ( this.curr === (this.cards.length - 1) ) {
                this.view.element.addClass( "no-right" );

            } else {
                this.view.element.removeClass( "no-right no-left" );
                this.curr++;
                if ( this.curr === (this.cards.length - 1) ) {
                    this.view.element.addClass( "no-right" );
                }
                this.move();
            }
        });
    }


    move () {
        const card = this.cards.eq( this.curr );
        const bounds = card[ 0 ].getBoundingClientRect();
        const windowHalf = (window.innerWidth / 2);

        this.cards.removeClass( "is-active" );
        card.addClass( "is-active" );

        this.calc = `calc( 50vw - ${bounds.width * this.curr}px - ${bounds.width / 2}px )`;

        core.util.translate3d(
            this.belt[ 0 ],
            this.calc,
            "0",
            "0"
        );
    }


    destroy () {}
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Decks;
