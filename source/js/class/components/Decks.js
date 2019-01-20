// import $ from "properjs-hobo";
import * as core from "../../core";
import ResizeController from "properjs-resizecontroller";



class Decks {
    constructor ( view ) {
        this.view = view;
        this.curr = 2;
        this.belt =  this.view.element.find( ".js-decks-belt" );
        this.right = this.view.element.find( ".js-decks-right" );
        this.left = this.view.element.find( ".js-decks-left" );
        this.cards = this.view.element.find( ".js-decks-card" );
        this.resizer = new ResizeController();
        this.breaks = {
            tablet: {
                width: 1280,
                hit: false
            },
            mobile: {
                width: 480,
                hit: false
            }
        };

        this.bind();
    }


    bind () {
        this.view.imageLoader.on( "done", () => {
            this.view.element.addClass( "is-loaded" );
            this.move();
        });

        this.resizer.on( "resize", () => {
            if ( ((window.innerWidth < this.breaks.tablet.width) && !this.breaks.tablet.hit) ) {
                this.breaks.tablet.hit = true;
                this.move();
            }

            if ( (window.innerWidth > this.breaks.tablet.width) && this.breaks.tablet.hit ) {
                this.breaks.tablet.hit = false;
                this.move();
            }

            if ( ((window.innerWidth < this.breaks.mobile.width) && !this.breaks.mobile.hit) ) {
                this.breaks.mobile.hit = true;
                this.move();
            }

            if ( (window.innerWidth > this.breaks.mobile.width) && this.breaks.mobile.hit ) {
                this.breaks.mobile.hit = false;
                this.move();
            }
        });

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
        const bounds = this.cards.not( ".is-active" )[ 0 ].getBoundingClientRect();

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


    destroy () {
        this.resizer.destroy();
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Decks;
